import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler,HttpClient, HttpHeaders, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {LocalStorageService} from "angular-web-storage";
import {NgxSpinnerService} from "ngx-spinner";
import {UrlService} from "../url/url.service";

@Injectable({
  providedIn: 'root'
})
export class SetAuthInterceptorService {
  user: any;
  proxyUrl = 'https://cors-anywhere.herokuapp.com';
  constructor(
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService,
    private url: UrlService,
    private http : HttpClient
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const reqCloned =  this.handleBodyIn(req);
    const copiedReq = reqCloned;
    this.spinner.show();

    return next.handle(copiedReq);
  }
  handleBodyIn(req: HttpRequest<any>) {
    // alert(this.url.bellyMellyUrl);
    this.user = this.localStorage.get('BM_USER');
    let authReq;
    let token = '';
    // alert(req.url);
    if (this.user) token = this.user.token;
    // url: `${this.proxyUrl}/${this.url.bellyMellyUrl}${req.url}`,
    const url = req.url.split('/')[2];
  
    if (url != '13.234.241.183:3000' && req.url != 'https://ipapi.co/json/') {
      if (req.method.toLowerCase() === 'post') {
        if (req.body instanceof FormData) {
          authReq = req.clone({
            headers: new HttpHeaders({
            })
          });
        } else {
          if(window.location.hostname == 'localhost'){
            authReq = req;
            authReq = req.clone({
              url: `${this.proxyUrl}/${this.url.bellyMellyUrl}${req.url}`, //testing
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*',
              }),
              body: {postData: btoa(JSON.stringify(req.body)), dt: new Date().getTime()}
            });
          }else{
            authReq = req;
            authReq = req.clone({
              url: `${this.url.bellyMellyUrl}${req.url}`, //live
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*',
              }),
              body: {postData: btoa(JSON.stringify(req.body)), dt: new Date().getTime()}
            });
          }
        

        }
      } else if (req.method.toLowerCase() === 'get') {
        req = req.clone({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*',
          })
        });
      }
      return authReq;
    } else {
      // alert('Url => ' + req.url);
      if (req.method.toLowerCase() ==  'post') {
        if (req.body instanceof FormData) {
          authReq = req.clone({
            headers: new HttpHeaders({
              'Authorization': ''
            })
          });
        } else {
          authReq = req.clone({
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': token || ''
            }),
          });
        }
      } else {
        authReq = req.clone({
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': token || ''
          })
        });
      }
      return authReq;
    }
  }
}
