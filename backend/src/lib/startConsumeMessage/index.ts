import amqp from "amqplib";
import doScraping from "../../services/do-scrap";
import { Sequelize } from "sequelize";

const queueName = "search-queue";
const exchangeName = "search-exchange";

export default async function startConsumeMessage(sequalizeClient: Sequelize) {
  try {
    if (!process.env.RABBITMQ_URL) throw new Error("RABBITMQ_URL is not set");

    // Connect to RabbitMQ server
    const connection = await amqp.connect(process.env.RABBITMQ_URL, {
      heartbeat: 10
    });

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
        if (!message) return;

        console.log(`[x] Received message: ${message.content.toString()}`);

        await doScraping(message.content.toString(), sequalizeClient);
      },
      { noAck: true }
    ); // Set noAck to true if you don't need manual acknowledgment
  } catch (error) {
    console.error("Error occurred:", error);
  }
}
