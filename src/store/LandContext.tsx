// Reactive Land Store Context
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { LandListing, LandDocument } from '../types';
import { landService, LandFilterParams } from '../services/landService';
import { useAuth } from './AuthContext';

interface LandContextType {
  lands: LandListing[];
  isLoading: boolean;
  filters: LandFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<LandFilterParams>>;
  refreshLands: () => Promise<void>;
  getLandById: (id: string) => Promise<LandListing | null>;
  isLandUnlocked: (landId: string) => Promise<boolean>;
  unlockLand: (landId: string) => Promise<void>;
  submitNewLand: (params: {
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
    exactLandmark?: string;
  }) => Promise<{ land: LandListing; verificationRequestId: string }>;
  sellerListings: LandListing[];
  savedLandIds: string[];
  toggleSaveLand: (landId: string) => void;
}

const LandContext = createContext<LandContextType | undefined>(undefined);

export function LandProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [lands, setLands] = useState<LandListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<LandFilterParams>({});
  const [unlockedMap, setUnlockedMap] = useState<Record<string, boolean>>({});
  const [savedLandIds, setSavedLandIds] = useState<string[]>(['land-001']);

  const loadLands = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await landService.getLands(filters);
      setLands(res);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadLands();
  }, [loadLands]);

  const getLandById = async (id: string): Promise<LandListing | null> => {
    return landService.getLandById(id);
  };

  const isLandUnlocked = async (landId: string): Promise<boolean> => {
    if (!currentUser) return false;
    // Sellers always see their own full details
    const land = lands.find((l) => l.id === landId);
    if (land && land.sellerId === currentUser.id) return true;
    if (unlockedMap[landId] !== undefined) return unlockedMap[landId];
    const unlocked = await landService.isLandUnlockedForUser(landId, currentUser.id);
    setUnlockedMap((prev) => ({ ...prev, [landId]: unlocked }));
    return unlocked;
  };

  const unlockLand = async (landId: string): Promise<void> => {
    if (!currentUser) return;
    await landService.markLandAsUnlocked(landId, currentUser.id);
    setUnlockedMap((prev) => ({ ...prev, [landId]: true }));
  };

  const submitNewLand = async (params: {
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
    exactLandmark?: string;
  }) => {
    const res = await landService.submitLandListing({
      ...params,
      sellerId: currentUser?.id || 'user-seller-01',
      sellerName: currentUser?.fullName || 'Paul Njoya',
      sellerPhone: currentUser?.phone || '+237 699 12 34 56',
    });
    await loadLands();
    return res;
  };

  const toggleSaveLand = (landId: string) => {
    setSavedLandIds((prev) =>
      prev.includes(landId) ? prev.filter((id) => id !== landId) : [...prev, landId]
    );
  };

  const sellerListings = lands.filter(
    (l) => l.sellerId === (currentUser?.id || 'user-seller-01')
  );

  return (
    <LandContext.Provider
      value={{
        lands,
        isLoading,
        filters,
        setFilters,
        refreshLands: loadLands,
        getLandById,
        isLandUnlocked,
        unlockLand,
        submitNewLand,
        sellerListings,
        savedLandIds,
        toggleSaveLand,
      }}
    >
      {children}
    </LandContext.Provider>
  );
}

export function useLand() {
  const context = useContext(LandContext);
  if (!context) {
    throw new Error('useLand must be used within a LandProvider');
  }
  return context;
}
