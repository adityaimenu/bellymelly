import { Component, OnInit } from '@angular/core';
import * as js from '../../../../assets/js/custom';
import { LoginService } from "../../../services/login/login.service";
import { LocalStorageService } from "angular-web-storage";
import { User } from "../../../models/user";
import { ActivatedRoute, Router } from "@angular/router";
import { ObservableService } from "../../../services/observable-service/observable.service";
import { UrlService } from "../../../services/url/url.service";
import { CommonService } from 'src/app/services/common/common.service';
import * as moment from "moment-timezone";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogin: boolean;
  user: any;
  currentAddr: string;
  history = window.history;
  mobUrl: any;
  locationDetails: any;
  logoImage: string;
  imageUrl: string;
  country: string;
  mobUrlNew: string;
  host: string;
  constructor(
    private loginService: LoginService,
    private localStorage: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private observable: ObservableService,
    private url: UrlService,
    private common: CommonService,
  ) { }

  ngOnInit() {

    this.country = window.location.pathname.replace('/', '').split('/')[0]; 
    if(this.country == 'us'){
      moment.tz.setDefault("America/Jamaica");
    }else if(this.country == 'au'){
      moment.tz.setDefault("Australia/Sydney");
    }
    if(this.country == 'au'){
      this.host = 'https://bellymelly.com.au';
    } else if(this.country == 'us'){
      this.host = 'https://bellymelly.com';
    }
    setTimeout(function () {
      if(window.location.hostname != 'localhost'){
      if (window.location.href == `${this.host}/${this.country}`) {
        window.location.href = `${this.host}/${this.country}/restaurants`
      }
    }
    }, 2000)

    this.imageUrl = this.url.imageUrl;
    js.tooltip();
    js.sideNav();
    this.observable.getLocationDetails().subscribe((response: any) => {
      this.locationDetails = response;
      if (this.locationDetails && this.locationDetails.LogoImg) this.logoImage = this.imageUrl + this.locationDetails.LogoImg;
      else this.logoImage = 'assets/images/defaultRest.png';
    });
    this.activatedRoute.params.subscribe((param: any) => {

      this.mobUrl = window.location.pathname.replace('/', '').split('/')[1]; //Without hashing
      this.country = window.location.pathname.replace('/', '').split('/')[0]; //Without hashing
      this.mobUrlNew = window.location.pathname;

      if (this.localStorage.get('BM_MobUrl') != this.mobUrl) {
        this.localStorage.set('cartItem', []);
        this.observable.setSpecialOffer(false)
        this.localStorage.set('specialOfferData', null)
      }
      if (this.localStorage.get('BM_Country') != this.country || this.localStorage.get('BM_MobUrl') != this.mobUrl) {
        this.localStorage.remove('placeOrderData');
        this.localStorage.remove('cartItem');
        this.localStorage.clear();
        this.loginService.setUser(null);
        this.loginService.setVal(false);
        this.observable.setSpecialOffer(false)
        this.localStorage.set('specialOfferData', null)

      }
      this.localStorage.set('BM_MobUrl', this.mobUrl);
      this.localStorage.set('BM_Country', this.country);
      this.loginService.isLoggedIn().subscribe((login: boolean) => {
        this.isLogin = login;
        this.user = this.localStorage.get('BM_USER');
        this.loginService.onUpdateProfile().subscribe((user: any) => {
          if (user) {
            if (this.user) user.token = this.user.token;
            this.user = user;
            if (this.user) this.localStorage.set('BM_USER', this.user);
          }
        })
      });
    });
    console.log('12',moment().format('MMMM DD, YYYY HH:mm:ss'))
  }
  getCurrentAddr(addr) {
    this.currentAddr = addr;
  }
  logout() {
    this.localStorage.clear();
    this.loginService.setUser(null);
    this.loginService.setVal(false);
    window.location.href = `${this.host}`;
    // this.router.navigateByUrl(`/${this.country}/${this.mobUrl}`);
    // if (window.location.hash.replace('#/', '').split('/').length > 2) {
    // if (window.location.pathname.replace('/', '').split('/').length > 2) {
    //   // const url = `/${this.mobUrl}`
    //   // this.router.navigateByUrl(url);
    //   // this.router.navigateByUrl(`/${this.country}/${this.mobUrl}`)
    //   // location.reload(`/${this.country}/${this.mobUrl}`);
    // } else {
    //   location.reload();
    // }

    // window.location.href = url;
    // window.location.href = `/bellymelly/#/${this.country}/${this.mobUrl}`;
    // window.location.reload();
  }

}
