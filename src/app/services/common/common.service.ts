import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { ApiService } from "../api/api.service";
import { UrlService } from "../url/url.service";
import { ToastrManager } from "ng6-toastr-notifications";
import * as moment from "moment-timezone";
import * as _ from 'lodash';
declare var swal: any;
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isIndia: BehaviorSubject<boolean>;
  currency = '';
  currencyInd = '₹';
  currencyUs = '$';
  locationId = '12797';
  // appToken = 'A16F9955-7648-44E2-AA81-3DDEEA7AA283'; //old
  appToken = '921E396D-7F4A-4333-A558-4BF6C32DB73B';
  loginToken = '463b7b6b-7c26-443f-9bda-67cb2a85980a';
  socialToken = '463b7b6b-7c26-443f-9bda-67cb2a85980a';
  baseUrl = window.location.pathname.replace('/', '').split('/')[1]; // Without hashing
  country = window.location.pathname.replace('/', '').split('/')[0];
  hostname = window.location.hostname == 'localhost' ? `http://${window.location.host}` : `https://${window.location.host}`;
  timeData = []
  mainUrl = `${this.baseUrl}`;
  // mainUrl = `/${this.country}/${this.baseUrl}`;
  // deliveryAmount:number;
  minOrderAmount: number = 0;
  minFlatFee: number = 0;
  minVarFee: number = 0;
  orderAmt1: number = 999.99;
  orderAmt2: number = 999.99;
  orderAmt3: number = 999.99;
  flatFee1: number = 0;
  flatFee2: number = 0;
  flatFee3: number = 0;
  varFee1: number = 0;
  varFee2: number = 0;
  varFee3: number = 0;
  openCloseTime: string;
  orderAmount: number = 0;

  mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ededed"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ededed"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ededed"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fff2af"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ];
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  constructor(
    private api: ApiService,
    private url: UrlService,
    private toaster: ToastrManager
  ) {
    this.isIndia = new BehaviorSubject<boolean>(false);
  }
  getCountryInd(): Observable<any> {
    return this.isIndia.asObservable();
  }
  setCurrency(val: boolean) {
    this.isIndia.next(val);
  }

  getPaytmDetail(data) {
    return new Promise((resolve, reject) => {
      this.api.getPaytmDetail(data).subscribe((response: any) => {
        if (response.serviceStatus != 'S') return reject('Failed');
        return resolve(response);
      }, error => {
        return reject(error);
      });
    });
  }

  checkRestaurentOpenClose(getLocationDetail) {
    this.country = window.location.pathname.replace('/', '').split('/')[0];
    if (this.country == 'us') {
      moment.tz.setDefault("America/Jamaica");
    } else if (this.country == 'au') {
      moment.tz.setDefault("Australia/Sydney");
    }
    const current = moment();
    const start = moment(moment().startOf('year'));
    const diff = current.diff(start, 'days');
    if (Number(getLocationDetail.Calendar.OpenOrCloseYearMask.charAt(diff)) == 0) {
      this.openSwal();
      return true;
    } else {
      const day = _.find(getLocationDetail.Schedule, { Day: this.days[new Date().getDay()] });

      var currentTime = moment();    // e.g. 11:00 pm
      var startTime1 = moment(day.OT1, "HH:mm:ss");
      var endTime1 = moment(day.CT1, "HH:mm:ss");
    
      if (startTime1.hour() >= 12 && endTime1.hour() <= 12 || endTime1.isBefore(startTime1)) {
        endTime1.add(1, "days");
        if (currentTime.hour() <= 12) {
          currentTime.add(1, "days");
        }
      }
      var isBetween = currentTime.isBetween(startTime1, endTime1);   // TRUE
      if (isBetween == false) {
        var startTime2 = moment(day.OT2, "HH:mm:ss");
        var endTime2 = moment(day.CT2, "HH:mm:ss");
        if (startTime2.hour() >= 12 && endTime2.hour() <= 12 || endTime2.isBefore(startTime2)) {
          endTime2.add(1, "days");
          if (currentTime.hour() <= 12) {
            currentTime.add(1, "days");
          }
        }
        var isBetween1 = currentTime.isBetween(startTime2, endTime2);   // TRUE     
        if (isBetween1 == false) {
          this.openSwal();
          return true;
        }
      }

      //// old function start
      // if ((moment().valueOf() < moment(day.OT1, 'HH:mm').valueOf()) || (moment().valueOf() > moment(day.CT1, 'HH:mm').valueOf())) {
      //   if ((moment().valueOf() < moment(day.OT2, 'HH:mm').valueOf()) || (moment().valueOf() > moment(day.CT2, 'HH:mm').valueOf())) {
      //     this.openSwal();
      //     return true;
      //   }
      // }
    }

    return false;
  }


  onlyCheckRestaurentOpenClose(getLocationDetail) {
    this.country = window.location.pathname.replace('/', '').split('/')[0];
    if (this.country == 'us') {
      moment.tz.setDefault("America/Jamaica");
    } else if (this.country == 'au') {
      moment.tz.setDefault("Australia/Sydney");
    }
    const current = moment();
    const start = moment(moment().startOf('year'));
    const diff = current.diff(start, 'days');
    if (Number(getLocationDetail.Calendar.OpenOrCloseYearMask.charAt(diff)) == 0) {
      return true;
    } else {
      const day = _.find(getLocationDetail.Schedule, { Day: this.days[new Date().getDay()] });
      var currentTime = moment();    // e.g. 11:00 pm

      var startTime1 = moment(day.OT1, "HH:mm:ss");
      var endTime1 = moment(day.CT1, "HH:mm:ss");
      if (startTime1.hour() >= 12 && endTime1.hour() <= 12 || endTime1.isBefore(startTime1)) {
        endTime1.add(1, "days");
        if (currentTime.hour() <= 12) {
          currentTime.add(1, "days");
        }
      }
      var isBetween = currentTime.isBetween(startTime1, endTime1);   // TRUE
      if (isBetween == false) {
        var startTime2 = moment(day.OT2, "HH:mm:ss");
        var endTime2 = moment(day.CT2, "HH:mm:ss");
        if (startTime2.hour() >= 12 && endTime2.hour() <= 12 || endTime2.isBefore(startTime2)) {
          endTime2.add(1, "days");
          if (currentTime.hour() <= 12) {
            currentTime.add(1, "days");
          }
        }
        var isBetween1 = currentTime.isBetween(startTime2, endTime2);   // TRUE     
        if (isBetween1 == false) {
          return true;
        }
      }
    }
    return false;
  }

  checkRestaurentTimeSchedule(getLocationDetail) {
    this.country = window.location.pathname.replace('/', '').split('/')[0];
    if (this.country == 'us') {
      moment.tz.setDefault("America/Jamaica");
    } else if (this.country == 'au') {
      moment.tz.setDefault("Australia/Sydney");
    }
    this.timeData = []
    const current = moment();
    const start = moment(moment().startOf('year'));
    const diff = current.diff(start, 'days');
    const day = _.find(getLocationDetail.Schedule, { Day: this.days[new Date().getDay()] });
    // return day;
    var start1 = moment(day.OT1, 'hh:mm');
    var end = moment(day.CT1, 'hh:mm');
    start1.minutes(Math.ceil(start1.minutes() / 15) * 15);
    var result = [];
    var current1 = moment(start1);
    while (current1 <= end) {
      result.push(current1.format('HH:mm'));
      current1.add(15, 'minutes');
    }

    var start2 = moment(day.OT2, 'hh:mm');
    var end2 = moment(day.CT2, 'hh:mm');
    start2.minutes(Math.ceil(start2.minutes() / 15) * 15);
    var result2 = [];
    var current2 = moment(start2);
    while (current2 <= end2) {
      result2.push(current2.format('HH:mm'));
      current2.add(15, 'minutes');
    }

    this.timeData = result.concat(result2);
    this.timeData = _.uniqBy(this.timeData, function (e) { return e; });
    var time = moment().format('HH:mm');
    var timeselect = []
    for (let index = 0; index < this.timeData.length; index++) {
      const element = this.timeData[index];
      if (time < element) {
        timeselect.push(element)
      }
    }
    return timeselect;

  }

  checkRestaurentTimeScheduleLaterToday(day) {
    this.country = window.location.pathname.replace('/', '').split('/')[0];
    if (this.country == 'us') {
      moment.tz.setDefault("America/Jamaica");
    } else if (this.country == 'au') {
      moment.tz.setDefault("Australia/Sydney");
    }
    this.timeData = []
    var start1 = moment(day.OT1, 'hh:mm');
    var end = moment(day.CT1, 'hh:mm');
    start1.minutes(Math.ceil(start1.minutes() / 15) * 15);
    var result = [];
    var current1 = moment(start1);
    while (current1 <= end) {
      result.push(current1.format('HH:mm'));
      current1.add(15, 'minutes');
    }
    var start2 = moment(day.OT2, 'hh:mm');
    var end2 = moment(day.CT2, 'hh:mm');
    start2.minutes(Math.ceil(start2.minutes() / 15) * 15);
    var result2 = [];
    var current2 = moment(start2);
    while (current2 <= end2) {
      result2.push(current2.format('HH:mm'));
      current2.add(15, 'minutes');
    }
    this.timeData = result2.concat(result);
    this.timeData = _.uniqBy(this.timeData, function (e) { return e; });
    var time = moment().format('HH:mm');
    var timeselect = []
    for (let index = 0; index < this.timeData.length; index++) {
      const element = this.timeData[index];

      // if (time < element) {
      timeselect.push(element)
      // }
    }
    return timeselect;

  }
  openSwal() {
    swal({
      title: 'Warning',
      // text: 'The restaurant is currently closed but you can place an order for a future date.',
      text: 'The restaurant is currently closed.',
      icon: 'warning',
      button: {
        text: 'Close',
        closeModal: false
      },
      dangerMode: true
    })
      .then((willDelete) => {
        swal.close();
      });
  }


  showOpenCloseTime(getLocationDetail) {
    this.country = window.location.pathname.replace('/', '').split('/')[0];
    if (this.country == 'us') {
      moment.tz.setDefault("America/Jamaica");
    } else if (this.country == 'au') {
      moment.tz.setDefault("Australia/Sydney");
    }
    this.timeData = []
    const current = moment();
    const start = moment(moment().startOf('year'));
    const diff = current.diff(start, 'days');
    const day = _.find(getLocationDetail.Schedule, { Day: this.days[new Date().getDay()] });
    var start1 = moment(day.OT1, 'HH:mm:ss').format("hh:mm a");
    var end1 = moment(day.CT1, 'HH:mm:ss').format("hh:mm a");
    var start2 = moment(day.OT2, 'HH:mm:ss').format("hh:mm a");
    var end2 = moment(day.CT2, 'HH:mm:ss').format("hh:mm a");
    if (start1 + ' - ' + end1 == start2 + ' - ' + end2) {
      var openTime = start1 + ' - ' + end1;
    } else {
      var openTime = start1 + ' - ' + end1 + ' & ' + start2 + ' - ' + end2;
    }

    return openTime;

  }


  servicesDelivery(service, orderAmount) {
    if (service.DynamicFee && service.DynamicFee == 'T') {
      if (service.MinOrder) this.minOrderAmount = service.MinOrder;
      if (service.MinFlatFee) this.minFlatFee = service.MinFlatFee;
      if (service.MinVarFee) this.minVarFee = service.MinVarFee;
      if (service.OrderAmt1) this.orderAmt1 = service.OrderAmt1;
      if (service.OrderAmt2) this.orderAmt2 = service.OrderAmt2;
      if (service.OrderAmt3) this.orderAmt3 = service.OrderAmt3;
      if (service.FlatFee1) this.flatFee1 = service.FlatFee1;
      if (service.FlatFee2) this.flatFee2 = service.FlatFee2;
      if (service.FlatFee3) this.flatFee3 = service.FlatFee3;
      if (service.VarFee1) this.varFee1 = service.VarFee1;
      if (service.VarFee2) this.varFee2 = service.VarFee2;
      if (service.VarFee3) this.varFee3 = service.VarFee3;
      if (orderAmount < this.minOrderAmount) {
        const deliveryAmount = 0;
        return deliveryAmount;
      }
      if ((this.minOrderAmount <= orderAmount) && (orderAmount < this.orderAmt1)) {
        const deliveryAmount = this.minFlatFee + orderAmount * this.minVarFee;
        return deliveryAmount;
      }
      if ((this.orderAmt1 <= orderAmount) && (orderAmount < this.orderAmt2)) {
        const deliveryAmount = this.flatFee1 + orderAmount * this.varFee1;
        return deliveryAmount;
      }
      if ((this.orderAmt2 <= orderAmount) && (orderAmount < this.orderAmt3)) {
        const deliveryAmount = this.flatFee2 + orderAmount * this.varFee2;
        return deliveryAmount;
      } else {
        const deliveryAmount = this.flatFee3 + orderAmount * this.varFee3;
        return deliveryAmount;
      }
    } else {
      const deliveryAmount = service.MinFee > service.MinCharges ? service.MinFee : service.MinCharges;
      return deliveryAmount;
    }
  }


}
