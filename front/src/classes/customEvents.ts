export class NetworkError extends Error {
  details: Response;
  constructor(details: Response, message?: string) {
    super(message);
    this.details = details;
  }
}

export class GenericNetworkError extends NetworkError {}

export class ClientError extends NetworkError {}

export class ServerError extends NetworkError {}

export class UndefinedError extends NetworkError {}
