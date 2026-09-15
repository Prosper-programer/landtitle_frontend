// Appointment and Advisor context
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Appointment, ProfessionalAdvisor, AppointmentStatus } from '../types';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from './AuthContext';

interface AppointmentContextType {
  appointments: Appointment[];
  advisors: ProfessionalAdvisor[];
  isLoading: boolean;
  refreshAppointments: () => Promise<void>;
  bookAppointment: (params: {
    advisorId: string;
    advisorName: string;
    advisorRole: string;
    date: string;
    timeSlot: string;
    topic: string;
    feeFCFA: number;
  }) => Promise<Appointment>;
  updateStatus: (id: string, status: AppointmentStatus, notes?: string) => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [advisors, setAdvisors] = useState<ProfessionalAdvisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const advs = await appointmentService.getAdvisors();
      setAdvisors(advs);
      const apts = await appointmentService.getAppointments();
      setAppointments(apts);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const bookAppointment = async (params: {
    advisorId: string;
    advisorName: string;
    advisorRole: string;
    date: string;
    timeSlot: string;
    topic: string;
    feeFCFA: number;
  }) => {
    const apt = await appointmentService.bookAppointment({
      ...params,
      userId: currentUser?.id || 'user-buyer-01',
      userName: currentUser?.fullName || 'Prosper Kamga',
      userPhone: currentUser?.phone || '+237 677 45 89 21',
    });
    await loadData();
    return apt;
  };

  const updateStatus = async (id: string, status: AppointmentStatus, notes?: string) => {
    await appointmentService.updateStatus(id, status, notes);
    await loadData();
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        advisors,
        isLoading,
        refreshAppointments: loadData,
        bookAppointment,
        updateStatus,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
}
