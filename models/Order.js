class Order {
  constructor(id, type = 'NORMAL') {
    this.id = id;
    this.type = type;
    this.status = 'PENDING';
    this.createdAt = new Date();
    this.processingStartTime = null;
    this.completedAt = null;
  }

  startProcessing() {
    this.status = 'PROCESSING';
    this.processingStartTime = new Date();
  }

  complete() {
    this.status = 'COMPLETE';
    this.completedAt = new Date();
  }

  resetToPending() {
    this.status = 'PENDING';
    this.processingStartTime = null;
  }
}

module.exports = Order;