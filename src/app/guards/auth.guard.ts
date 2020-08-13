import { Injectable } from '@angular/core';
import {ActivatedRoute, CanActivate, Router} from '@angular/router';
import {LocalStorageService} from "angular-web-storage";
import {LoginService} from "../services/login/login.service";
import {ToastrManager} from "ng6-toastr-notifications";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  mobUrl: string;
  country: string;
  constructor(
    private localStorage: LocalStorageService,
    private loginService: LoginService,
    private toaster: ToastrManager,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }
  canActivate() {
    if (this.localStorage.get('BM_USER')) {
      return true;
    }
    this.loginService.setVal(false);
    // this.toaster.errorToastr('Sorry, you need to sign in first.');
    const url = window.location.pathname.replace('/', ''); // Without hashing
    // const url = window.location.hash.replace('#/', ''); // With hashing
    if(window.location.href.substring(window.location.href.indexOf('#')+1) == 'dinein'){
      this.router.navigateByUrl(`/${url}#dinein`);
    }else{
      this.router.navigateByUrl(`/${url}`);
    }
 
    document.getElementById('openLoginModalBtn').click();
    return false;
  }
}
