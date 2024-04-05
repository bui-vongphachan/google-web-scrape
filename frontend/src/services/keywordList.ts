import makeTextLowercaseAndNoSpace from "@/helpers/make-text-lowercase-and-no-space";
import Keyword from "./keyword";
import FunctionOutput from "./function-output";
import prisma from "@/lib/prisma";
import RabbitMQ from "./rabbitmq";

export default class KeywordList {
  keywords: Keyword[] = [];
  stringKeywords: string[] = [];

  constructor(keywords: string[], fileId: string) {
    this.stringKeywords = keywords;
    this.keywords = keywords.map(
      (keyword) =>
        new Keyword(makeTextLowercaseAndNoSpace(keyword), keyword, fileId)
    );
  }

  async save() {
    const output = new FunctionOutput<Keyword[]>(true, "", []);

    if (this.keywords.length > 100) {
      output.message = "You are only allowed to search up to 5 keywords";
      return output;
    }

    await prisma.keyword.createMany({ data: this.keywords });

    output.data = this.keywords;
    output.isError = false;
    return output;
  }

  async removeDuplicates() {
    const output = new FunctionOutput<Keyword[]>(true, "", this.keywords);

    const existingKeywords = await prisma.keyword.findMany({
      where: {
        keyword: {
          in: this.stringKeywords,
        },
      },
    });

    const newKeywords = this.keywords.filter(
      (item) =>
        !existingKeywords.some((keyword) => keyword.keyword === item.keyword)
    );

    this.keywords = newKeywords;

    output.data = newKeywords;
    output.isError = false;
    return output;
  }

  async publish(rabbitMQ: RabbitMQ) {
    const output = new FunctionOutput<Keyword[]>(true, "", this.keywords);

    if (this.keywords.length === 0) {
      output.message = "No keywords to publish";
      return output;
    }

    if (rabbitMQ.connection === null) {
      output.message = "RabbitMQ connection not established";
      return output;
    }

    if (rabbitMQ.channel === null) {
      output.message = "RabbitMQ channel not established";
      return output;
    }

    const promises = [];

    for (let i = 0; i < this.keywords.length; i += 20) {
      const promise = new Promise((resolve) => {
        const chunks = this.keywords.slice(i, i + 20);

        const buf = Buffer.from(JSON.stringify(chunks));

        rabbitMQ.channel?.publish(
          rabbitMQ.exchangeName,
          rabbitMQ.queueName,
          buf
        );

        resolve(null);
      });

      promises.push(promise);
    }

    await Promise.all(promises);

    output.isError = false;
    return output;
  }
}
