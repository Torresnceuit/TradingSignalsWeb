import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import { TokenService } from "../services/token.service";
import { Token } from "../models/token";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) { }

  intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    return Observable.create((subscriber: Subscriber<HttpEvent<any>>) => {

      // Prepare the handlers for use later on
      let successHandler = success => {
        // pass the event back to the caller of the interceptor
        subscriber.next(success);
      }

      let errorHandler = error => {
        // pass the event back to the caller of the interceptor
        subscriber.error(error);
      }

      let refreshTokenAndContinue = () => {
        this.tokenService.refreshToken().subscribe(
          token => {
            // Now we have a new token, use it in the headers
            request = request.clone({
              setHeaders: {
                Authorization: 'Bearer ' + token.accessToken
              }
            });

            // Pass the request along
            handler.handle(request).subscribe(successHandler, errorHandler);

          }, error => {
            // Pass the error down the chain
            errorHandler(error);
          }
        )
      }


      // If we need authentication
      if (request['auth']) {
        // If the token has expired
        if (this.tokenService.tokenExpired()) {
          // Refresh it and use new token
          refreshTokenAndContinue();
        }
        else {
          // The token has not expired, add it to the headers and complete the request
          request = request.clone({
            setHeaders: {
              Authorization: 'Bearer ' + this.tokenService.getStorageToken().accessToken
            }
          });

          // Pass the request along, catching any authorisation errors
          handler.handle(request).subscribe(successHandler, error => {
            if (error instanceof HttpErrorResponse && error.status == 401) {
              // Unauthorised - try refreshing token and trying again
              refreshTokenAndContinue()
            }
            else {
              // Handle the error normally
              errorHandler(error);
            }
          });
        }
      }
      else {
        // The request requires no authentication
        // Pass the request along
        handler.handle(request).subscribe(successHandler, errorHandler);
      }

    });
  }
}