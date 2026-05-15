import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {

    return next.handle().pipe(
      map((data) => {

        // jika sudah punya format data+meta
        if (
          data?.data &&
          data?.meta
        ) {
          return {
            success: true,
            message: 'Request success',
            ...data,
          };
        }

        return {
          success: true,
          message: 'Request success',
          data,
        };
      }),
    );
  }
}
