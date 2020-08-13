import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PlaceOrderBody } from "../../../requests/place-order-body";
import { LocalStorageService } from "angular-web-storage";
import { ToastrManager } from "ng6-toastr-notifications";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment-timezone";
import { ApiService } from "../../../services/api/api.service";
declare var swal: any;
import * as _ from 'lodash';
import { CardDetailBody } from "../../../requests/card-detail-body";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { CommonService } from "../../../services/common/common.service";
import { ObservableService } from 'src/app/services/observable-service/observable.service';

declare var $: any;
import * as js from '../../../../assets/js/custom';



@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() public mobUrl: string;
  @Input() public SpecialInstructions: string;
  @Output() onOrderFailed = new EventEmitter();
  @Output() onOrderByPaytm = new EventEmitter();
  @Output() onOrderSucess = new EventEmitter();
  @Input() isOrderByPaytm: boolean;
  @Input() public placeorderData1: any;
  country: string;
  placeOrderBody = new PlaceOrderBody();
  cardBody = new CardDetailBody();

  navList = [];
  locationDetails: any;
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  orderData: any;
  orderId: string;
  selectedType: number;
  flags = {
    isOrderPlaced: false
  };
  currency: string;
  restUser = [];
  PaymentTypes: boolean = false;
  PaymentTypesCOD: boolean = false;
  mobUrlNew: string;
  constructor(
    private localStorage: LocalStorageService,
    private toaster: ToastrManager,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private observable: ObservableService,
  ) { }

  ngOnInit() {
    this.country = window.location.pathname.replace('/', '').split('/')[0];
    if (this.country == 'us') {
      moment.tz.setDefault("America/Jamaica");
    } else if (this.country == 'au') {
      moment.tz.setDefault("Australia/Sydney");
    }
    this.placeOrderBody = this.localStorage.get('placeOrderData');
    this.common.getCountryInd().subscribe((isIndia: boolean) => {
      if (isIndia) {
        this.currency = this.common.currencyInd;
      } else {
        this.currency = this.common.currencyUs;
      }
    });
    this.locationDetails = this.localStorage.get('BM_LocationDetail');

    const paymentTypeExistCC = _.find(this.locationDetails.PaymentTypes, { Type: 'CC' });

    if (paymentTypeExistCC) {
      this.PaymentTypes = true;
      this.selectedType = 2;
      this.placeOrderBody.data.orderData.PaymentTypeId = 2;
    }

    const paymentTypeExistCOD = _.find(this.locationDetails.PaymentTypes, { Type: '$$' });

    if (paymentTypeExistCOD) {
      this.PaymentTypesCOD = true;
    }



    if (this.placeOrderBody.data.orderData.PaymentTypeId) this.selectedType = this.placeOrderBody.data.orderData.PaymentTypeId;
    this.country = window.location.pathname.replace('/', '').split('/')[0]; // Without hasing
    this.mobUrlNew = window.location.pathname.replace('/', '').split('/')[1];
    this.restUser = this.localStorage.get('BM_USER')



  }

  placeOrder(responseDaat) {
    this.locationDetails = this.localStorage.get('BM_LocationDetail');
    // if(this.placeorderData1){
    //   this.placeOrderBody = this.placeorderData1;
  
    // }else{
    this.placeOrderBody = this.localStorage.get('placeOrderData');
 
    // }
    this.placeOrderBody.data.orderData.PaymentTypeId = this.selectedType;
    if (!this.placeOrderBody.data.orderData.PaymentTypeId) return this.error('Please select payment type.');
    if (this.localStorage.get('specialOfferData')) {
      const specialOff = this.localStorage.get('specialOfferData');
      if (specialOff.length > 0) {
        if (this.placeOrderBody.data.orderData.PreTaxAmt < specialOff[0]['Amt1']) return this.error(`To qualify for the Free item the order must be over ${this.currency}${specialOff[0]['Amt1']}`)
      }
    }
    const totalAmount = _.sumBy(this.placeOrderBody.data.orderData.ItemList, 'Amt');
    const selectedService = _.find(this.locationDetails.Services, { Id: this.placeOrderBody.data.orderData.ServiceId });
    if (totalAmount < parseInt(selectedService.MinOrder)) return this.error(`Minimum order for this restaurant is ${this.currency}${parseInt(selectedService.MinOrder)}.`);
    const current = moment();
    const start = moment(moment().startOf('year'));
    const diff = current.diff(start, 'days');
    if (Number(this.locationDetails.Calendar.OpenOrCloseYearMask.charAt(diff)) == 0) {
      // this.openSwal();
    } else {
      const day = _.find(this.locationDetails.Schedule, { Day: this.days[new Date().getDay()] });
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
        if (startTime2.hour() >= 12 && endTime2.hour() <= 12 || endTime1.isBefore(startTime2)) {
          endTime2.add(1, "days");
          if (currentTime.hour() <= 12) {
            currentTime.add(1, "days");
          }
        }
        var isBetween1 = currentTime.isBetween(startTime2, endTime2);   // TRUE     
        if (isBetween1 == false) {
          if (this.placeOrderBody.data.orderData.TimeSelection == 0) {
            // this.openSwal();
          }
        }
      }
    }
    if (!this.placeOrderBody.data.orderData.ItemList.length) return this.error('Sorry your cart is empty, Please select item first.');
    if (this.placeOrderBody.data.orderData.ServiceId == 2 && (!this.placeOrderBody.data.orderData.DeliveryInfo)) return this.error('Please select delivery info first.');
    if (this.placeOrderBody.data.orderData.ServiceId == 2 && !this.localStorage.get('BM_Is_Delivery')) return this.error('Your delivery address is outside our delivery zones. Currently we are not able to provide service to these areas. Please select the address or select another order type.');

    this.restUser = this.localStorage.get('BM_USER')
    this.flags.isOrderPlaced = true;
    this.placeOrderBody.data.orderData.CreatedOn = moment().format();
    if (this.country.toUpperCase() != 'IN') {
      if (this.placeOrderBody.data.orderData.PaymentTypeId == 2) {
        const dueon = this.placeOrderBody.data.orderData.DueOn.split(' ')
        this.placeOrderBody.data.orderData.CCInfo = responseDaat;
        this.placeOrderBody.data.orderData.CCInfo.date = dueon[0]
        this.placeOrderBody.data.orderData.CCInfo.time = moment(dueon[1], 'HH:mm:ss').format("hh:mm a");
        // delete this.placeOrderBody.data.orderData.CCInfo.StripeToken;
      } else {
        this.placeOrderBody.data.orderData.CCInfo = {
          CCFName: null,
          CCLName: null,
          CCMName: null,
          CCAddr1: null,
          CCAddr2: null,
          CCCity: null,
          CCState: null,
          CCZIP: null,
          CCNumber: null,
          CCCVV: null,
          CCExpDate: null
        };
      }
    }
    if (this.placeOrderBody.data.orderData.ServiceId == 2) {
      this.placeOrderBody.data.orderData.DeliveryInfo = {
        Name: this.restUser['FName'] ? this.restUser['FName'] : this.restUser['LName'],
        AddressId: this.placeOrderBody.data.orderData.DeliveryInfo.CustAddressBookId ? this.placeOrderBody.data.orderData.DeliveryInfo.CustAddressBookId : null,
        Addr1: this.placeOrderBody.data.orderData.DeliveryInfo.Addr1 ? this.placeOrderBody.data.orderData.DeliveryInfo.Addr1 : null,
        Addr2: this.placeOrderBody.data.orderData.DeliveryInfo.Addr2 ? this.placeOrderBody.data.orderData.DeliveryInfo.Addr2 : null,
        City: this.placeOrderBody.data.orderData.DeliveryInfo.City ? this.placeOrderBody.data.orderData.DeliveryInfo.City : null,
        State: this.placeOrderBody.data.orderData.DeliveryInfo.State ? this.placeOrderBody.data.orderData.DeliveryInfo.State : null,
        Zip: this.placeOrderBody.data.orderData.DeliveryInfo.ZIP ? this.placeOrderBody.data.orderData.DeliveryInfo.ZIP : null,
        Telephone: this.restUser['Tel'] ? this.restUser['Tel'] : null,
        Instructions: this.placeOrderBody.data.orderData.DeliveryInfo.Instructions ? this.placeOrderBody.data.orderData.DeliveryInfo.Instructions : this.placeOrderBody.data.orderData.DeliveryInfo.instr ? this.placeOrderBody.data.orderData.DeliveryInfo.instr : null,
      };
    } else {
      this.placeOrderBody.data.orderData.DeliveryInfo = {
        Name: this.restUser['FName'] ? this.restUser['FName'] :this.restUser['fname']?this.restUser['fname']:null,
        Addr1: null,
        Addr2: null,
        City: null,
        State: null,
        Zip: null,
        Telephone: this.restUser['Tel'] ? this.restUser['Tel'] : null,
        Instructions: null
      };
    }
    this.placeOrderBody.data.orderData.TotalAmt = this.calculations() + Number(this.placeOrderBody.data.orderData.TaxAmt) + Number(this.placeOrderBody.data.orderData.TipAmt) + Number(this.placeOrderBody.data.orderData.SrvcFee);
    if (this.placeOrderBody.data.orderData.CustCouponId == null && this.placeOrderBody.data.orderData.RestChainCouponId == null) this.placeOrderBody.data.orderData.CouponAmt = null;
    // this.placeOrderBody.data.orderData.SpecialInstructions = this.SpecialInstructions;
    this.placeOrderBody.data.orderData.TotalAmt = Number(this.placeOrderBody.data.orderData.TotalAmt.toFixed(2)) - (this.placeOrderBody.data.orderData.CouponAmt || this.placeOrderBody.data.orderData.DiscountAmt || 0).toFixed(2);
    // delete this.placeOrderBody.data.orderData.NGOName;
    delete this.placeOrderBody.data.orderData.donateValueWithPrcent;
    if (this.locationDetails.PaymentProviderStripe == 'T' && this.placeOrderBody.data.orderData.PaymentTypeId == 2) {
      this.placeOrderBody.data.orderData.StripeToken = responseDaat.StripeToken;
    }
    var time1 = moment(this.placeOrderBody.data.orderData.DueOn).format('YYYY-MM-DD HH:mm:ss');
    var time2 = moment().format('YYYY-MM-DD HH:mm:ss');
    if (this.placeOrderBody.data.orderData.TimeSelection == 0) {
      const service = _.find(this.locationDetails.Services, { Id: this.placeOrderBody.data.orderData.ServiceId });
      this.placeOrderBody.data.orderData.DueOn = moment().add(service.ReadyInMin, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    }
    if (this.placeOrderBody.data.orderData.TimeSelection != 0) {
      if (time1 < time2) {
        $('.clickShecdule').trigger('click')
        return
      }
    }
    if (this.placeOrderBody.data.orderData.ServiceId == 5) {
      this.observable.getdinein().subscribe((response: any) => {
        if(response){
          this.placeOrderBody.data.orderData.DineInTableNum = response;
        }
      })
      if(!this.placeOrderBody.data.orderData.DineInTableNum) return this.error('Please enter table number');
    }

    this.api.orderPlace(this.placeOrderBody).subscribe((response: any) => {
      this.flags.isOrderPlaced = false;
      if (response.serviceStatus === 'S') {
        this.orderId = response.data.OrderNumber;
        this.orderData = this.placeOrderBody.data.orderData;
        this.localStorage.set('thankyouData', { orderId: this.orderId, data: this.orderData, locationDetails: this.locationDetails })
        this.observable.setthankyouData({ orderId: this.orderId, data: this.orderData, locationDetails: this.locationDetails })
        if (window.location.hostname == 'localhost') {
          this.router.navigateByUrl(`${this.country}/${this.mobUrlNew}/thankyou`); //testing
        } else {
          this.router.navigateByUrl(`${this.mobUrlNew}/thankyou`);
        }
        this.onOrderSucess.emit({ orderId: this.orderId, data: this.orderData });
        this.localStorage.remove('placeOrderData');
        this.localStorage.remove('cartItem');
        this.observable.setSpecialOffer(false)
        this.localStorage.set('specialOfferData', null)
        // document.getElementById('openOrderSuccess').click();
        // js.eventEmitter('purchase', this.orderId, this.mobUrlNew, 'USD',this.orderData.TotalAmt,this.orderData.TaxAmt.toFixed(2),0,this.orderData.ItemList)
      } else {
        this.onOrderFailed.emit(JSON.parse(atob(response.data)));
      }
    }, error => {
      this.flags.isOrderPlaced = false;
    });
  }
  openSwal() {
    swal({
      title: 'Warning',
      text: 'The restaurant is currently closed but you can place an order for a future date.',
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
  calculations() {
    return _.sumBy(this.placeOrderBody.data.orderData.ItemList, 'Amt');
  }
  updatePlaceOrder(status) {
    this.placeOrderBody = this.localStorage.get('placeOrderData');
    this.placeOrderBody.data.orderData.PaymentTypeId = status;
    // $('li.payment-links').removeClass('active');
    this.selectedType = status;
    this.localStorage.set('placeOrderData', this.placeOrderBody);
  }
  orderByPaytm() {
    this.onOrderByPaytm.emit();
  }
  error = (message: string) => {
    this.toaster.errorToastr(message);
  }

  SendAddToCartEvent() {
    //  this.googleAnalyticsService.eventEmitter("add_to_cart", "shop", "cart", '10', 'USD');
  }

}
