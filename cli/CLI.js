const readline = require("readline");
const OrderController = require("../services/OrderController");

class CLI {
  constructor() {
    this.controller = new OrderController();
    this.isMonitoring = false;
    this.monitorInterval = null;
    this.createReadlineInterface();
  }

  createReadlineInterface() {
    if (this.rl && !this.rl.closed) {
      this.rl.close();
    }

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    this.rl.on("line", (input) => {
      this.processCommand(input);
    });

    this.rl.on("close", () => {
      console.log(
        "👋 Goodbye! Thanks for using McDonald's Order Controller System"
      );
      process.exit(0);
    });
  }

  // Process user input commands
  processCommand(input) {
    const command = input.trim().toLowerCase();

    switch (command) {
      case "1":
      case "normal":
        this.createNormalOrder();
        break;
      case "2":
      case "vip":
        this.createVIPOrder();
        break;
      case "3":
      case "+bot":
        this.addBot();
        break;
      case "4":
      case "-bot":
        this.removeBot();
        break;
      case "5":
      case "status":
        this.showStatus();
        break;
      case "6":
      case "monitor":
        this.startMonitoring();
        return;
      case "7":
      case "help":
        this.showMenu();
        break;
      case "0":
      case "exit":
        this.exit();
        return;
      default:
        console.log('❌ Invalid command. Type "help" for available commands.');
    }

    this.promptForInput();
  }

  promptForInput() {
    this.rl.prompt();
  }

  start() {
    console.log("🍟 McDonald's Order Controller System");
    console.log("=====================================");
    this.showMenu();
    this.rl.setPrompt("\nEnter command: ");
    this.promptForInput();
  }

  showMenu() {
    console.log("\nAvailable Commands:");
    console.log("1. normal     - Create Normal Order");
    console.log("2. vip        - Create VIP Order");
    console.log("3. +bot       - Add Bot");
    console.log("4. -bot       - Remove Bot");
    console.log("5. status     - Show Current Status");
    console.log("6. monitor    - Real-time Monitoring");
    console.log("7. help       - Show this menu");
    console.log("0. exit       - Exit application");
    console.log("=====================================");
  }

  createNormalOrder() {
    const order = this.controller.createOrder("NORMAL");
    console.log(`✅ Created Normal Order #${order.id}`);
    this.showQuickStatus();
  }

  createVIPOrder() {
    const order = this.controller.createOrder("VIP");
    console.log(`⭐ Created VIP Order #${order.id}`);
    this.showQuickStatus();
  }

  addBot() {
    const bot = this.controller.addBot();
    console.log(`🤖 Added Bot #${bot.id}`);
    this.showQuickStatus();
  }

  removeBot() {
    const bot = this.controller.removeBot();
    if (bot) {
      console.log(`🗑️  Removed Bot #${bot.id}`);
      this.showQuickStatus();
    } else {
      console.log("❌ No bots available to remove");
    }
  }

