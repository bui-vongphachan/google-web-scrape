import { makeUniqueId } from "@/helpers/make-unique-id";
import prisma from "@/lib/prisma";
import FunctionOutput from "./function-output";

export default class UploadingFile {
  id = "";
  name = "";
  createdAt = new Date();
  userId = "";
  keywords: string[] = [];
  rawFile: File | null = null;

  constructor(file: File, userId: string) {
    this.name = file.name;
    this.userId = userId;
    this.id = makeUniqueId();
    this.createdAt = new Date();
    this.rawFile = file;
  }

  async save() {
    const output = new FunctionOutput<UploadingFile>(true, "", this);

    await prisma.uploadedFile.create({ data: this });

    output.isError = false;
    return output;
  }

  async getKeywords() {
    const output = new FunctionOutput<string[]>(true, "", []);

    if (this.rawFile === null) {
      output.message = "Please upload a file";
      return output;
    }

    const keywords = await this.rawFile
      .text()
      .then((text) => text.split("\n").filter((item) => item !== ""));

    if (keywords.length > 100) {
      output.message = "You are only allowed to search up to 5 keywords";
      return output;
    }

    this.keywords = keywords;

    output.data = keywords;
    output.isError = false;
    return output;
  }
}
