import {Component, Input, OnInit} from '@angular/core';
import * as js from '../../../../../assets/js/custom';
import {UrlService} from "../../../../services/url/url.service";
import {LocationServiceService} from "../../../../services/location-services/location-service.service";
import * as _ from 'lodash';
import {ObservableService} from "../../../../services/observable-service/observable.service";
import {ToastrManager} from "ng6-toastr-notifications";
import {CommonService} from "../../../../services/common/common.service";
declare var $: any;

@Component({
  selector: 'app-restaurent-info',
  templateUrl: './restaurent-info.component.html',
  styleUrls: ['./restaurent-info.component.scss']
})
export class RestaurentInfoComponent implements OnInit {
  @Input() public locationDetails: any;
  public imageUrl: string;
  deliveryAmount = 0;
  timerInterval: any;
  isDeliveryFree = false;
  distance = 0;
  flags = {
    deliveryNotAvailable: false
  };
  currency: string;
  country: string;
  bannerImg:string;
  deliveryExist:boolean=false;
  minOrderAmount:number=0;
  minFlatFee:number=0;
  minVarFee:number=0;
  orderAmt1:number=999.99;
  orderAmt2:number=999.99;
  orderAmt3:number=999.99;
  flatFee1:number=0;
  flatFee2:number=0;
  flatFee3:number=0;
  varFee1:number=0;
  varFee2:number=0;
  varFee3:number=0;
  openCloseTime:string;
  orderAmount:number=0;
  deliveryExistHere:boolean=false;
  withoutDliveryZone:boolean=false;
  responseCartamount:any;
  selectedAdrLat:number;
  selectedAdrLong:number;
  dineinExist:boolean=false;
  constructor(
    private url: UrlService,
    private locationService: LocationServiceService,
    private observable: ObservableService,
    private toaster: ToastrManager,
    private common: CommonService
  ) { }

  ngOnInit() {
    if(window.location.href.substring(window.location.href.indexOf('#')+1) == 'dinein'){
      this.dineinExist = true;
    }
    this.country = window.location.pathname.replace('/', '').split('/')[0]; // Without hasing
    this.imageUrl = this.url.imageUrl;
    this.common.getCountryInd().subscribe((isIndia: boolean) => {
      if (isIndia) {
        this.currency = this.common.currencyInd;
      } else {
        this.currency = this.common.currencyUs;
      }
    });
    js.sticky();
    this.observable.getLocationDetails().subscribe((data: any) => {
      this.locationDetails = data;
    if(!this.locationDetails) return;
      if (this.locationDetails) {
        const deliveryExist = _.find(this.locationDetails.Services, { Name: 'Delivery' });
        if (deliveryExist) {
          this.deliveryExist = true;
        }
        if (this.locationDetails.PortalBkImg) {
          this.bannerImg = this.imageUrl + this.locationDetails.PortalBkImg;
        } else {
          if (this.locationDetails && this.locationDetails.HeaderImg) {
            this.bannerImg = this.locationDetails.HeaderImg;
          }
          if (this.country.toUpperCase() == 'IN') {
            if (this.locationDetails && this.locationDetails.Header) {
              this.bannerImg = this.imageUrl + this.locationDetails.Header;
            }
          } else {
            if (this.locationDetails && this.locationDetails.HeaderBackgroundImage) {
              this.bannerImg = this.imageUrl + this.locationDetails.HeaderBackgroundImage;
            }
          }
        }
        this.openCloseTime = this.common.showOpenCloseTime(this.locationDetails)
      }

      this.observable.getCartTotalA().subscribe((response: any) => {
        this.responseCartamount = response;
        this.getDeliveryPrice(response);
        const service = _.find(this.locationDetails.Services, { Id: 2 });
      })
    
    });
    this.observable.getSelectedAddrssData().subscribe((address: any) => {
      if(!this.locationDetails) return;
      if(address){
        this.selectedAdrLat = address.lat;
        this.selectedAdrLong = address.long;
        this.getDeliveryPriceSelectedAdr(this.responseCartamount)
      }
    })
  }
  
