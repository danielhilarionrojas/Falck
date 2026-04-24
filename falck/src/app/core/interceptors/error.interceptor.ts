import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { ApiError } from '../errors/api-error';
import { ErrorLogger } from '../services/error-logger';

export const errorInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const logger = inject(ErrorLogger);

  return next(req).pipe(
    catchError((error: unknown) => {
      const normalized = toApiError(error, req.urlWithParams);
      logger.log(normalized);
      return throwError(() => normalized);
    }),
  );
};

const toApiError = (error: unknown, url: string): ApiError => {
  if (error instanceof HttpErrorResponse) {
    return {
      status: error.status,
      message:
        (typeof error.error === 'object' && error.error !== null && 'message' in error.error
          ? String((error.error as { message: unknown }).message)
          : null) ??
        error.message ??
        'Unknown HTTP error',
      url: error.url ?? url,
      cause: error,
    };
  }
  return {
    status: 0,
    message: error instanceof Error ? error.message : 'Unexpected error',
    url,
    cause: error,
  };
};
