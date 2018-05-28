import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService extends HttpClient {

  constructor(private httpHandler: HttpHandler) {
    super(httpHandler);
  }

  private addInterceptor(interceptor: HttpInterceptor): HttpService {
    const handler: HttpHandler = new HttpInterceptorHandler(this.httpHandler, interceptor);

    return new HttpService(handler);
  }

  auth(): HttpService {
    return this.addInterceptor({
      intercept(req, next) {
        // add the auth bool so in the interceptor we know to add the auth header
        req['auth'] = true;

        return next.handle(req);
      }
    });
  }
}

class HttpInterceptorHandler implements HttpHandler {
  constructor(private next: HttpHandler, private interceptor: HttpInterceptor) { }

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(req, this.next);
  }
}