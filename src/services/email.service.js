const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const sendOrderConfirmationEmail = async (order) => {
    const params = {
        Source: process.env.SES_VERIFIED_EMAIL,
        Destination: {
            ToAddresses: ["vikybad9306@gmail.com"]
        },
        Message: {
            Subject: { Data: `Order Confirmation - ${order.orderId}` },
            Body: {
                Text: { Data: `Thank you for your order!\n\nOrder ID: ${order.orderId}\nStatus: ${order.status}\nTotal: $${order.totalAmount}` },
                Html: {
                    Data: `<h2>Order Confirmation</h2>
                           <p>Thank you for your order!</p>
                           <p><strong>Order ID:</strong> ${order.orderId}</p>
                           <p><strong>Status:</strong> ${order.status}</p>
                           <p><strong>Total:</strong> $${order.totalAmount}</p>`
                }
            }
        }
    };

    try {
        const result = await ses.sendEmail(params).promise();
        console.log("Email sent successfully:", result.MessageId);
    } catch (error) {
        console.error("Failed to send email:", error);
    }
};

module.exports = { sendOrderConfirmationEmail };
