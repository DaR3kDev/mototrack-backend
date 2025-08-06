import { ResponseInterface } from './interfaces/response.interfaces';

export class ResponseHelper<T> implements ResponseInterface<T> {
  message: string;
  data?: T | [];

  constructor(message: string, data?: T | []) {
    this.message = message;
    this.data = data;
  }
}
