
// Simulated Backend API delays and responses

export const mockSendOTP = async (phone: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[MockAPI] OTP sent to ${phone} via SMS & WhatsApp: 123456`);
      resolve(true);
    }, 1500);
  });
};

export const mockVerifyOTP = async (phone: string, otp: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === '123456') {
        resolve(true);
      } else {
        reject(new Error('Invalid OTP'));
      }
    }, 1000);
  });
};

export const mockDeposit = async (amount: number): Promise<{ success: boolean; newBalance: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, newBalance: amount });
    }, 2000);
  });
};

export const mockWithdraw = async (amount: number, currentBalance: number): Promise<{ success: boolean }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (amount <= currentBalance) {
        resolve({ success: true });
      } else {
        reject(new Error('Insufficient Funds'));
      }
    }, 2000);
  });
};
