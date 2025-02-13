import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql'; // Import GraphQLError
import mongoose from 'mongoose';
import { AppError } from 'src/utils';
import { GraphqlValidationException } from './GraphqlValidationException';
import handleCastError from './handleCastError';
import handleDuplicateError from './handleDuplicateError';
import handleMongooseError from './handleMongooseError';

@Catch(HttpException, Error) // Catch both HttpException and generic Error
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const gqlHost = host.switchToHttp(); // For HTTP requests (if needed)

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong!';
    let errors: any[] = []; // Use 'any' type for flexibility

    if (exception instanceof GraphqlValidationException) {
      // Your custom GraphqlValidationException
      statusCode = exception.getStatus();
      message = exception.message;
      errors = exception.graphQLErrors;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
      errors = [{ message: message }]; // Adapt to your error format
    } else if (exception instanceof mongoose.Error.ValidationError) {
      const modifier = handleMongooseError(exception);
      statusCode = modifier.statusCode;
      message = modifier.message;
      errors = modifier.errors;
    } else if (exception instanceof mongoose.Error.CastError) {
      const modifier = handleCastError(exception);
      statusCode = modifier.statusCode;
      message = modifier.message;
      errors = modifier.errors;
    } else if ((exception as any)?.code === 11000) {
      const modifier = handleDuplicateError(exception);
      statusCode = modifier.statusCode;
      message = modifier.message;
      errors = modifier.errors;
    } else if (exception instanceof AppError) {
      statusCode = exception.statusCode;
      message = exception.message;
      errors = [{ message: exception.message }];
    } else if (exception instanceof Error) {
      message = exception.message;
      errors = [{ message: exception.message }];
      // Important: Log the stack trace for debugging in production
      console.error(exception); // Or use a proper logging service
    }

    // Format the error response for GraphQL
    const graphQLError = new GraphQLError(message, {
      extensions: {
        code: statusCode.toString(), // Convert to string for GraphQL
        errorMessages: errors,
        // stack: exception.stack, // Include stack trace in development only
      },
    });

    return graphQLError; // Return the GraphQLError object
  }
}
