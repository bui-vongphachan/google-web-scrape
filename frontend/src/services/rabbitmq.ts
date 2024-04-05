import amqp from "amqplib";
import FunctionOutput from "./function-output";

export default class RabbitMQ {
  connection: amqp.Connection | null = null;
  channel: amqp.Channel | null = null;
  exchangeName = "search-exchange";
  queueName = "search-queue";

  async warnup() {
    const output = new FunctionOutput(true, "", null);

    const createChannelOutput = await this.createChannel();

    if (createChannelOutput.isError) return createChannelOutput;

    const assertExchangeOutput = await this.assertExchange();

    if (assertExchangeOutput.isError) return assertExchangeOutput;

    const assertQueueOutput = await this.assertQueue();

    if (assertQueueOutput.isError) return assertQueueOutput;

    output.isError = false;
    return output;
  }

  async connect() {
    const output = new FunctionOutput<amqp.Connection | null>(true, "", null);

    if (this.connection !== null) {
      output.data = this.connection;
      output.isError = false;
      return output;
    }

    this.connection = await amqp
      .connect(process.env.RABBITMQ_URL as string)
      .then((conn) => conn)
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!this.connection) {
      output.message = "Failed to connect to RabbitMQ";
      return output;
    }

    output.data = this.connection;
    output.isError = false;
    return output;
  }

  async createChannel() {
    const output = new FunctionOutput<amqp.Channel | null>(true, "", null);

    if (!this.connection) {
      output.message = "Failed to connect to RabbitMQ";
      return output;
    }

    if (this.channel !== null) {
      output.data = this.channel;
      output.isError = false;
      return output;
    }

    this.channel = await this.connection
      .createChannel()
      .then((channel) => channel)
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!this.channel) {
      output.message = "Failed to create channel";
      return output;
    }

    output.data = this.channel;
    output.isError = false;
    return output;
  }

  async assertExchange() {
    const output = new FunctionOutput<amqp.Replies.AssertExchange | null>(
      true,
      "",
      null
    );

    if (!this.channel) {
      output.message = "Failed to create channel";
      return output;
    }

    const reply = await this.channel
      .assertExchange(this.exchangeName, "fanout", {
        durable: false,
      })
      .then((reply) => reply)
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!reply) {
      output.message = "Failed to assert exchange";
      return output;
    }

    output.data = reply;
    output.isError = false;
    return output;
  }

  async assertQueue() {
    const output = new FunctionOutput<amqp.Replies.AssertQueue | null>(
      true,
      "",
      null
    );

    if (!this.channel) {
      output.message = "Failed to create channel";
      return output;
    }

    const reply = await this.channel
      .assertQueue(this.queueName, { durable: false })
      .then((reply) => reply)
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!reply) {
      output.message = "Failed to assert queue";
      return output;
    }

    output.data = reply;
    output.isError = false;
    return output;
  }
}
