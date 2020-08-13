import { Component, OnInit } from '@angular/core';
declare var $: any
import * as js from '../../../../assets/js/custom';
import { LocalStorageService } from 'angular-web-storage';
import { ApiService } from 'src/app/services/api/api.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CommonService } from 'src/app/services/common/common.service';
import { ObservableService } from 'src/app/services/observable-service/observable.service';
import { LoginService } from 'src/app/services/login/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from 'src/app/services/url/url.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-us-restaurants',
  templateUrl: './us-restaurants.component.html',
  styleUrls: ['./us-restaurants.component.scss']
})
export class UsRestaurantsComponent implements OnInit {
  addAddressString: string;
  type: string = 'imenu';
  latitude: number = 0;
  longitude: number = 0;
  country: string;
  countryAsign: string;
  restaurantname: string;
  servicetype: string = 'Pickup';
  FoodTypes = [];
  FoodTypesId = []
  Locations = [];
  imageUrl: string;
  foodtype = ['0'];
  searchAddress: string;
  currentAddr: string;
  showBoundaryLinks = true;
  totalCount: number;
  bigCurrentPage: number;
  maxSize = 3;
  skipRows: number = 0;
  limit: number = 20;
  searchAddressMobile: string;
  selectedservicetype: string;
  countryCode: string;
  showRestaurant: number = 0;
  showService: number = 0;
  showFoodtype: number = 0;
  options = {
    componentRestrictions: { country: this.countryCode }
  }
  host: string;
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService,
    private toaster: ToastrManager,
    private common: CommonService,
    private observable: ObservableService,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private url: UrlService
  ) { }

  ngOnInit() {
    // this.host = this.common.hostname;
    js.stickyNew()
    this.imageUrl = this.url.imageUrl;
    js.scrolltopnm()

    js.scrolltop()
    this.country = window.location.pathname.replace('/', '').split('/')[0];
    if (this.country == 'au') {
      this.countryCode = 'AU'
      this.countryAsign = 'aus';
      this.host = 'https://bellymelly.com.au';
    } else if (this.country == 'us') {
      this.countryCode = 'US'
      this.countryAsign = 'usa';
      this.host = 'https://bellymelly.com';
    }
    this.options = {
      componentRestrictions: { country: this.countryCode }
    }
    js.stickyNew();
    // this.getCurrentPosition()
    this.comingLatLong()
  }

  comingLatLong() {
    if (window.location.search) {
      var latitude = window.location.search.replace('?', '').split('&')[0].split('=')[1];
      var longitude = window.location.search.replace('?', '').split('&')[1].split('=')[1];
      this.restaurantname = window.location.search.replace('?', '').split('&')[2].split('=')[1];
      this.latitude = Number(latitude);
      this.longitude = Number(longitude);
      if (this.latitude == 0 && this.restaurantname != '') {
        this.searchrRestaurants(this.servicetype)
      } else {
        this.currentAddr = ' ';
        this.addAddressString = this.currentAddr;
        this.searchAddressMobile = this.addAddressString;
        this.searchrRestaurantsWithAddress(this.servicetype);
      }
    } else {
      if (this.country == 'us') {
        window.location.href = `${this.host}`
      } else if (this.country == 'au') {
        // window.location.href = `${this.host}`
        this.getCurrentPosition();
      }

    }


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
          const address = data.results[0];
          this.latitude = address.geometry.location.lat;
          this.longitude = address.geometry.location.lng;
          this.currentAddr = address.formatted_address;
          this.addAddressString = this.currentAddr;
          this.searchAddressMobile = this.addAddressString;
          this.searchrRestaurantsWithAddress(this.servicetype);
        }
      };
      request.send();
    });



    $("input[name=addAddress4545677]").val(this.addAddressString)
    $("input[name=addAddress4545]").val(this.addAddressString)

  }

  public handleAddressChange(address) {
    this.searchAddress = address.formatted_address;
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
  }

  public handleAddressChangeKeyup(address) {
    this.changeSearchType(1)
    this.searchAddress = address.formatted_address;
    this.addAddressString = this.searchAddress;
    this.searchAddressMobile = this.searchAddress;
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    this.searchrRestaurantsWithAddress(this.servicetype)
    $(".dropdown-menu ").removeClass('show')
  }

  searchrRestaurants(val) {
    this.addAddressString = null;
    this.skipRows = 0;
    this.Locations = [];
    this.totalCount = 0;
    this.servicetype = val;
    if (this.servicetype) {
      var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=${this.servicetype}&skipRows=${this.skipRows}`
    }
    else {
      var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    this.api.searchrRestaurants(data).subscribe((response: any) => {
      this.showRestaurant = 0
      if (!response) {
        return this.warning('No restaurants found for this location')
      }
      this.Locations = response.Locations;
      this.totalCount = response.TotalLocationCnt;
      if (this.FoodTypes.length == 0) {
        this.FoodTypes = response.FoodTypes;
        this.FoodTypes.forEach(element => {
          element.status = false
        });
      }
      this.selectedservicetype = this.servicetype;
      this.searchAddressMobile = this.searchAddress;
      $('.addAddressString').val('')
      $('#addmdl').modal('hide')
      $('#srchmdl').modal('hide')
      $('#filtermdl').modal('hide')
      $('.responsive-filter').removeClass('active')
    })

  }

  searchrRestaurantsWithAddress(val) {
    this.restaurantname = null
    this.Locations = [];
    this.totalCount = 0;
    this.skipRows = 0;
    this.servicetype = val;
    if (this.servicetype) {
      var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=${this.servicetype}&skipRows=${this.skipRows}`
    } else {
      var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    this.api.searchrRestaurants(data).subscribe((response: any) => {
      this.showRestaurant = 1;
      if (!response) {
        return this.warning('No restaurants found for this location')
      }
      this.Locations = response.Locations;
      this.totalCount = response.TotalLocationCnt;
      if (this.FoodTypes.length == 0) {
        this.FoodTypes = response.FoodTypes;
        this.FoodTypes.forEach(element => {
          element.status = false
        });
      }
      this.selectedservicetype = this.servicetype;
      this.searchAddressMobile = this.searchAddress;
      $('.addAddressString').val('')
      $('#addmdl').modal('hide')
      $('#srchmdl').modal('hide')
      $('#filtermdl').modal('hide')
      $('.responsive-filter').removeClass('active')
    })

  }

  searchrRestaurantsBoth(val) {
    // this.Locations =[];
    // this.totalCount= 0;
    // this.skipRows = 0
    this.servicetype = val;
    if (this.addAddressString) {
      if (this.servicetype) {
        var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=${this.servicetype}&skipRows=${this.skipRows}`
      } else {
        var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
      }
    }
    if (this.restaurantname) {
      if (this.servicetype) {
        var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=${this.servicetype}&skipRows=${this.skipRows}`
      } else {
        var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
      }
    }
    this.api.searchrRestaurants(data).subscribe((response: any) => {
      this.showFoodtype = 1;
      this.showService = 0
      if (!response) {
        return this.warning('No restaurants found for this location')
      }
      this.Locations = response.Locations;
      this.totalCount = response.TotalLocationCnt;
      if (this.FoodTypes.length == 0) {
        this.FoodTypes = response.FoodTypes;
        this.FoodTypes.forEach(element => {
          element.status = false
        });
      }

      this.selectedservicetype = this.servicetype;

      this.searchAddressMobile = this.searchAddress;
      $('.addAddressString').val('')
      $('#addmdl').modal('hide')
      $('#srchmdl').modal('hide')
      $('#filtermdl').modal('hide')
      $('.responsive-filter').removeClass('active')
    })

  }



  changeSearchType(val) {
    this.skipRows = 0;
    $('.restaurantname').val('')

    $("input[name=addAddress4545677]").val('')
    $("input[name=addAddress4545]").val('')
    // this.clearALl()
    // this.addAddressString = null;
    // this.restaurantname = null;
    if (val == 1) {
      $('.addAddressString').val('')
      // this.getCurrentPosition()
    }
    this.foodtype = ['0'];
    $('.custom-control-input').prop('checked', false)
  }



  FoodTypeF(val, check) {
    const data = _.find(this.FoodTypes, function(o) { return o.FoodTypeId == val; })
    const a = data.FoodTypeId
    if (check) {
      this.foodtype.push(a)
      this.FoodTypes.forEach(element => {
        if(element.FoodTypeId == a){
          element.status = true
        }
      });
    } else {
      this.FoodTypes.forEach(element => {
        if(element.FoodTypeId == a){
          element.status = false
        }
      });
      var index = this.foodtype.findIndex(x => x === val);
      this.foodtype.splice(index, 1)
    }
  }
  foodtypeVal(val) {
    const data = _.find(this.FoodTypes, function(o) { return o.FoodTypeId == val; })
    const a = data.FoodTypeId
    return this.FoodTypes[a].Name
  }
  pageChanged(e: any): void {
    const a = e.page * 2;
    const c = a + '0'
    const d = parseInt(c) - 20
    this.skipRows = Number(d);
    this.searchrRestaurantsBoth(this.servicetype);
    $("html").animate({ scrollTop: 800 }, "slow");
    // $(window).scrollTop(900);
  }

  clearALl() {
    this.servicetype = null
    this.foodtype = ['0'];
    $('.custom-control-input').prop('checked', false)
    this.searchrRestaurantsBoth(this.servicetype)
  }

  selectService(val) {
    this.skipRows = 0;
    this.servicetype = val
    this.searchrRestaurantsBoth(val);
  }
  selectServiceMob(val) {
    this.skipRows = 0;
    this.servicetype = val
  }

  cleaResto() {
    this.comingLatLong();
    return

    if (this.latitude) {
      this.searchrRestaurantsWithAddress(this.servicetype)
    } else {
      this.comingLatLong();
      // navigator.geolocation.getCurrentPosition(position => {
      //   const request = new XMLHttpRequest();
      //   const method = 'GET';
      //   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyBT4Ll-DEXGLSemUGlDPgqH9UADeIzQq3Y`;
      //   const async = true;
      //   const self = this;
      //   const service = ''
      //   request.open(method, url, async);
      //   request.onreadystatechange = () => {
      //     if (request.readyState == 4 && request.status == 200) {
      //       const data = JSON.parse(request.responseText);
      //       const address = data.results[0];
      //       this.latitude = address.geometry.location.lat;
      //       this.longitude = address.geometry.location.lng;
      //       this.currentAddr = address.formatted_address;
      //       this.addAddressString = this.currentAddr;
      //       this.searchAddressMobile = this.currentAddr;
      //      this.restaurantname=null;
      //       this.searchrRestaurantsWithAddress(service)
      //       this.clearService()
      //       this.changeSearchType(1);
      //       this.showFoodtype= 0;
      //       this.foodtype = ['0']
      //       this.showRestaurant = 1;
      //     }
      //   };
      //   request.send();
      // });
      $('.headerserachrestaurant').val('')
    }
  }

  clearService() {
    this.skipRows = 0
    if (this.addAddressString) {
      var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    if (this.restaurantname) {
      var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    this.api.searchrRestaurants(data).subscribe((response: any) => {
      if (!response) {
        return this.warning('No restaurants found for this location')
      }
      this.Locations = response.Locations;
      this.totalCount = response.TotalLocationCnt;
      if (this.FoodTypes.length == 0) {
        this.FoodTypes = response.FoodTypes;
        this.FoodTypes.forEach(element => {
          element.status = false
        });
      }
      this.showService = 1;
      this.selectedservicetype = '';
      this.searchAddressMobile = this.searchAddress;
      $('.addAddressString').val('')
      $('#addmdl').modal('hide')
      $('#srchmdl').modal('hide')
      $('#filtermdl').modal('hide')
      $('.responsive-filter').removeClass('active')
    })
  }

  clearFoodtype(val) {

    var index = this.foodtype.findIndex(x => x === val);
    this.foodtype.splice(index, 1)

    this.Locations = []
    this.skipRows = 0
    if (this.addAddressString) {
      var data = `getLocation&type=imenu&latitude=${this.latitude}&longitude=${this.longitude}&country=${this.countryAsign}&restaurantname=&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    if (this.restaurantname) {
      var data = `getLocation&type=imenu&latitude=0&longitude=0&country=${this.countryAsign}&restaurantname=${this.restaurantname}&foodtype=${this.foodtype}&servicetype=&skipRows=${this.skipRows}`
    }
    this.api.searchrRestaurants(data).subscribe((response: any) => {
      const a = val;
      this.FoodTypes.forEach(element => {
        if(element.FoodTypeId == a.FoodTypeId){
          element.status = false
        }
      });
      $(`#${a.FoodTypeId}m`).prop('checked', false)
      $(`#${a.FoodTypeId}w`).prop('checked', false)

      if (!response) {
        return this.warning('No restaurants found for this location')
      }
      this.Locations = response.Locations;
      this.totalCount = response.TotalLocationCnt;
      if (this.FoodTypes.length == 0) {
        this.FoodTypes = response.FoodTypes;
        this.FoodTypes.forEach(element => {
          element.status = false
        });
      }

      this.searchAddressMobile = this.searchAddress;
      $('.addAddressString').val('')
      $('#addmdl').modal('hide')
      $('#srchmdl').modal('hide')
      $('#filtermdl').modal('hide')
      $('.responsive-filter').removeClass('active')
    })
  }
  error = (message: string) => {
    this.toaster.errorToastr(message);
  }
  warning = (message: string) => {
    this.toaster.warningToastr(message);
  }
  success = (message: string) => {
    this.toaster.successToastr(message);
  }

}
