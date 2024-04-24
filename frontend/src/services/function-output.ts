export default class FunctionOutput<T> {
  isError: boolean = false;
  message: string = "";
  data: T = {} as T;

  constructor(isError: boolean, message: string, data: T) {
    this.isError = isError;
    this.message = message;
    this.data = data;
  }
}
