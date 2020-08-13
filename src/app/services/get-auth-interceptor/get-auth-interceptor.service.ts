import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ToastrManager} from 'ng6-toastr-notifications';
import {LocalStorageService} from 'angular-web-storage';
import {LoginService} from '../login/login.service';
import {Observable} from 'rxjs';
import {NgxSpinnerService} from "ngx-spinner";
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class GetAuthInterceptorService {

  constructor(
    private router: Router,
    private toaster: ToastrManager,
    private loginService: LoginService,
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        this.spinner.hide();
        if (event.status == 200) {
          const url = event.url.split('/')[2];
          if (url.toString() !== '13.234.241.183:3000' && event.url != 'https://ipapi.co/json/') {


          
            if (event.body.serviceStatus != 'S') {
              if (event.body.serviceStatus == 'F007') return this.error(event.body.message);
              if (event.body.message == 'AppCode or LocationId Mismatch') {
                return this.error('We are sorry. Either the web address is incorrect or the restaurant location is not enabled. Please place your order by calling the restaurant directly.');
              }
              if (window.location.hostname == 'localhost') {
                if (event.url.split('&type')[0] == 'https://cors-anywhere.herokuapp.com/https://bellymelly.com/AjaxServer_Location.aspx?Action=getLocation') {  //testing
                  if (event.body.Locations.length == 0) return;
                }
                else if (event.url.split('&NGOCode')[0] == 'https://cors-anywhere.herokuapp.com/https://bellymelly.com/AjaxServer_Location.aspx?Action=getNGOdetails') {  //testing
                  if (!event.body.NgoDetails) return;
                }
                else {
                  return this.error(event.body.message);
                }
              } else {
                if (event.url.split('&type')[0] == 'https://bellymelly.com/AjaxServer_Location.aspx?Action=getLocation') {
                  if (event.body.Locations.length == 0) return;
                }
                else if (event.url.split('&NGOCode')[0] == 'https://bellymelly.com/AjaxServer_Location.aspx?Action=getNGOdetails') {  //live
                  if (!event.body.NgoDetails) return;
                }

                else {
                  return this.error(event.body.message);
                }
              }
              return
            }

            const data = event.body;
            data.data = JSON.parse(atob(data.data));
            return event.clone({
              body: data
            });
          } else {
            if (event.url == 'https://ipapi.co/json/') return;
            if (!event.body.success) return this.error(event.body.message);
          }
        } else {
          return alert(event.body.message);
        }
      }
    }, (error: any) => {
      if (error instanceof HttpErrorResponse) {
        this.spinner.hide();
        if (error.status === 403) {
          this.toaster.errorToastr('Your session is expired, please sign in.');
          this.router.navigateByUrl('/');
          this.loginService.setVal(false);
          this.localStorage.clear();
          document.getElementById('openLoginModalBtn').click();
        } else if (error.status !== 200) {
          // document.getElementById('connectionError').click();
          return alert('Connection Error: Please check your internet connection and try again.');
        }
      }
    }));
  }
  error = (message: string) => {
    this.toaster.errorToastr(message);
  }
}
