const AWS = require('aws-sdk');
const Order = require('../models/order.model'); 
const { sendOrderConfirmationEmail } = require('../services/email.service');
const redisClient = require('../config/redis')
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const sqs = new AWS.SQS();
const QUEUE_URL = process.env.AWS_SQS_QUEUE_URL;

// Function to process messages from SQS
const processOrder = async () => {
    try {
        const params = {
            QueueUrl: QUEUE_URL,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 10
        };

        const data = await sqs.receiveMessage(params).promise();
        if (!data.Messages || data.Messages.length === 0) {
            console.log("No new messages.");
            return;
        }

        const message = data.Messages[0];
        const orderDetails = JSON.parse(message.Body);

        console.log("Processing Order:", orderDetails);

        // Update order status in MongoDB
        await Order.findByIdAndUpdate(orderDetails.orderId, { status: "Processed" });

        await redisClient.set(`order:${orderDetails.orderId}`, JSON.stringify(orderDetails), {
            EX: 3600 // Expire in 1 hour
        });

        console.log("✅Order stored in Redis:", orderDetails.orderId);

        // Send confirmation email
        await sendOrderConfirmationEmail(orderDetails);

        // Delete message from SQS after processing
        await sqs.deleteMessage({
            QueueUrl: QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle
        }).promise();

        console.log("Order Processed Successfully!");

    } catch (error) {
        console.error(" Error processing order:", error);
    }
};

// Run worker continuously
setInterval(processOrder, 5000);
