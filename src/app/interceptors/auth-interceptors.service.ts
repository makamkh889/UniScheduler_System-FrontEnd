import { HttpEventType, HttpHandlerFn, HttpRequest, HttpEvent, HttpHandler, HttpInterceptor } from "@angular/common/http";
import { catchError, tap, throwError } from "rxjs";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export function AuthInterceptors(req: HttpRequest<any>, next: HttpHandlerFn) {

     const authToken = sessionStorage.getItem('token');
     let Modified_req = req;
     if (authToken) {
          Modified_req = req.clone({
               headers: Modified_req.headers.set('Authorization', `Bearer ${authToken}`)
          });
     }
     console.log(Modified_req);
     return next(Modified_req).pipe(
          tap(response => {


               // if (event.type == HttpEventType.Response) {
               //      if (event.status == 200) { }
               //      else if (event.status == 500) { }
               // }

          }),
          catchError((error) => {
               console.log(Modified_req);
               return throwError(() => error.error);  // Rethrow the error so it can be handled by the caller
          })
     );
}


