class AppError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
        this.isOperational=true;
        Error.captureStackTrace(this,this.constructor)
    }
}
class NotFoundError extends AppError{
        constructor(message){
            super(message,404);
            
        }
}
class BadRequestError extends AppError{
        constructor(message){
            super(message,400);
            
        }
}
class UnauthorizedError extends AppError{
        constructor(message){
            super(message,401);
            
        }
}
class ForbiddenError extends AppError{
        constructor(message){
            super(message,403);
            
        }
}
class ConflictError extends AppError{
        constructor(message){
            super(message,409);
            
        }
}
class ValidationError extends AppError{
        constructor(message){
            super(message,422);
            
        }
}
module.exports={
    AppError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    ValidationError
}


// Client

// ↓

// Bad Request

// 400

// ------------

// No Login

// 401

// ------------

// No Permission

// 403

// ------------

// Not Found

// 404

// ------------

// Conflict

// 409

// ------------

// Validation

// 422

// ------------

// Unexpected Bug

// 500