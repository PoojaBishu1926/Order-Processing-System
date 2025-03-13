const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const orderRoutes = require('./src/routes/order.routes');
const inventoryRoutes = require('./src/routes/inventory.routes')
const errorHandler = require('./src/middelware/errorHandler')
require('./src/workers/orderProcessor'); // Start SQS worker


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(errorHandler);
// app.use((err, req, res, next) => {
//     console.error("Error:", err.message);

//     res.status(err.status || 500).json({
//         success: false,
//         message: err.message || "Internal Server Error",
//     });
// });

