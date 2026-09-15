// Payment Service abstraction layer for MTN Mobile Money & Orange Money
import { PaymentMethod, PaymentTransaction } from '../types';
import { storageService } from './storageService';
import { landService } from './landService';
import { notificationService } from './notificationService';

const PAYMENTS_KEY = 'terraverify_payments';

export const paymentService = {
  async getTransactions(userId?: string): Promise<PaymentTransaction[]> {
    const list = await storageService.getItem<PaymentTransaction[]>(PAYMENTS_KEY, []);
    if (!userId) return list;
    return list.filter((tx) => tx.userId === userId);
  },

  validateCameroonPhone(phone: string, method: PaymentMethod): { isValid: boolean; message?: string } {
    // Strip all non-digit characters
    const clean = phone.replace(/\D/g, '');
    let localDigits = clean;

    if (clean.startsWith('237') && clean.length === 12) {
      localDigits = clean.substring(3);
    }

    if (localDigits.length !== 9) {
      return { isValid: false, message: 'Please enter a valid 9-digit Cameroonian phone number (e.g. 677 12 34 56).' };
    }

    const prefix = localDigits.substring(0, 2);
    const prefix3 = localDigits.substring(0, 3);

    if (method === 'mtn_momo') {
      const isMtn = prefix === '67' || prefix === '68' || ['650', '651', '652', '653', '654'].includes(prefix3);
      if (!isMtn) {
        return { isValid: false, message: 'The phone number entered does not match an active MTN Cameroon prefix (67x, 68x, 650-654).' };
      }
    } else if (method === 'orange_money') {
      const isOrange = prefix === '69' || ['655', '656', '657', '658', '659'].includes(prefix3);
      if (!isOrange) {
        return { isValid: false, message: 'The phone number entered does not match an active Orange Cameroon prefix (69x, 655-659).' };
      }
    }

    return { isValid: true };
  },

  async processUnlockPayment(params: {
    userId: string;
    landId: string;
    landTitle: string;
    amountFCFA: number;
    method: PaymentMethod;
    phoneNumber: string;
  }): Promise<PaymentTransaction> {
    const validation = this.validateCameroonPhone(params.phoneNumber, params.method);
    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    const ref = `TX-${params.method === 'mtn_momo' ? 'MTN' : 'OM'}-${Date.now().toString().slice(-6)}`;
    
    // Simulate USSD prompt network roundtrip (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const transaction: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      reference: ref,
      userId: params.userId,
      landId: params.landId,
      landTitle: params.landTitle,
      amountFCFA: params.amountFCFA,
      method: params.method,
      phoneNumber: params.phoneNumber,
      status: 'success',
      providerTransactionId: `MOMO-CM-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    const history = await this.getTransactions();
    history.unshift(transaction);
    await storageService.setItem(PAYMENTS_KEY, history);

    // Mark property as unlocked for this buyer
    await landService.markLandAsUnlocked(params.landId, params.userId);

    // Send notification
    await notificationService.createNotification({
      userId: params.userId,
      title: 'Payment Successful - Details Unlocked',
      message: `Your payment of ${params.amountFCFA.toLocaleString('fr-FR')} FCFA via ${params.method === 'mtn_momo' ? 'MTN MoMo' : 'Orange Money'} was confirmed. Full land details & seller contact are now accessible.`,
      type: 'payment_success',
      relatedEntityId: params.landId,
      relatedEntityType: 'land',
    });

    return transaction;
  },
};
