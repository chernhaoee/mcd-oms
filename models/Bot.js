class Bot {
  constructor(id) {
    this.id = id;
    this.status = 'IDLE';
    this.currentOrder = null;
    this.processingTimer = null;
  }

  isIdle() {
    return this.status === 'IDLE';
  }

  startProcessing(order, onComplete) {
    if (!this.isIdle()) {
      throw new Error('Bot is already processing an order');
    }

    this.status = 'PROCESSING';
    this.currentOrder = order;
    order.startProcessing();

    // Process order for 10 seconds
    this.processingTimer = setTimeout(() => {
      this.completeOrder(onComplete);
    }, 10000);
  }

  completeOrder(onComplete) {
    if (this.currentOrder) {
      this.currentOrder.complete();
      const completedOrder = this.currentOrder;
      
      this.reset();
      onComplete(completedOrder);
    }
  }

  stopProcessing() {
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
      this.processingTimer = null;
    }

    if (this.currentOrder) {
      this.currentOrder.resetToPending();
      const stoppedOrder = this.currentOrder;
      this.reset();
      return stoppedOrder;
    }
    return null;
  }

  reset() {
    this.status = 'IDLE';
    this.currentOrder = null;
    this.processingTimer = null;
  }
}

module.exports = Bot;