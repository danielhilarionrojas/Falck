import { Injectable } from '@angular/core';

import { ApiError } from '../errors/api-error';

@Injectable({ providedIn: 'root' })
export class ErrorLogger {
  log(error: ApiError): void {
    // Reemplazable por Sentry, Datadog, etc. sin tocar los interceptores.
    console.error('[ApiError]', error);
  }
}
