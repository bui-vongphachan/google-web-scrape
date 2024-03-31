require("dotenv").config();

const amqp = require("amqplib");
const { doScraping } = require("./scrap");

const queueName = "search-queue";
const exchangeName = "search-exchange";

async function listenToQueue() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    // Create a channel
    const channel = await connection.createChannel();

    // Declare an exchange
    await channel.assertExchange(exchangeName, "fanout", { durable: false });

    // Declare a queue
    await channel.assertQueue(queueName, { durable: false });

    // Bind the queue to the exchange
    await channel.bindQueue(queueName, exchangeName, "");

    console.log(`[*] Waiting for messages in ${queueName}.`);

    await channel.consume(
      queueName,
      async (message) => {
        console.log(`[x] Received message: ${message.content.toString()}`);

        await doScraping(message.content.toString());
      },
      { noAck: true }
    ); // Set noAck to true if you don't need manual acknowledgment
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

module.exports = { listenToQueue };
