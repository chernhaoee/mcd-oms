const Order = require('../models/Order');
const Bot = require('../models/Bot');

class OrderController {
  constructor() {
    this.orders = [];
    this.bots = [];
    this.nextOrderId = 1;
    this.nextBotId = 1;
  }

  createOrder(type = 'NORMAL', botId = null) {
    const order = new Order(this.nextOrderId++, type);
    
    // Insert order based on priority
    if (type === 'VIP') {
      // Find the last VIP order index
      let insertIndex = 0;
      for (let i = 0; i < this.orders.length; i++) {
        if (this.orders[i].type === 'VIP' && this.orders[i].status === 'PENDING') {
          insertIndex = i + 1;
        } else if (this.orders[i].type === 'NORMAL' && this.orders[i].status === 'PENDING') {
          break;
        }
      }
      this.orders.splice(insertIndex, 0, order);
    } else {
      this.orders.push(order);
    }

    // Try to assign to an idle bot
    this.assignOrderToBot();
    return order;
  }

  addBot() {
    const bot = new Bot(this.nextBotId++);
    this.bots.push(bot);
    
    // Try to assign pending order to the new bot
    this.assignOrderToBot();
    return bot;
  }

  removeBot() {
    if (this.bots.length === 0) {
      return null;
    }

    // Remove the newest bot (last added)
    const bot = this.bots.pop();
    const stoppedOrder = bot.stopProcessing();
    
    // If bot was processing an order, put it back to pending
    if (stoppedOrder) {
      // Find the order in our orders array and reset it
      const orderIndex = this.orders.findIndex(o => o.id === stoppedOrder.id);
      if (orderIndex !== -1) {
        this.orders[orderIndex] = stoppedOrder;
      }
      
      // Try to assign the stopped order to another bot
      this.assignOrderToBot();
    }

    return bot;
  }

  assignOrderToBot() {
    const idleBot = this.bots.find(bot => bot.isIdle());
    const pendingOrder = this.orders.find(order => order.status === 'PENDING');

    if (idleBot && pendingOrder) {
      idleBot.startProcessing(pendingOrder, (completedOrder) => {
        // Order completed, try to assign next order
        this.assignOrderToBot();
      });
    }
  }

  getPendingOrders() {
    return this.orders.filter(order => order.status === 'PENDING');
  }

  getProcessingOrders() {
    return this.orders.filter(order => order.status === 'PROCESSING');
  }

  getCompletedOrders() {
    return this.orders.filter(order => order.status === 'COMPLETE');
  }

  getBotStatus() {
    return this.bots.map(bot => ({
      id: bot.id,
      status: bot.status,
      currentOrderId: bot.currentOrder ? bot.currentOrder.id : null
    }));
  }

  getStats() {
    return {
      totalOrders: this.orders.length,
      pendingOrders: this.getPendingOrders().length,
      processingOrders: this.getProcessingOrders().length,
      completedOrders: this.getCompletedOrders().length,
      totalBots: this.bots.length,
      idleBots: this.bots.filter(bot => bot.isIdle()).length,
      processingBots: this.bots.filter(bot => !bot.isIdle()).length
    };
  }
}

module.exports = OrderController;