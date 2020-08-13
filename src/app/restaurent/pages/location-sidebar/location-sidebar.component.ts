import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { LoginService } from "../../../services/login/login.service";
import { LocalStorageService } from "angular-web-storage";
import { RestLoginBody } from "../../../requests/rest-login-body";
import { ApiService } from "../../../services/api/api.service";
import { RestSignUpBody, SignUpCustomerData } from "../../../requests/Rest-sign-up-body";
import { CommonService } from "../../../services/common/common.service";
import { UrlService } from "../../../services/url/url.service";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ObservableService } from "../../../services/observable-service/observable.service";
import { LocationServiceService } from "../../../services/location-services/location-service.service";
import { ToastrManager } from "ng6-toastr-notifications";
declare var $: any;
import * as _ from 'lodash';
@Component({
  selector: 'app-location-sidebar',
  templateUrl: './location-sidebar.component.html',
  styleUrls: ['./location-sidebar.component.scss']
})
export class LocationSidebarComponent implements OnInit {
  @Output() currentAddress = new EventEmitter();
  addressList: any[] = [];
  user: any;
  restLoginBody = new RestLoginBody();
  tId: string;
  timerInterval: any;
  currentAddr: string;
  signUpBody = new SignUpCustomerData();
  restSignUpBody = new RestSignUpBody();
  loginBody: any;
  lat = 30.7095079;
  lng = 76.6932851;
  deliveryCharges = 0;
  selectedIndex: number;
  selectedAddress: any;
  locationDetails: any;
  isDeliveryFree = false;
  country: string;
  // options = {
  //   types: []
  // };
  
  newLoginBody = { tId: '', data: { custId: 0, isBMPortal: 1 } };
  @ViewChild('placesRef', { static: false }) placesRef: GooglePlaceDirective;
host:string;
countryCode:string;
options= {
  componentRestrictions: { country: this.countryCode }
  }
  constructor(
    private loginService: LoginService,
    private localStorage: LocalStorageService,
    private api: ApiService,
    private common: CommonService,
    private url: UrlService,
    private observable: ObservableService,
    private locationService: LocationServiceService,
    private toaster: ToastrManager
  ) { }

  ngOnInit() {
    this.country = window.location.pathname.replace('/', '').split('/')[0]; 
    if(this.country == 'au'){
      this.host = 'https://bellymelly.com.au';
    } else if(this.country == 'us'){
      this.host = 'https://bellymelly.com';
    }
    this.loginService.isLoggedIn().subscribe((isLogin: boolean) => {
      if (isLogin) {
        this.getLocation();
      }
    });
    this.loginService.onUpdateProfile().subscribe((loginData: boolean) => {

      if (loginData) {
        this.tId = this.localStorage.get('BM_tId');
        this.newLoginBody.tId = this.tId;
        this.user = loginData;
        this.newLoginBody.data.custId = this.user.id;
        // this.loginRest();
        this.addressList = this.user.AddressBook;

      }
    });


    this.observable.isAddressSelected().subscribe((address: any) => {
      if (address) {
        this.addressList.push(address)
        // this.loginRest();
      }
    });

    this.observable.getLocationDetails().subscribe((data: any) => {
      this.locationDetails = data;
    });
    this.getCurrentPosition();
    this.country = window.location.pathname.replace('/', '').split('/')[0]; 
    if(this.country == 'au'){
      this.countryCode = 'AU'
      // this.countryAsign = 'aus';
    } else if(this.country == 'us'){
      this.countryCode = 'US'
      // this.countryAsign = 'usa';
    }

this.options= {
  componentRestrictions: { country: this.countryCode }
  }

  }
  public handleAddressChange(address) {
    this.onSelectAddress(address.geometry.location.lat(),address.geometry.location.lng(),address.formatted_address, 0);
  }
  
  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(position => {
      const request = new XMLHttpRequest();
      const method = 'GET';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyBT4Ll-DEXGLSemUGlDPgqH9UADeIzQq3Y`;
      const async = true;
      const self = this;
      request.open(method, url, async);
      request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status == 200) {
          const data = JSON.parse(request.responseText);
          var address = data.results[0];
          self.currentAddr = address.formatted_address;
            this.localStorage.set('selectedAddress',{lat: address.geometry.location.lat, long: address.geometry.location.lng,address:self.currentAddr})
            this.observable.setSelectedAddrssData({lat: address.geometry.location.lat, long: address.geometry.location.lng,address:self.currentAddr}) 
          this.currentAddress.emit(self.currentAddr);
          document.getElementById('closeSideLocationModal').click();
        }
      };
      request.send();
    });

  }
  getTId() {
    this.timerInterval = setInterval(() => {
      if (this.localStorage.get('BM_tId')) {
        this.tId = this.localStorage.get('BM_tId');

        this.user = this.localStorage.get('BM_USER');
        if (this.user) {

        }

        clearInterval(this.timerInterval);
      }
    });
  }
  getLocation() {

    if (this.country.toUpperCase() == 'IN') {
      this.common.setCurrency(true);
      this.url.bellyMellyUrl = this.url.baseUrlTwoInd;
    } else if (this.country.toUpperCase() == 'US') {
      this.common.setCurrency(false);
      this.url.bellyMellyUrl = this.url.baseUrlTwoUs;
    } else if (this.country.toUpperCase() == 'AU') {
      this.common.setCurrency(false);
      this.url.bellyMellyUrl = this.url.baseUrlTwoAustralia;
    }
    this.getTId();
  }

  loginRest() {
    this.api.loginByCustomerId(this.newLoginBody).subscribe((response: any) => {
      if (response.serviceStatus === 'S') {
        this.addressList = response.data.AddressBook;

      }
    });
  }

  onSelectAddress(lat,long,address,i) {
      window.location.href = `${this.host}/${this.country}/restaurants?latitude=${lat}&longitude=${long}&address=${address}`;
  }
  onSelectAddressResp(address, i) {

    address.index = i;
    this.observable.onSelectAddressResp(address);

  }

  changeYourLoc(val) {
    if (val.Latitude)
      navigator.geolocation.getCurrentPosition(position => {

        const request = new XMLHttpRequest();
        const method = 'GET';
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${val.Latitude},${val.Longitude}&key=AIzaSyBT4Ll-DEXGLSemUGlDPgqH9UADeIzQq3Y`;
        const async = true;
        const self = this;
        request.open(method, url, async);
        request.onreadystatechange = () => {
          if (request.readyState == 4 && request.status == 200) {
            const data = JSON.parse(request.responseText);
            var address = data.results[0];
            self.currentAddr = address.formatted_address;
            this.localStorage.set('selectedAddress',{lat: address.geometry.location.lat, long: address.geometry.location.lng,address:self.currentAddr})
            this.observable.setSelectedAddrssData({lat: address.geometry.location.lat, long: address.geometry.location.lng,address:self.currentAddr}) 
         
            this.currentAddress.emit(self.currentAddr);
            document.getElementById('closeSideLocationModal').click();
          }
        };
        request.send();
      });



  }


  error = (message: string) => {
    this.toaster.errorToastr(message);
  }

}
