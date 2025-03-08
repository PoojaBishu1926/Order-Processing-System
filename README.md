# Order-Processing-System
Order Processing System
Order Processing System

This is a Node.js-based Order Processing System that integrates with AWS SQS, Redis, and AWS SES to process orders asynchronously.
Features

✅ Listens to AWS SQS for new orders
✅ Processes orders and updates order status
✅ Stores orders in Redis for quick retrieval
✅ Persists order data in MongoDB
✅ Sends email notifications using AWS SES

Tech Stack

    Backend: Node.js, Express.js
    Database: MongoDB, Redis
    Message Queue: AWS SQS
    Email Service: AWS SES
    Other Tools: Postman for API testing

    Setup Instructions
1. Clone the Repository
     git clone https://github.com/PoojaBishu1926/Order-Processing-System

2. Install Dependencies
   npm install
3. Environment Variables (.env)
     PORT=3000
  MONGO_URI=mongodb://localhost:27017/orderDB
  REDIS_HOST=127.0.0.1
  REDIS_PORT=6379
  AWS_ACCESS_KEY_ID=your_aws_access_key
  AWS_SECRET_ACCESS_KEY=your_aws_secret_key
  AWS_REGION=us-east-1
  AWS_SQS_URL=your_sqs_queue_url
  AWS_SES_EMAIL=your_verified_ses_email

4. Start Redis (If not running)
     redis-server
5. Run the Server
     npm start



   
   