  showStatus() {
    const stats = this.controller.getStats();
    const botStatus = this.controller.getBotStatus();

    const pendingOrders = this.controller.getPendingOrders();
    const processingOrders = this.controller.getProcessingOrders();
    const completedOrders = this.controller.getCompletedOrders();

    const pendingNormal = pendingOrders.filter(
      (order) => order.type === "NORMAL"
    ).length;
    const pendingVIP = pendingOrders.filter(
      (order) => order.type === "VIP"
    ).length;
    const processingNormal = processingOrders.filter(
      (order) => order.type === "NORMAL"
    ).length;
    const processingVIP = processingOrders.filter(
      (order) => order.type === "VIP"
    ).length;
    const completedNormal = completedOrders.filter(
      (order) => order.type === "NORMAL"
    ).length;
    const completedVIP = completedOrders.filter(
      (order) => order.type === "VIP"
    ).length;

    console.log("\n📊 Current System Status:");
    console.log("========================");
    console.log(`Total Orders: ${stats.totalOrders}`);
    console.log("");

    console.log("📋 PENDING ORDERS:");
    console.log(`   Total: ${stats.pendingOrders}`);
    console.log(`   ⭐ VIP: ${pendingVIP} | 👤 Normal: ${pendingNormal}`);

    console.log("\n🔄 PROCESSING ORDERS:");
    console.log(`   Total: ${stats.processingOrders}`);
    console.log(`   ⭐ VIP: ${processingVIP} | 👤 Normal: ${processingNormal}`);

    if (processingOrders.length > 0) {
      console.log("   Processing Details:");
      processingOrders.forEach((order) => {
        const timeElapsed = Math.floor(
          (Date.now() - order.processingStartTime.getTime()) / 1000
        );
        const timeRemaining = Math.max(0, 10 - timeElapsed);
        const orderType = order.type === "VIP" ? "⭐ VIP" : "👤 Normal";
        console.log(
          `     Order #${order.id} (${orderType}): ${timeElapsed}s elapsed, ${timeRemaining}s remaining`
        );
      });
    }

    console.log("\n✅ COMPLETED ORDERS:");
    console.log(`   Total: ${stats.completedOrders}`);
    console.log(`   ⭐ VIP: ${completedVIP} | 👤 Normal: ${completedNormal}`);

    if (completedOrders.length > 0) {
      console.log("   Recent Completions:");
      const recentCompleted = completedOrders.slice(-5);
      recentCompleted.forEach((order) => {
        const processingTime = Math.floor(
          (order.completedAt.getTime() - order.processingStartTime.getTime()) /
            1000
        );
        const orderType = order.type === "VIP" ? "⭐ VIP" : "👤 Normal";
        const completedTime = order.completedAt.toLocaleTimeString();
        console.log(
          `     Order #${order.id} (${orderType}): Completed in ${processingTime}s at ${completedTime} by Bot #${order.completedByBotId}`
        );
      });
    }

    console.log("\n🤖 BOT STATUS:");
    console.log(`   Total Bots: ${stats.totalBots}`);
    console.log(
      `   💤 Idle: ${stats.idleBots} | 🔄 Processing: ${stats.processingBots}`
    );

    if (botStatus.length > 0) {
      console.log("\n🤖 Bot Details:");
      botStatus.forEach((bot) => {
        if (bot.status === "IDLE") {
          console.log(`   Bot #${bot.id}: 💤 IDLE`);
        } else {
          const currentOrder = processingOrders.find(
            (order) => order.id === bot.currentOrderId
          );
          if (currentOrder) {
            const timeElapsed = Math.floor(
              (Date.now() - currentOrder.processingStartTime.getTime()) / 1000
            );
            const timeRemaining = Math.max(0, 10 - timeElapsed);
            const orderType =
              currentOrder.type === "VIP" ? "⭐ VIP" : "👤 Normal";
            console.log(
              `   Bot #${bot.id}: 🔄 Processing ${orderType} Order #${bot.currentOrderId} (${timeElapsed}s/${timeRemaining}s left)`
            );
          } else {
            console.log(
              `   Bot #${bot.id}: 🔄 Processing Order #${bot.currentOrderId}`
            );
          }
        }
      });
    }
  }

  startMonitoring() {
    console.log("📡 Starting real-time monitoring...");
    console.log('Press "q" and Enter to stop monitoring');
    console.log("Status will update every 2 seconds\n");

    this.isMonitoring = true;

    // Set up monitoring display
    this.monitorInterval = setInterval(() => {
      console.clear();
      console.log("📡 REAL-TIME MONITORING MODE");
      console.log("============================");
      console.log(`Current Time: ${new Date().toLocaleTimeString()}`);
      console.log('Press "q" and Enter to stop monitoring\n');

      this.showStatus();

      const processingOrders = this.controller.getProcessingOrders();
      if (processingOrders.length === 0) {
        console.log(
          "\n💤 No orders currently processing. Monitoring continues..."
        );
      }

      console.log("\n🔄 Auto-refreshing every 2 seconds...");
      console.log('Type "q" and press Enter to stop monitoring');
    }, 2000);

    const monitoringLineHandler = (input) => {
      const command = input.trim().toLowerCase();
      if (command === "q" || command === "quit" || command === "exit") {
        this.stopMonitoring();

        this.rl.removeListener("line", monitoringLineHandler);

        console.log("\n📡 Monitoring stopped. Returning to main menu...");

        setTimeout(() => {
          console.clear();
          console.log("🍟 McDonald's Order Management System");
          console.log("=====================================");
          this.showMenu();
          this.rl.setPrompt("\nEnter command: ");
          this.promptForInput();
        }, 500);
      }
    };

    this.rl.on("line", monitoringLineHandler);
  }

  stopMonitoring() {
    this.isMonitoring = false;
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
  }

  showQuickStatus() {
    const stats = this.controller.getStats();
    console.log(
      `📈 Quick Status - Pending: ${stats.pendingOrders}, Processing: ${stats.processingOrders}, Completed: ${stats.completedOrders}, Bots: ${stats.totalBots}`
    );
  }

  exit() {
    console.log(
      "👋 Goodbye! Thanks for using McDonald's Order Management System"
    );
    this.stopMonitoring();
    if (!this.rl.closed) {
      this.rl.close();
    }
  }
}

module.exports = CLI;
