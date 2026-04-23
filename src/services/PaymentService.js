class PaymentService {
  async processPayment(amount) {
    console.log(`[PaymentService] Processing payment of $${amount}...`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = Math.random() > 0.2;
    
    if (success) {
      console.log(`[PaymentService] Payment successful.`);
    } else {
      console.log(`[PaymentService] Payment failed.`);
    }
    
    return success;
  }
}

export default new PaymentService();
