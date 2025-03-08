const AWS = require('aws-sdk');

// Configure AWS SDK with credentials & region
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const sqs = new AWS.SQS();
const QUEUE_URL = process.env.AWS_SQS_QUEUE_URL;

// Function to send order to SQS
const sendToSQS = async (order) => {
    try {
        const params = {
            QueueUrl: QUEUE_URL,
            MessageBody: JSON.stringify({
                orderId: order._id,
                userId: order.userId,
                items: order.items,
                totalAmount: order.totalAmount,
                status: order.status
            })
        };

        const result = await sqs.sendMessage(params).promise();
        console.log("Order sent to SQS:", result.MessageId);
        return result;
    } catch (error) {
        console.error("Error sending order to SQS:", error);
        throw new Error("Failed to send order to SQS");
    }
};

module.exports = { sendToSQS };
