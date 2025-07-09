MCD OMS
🚀 Features

Priority Queue Management: VIP orders are processed before normal orders
Real-time Bot Management: Add/remove bots dynamically
Order Lifecycle Tracking: PENDING → PROCESSING → COMPLETE
Interactive CLI Interface: Easy-to-use command-line interface
Comprehensive Testing: Full test coverage with performance tests
Clean Architecture: Modular design following SOLID principles

✅ New Normal Order creates unique, increasing order IDs in PENDING area
✅ New VIP Order prioritizes correctly (ahead of normal, behind existing VIP)
✅ Unique, increasing order numbers
✅ Bot creation immediately processes pending orders with 10-second timing
✅ Bots become IDLE when no orders are pending
✅ Bot removal stops current processing and returns order to PENDING
✅ In-memory data storage (no persistence)

🏗️ Architecture

├── models/
│   ├── Order.js        # Order entity with status management
│   └── Bot.js          # Bot entity with processing logic
├── services/
│   └── OrderController.js # Main business logic
├── cli/
│   └── CLI.js          # Command-line interface
└── app.js              # Main entry point

Install dependencies
npm install

Run the application
npm start 