// TerraVerify Core Type Definitions

export type UserRole = 'visitor' | 'buyer' | 'seller' | 'surveyor' | 'advisor' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  isPhoneVerified: boolean;
  registeredAt: string;
  nationalIdNumber?: string;
  status: 'active' | 'suspended';
}

export type VerificationState = 'pending' | 'under_review' | 'verified' | 'rejected';

export interface LandDocument {
  id: string;
  name: string;
  type: 'titre_foncier' | 'plan_bornage' | 'certificat_propriete' | 'attestation_non_litige';
  documentNumber: string;
  fileUrl: string;
  fileSize: string;
  uploadedAt: string;
  isVerified: boolean;
}

export interface LandListing {
  id: string;
  title: string;
  landTitleNumber: string; // e.g. "LT-2026-YDE-0482"
  description: string;
  region: string;
  division: string;
  subdivision: string;
  neighborhood: string;
  
  // Protected details (hidden before unlock fee payment)
  exactLocation?: {
    coordinates: { latitude: number; longitude: number };
    landmarkDescription: string;
    streetAddress: string;
  };
  sellerContact?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatarUrl?: string;
  };
  documents: LandDocument[];

  areaSqM: number;
  priceFCFA: number;
  unlockFeeFCFA: number; // default 10,000 FCFA
  landType: 'residential' | 'commercial' | 'agricultural' | 'industrial' | 'mixed_use';
  topography: 'flat' | 'gentle_slope' | 'elevated' | 'waterfront';
  accessRoad: 'paved' | 'dirt_road' | 'secondary' | 'servitude';
  
  images: string[];
  verificationStatus: VerificationState;
  isPublished: boolean;
  isFeatured?: boolean;
  rejectionReason?: string;
  surveyorNotes?: string;
  verifiedAt?: string;
  submittedAt: string;
  sellerId: string;
}

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  timestamp?: string;
}

export interface VerificationRequest {
  id: string;
  landId: string;
  landTitleNumber: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  surveyorId?: string;
  surveyorName?: string;
  region: string;
  division: string;
  subdivision: string;
  surfaceAreaSqM: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  surveyorNotes?: string;
  cadastralRegistryNotes?: string;
  estimatedTurnaroundHours: number; // 48
  timeline: TimelineStep[];
  documents: LandDocument[];
}

export type PaymentMethod = 'mtn_momo' | 'orange_money';

export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';

export interface PaymentTransaction {
  id: string;
  reference: string;
  userId: string;
  landId: string;
  landTitle: string;
  amountFCFA: number;
  method: PaymentMethod;
  phoneNumber: string;
  status: PaymentStatus;
  providerTransactionId?: string;
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
}

export interface ProfessionalAdvisor {
  id: string;
  fullName: string;
  roleTitle: string;
  yearsOfExperience: number;
  bio: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  consultationFeeFCFA: number;
  availableDays: string[];
  availableHours: string;
  phone: string;
  email: string;
  avatarUrl: string;
  location: string;
}

export type AppointmentStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  advisorId: string;
  advisorName: string;
  advisorRole: string;
  date: string;
  timeSlot: string;
  topic: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  feeFCFA: number;
}

export type NotificationType = 
  | 'verification_submitted'
  | 'verification_approved'
  | 'verification_rejected'
  | 'payment_success'
  | 'payment_failed'
  | 'appointment_requested'
  | 'appointment_confirmed'
  | 'appointment_reminder'
  | 'land_published'
  | 'system';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  relatedEntityId?: string;
  relatedEntityType?: 'land' | 'verification' | 'payment' | 'appointment';
}
