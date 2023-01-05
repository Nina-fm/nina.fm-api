export class Exception {
  constructor(error, status) {
    const err = new Error(error);
    err.statusCode = status;
    return err;
  }
}

export class NotFoundException extends Exception {
  constructor(error) {
    super(error, 404);
  }
}

export class BadRequestException extends Exception {
  constructor(error) {
    super(error, 400);
  }
}
