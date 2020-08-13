import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {GooglePlaceDirective} from "ngx-google-places-autocomplete";
import {Address} from "ngx-google-places-autocomplete/objects/address";
import {LocalStorageService} from "angular-web-storage";
import {ApiService} from "../../../../services/api/api.service";
import {ToastrManager} from "ng6-toastr-notifications";
import {AddAddressBody, AddressDetail} from "../../../../requests/add-address-body";
import * as _ from 'lodash';
import {timer} from "rxjs";
import {timeInterval} from "rxjs/operators";
declare var klokantech: any;
import {} from 'googlemaps';
import {CommonService} from "../../../../services/common/common.service";
import { ObservableService } from 'src/app/services/observable-service/observable.service';
import { LoginService } from 'src/app/services/login/login.service';
declare var $: any;
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {
  @Input() public editDetail: any;
  @Input() public status: boolean;
  addAddressBody = new AddAddressBody();
  addDetails = new AddressDetail();
  updateAddDetails = new AddressDetail();
  selectedEdit: any;
  addAddressString = '';
  editAddressString = '';
  tId: string;
  lat = 30.7095079;
  lng = 76.6932851;
  @ViewChild('placesRef', {static: false}) placesRef: GooglePlaceDirective;
  options = {
    types: []
  };
  flags = {
    isAdded: false,
    isUpdate: false
  };
  updateAdd: string;
  interval: any;
  myStyle: Array<any> = [];
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 17,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.DEFAULT
    }
  };
  marker = new google.maps.Marker({
    position: this.coordinates
  });
  newLoginBody = {tId: '', data: {custId: 0,isBMPortal:1}};
  user: any;
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;
  map: google.maps.Map;
  countryNew:string;
  findCountry:boolean;
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService,
    private toaster: ToastrManager,
    private common: CommonService,
    private observable: ObservableService,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.interval = null;
    this.myStyle = this.common.mapStyle;
    this.addAddressBody.data = {customerAddress: {}};
    this.addDetails.isPrimary = 0;
    // this.editTimer(); 
    this.getCurrentPosition(true);

    this.activatedRoute.params.subscribe((response: any) => {

      this.countryNew = window.location.pathname.replace('/', '').split('/')[0];
      if (this.countryNew.toUpperCase() == 'IN') {
      this.findCountry = true;
      }else{
        this.findCountry = false;
      }
    })

    this.loginService.onUpdateProfile().subscribe((loginData: boolean) => {

      if(loginData){

        this.tId = this.localStorage.get('BM_tId');
        this.newLoginBody.tId = this.tId;
      this.user = loginData;
      this.addDetails.fName = this.user.FName?this.user.FName:this.user.LName;
      this.addDetails.tel = this.user.Tel;
      
      this.newLoginBody.data.custId = this.user.id;
      // this.loginRest();
      this.localStorage.set('BM_USER', loginData);
      }
    });
    this.observable.getEditAddress().subscribe((response: any) => {
      if (response) {
        this.editTimer(response);
      }
    })
  }
  onEditClose() {
    this.editDetail = null;
    // this.editTimer();
  }
  editTimer(editDetail) {
    this.editDetail = editDetail.selectedAddressEdit;
        this.updateAddDetails.Addr1 = this.editDetail.Addr1;
        this.updateAddDetails.selectedIndex = editDetail.selectedIndex;
    // this.interval = setInterval(() => {
      if (this.editDetail) {
        this.updateAddDetails.Addr1 = this.editDetail.Addr1;
        this.updateAddDetails.Addr2 = this.editDetail.Addr2;
        this.updateAdd = this.editDetail.Addr1;
        this.updateAddDetails.instr = this.editDetail.Instructions?this.editDetail.Instructions:this.editDetail.instr;
        this.updateAddDetails.addrName = this.editDetail.CustAddressName?this.editDetail.CustAddressName:this.editDetail.addrName;
        this.updateAddDetails.custAddrId = this.editDetail.CustAddressBookId?this.editDetail.CustAddressBookId:this.editDetail.custAddrId;
        this.updateAddDetails.City = this.editDetail.City;
        this.updateAddDetails.fName = this.editDetail.fName?this.editDetail.fName?this.editDetail.fName:this.editDetail.lName:this.editDetail.FName?this.editDetail.FName:this.editDetail.LName;
        this.updateAddDetails.mName = this.editDetail.MName;
        this.updateAddDetails.lName = this.editDetail.lName?this.editDetail.lName?this.editDetail.lName:this.editDetail.FName:this.editDetail.LName?this.editDetail.LName:this.editDetail.FName;
        this.updateAddDetails.lat = this.editDetail.Latitude;
        this.updateAddDetails.lon = this.editDetail.Longitude;
        this.updateAddDetails.isPrimary = this.editDetail.IsPrimaryAddress?this.editDetail.IsPrimaryAddress:this.editDetail.isPrimary;
        this.updateAddDetails.State = this.editDetail.State;
        this.updateAddDetails.tel = this.editDetail.Telephone?this.editDetail.Telephone:this.editDetail.tel;
        this.updateAddDetails.zip = this.editDetail.ZIP?this.editDetail.ZIP:this.editDetail.zip;
        this.lat = Number(this.editDetail.Latitude);
        this.lng = Number(this.editDetail.Longitude);
        // clearInterval(this.interval);
      }
    // }, 1000);
  }
  public handleAddressChange(address: Address) {

    this.addDetails.Addr1 =  address.formatted_address;

    address.address_components.forEach(ele => {
      const index = ele.types.indexOf('administrative_area_level_1');
      const cityIndex = ele.types.indexOf('locality');
      const zipIndex = ele.types.indexOf('postal_code');
      if (cityIndex > -1) this.addDetails.City = ele.long_name;
      if (index > -1) this.addDetails.State = ele.long_name;
      if (zipIndex > -1) this.addDetails.zip = ele.long_name;
    });
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
    this.addDetails.lat = this.lat;
    this.addDetails.lon = this.lng;
    this.addDetails.Latitude = this.lat;
    this.addDetails.Longitude = this.lng;
  }
  testRun(bounds) {

  }
  onMapClick(bounds, flag) {
    this.lat = bounds.coords.lat;
    this.lng = bounds.coords.lng;
    var request = new XMLHttpRequest();

    var method = 'GET';
    var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.lng}&key=AIzaSyBT4Ll-DEXGLSemUGlDPgqH9UADeIzQq3Y`;

    var async = true;
    const self = this;
    request.open(method, url, async);
    request.onreadystatechange = function(){
      if(request.readyState == 4 && request.status == 200){
        var data = JSON.parse(request.responseText);
        var address = data.results[0];
        if (flag) {
          self.addAddressString = address.formatted_address;
          self.addDetails.Addr1 = address.formatted_address;
          address.address_components.forEach(ele => {
            const index = ele.types.indexOf('administrative_area_level_1');
            const cityIndex = ele.types.indexOf('locality');
            const zipIndex = ele.types.indexOf('postal_code');
            if (cityIndex > -1) self.addDetails.City = ele.long_name;
            if (index > -1) self.addDetails.State = ele.long_name;
            if (zipIndex > -1) self.addDetails.zip = ele.long_name;
          });
        } else {
          self.updateAdd = address.formatted_address;
          self.updateAddDetails.Addr1 =  address.formatted_address;
          address.address_components.forEach(ele => {
            const index = ele.types.indexOf('administrative_area_level_1');
            const cityIndex = ele.types.indexOf('locality');
            const zipIndex = ele.types.indexOf('postal_code');
            if (cityIndex > -1) self.updateAddDetails.City = ele.long_name;
            if (index > -1) self.updateAddDetails.State = ele.long_name;
            if (zipIndex > -1) self.updateAddDetails.zip = ele.long_name;
          });
        }
      }
    };
    request.send();
    this.addDetails.lat = this.lat;
    this.addDetails.lon = this.lng;
    this.addDetails.Latitude = this.lat;
    this.addDetails.Longitude = this.lng;
  }
  public handleAddressChangeForEdit(address: Address) {
    this.updateAddDetails.Addr1 =  address.formatted_address;
    address.address_components.forEach(ele => {
      const index = ele.types.indexOf('administrative_area_level_1');
      const cityIndex = ele.types.indexOf('locality');
      const zipIndex = ele.types.indexOf('postal_code');
      if (cityIndex > -1) this.updateAddDetails.City = ele.long_name;
      if (index > -1) this.updateAddDetails.State = ele.long_name;
      if (zipIndex > -1) this.updateAddDetails.zip = ele.long_name;
    });
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
    this.updateAddDetails.lat = this.lat;
    this.updateAddDetails.lon = this.lng;
    this.updateAddDetails.Latitude = this.lat;
    this.updateAddDetails.Longitude = this.lng;

  }
  updateAddress() {
    if (!this.updateAddDetails.lat || !this.updateAddDetails.lon) return this.error('Please enter your location.');

    if (!this.updateAddDetails.zip) return this.error('Please enter zip.');
    if (!this.updateAddDetails.addrName) return this.error('Please select address name first.');
    const user = this.localStorage.get('BM_Rest_User');
    this.tId = this.localStorage.get('BM_tId');
    this.updateAddDetails.custId = user.id;

    this.updateAddDetails.Latitude = this.updateAddDetails.lat
    this.updateAddDetails.Longitude = this.updateAddDetails.lon
    this.updateAddDetails.ZIP = this.updateAddDetails.zip
    this.updateAddDetails.isPrimary = this.updateAddDetails.isPrimary;
    this.updateAddDetails.lName = this.updateAddDetails.lName;
    this.updateAddDetails.CustAddressBookId = this.updateAddDetails.custAddrId;
    this.addAddressBody.data.customerAddress = this.updateAddDetails;
    const body = {tId: this.tId, data: {customerAddress: this.updateAddDetails}};
    this.flags.isUpdate = true;
    this.api.addUserAddress(body).subscribe((response: any) => {

      $('.closeupdateAdressModal').trigger('click');
      this.flags.isUpdate = false;
      if (response.serviceStatus === 'S') {
        this.toaster.successToastr('Address updated successfully!');
    
        this.observable.onSelectAddressResp(this.updateAddDetails);
        // location.reload();
      }
    }, error => {
      this.flags.isUpdate = false;
    });
  }



  searchData(val) {

    var request = new XMLHttpRequest();
    var method = 'GET';
    var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${val}&key=AIzaSyBT4Ll-DEXGLSemUGlDPgqH9UADeIzQq3Y`;

    var async = true;
    request.open(method, url, async);
    request.open(method, url, async);
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        var data = JSON.parse(request.responseText);
        var address = data.results[0];
        if (address.formatted_address) {
        }
      }
    };
    request.send();

  }
  addAddress() {

    
    if (!this.addDetails.lat || !this.addDetails.lon) return this.error('Please enter your location.');
    if (!this.addDetails.fName) return this.error('Please enter your name.');
    if (!this.addDetails.tel) return this.error('Please enter your phone.');
    if (!this.addDetails.zip) return this.error('Please enter zip.');
    if (!this.addDetails.addrName) return this.error('Please select address name first.');
    const user = this.localStorage.get('BM_Rest_User');
    this.tId = this.localStorage.get('BM_tId');
    this.addDetails.mName = user.MName;
    this.addDetails.lName = user.LName;
    this.addDetails.custId = user.id;
    this.addAddressBody.tId = this.tId;
    
    this.addAddressBody.data.customerAddress = this.addDetails;
    this.flags.isAdded = true;
    this.api.addUserAddress(this.addAddressBody).subscribe((response: any) => {
      this.addDetails.custAddrId = response.data.custAddrId;

      $('#closeAddAdressModal').trigger('click');
      this.flags.isAdded = false;
      if (response.serviceStatus === 'S') {
        this.toaster.successToastr('Address added successfully!');
          this.observable.onSelectAddressResp(this.addDetails);
      }
    }, error => {
      this.flags.isAdded = false;
    });
  }
  

  loginRest() {
    this.api.loginByCustomerId(this.newLoginBody).subscribe((response: any) => {
      if (response.serviceStatus === 'S') {
        this.localStorage.set('BM_USER', response.data);
      }
    });
  }

  getCurrentPosition(flag) {
    navigator.geolocation.getCurrentPosition(position => {
   
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      var request = new XMLHttpRequest();
      var method = 'GET';
      var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.lng}&key=AIzaSyBT4Ll-DEXGLSemUGlDPgqH9UADeIzQq3Y`;

      var async = true;
      const self = this;
      request.open(method, url, async);
      request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
          var data = JSON.parse(request.responseText);
          var address = data.results[0];
          if (flag) {
            self.addAddressString = address.formatted_address;
            self.addDetails.Addr1 = address.formatted_address;
            address.address_components.forEach(ele => {
              const index = ele.types.indexOf('administrative_area_level_1');
              const cityIndex = ele.types.indexOf('locality');
              const zipIndex = ele.types.indexOf('postal_code');
              if (cityIndex > -1) self.addDetails.City = ele.long_name;
              if (index > -1) self.addDetails.State = ele.long_name;
              if (zipIndex > -1) self.addDetails.zip = ele.long_name;
            });
          } else {
            self.updateAdd = address.formatted_address;
            self.updateAddDetails.Addr1 =  address.formatted_address;
            address.address_components.forEach(ele => {
              const index = ele.types.indexOf('administrative_area_level_1');
              const cityIndex = ele.types.indexOf('locality');
              const zipIndex = ele.types.indexOf('postal_code');
              if (cityIndex > -1) self.updateAddDetails.City = ele.long_name;
              if (index > -1) self.updateAddDetails.State = ele.long_name;
              if (zipIndex > -1) self.updateAddDetails.zip = ele.long_name;
            });
          }
        }
      };
      request.send();
      this.addDetails.lat = this.lat;
      this.addDetails.lon = this.lng;
    });

  }

  error = (message: string) => {
    this.toaster.errorToastr(message);
  }

}

function addYourLocationButton (map) {
  var controlDiv = document.createElement('div');

  var firstChild = document.createElement('button');
  firstChild.style.backgroundColor = '#fff';
  firstChild.style.border = 'none';
  firstChild.style.outline = 'none';
  firstChild.style.width = '28px';
  firstChild.style.height = '28px';
  firstChild.style.borderRadius = '2px';
  firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
  firstChild.style.cursor = 'pointer';
  firstChild.style.marginRight = '10px';
  firstChild.style.padding = '0';
  firstChild.title = 'Your Location';
  controlDiv.appendChild(firstChild);

  var secondChild = document.createElement('div');
  secondChild.style.margin = '5px';
  secondChild.style.width = '18px';
  secondChild.style.height = '18px';
  secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
  secondChild.style.backgroundSize = '180px 18px';
  secondChild.style.backgroundPosition = '0 0';
  secondChild.style.backgroundRepeat = 'no-repeat';
  firstChild.appendChild(secondChild);

  google.maps.event.addListener(map, 'center_changed', function () {
    secondChild.style['background-position'] = '0 0';
  });

  firstChild.addEventListener('click', function () {
    var imgX = 0,
      animationInterval = setInterval(function () {
        imgX = -imgX - 18 ;
        secondChild.style['background-position'] = imgX+'px 0';
      }, 500);

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(latlng);
        clearInterval(animationInterval);
        secondChild.style['background-position'] = '-144px 0';
      });
    } else {
      clearInterval(animationInterval);
      secondChild.style['background-position'] = '0 0';
    }
  });


  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}
