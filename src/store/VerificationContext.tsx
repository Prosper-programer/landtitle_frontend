// Verification state management context
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { VerificationRequest } from '../types';
import { verificationService } from '../services/verificationService';
import { useAuth } from './AuthContext';

interface VerificationContextType {
  requests: VerificationRequest[];
  isLoading: boolean;
  refreshRequests: () => Promise<void>;
  getRequestById: (id: string) => Promise<VerificationRequest | null>;
  approveRequest: (requestId: string, notes?: string) => Promise<void>;
  rejectRequest: (requestId: string, reason: string, notes?: string) => Promise<void>;
  checkTitleNumber: (titleNumber: string) => Promise<{
    status: 'verified' | 'pending' | 'rejected' | 'not_found';
    details?: {
      landTitleNumber: string;
      region?: string;
      division?: string;
      surveyorName?: string;
      verifiedDate?: string;
      reason?: string;
    };
  }>;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await verificationService.getRequests();
      setRequests(res);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const getRequestById = async (id: string) => {
    return verificationService.getRequestById(id);
  };

  const approveRequest = async (requestId: string, notes?: string) => {
    const surveyorId = currentUser?.id || 'user-surveyor-01';
    const surveyorName = currentUser?.fullName || 'Ing. Samuel Ewane';
    await verificationService.approveRequest(requestId, surveyorId, surveyorName, notes);
    await loadRequests();
  };

  const rejectRequest = async (requestId: string, reason: string, notes?: string) => {
    const surveyorId = currentUser?.id || 'user-surveyor-01';
    const surveyorName = currentUser?.fullName || 'Ing. Samuel Ewane';
    await verificationService.rejectRequest(requestId, surveyorId, surveyorName, reason, notes);
    await loadRequests();
  };

  const checkTitleNumber = async (titleNumber: string) => {
    return verificationService.checkTitleNumber(titleNumber);
  };

  return (
    <VerificationContext.Provider
      value={{
        requests,
        isLoading,
        refreshRequests: loadRequests,
        getRequestById,
        approveRequest,
        rejectRequest,
        checkTitleNumber,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}
