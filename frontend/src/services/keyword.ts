import { makeUniqueId } from "@/helpers/make-unique-id";

export default class Keyword {
  id = makeUniqueId();
  compactKeyword: string = "";
  keyword: string = "";
  createdAt = new Date();
  fileId = "";

  constructor(compactKeyword: string, keyword: string, fileId: string) {
    this.compactKeyword = compactKeyword;
    this.keyword = keyword;
    this.fileId = fileId;
  }
}
