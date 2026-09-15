// Land listing and management service
import { LandListing, LandDocument } from '../types';
import { MOCK_LANDS } from '../data/mockData';
import { storageService } from './storageService';
import { verificationService } from './verificationService';

const LANDS_KEY = 'terraverify_lands_list';
const UNLOCKED_LANDS_KEY = 'terraverify_unlocked_lands_'; // append userId

export interface LandFilterParams {
  searchQuery?: string;
  region?: string;
  landType?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  onlyVerified?: boolean;
}

export const landService = {
  async getLands(filters?: LandFilterParams): Promise<LandListing[]> {
    const lands = await storageService.getItem<LandListing[]>(LANDS_KEY, MOCK_LANDS);
    
    if (!filters) return lands;

    return lands.filter((land) => {
      if (filters.onlyVerified && land.verificationStatus !== 'verified') {
        return false;
      }
      if (filters.region && filters.region !== 'all' && land.region.toLowerCase() !== filters.region.toLowerCase()) {
        return false;
      }
      if (filters.landType && filters.landType !== 'all' && land.landType !== filters.landType) {
        return false;
      }
      if (filters.minPrice && land.priceFCFA < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && land.priceFCFA > filters.maxPrice) {
        return false;
      }
      if (filters.minArea && land.areaSqM < filters.minArea) {
        return false;
      }
      if (filters.maxArea && land.areaSqM > filters.maxArea) {
        return false;
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchTitle = land.title.toLowerCase().includes(query);
        const matchNeighborhood = land.neighborhood.toLowerCase().includes(query);
        const matchSubdiv = land.subdivision.toLowerCase().includes(query);
        const matchTitleNum = land.landTitleNumber.toLowerCase().includes(query);
        const matchRegion = land.region.toLowerCase().includes(query);
        if (!matchTitle && !matchNeighborhood && !matchSubdiv && !matchTitleNum && !matchRegion) {
          return false;
        }
      }
      return true;
    });
  },

  async getLandById(id: string): Promise<LandListing | null> {
    const lands = await this.getLands();
    return lands.find((l) => l.id === id) || null;
  },

  async isLandUnlockedForUser(landId: string, userId: string): Promise<boolean> {
    const unlocked = await storageService.getItem<string[]>(`${UNLOCKED_LANDS_KEY}${userId}`, []);
    return unlocked.includes(landId);
  },

  async markLandAsUnlocked(landId: string, userId: string): Promise<void> {
    const unlocked = await storageService.getItem<string[]>(`${UNLOCKED_LANDS_KEY}${userId}`, []);
    if (!unlocked.includes(landId)) {
      unlocked.push(landId);
      await storageService.setItem(`${UNLOCKED_LANDS_KEY}${userId}`, unlocked);
    }
  },

  async getSellerListings(sellerId: string): Promise<LandListing[]> {
    const lands = await this.getLands();
    return lands.filter((l) => l.sellerId === sellerId);
  },

  async submitLandListing(params: {
    title: string;
    landTitleNumber: string;
    description: string;
    region: string;
    division: string;
    subdivision: string;
    neighborhood: string;
    areaSqM: number;
    priceFCFA: number;
    landType: 'residential' | 'commercial' | 'agricultural' | 'industrial' | 'mixed_use';
    topography: 'flat' | 'gentle_slope' | 'elevated' | 'waterfront';
    accessRoad: 'paved' | 'dirt_road' | 'secondary' | 'servitude';
    images: string[];
    documents: LandDocument[];
    sellerId: string;
    sellerName: string;
    sellerPhone: string;
    exactLandmark?: string;
  }): Promise<{ land: LandListing; verificationRequestId: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lands = await storageService.getItem<LandListing[]>(LANDS_KEY, MOCK_LANDS);

    const newLandId = `land-${Date.now()}`;
    const newLand: LandListing = {
      id: newLandId,
      title: params.title,
      landTitleNumber: params.landTitleNumber.toUpperCase().trim(),
      description: params.description,
      region: params.region,
      division: params.division,
      subdivision: params.subdivision,
      neighborhood: params.neighborhood,
      areaSqM: params.areaSqM,
      priceFCFA: params.priceFCFA,
      unlockFeeFCFA: 10000,
      landType: params.landType,
      topography: params.topography,
      accessRoad: params.accessRoad,
      images: params.images.length > 0 ? params.images : [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
      ],
      documents: params.documents,
      verificationStatus: 'pending',
      isPublished: false, // published only after surveyor approval
      submittedAt: new Date().toISOString(),
      sellerId: params.sellerId,
      exactLocation: {
        coordinates: { latitude: 3.8480, longitude: 11.5021 }, // Yaoundé area default
        landmarkDescription: params.exactLandmark || 'Near public crossroads',
        streetAddress: `${params.neighborhood}, ${params.subdivision}`,
      },
      sellerContact: {
        id: params.sellerId,
        name: params.sellerName,
        phone: params.sellerPhone,
        email: 'seller@terraverify.cm',
      },
    };

    lands.unshift(newLand);
    await storageService.setItem(LANDS_KEY, lands);

    // Create the associated verification request with 48h timeline
    const verifReq = await verificationService.createVerificationRequest({
      landId: newLand.id,
      landTitleNumber: newLand.landTitleNumber,
      sellerId: params.sellerId,
      sellerName: params.sellerName,
      sellerPhone: params.sellerPhone,
      region: params.region,
      division: params.division,
      subdivision: params.subdivision,
      surfaceAreaSqM: params.areaSqM,
      documents: params.documents,
    });

    return { land: newLand, verificationRequestId: verifReq.id };
  },

  async updateLandStatus(
    landId: string,
    status: 'verified' | 'rejected',
    surveyorNotes?: string,
    rejectionReason?: string
  ): Promise<LandListing> {
    const lands = await storageService.getItem<LandListing[]>(LANDS_KEY, MOCK_LANDS);
    const index = lands.findIndex((l) => l.id === landId);
    if (index === -1) throw new Error('Land not found');

    lands[index].verificationStatus = status;
    lands[index].isPublished = status === 'verified';
    if (status === 'verified') {
      lands[index].verifiedAt = new Date().toISOString();
      lands[index].surveyorNotes = surveyorNotes;
    } else {
      lands[index].rejectionReason = rejectionReason;
    }

    await storageService.setItem(LANDS_KEY, lands);
    return lands[index];
  },
};
