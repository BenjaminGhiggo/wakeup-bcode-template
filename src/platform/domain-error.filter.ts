import { type ArgumentsHost, Catch, type ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { DomainError } from '../shared-kernel/domain-error.js';

/** Business-rule violations become a readable 400: { statusCode, error, message } with the rule's own message. */
@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost): void {
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(400)
      .json({ statusCode: 400, error: 'Bad Request', message: error.message });
  }
}
