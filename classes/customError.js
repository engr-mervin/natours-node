export class CustomError extends Error {
    statusCode;
    status;
    isOperational;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
