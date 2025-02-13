// graphql-validation.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';

export class GraphqlValidationException extends HttpException {
  public graphQLErrors: GraphQLError[]; // Array of GraphQLError objects

  constructor(errors: any[]) {
    // 'any[]' because the validation errors could have various structures
    super({ errors }, HttpStatus.BAD_REQUEST); // Store errors in the response body

    this.graphQLErrors = errors.map((error) => {
      let message = error.constraints
        ? error.constraints[Object.keys(error.constraints)[0]]
        : error.message;

      return new GraphQLError(message, {
        extensions: {
          code: 'VALIDATION_ERROR', // Custom error code
          field: error.property, // The field that caused the error
          message: message, // The error message
        },
      });
    });
  }
}
