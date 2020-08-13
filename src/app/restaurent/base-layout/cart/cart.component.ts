import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as js from '../../../../assets/js/custom';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from "@angular/router";
import { OrderDataDetail, PlaceOrderBody } from "../../../requests/place-order-body";
import * as moment from "moment-timezone";
import { ToastrManager, ToastrModule } from "ng6-toastr-notifications";
import { LocalStorageService } from "angular-web-storage";
import { ObservableService } from "../../../services/observable-service/observable.service";
import { CommonService } from "../../../services/common/common.service";
import { UrlService } from 'src/app/services/url/url.service';


declare var $: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @Input() public cartList: any[] = [];
  @Input() public locationDetail: any;
  @Input() public Services: any;
  @Input() public tId: string;
  @Output() updateCartList = new EventEmitter();
  @Output() cartTotalCount = new EventEmitter();
  subTotalAmount: number;
  baseUrl: string;
  placeOrderBody = new PlaceOrderBody();
  orderData = new OrderDataDetail();
  selectedService: any;
  flags = {
    isServiceSelected: false
  };
  currency: string;
  country: string;
  specialOfferData = [];
  public min: Date = new Date();
  maxDate: Date;
  laterDate: string;
  TimeSelection: number = 0;
  todayDate: string;
  DueOn: string;
  getLocationDetail: any;
  timeData = []
  timeData1=[];
  selectedTime: string;
  ASAPOnOFf:string='F';
  LTOnOff:string='F';
  FOOnOff:string='F';
  dineinExist:boolean=false;
  mobUrl:string;
  todayOpenClose:boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrManager,
    private router: Router,
    private localStorage: LocalStorageService,
    private observable: ObservableService,
    private common: CommonService,
    private url: UrlService
  ) {  
    this.maxDate = new Date();

    this.maxDate.setDate(this.maxDate.getDate() + 7); }

  ngOnInit() {
    this.country = window.location.pathname.replace('/', '').split('/')[0]; 
    this.mobUrl = window.location.pathname.replace('/', '').split('/')[1]; // Without hasing
    if(this.country == 'us'){
      moment.tz.setDefault("America/Jamaica");
    }else if(this.country == 'au'){
      moment.tz.setDefault("Australia/Sydney");
    }
    if(window.location.href.substring(window.location.href.indexOf('#')+1) == 'dinein'){
      this.dineinExist = true;
     
      // document.getElementById('dineinModalButton').click();
    }
    this.common.getCountryInd().subscribe((isIndia: boolean) => {
      if (isIndia) {
        this.currency = this.common.currencyInd;
      } else {
        this.currency = this.common.currencyUs;
      }
    });
    this.subTotalAmount = 0;
    js.datePicker();
    this.baseUrl = window.location.pathname.replace('/', '').split('/')[1]; // Without hashing
    this.country = window.location.pathname.replace('/', '').split('/')[0]; // Without hashing
    // this.baseUrl = window.location.hash.replace('#/', '').split('/')[1]; // With hasing
    // this.country = window.location.hash.replace('#/', '').split('/')[0]; // With hashing
    this.todayDate = moment().format("YYYY-MM-DD");
    this.laterDate = moment().add(1,'day').format('YYYY-MM-DD');
    this.getLocationDetail = this.localStorage.get('BM_LocationDetail');
    this.timesection1(0)
  this.todayOpenClose =  this.common.onlyCheckRestaurentOpenClose(this.getLocationDetail)
  }
  calculateTotal() {
    this.cartTotalCount.emit(_.sumBy(this.cartList, 'P1'))
    return _.sumBy(this.cartList, 'P1');
  }
  getCartItem() {
    return _.sumBy(this.cartList, 'addQuantity');
  }
  addQuantity(product, i) {


    if (product.addQuantity >= product.max) return;

    product.addQuantity = product.addQuantity + 1;
    product.isAdded = true;
    const index = _.findIndex(this.cartList, { Id: product.Id });
    this.cartList[i].P1 = product.price * product.addQuantity;
    this.cartList[i].addQuantity = product.addQuantity;
    this.cartList[i].addedItems = product.addedItems;
    if (this.cartList[i].ItemAddOnList.length) {
      let amt = 0;
      this.cartList[i].ItemAddOnList.forEach(ele => {
        amt += _.sumBy(ele.AddOnOptions, 'Amt');
      });
      this.cartList[i].P1 += amt * product.addQuantity;
    }
    this.localStorage.set('setTotalCountData', this.calculateTotal());
    this.observable.setTotalCount(this.calculateTotal())
    this.observable.setCartTotalA(this.calculateTotal())

    this.updateCartList.emit({ Id: product.Id, addQuantity: product.addQuantity, addedItems: product.addedItems });

  }
  removeQuantity(product, i) {

    if (product.specialOffer) {
      this.observable.setSpecialOffer(false)
      this.localStorage.set('specialOfferData', null)
    }

    if (product.addQuantity <= 1) {
      js.removeFromCart(product.Name, product.Id, product.P1, this.mobUrl, product.catName, [], 1);
      product.addQuantity = 0;
      product.isAdded = false;
      const index = _.findIndex(this.cartList, { Id: product.Id });
      this.cartList.splice(i, 1);
      if (product.addedItems <= 1) {
        // alert('work');
        this.observable.updateQuantity(false);
        this.updateCartList.emit({ Id: product.Id, addQuantity: 0, addedItems: 0 });
        this.observable.setCartTotalA(this.calculateTotal())
      } else {
        this.observable.updateQuantity(false);
        this.updateCartList.emit({ Id: product.Id, addQuantity: 1, addedItems: product.addedItems - 1 });
        if (_.findIndex(this.cartList, { Id: product.Id }) > -1) this.cartList[_.findIndex(this.cartList, { Id: product.Id })].addedItems = product.addedItems - 1;
        this.observable.setCartTotalA(this.calculateTotal())
      }
      
    } else {
      product.addQuantity = product.addQuantity - 1;
      product.isAdded = true;
      const index = _.findIndex(this.cartList, { Id: product.Id });
      let amt = 0;
      if (this.cartList[i].ItemAddOnList.length) {
        this.cartList[i].ItemAddOnList.forEach(ele => {
          amt += _.sumBy(ele.AddOnOptions, 'Amt');
        });
      }
      this.cartList[i].P1 = (product.price + amt) * product.addQuantity;
      this.cartList[i].addQuantity = product.addQuantity;
      this.cartList[i].addedItems = product.addedItems;
      this.updateCartList.emit({ Id: product.Id, addQuantity: product.addQuantity, addedItems: product.addedItems });
      this.observable.setCartTotalA(this.calculateTotal())
    }
    
  }
  checkout() {
    if (this.localStorage.get('specialOfferData')) {
      const specialOff = this.localStorage.get('specialOfferData');
      if (specialOff) {
        if (this.calculateTotal() < specialOff.specialOffer['Amt1']) return this.error(`To qualify for the Free item the order must be over ${this.currency}${specialOff.specialOffer['Amt1']}`)
      }
    }
    if (!this.selectedService) return this.error('Please select service type.');
    if (this.TimeSelection == 0) {
      this.DueOn = moment(this.DueOn, 'YYYY-MM-DD HH:mm:ss').add(this.selectedService.ReadyInMin, 'minutes').format('YYYY-MM-DD HH:mm');
    }
    // if (this.locationDetail.Menus[0].ASAP == 'F') return this.error('Restaurant is not accepting current orders.');
    if (this.TimeSelection == 0) {
      // if (this.common.checkRestaurentOpenClose(this.locationDetail)) return;
      if(this.common.onlyCheckRestaurentOpenClose(this.locationDetail) == true){
this.shecdule()
return
      }
    }
    if (this.TimeSelection == 0) {
      if (this.locationDetail.Menus[0].ASAP == 'F') return this.shecdule()
      //  return this.error('Restaurant is currently not accepting orders, but you can place orders for later today and tomorrow.');
    }
    if (this.TimeSelection == 1) {
      if (this.locationDetail.Menus[0].LT == 'F') return this.shecdule()
      // return this.error('Restaurant is currently not accepting orders, but you can place orders for tomorrow.');
    }
    if (this.TimeSelection == 2) {
      if (this.locationDetail.Menus[0].FO == 'F') return this.shecdule()
      //  return this.error('Restaurant is currently not accepting Future Orders. Please try again after some time.');
    }
    const selectedService = _.find(this.locationDetail.Services, { Id: this.selectedService.Id });
    if (this.calculateTotal() < parseInt(selectedService.MinOrder)) return this.error(`Minimum order for this restaurant is ${this.currency}${parseInt(selectedService.MinOrder)}.`);
    if (!this.cartList.length) return this.error('Please select items first.');
    if (!this.orderData.ServiceId) return this.error('Please select service first.');
    if (this.calculateTotal() < this.selectedService.minOrder) this.error(`This restaurant accepts order above ${Number(this.selectedService.minOrder).toFixed(2)}.`);
    this.placeOrderBody.tId = this.tId;
    this.orderData.PlaceOrder = 'T';
    this.orderData.isPrinterMsgOk = '0';
    this.orderData.LocationId = this.locationDetail.Id;
    this.orderData.MenuId = this.locationDetail.Menus[0].Id;
    this.orderData.Status = 1;
    this.orderData.SrvcFee = 0;
    this.orderData.TipAmt = 0;
    this.orderData.PreTaxAmt = this.calculateTotal();
    this.orderData.DeliveryInfo = null;
    this.orderData.CouponAmt = 0;
    // this.orderData.TimeSelection = 0;
    this.orderData.SpecialInstructions = '';
    this.orderData.OldOrderId = null;
    this.orderData.utm_source = '';
    this.orderData.RestChainId = this.locationDetail.RestChainId;
    this.orderData.ItemList = [];
    const body = { orderData: this.orderData };
    this.placeOrderBody.data = body;
    this.cartList.forEach(ele => {
      if (ele.specialOffer) {
        if ((this.calculateTotal() - ele.P1) > ele.specialOffer.Amt1) {
          this.orderData.PreTaxAmt = this.orderData.PreTaxAmt - ele.P1;
        }
      }
      this.orderData.ItemList.push({
        Name: ele.Name,
        Id: ele.Id,
        PortionId: ele.portionId,
        UnitPrice: ele.price,
        Qty: ele.addQuantity,
        Amt: ele.P1,
        SpecialInstructions: ele.instr,
        NameOfThePerson: '',
        categoryId: ele.catId,
        catName:ele.catName,
        ItemAddOnList: ele.ItemAddOnList,
        isShowforSuggestion: ele.isShowforSuggestion,
        ItemModList: [],
        max: ele.max
      });
    });
    this.orderData.TaxAmt = this.orderData.PreTaxAmt * this.locationDetail.Tax;
    this.orderData.TotalAmt = this.orderData.PreTaxAmt + this.orderData.TaxAmt;
    this.placeOrderBody.data.orderData.TimeSelection = this.TimeSelection;
    this.placeOrderBody.data.orderData.DueOn = this.DueOn;
    this.localStorage.set('placeOrderData', this.placeOrderBody);
    if(window.location.hostname == 'localhost'){
      this.router.navigateByUrl(`/${this.country}/${this.baseUrl}/checkout`); //testing
    }else{
      this.router.navigateByUrl(`/${this.baseUrl}/checkout`); //live
    }
    this.observable.setIsCheckout(true);
  }
  onSelectService(service: any) {
    this.flags.isServiceSelected = true;
    this.orderData.ServiceId = service.Id;
    this.selectedService = service;
  }

  openMobService() {
    if (this.localStorage.get('specialOfferData')) {
      const specialOff = this.localStorage.get('specialOfferData');
      if (specialOff.length > 0) {
        if (this.calculateTotal() < specialOff[0]['Amt1']) {
          return this.error(`To qualify for the Free item the order must be over ${this.currency}${specialOff[0]['Amt1']}`)
        }
      }
    }
    this.getLocationDetail = this.localStorage.get('BM_LocationDetail');
    if (this.common.onlyCheckRestaurentOpenClose(this.getLocationDetail) == true) {
      $('#serviceModal').modal('show');
    } else {
      if (window.location.href.substring(window.location.href.indexOf('#') + 1) == 'dinein') {
        var data = _.find(this.getLocationDetail.Services, function (o) { return o.Id == 5; });
        if (data) {
          this.onSelectServiceResp(data)
        } else {
          $('#serviceModal').modal('show');
        }
      } else {
        if (this.dineinExist == true) {
          $('#dine in').trigger('click');
        }else{
          $('#serviceModal').modal('show');
        }
      }
    }
  }


  onSelectServiceResp(service) {
    this.flags.isServiceSelected = true;
    this.orderData.ServiceId = service.Id;
    this.selectedService = service;
    document.getElementById('closeServiceModal').click();
    this.checkout();
  }
  timesection(val) {
    if(val == 2){
      if(!this.selectedTime) return this.error('Select time');; 
    }
    this.TimeSelection = val;
    if(this.TimeSelection == 0){
      if (this.getLocationDetail.Menus[0].ASAP == 'F') return this.error('Restaurant is currently not accepting orders, but you can place orders for later today and tomorrow.');
    }
     if(this.TimeSelection == 1){
      if (this.getLocationDetail.Menus[0].LT == 'F') return this.error('Restaurant is currently not accepting orders, but you can place orders for tomorrow.');
    }
     if(this.TimeSelection == 2){
      if (this.getLocationDetail.Menus[0].FO == 'F') return this.error('Restaurant is currently not accepting Future Orders. Please try again after some time.');
    }

    if (this.TimeSelection == 0) {
      this.DueOn = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    if (this.TimeSelection == 1 && !this.DueOn) return this.error('Select time');
    if (this.TimeSelection == 2 && !this.laterDate) return this.error('Select date');
    if (this.TimeSelection == 2 && !this.DueOn) return this.error('Select time');
    $('#shecdule').modal('hide')
    $("div").removeClass("modal-backdrop")
  }

  timesection1(val) {

    this.TimeSelection = val;
    // if(this.TimeSelection == 0){
    //   if (this.getLocationDetail.Menus[0].ASAP == 'F') return this.error('Restaurant is currently not accepting orders, but you can place orders for later today and tomorrow.');
    // }
     if(this.TimeSelection == 1){
      if (this.getLocationDetail.Menus[0].LT == 'F') return this.error('Restaurant is currently not accepting orders, but you can place orders for tomorrow.');
    }
     if(this.TimeSelection == 2){
      if (this.getLocationDetail.Menus[0].FO == 'F') return this.error('Restaurant is currently not accepting Future Orders. Please try again after some time.');
    }

    if (this.TimeSelection == 0) {
      this.DueOn = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    if (this.TimeSelection == 1 && !this.DueOn) return this.error('Select time');
    if (this.TimeSelection == 2 && !this.laterDate) return this.error('Select date');
    if (this.TimeSelection == 2 && !this.DueOn) return this.error('Select time');
    $('#shecdule').modal('hide')
    $("div").removeClass("modal-backdrop")
  }

  selectTime(val) {
    this.DueOn = val;
    this.selectedTime = this.DueOn
  }

  dateTime(date, time) {
    const timeData = moment(time, 'HH:mm:ss').format("hh:mm a");
    return timeData;
  }

  selectedTimeF(val){
    const time = val.split(' ')[1];
    const timeData = moment(time, 'HH:mm').format("hh:mm a");
    return timeData;
  }

  clearTime() {
    this.timeData1=[]
    this.DueOn = null;
    this.selectedTime = null
    $(".selectOption").prop("selected", false)
    $(".selectOptionSelected").prop("selected", true)
  }

  laterDateDate(date) {
    this.selectedTime = null;
    $(".selectOption").prop("selected", false)
    $(".selectOptionSelected").prop("selected", true)
    this.timeData1=[]
    this.laterDate = moment(date).format('YYYY-MM-DD');
    if(this.todayDate == this.laterDate){
      this.selectedTime = null;
      return this.error('Select next day date')
    } 

    var today = '';
    const dayFind = moment(date).day()
    if (dayFind == 1) {
      var today = 'Mon';
    }
    else if (dayFind == 2) {
      var today = 'Tue';
    }
    else if (dayFind == 3) {
      var today = 'Wed';
    }
    else if (dayFind == 4) {
      var today = 'Thu';
    }
    else if (dayFind == 5) {
      var today = 'Fri';
    }
    else if (dayFind == 6) {
      var today = 'Sat';
    }
    else if (dayFind == 0) {
      var today = 'Sun';
    }
    this.getLocationDetail = this.localStorage.get('BM_LocationDetail');
    const day = _.find(this.getLocationDetail.Schedule, { Day: today });
    if(day.Closed == "T"){
      this.selectedTime = null;
      return  this.error('Restaurant is closed for today');
    } 
    this.timeData1 = this.common.checkRestaurentTimeScheduleLaterToday(day);
  }

  shecdule() {
    if (this.locationDetail.Menus[0].ASAP == 'T') {
      this.ASAPOnOFf = 'T';
    } 
     if (this.locationDetail.Menus[0].LT == 'T') {
      this.LTOnOff = 'T';
    }
     if (this.locationDetail.Menus[0].FO == 'T') {
      this.FOOnOff = 'T';
    }
    this.timeData=[]
    this.getLocationDetail = this.localStorage.get('BM_LocationDetail');
    this.timeData = this.common.checkRestaurentTimeSchedule(this.getLocationDetail);
    $('#shecdule').modal('show');
  }

  error = (message: string) => {
    this.toaster.errorToastr(message);
  }

}
