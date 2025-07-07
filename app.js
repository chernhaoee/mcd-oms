const CLI = require('./cli/CLI');
const OrderController = require('./services/OrderController');
const Order = require('./models/Order');
const Bot = require('./models/Bot');

// Main entry point
if (require.main === module) {
  const cli = new CLI();
  cli.start();
}

// Export modules for testing
module.exports = {
  OrderController,
  Order,
  Bot,
  CLI
};