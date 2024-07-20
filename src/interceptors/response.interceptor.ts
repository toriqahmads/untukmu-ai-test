import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (
          context.switchToHttp().getResponse().getHeaders()[
            'content-disposition'
          ]
        ) {
          return data;
        }

        return {
          code: context.switchToHttp().getResponse().statusCode,
          success: true,
          message: data?.message || 'success',
          data,
        };
      }),
    );
  }
}