  async getDeliveryPrice(cartAmount) {
    navigator.geolocation.getCurrentPosition(position => {
      this.locationService.getDistance({lat: this.locationDetails.Lat, lon: this.locationDetails.Lon}, {lat: position.coords.latitude, lon: position.coords.longitude}).then(result => {
        this.distance = Math.round(Number(result));
      });
      const service = _.find(this.locationDetails.Services, {Id: 2});
    
      if (service) {
        this.deliveryExistHere = false;
        if (service.DeliveryZones && service.DeliveryZones.length > 0) {  
          this.locationService.getDeliveryPrice({latitude: position.coords.latitude, longitude: position.coords.longitude}, service).then((result: any) => {
            if (!result.length) {
              if (this.locationDetails.MiscMask.split('')[2] == 0) {
                this.deliveryAmount = service.DeliveryZones[service.DeliveryZones.length - 1].FixedCharge;
              }
            } else {
              this.deliveryAmount = result[0].FixedCharge;
            }
          });
        } else {
          if (this.locationDetails.MiscMask.split('')[2] == 0) {
            this.deliveryAmount = this.common.servicesDelivery(service, cartAmount);
            this.deliveryAmount = Math.round(this.deliveryAmount)
            if(this.deliveryAmount == 0) return this.withoutDliveryZone = true;
            // this.isDeliveryFree = true;
          } else {
            this.deliveryAmount = 0;
          }
        }
      }else{
        this.deliveryExistHere = true;
      }
    });


    navigator.geolocation.getCurrentPosition(position => {
      if (!this.locationDetails) return;
      clearInterval(this.timerInterval);
      const service = _.find(this.locationDetails.Services, {Id: 2});
      if (service) {
        this.locationService.getDeliveryPrice({latitude: position.coords.latitude, longitude: position.coords.longitude}, service).then((result: any) => {
          if (result.length) this.deliveryAmount = result[0].FixedCharge;
        });
      }
    });
  }


  async getDeliveryPriceSelectedAdr(cartAmount) {
      this.locationService.getDistance({lat: this.locationDetails.Lat, lon: this.locationDetails.Lon}, {lat: this.selectedAdrLat, lon: this.selectedAdrLong}).then(result => {
        this.distance = Math.round(Number(result));
      });
      const service = _.find(this.locationDetails.Services, {Id: 2});
      if (service) {
        this.deliveryExistHere = false;
        if (service.DeliveryZones && service.DeliveryZones.length > 0) {  
          this.locationService.getDeliveryPrice({latitude: this.selectedAdrLat, longitude: this.selectedAdrLong}, service).then((result: any) => {
            if (result.length == 0) {
              if (this.locationDetails.MiscMask.split('')[2] == 0) {
                this.deliveryAmount = service.DeliveryZones[service.DeliveryZones.length - 1].FixedCharge;
                this.deliveryExistHere = false;
              }else{
                this.deliveryExistHere = true;
              }
            } else {
              this.deliveryAmount = result[0].FixedCharge;
            }
          });
        } else {
          if (this.locationDetails.MiscMask.split('')[2] == 0) {
            this.deliveryAmount = this.common.servicesDelivery(service, cartAmount);
            this.deliveryAmount = Math.round(this.deliveryAmount)
            if(this.deliveryAmount == 0) return this.withoutDliveryZone = true;
            // this.isDeliveryFree = true;
          } else {
            this.deliveryAmount = 0;
          }
        }
      }else{
        this.deliveryExistHere = true;
      }

    // navigator.geolocation.getCurrentPosition(position => {
    //   if (!this.locationDetails) return;
    //   clearInterval(this.timerInterval);
    //   const service = _.find(this.locationDetails.Services, {Id: 2});
    //   if (service) {
    //     this.locationService.getDeliveryPrice({latitude: position.coords.latitude, longitude: position.coords.longitude}, service).then((result: any) => {
    //       if (result.length) this.deliveryAmount = result[0].FixedCharge;
    //     });
    //   }
    // });
  }

  error = (message: string) => {
    this.toaster.errorToastr(message);
  }

}
