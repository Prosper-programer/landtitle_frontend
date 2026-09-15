// Professional Advisor & Appointment Service
import { ProfessionalAdvisor, Appointment, AppointmentStatus } from '../types';
import { MOCK_ADVISORS, MOCK_APPOINTMENTS } from '../data/mockData';
import { storageService } from './storageService';
import { notificationService } from './notificationService';

const APPOINTMENTS_KEY = 'terraverify_appointments';
const ADVISORS_KEY = 'terraverify_advisors';

export const appointmentService = {
  async getAdvisors(): Promise<ProfessionalAdvisor[]> {
    return storageService.getItem<ProfessionalAdvisor[]>(ADVISORS_KEY, MOCK_ADVISORS);
  },

  async getAdvisorById(id: string): Promise<ProfessionalAdvisor | null> {
    const advisors = await this.getAdvisors();
    return advisors.find((a) => a.id === id) || null;
  },

  async getAppointments(userId?: string, advisorId?: string): Promise<Appointment[]> {
    const all = await storageService.getItem<Appointment[]>(APPOINTMENTS_KEY, MOCK_APPOINTMENTS);
    if (advisorId) {
      return all.filter((a) => a.advisorId === advisorId);
    }
    if (userId) {
      return all.filter((a) => a.userId === userId);
    }
    return all;
  },

  async bookAppointment(params: {
    userId: string;
    userName: string;
    userPhone: string;
    advisorId: string;
    advisorName: string;
    advisorRole: string;
    date: string;
    timeSlot: string;
    topic: string;
    feeFCFA: number;
  }): Promise<Appointment> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const appointments = await storageService.getItem<Appointment[]>(APPOINTMENTS_KEY, MOCK_APPOINTMENTS);

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      userId: params.userId,
      userName: params.userName,
      userPhone: params.userPhone,
      advisorId: params.advisorId,
      advisorName: params.advisorName,
      advisorRole: params.advisorRole,
      date: params.date,
      timeSlot: params.timeSlot,
      topic: params.topic,
      status: 'confirmed', // Confirmed for instant demo responsiveness
      createdAt: new Date().toISOString(),
      feeFCFA: params.feeFCFA,
    };

    appointments.unshift(newApt);
    await storageService.setItem(APPOINTMENTS_KEY, appointments);

    // Notify user
    await notificationService.createNotification({
      userId: params.userId,
      title: 'Consultation Scheduled',
      message: `Your appointment with ${params.advisorName} is confirmed for ${params.date} at ${params.timeSlot}.`,
      type: 'appointment_confirmed',
      relatedEntityId: newApt.id,
      relatedEntityType: 'appointment',
    });

    return newApt;
  },

  async updateStatus(appointmentId: string, status: AppointmentStatus, notes?: string): Promise<Appointment> {
    const appointments = await storageService.getItem<Appointment[]>(APPOINTMENTS_KEY, MOCK_APPOINTMENTS);
    const index = appointments.findIndex((a) => a.id === appointmentId);
    if (index === -1) throw new Error('Appointment not found');

    appointments[index].status = status;
    if (notes) {
      appointments[index].notes = notes;
    }

    await storageService.setItem(APPOINTMENTS_KEY, appointments);
    return appointments[index];
  },
};
