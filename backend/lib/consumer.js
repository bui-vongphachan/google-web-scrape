const amqp = require("amqplib");
const { doScraping } = require("./scrap");

const queueName = "search-queue";
const exchangeName = "search-exchange";
const url =
  "amqps://wyaofjks:FxcvgNSO_ODhNd6YhMF0utAMDyuuenwy@octopus.rmq3.cloudamqp.com/wyaofjks";

async function listenToQueue() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect(url);

    // Create a channel
    const channel = await connection.createChannel();

    // Declare an exchange
    await channel.assertExchange(exchangeName, "fanout", { durable: false });

    // Declare a queue
    await channel.assertQueue(queueName, { durable: false });

    // Bind the queue to the exchange
    await channel.bindQueue(queueName, exchangeName, "");

    console.log(`[*] Waiting for messages in ${queueName}.`);

    channel.consume(
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
