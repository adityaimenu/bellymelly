import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {LocalStorageService} from "angular-web-storage";
import {CardDetailBody} from "../../../../requests/card-detail-body";
import {ToastrManager} from "ng6-toastr-notifications";
import {GooglePlaceDirective} from "ngx-google-places-autocomplete";
import {Address} from "ngx-google-places-autocomplete/objects/address";
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StripeService, StripeCardComponent,Element as StripeElement, ElementOptions, ElementsOptions } from "@nomadreservations/ngx-stripe";
declare var $: any;
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  @Output() onPlaceOrder = new EventEmitter();
  date: string;
  locationDetails: any;
  cardBody = new CardDetailBody();
  expDate = {month: '', year: ''};
  country: string;
  @ViewChild('placesRef', {static: false}) placesRef: GooglePlaceDirective;
  options = {
    types: []
  };
  flags = {
    isPromoApplied: false,
    deliveryNotAvailable: false,
    isOrderPlaced: false,
    isCCPayment: false,
    isOrderByPaytm: false,
    placeorderButton:false
  };
  PaymentTypes:boolean=false;
  PaymentTypesCOD:boolean=false;

  stripeKey = '';
  error1: any;
  complete = false;
  element: StripeElement;
  cardOptions: ElementOptions = {
    // hidePostalCode: true,
    style: {
      base: {
        iconColor: '#276fd3',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

token:string;
  constructor(
    private localStorage: LocalStorageService,
    private toaster: ToastrManager,
    private stripe: StripeService
  ) { }

  ngOnInit() {
    this.locationDetails = this.localStorage.get('BM_LocationDetail');
    this.country = window.location.pathname.replace('/', '').split('/')[0]; // Without hasing
    const paymentTypeExistCC = _.find(this.locationDetails.PaymentTypes, {Type: 'CC'});

    if(paymentTypeExistCC){
      this.PaymentTypes = true;
    }

    const paymentTypeExistCOD = _.find(this.locationDetails.PaymentTypes, {Type: '$$'});

    if(paymentTypeExistCOD){
      this.PaymentTypesCOD = true;
    }
    if(this.locationDetails.PaymentProviderStripe == 'T'){
    this.stripe.changeKey(atob(this.locationDetails.PublishableKey));
    }
    // environment.stripe = atob(this.locationDetails.PublishableKey)
  }

  public handleAddressChange(address: Address) {
    this.cardBody.CCAddr1 =  address.formatted_address;
    this.cardBody.CCAddr2 = address.vicinity;
    address.address_components.forEach(ele => {
      const index = ele.types.indexOf('administrative_area_level_1');
      const cityIndex = ele.types.indexOf('locality');
      const zipIndex = ele.types.indexOf('postal_code');
      if (cityIndex > -1) this.cardBody.CCCity = ele.long_name;
      if (index > -1) this.cardBody.CCState = ele.long_name;
      if (zipIndex > -1) this.cardBody.CCZIP = ele.long_name;
    });
  }
  placeOrder() {
    if(this.locationDetails.PaymentProviderStripe == 'F'){
      if (Number(this.expDate.month) > 12) return this.toaster.errorToastr('Please enter valid date.');
      if (this.expDate.year.length < 2) return this.toaster.errorToastr('Please enter valid year.');
      if (this.expDate.month.length < 2) this.expDate.month = `0${this.expDate.month}`;
      for (let index = 0; index < 6; index++) {
        this.cardBody.CCNumber = this.cardBody.CCNumber.replace("-", "");
      }
    }
    // if(this.locationDetails.PaymentProviderStripe == 'T'){
    // this.cardBody.StripeToken = this.token;
    // }
  
    this.cardBody.service = 1;
    this.cardBody.date = 'LT';
    this.cardBody.time = 'ASAP';
    this.cardBody.tipPaidbBy = 'on';
    this.cardBody.txtPaytronixGiftCard = '';
    this.cardBody.CCType = 2;
    this.cardBody.hacode = ''; 
    this.cardBody.CCCVV = this.cardBody.CCCVV?this.cardBody.CCCVV:'';
    this.cardBody.CCNumber = this.cardBody.CCNumber?this.cardBody.CCNumber:'';
    this.cardBody.CCZIP = this.cardBody.CCZIP?this.cardBody.CCZIP:'';
    this.cardBody.expMonth = this.cardBody.expMonth?this.cardBody.expMonth:'';
    this.cardBody.expYear = this.cardBody.expYear?this.cardBody.expYear:'';
    this.cardBody.CCExpDate =  this.expDate.month?`${this.expDate.month}/${this.expDate.year}`:'';
    this.onPlaceOrder.emit(this.cardBody);
  }

  cardUpdated(result) {
    this.element = result.element;
    this.complete = result.card.complete;
    if(this.complete) {
      // this._stripe.changeKey(this.stripeKey);
    }
    this.error1 = undefined;
  }

  keyUpdated() {
    this.stripe.changeKey(this.stripeKey);
  }
  // getCardToken() {
  //   this.stripe.createPaymentMethod(this.element, {}).(result => {
  //     if (result.token) {
  //       this.cardBody.StripeToken = result.token.id;
  //       this.placeOrder();
  //     } else if (result.error) {
  //       this.error(result.error.message)
  //     }

  //   });
  // }
  getCardToken() {
    if (!this.element) return this.error('Enter card information')
    this.flags.placeorderButton = true;
    this.stripe.createPaymentMethod({ type: 'card', card: this.element, billing_details: { name: 'Jenny Rosen', }, }).subscribe(result => {
      if (result.paymentMethod) {
        this.flags.placeorderButton = true;
        setTimeout(() => {
          this.flags.placeorderButton = false;
        }, 2000);
       
        this.cardBody.StripeToken = result.paymentMethod.id;
        this.placeOrder()
      } else if (result.error) {
        this.flags.placeorderButton = false;
        this.error(result.error.message)
      }
    })
  }

  
  error = (message: string) => {
    this.toaster.errorToastr(message);
  }

}
