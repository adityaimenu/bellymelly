import { Component, OnInit, ViewChild, Output, Input } from '@angular/core';
import * as js from '../../../../../assets/js/custom';
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../../services/api/api.service";
import { CommonService } from "../../../../services/common/common.service";
import { GetNewTokenBody } from "../../../../requests/get-new-token-body";
import { GetLocationDetailBody } from "../../../../requests/get-location-detail-body";
import * as _ from 'lodash';
import * as moment from "moment-timezone";
import { LocalStorageService } from "angular-web-storage";
import { ToastrManager } from "ng6-toastr-notifications";
import { ModalComponent } from "../../dish-items/modal/modal.component";
import { UrlService } from "../../../../services/url/url.service";
import { ObservableService } from "../../../../services/observable-service/observable.service";
import { async } from '@angular/core/testing';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-structure',
  templateUrl: './main-structure.component.html',
  styleUrls: ['./main-structure.component.scss']
})
export class MainStructureComponent implements OnInit {
  mobUrl: string;
  newTokenDetail: any;
  getLocationDetail: any;
  menuDetails: any;
  catList: any[] = [];
  newTokenBody = new GetNewTokenBody();
  getLocationBody = new GetLocationDetailBody();
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  tId: string;
  cartList: any[] = [];
  imageUrl: string;
  country: string;
  cartTotalCountVal: number = 0;
  Services = [];
  // @Input() public cartTotalCountVal: any;
  @ViewChild(ModalComponent, { static: false }) public modal: ModalComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private common: CommonService,
    private localStorage: LocalStorageService,
    private toaster: ToastrManager,
    private url: UrlService,
    private observable: ObservableService,
    private spinner: NgxSpinnerService,
    
  ) { }

  ngOnInit() {
    this.country = window.location.pathname.replace('/', '').split('/')[0]; 
    if(this.country == 'us'){
      moment.tz.setDefault("America/Jamaica");
    }else if(this.country == 'au'){
      moment.tz.setDefault("Australia/Sydney");
    }
    js.sticky();
    setTimeout(() => {
      js.customFixed();
    }, 500)
    

    this.imageUrl = this.url.imageUrl;
    this.localStorage.remove('selectedCouponBM');
    this.activatedRoute.params.subscribe((param: any) => {
      this.mobUrl = window.location.pathname.replace('/', '').split('/')[1]; // Without hashing
      this.country = window.location.pathname.replace('/', '').split('/')[0]; // Without hashing
      // this.mobUrl = window.location.hash.replace('#/', '').split('/')[1]; // With hasing
      // this.country = window.location.hash.replace('#/', '').split('/')[0]; // With hashing
      this.newTokenBody.AppCode = this.common.appToken;
      this.newTokenBody.data = { mobUrl: this.mobUrl, pid: null, TempOrderId: null, PaypalToken: null, PaypalPayerID: null };
      this.getLocationBody.data = { locationId: 0, mobUrl: this.mobUrl };
      this.getLocation();

    });


  }

  cartTotalCount(val) {
    this.observable.setTotalCount(val)
    
  }
  getLocation() {
    if (this.country.toUpperCase() == 'IN') {
      this.common.setCurrency(true);
      this.url.bellyMellyUrl = this.url.baseUrlTwoInd;
      this.newTokenBody.mobUrl = `http://www.imenu360.mobi/?id=${this.mobUrl}`;
    } else if (this.country.toUpperCase() == 'US') {
      this.common.setCurrency(false);
      this.url.bellyMellyUrl = this.url.baseUrlTwoUs;
      this.newTokenBody.mobUrl = `http://www.imenu360.mobi/?id=${this.mobUrl}`;
    } else if (this.country.toUpperCase() == 'AU') {
      this.common.setCurrency(false);
      this.url.bellyMellyUrl = this.url.baseUrlTwoAustralia;
      this.newTokenBody.mobUrl = `https://www.imenu360.mobi/?id=${this.mobUrl}`;
    }
    this.getLocationData();
  }
  getLocationData() {
    this.api.getNewToken(this.newTokenBody).subscribe((response: any) => {

      if (response.serviceStatus === 'S') {
        this.newTokenDetail = response.data;
        this.getLocationBody.tId = this.newTokenDetail.tId;
        this.getLocationBody.data.locationId = this.newTokenDetail.locationId;
        this.tId = this.getLocationBody.tId;
        this.getLocationBody.data.locationId = this.newTokenDetail.locationId;
        this.localStorage.set('BM_tId', this.tId);
        this.getLocationDetailMethod();
      }
    });
  }
  getLocationDetailMethod() {
    const tempArray = [];
    this.api.getLocationData(this.getLocationBody).subscribe((response: any) => {

      if (response.serviceStatus === 'S') {
        this.getLocationDetail = response.data;

        if (response.data.Services.length > 0) {

        }
    // if(this.getLocationDetail.PaymentProviderStripe == 'T'){
      environment.stripe = atob(this.getLocationDetail.PublishableKey)
    // }
        this.getLocationDetail.Name = this.getLocationDetail.Name.replace('- Belly Melly', '');
        this.getLocationDetail.varitionList = [];
        this.getLocationDetail.likePrdoucts = [];
        if (this.getLocationDetail.Alert) {
          if (this.getLocationDetail.Alert.length) {
            const currentDate = moment().format('YYYY-MM-DD');
            const currentTime = moment().format('HH:mm');
            this.getLocationDetail.Alert.forEach(ele => {
              const alertDate = moment(ele.StartDate, 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm');
              const alertTime = moment(ele.EndDate, 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm');
              if (currentDate >= alertDate.split(' ')[0] && currentDate <= alertTime.split(' ')[0]) {
                if (currentTime >= alertDate.split(' ')[1] && currentTime <= alertTime.split(' ')[1]) tempArray.push(ele);
              }
            })
          }
        }
        this.getLocationDetail.Alert = tempArray;
        if (!this.getLocationDetail.HeaderImg) this.getLocationDetail.HeaderImg = 'assets/images/restaurent-cover.jpg';
        else this.getLocationDetail.HeaderImg = this.imageUrl + this.getLocationDetail.HeaderImg;

        this.getLocationDetail.Services.forEach(element => {
          element.showTOday = false
          const todayDate = moment().format('YYYY-MM-DD');
          var today = '';
          const dayFind = moment(todayDate).day()
          if (dayFind == 1) {
            today = 'Mon';
            if(element.OpenOn.Mon == "T"){
              element.showTOday = true
            }
          }
          else if (dayFind == 2) {
            today = 'Tue';
            if(element.OpenOn.Tue == "T"){
              element.showTOday = true
            }
          }
          else if (dayFind == 3) {
            today = 'Wed';
            if(element.OpenOn.Wed == "T"){
              element.showTOday = true
            }
          }
          else if (dayFind == 4) {
            today = 'Thu';
            if(element.OpenOn.Thu == "T"){
              element.showTOday = true
            }
          }
          else if (dayFind == 5) {
            today = 'Fri';
            if(element.OpenOn.Fri == "T"){
              element.showTOday = true
            }
          }
          else if (dayFind == 6) {
            today = 'Sat';
            if(element.OpenOn.Sat == "T"){
              element.showTOday = true
            }
          }
          else if (dayFind == 0) {
            today = 'Sun';
            if(element.OpenOn.Sun == "T"){
              element.showTOday = true
            }
          }
        });

        this.localStorage.set('BM_LocationDetail', this.getLocationDetail);
        if (this.getLocationDetail.Menus.length) {
          this.getLocationBody.data.menuId = this.getLocationDetail.Menus[0].Id;
          this.getLocationBody.data.chainId = this.getLocationDetail.RestChainId;
          this.getLocationDetail.Cuisines = _.map(this.getLocationDetail.Cuisines, 'name');
          this.common.checkRestaurentOpenClose(this.getLocationDetail)
          this.getMenu();
        }
        this.observable.setLocationDetails(this.getLocationDetail);
      }
    });
  }
  getMenu() {
    this.api.getMenu(this.getLocationBody).subscribe((response: any) => {
      this.spinner.hide();
      if (response.serviceStatus === 'S') {
        this.menuDetails = response.data;
        const itemList = this.menuDetails.catList;
        if (itemList.length) {
          itemList.forEach(ele => {
            ele.customId = ele.CatName.replace(/[^A-Z0-9]/ig, '');
            if (ele.ItemList.length) {
              ele.ItemList.forEach(element => {
                element.showTOday = false
                const todayDate = moment().format('YYYY-MM-DD');
                var today = '';
                const dayFind = moment(todayDate).day()
                if (dayFind == 1) {
                  today = 'Mon';
                  if(element.OpenOn.Mon == "T"){
                    element.showTOday = true
                  }
                }
                else if (dayFind == 2) {
                  today = 'Tue';
                  if(element.OpenOn.Tue == "T"){
                    element.showTOday = true
                  }
                }
                else if (dayFind == 3) {
                  today = 'Wed';
                  if(element.OpenOn.Wed == "T"){
                    element.showTOday = true
                  }
                }
                else if (dayFind == 4) {
                  today = 'Thu';
                  if(element.OpenOn.Thu == "T"){
                    element.showTOday = true
                  }
                }
                else if (dayFind == 5) {
                  today = 'Fri';
                  if(element.OpenOn.Fri == "T"){
                    element.showTOday = true
                  }
                }
                else if (dayFind == 6) {
                  today = 'Sat';
                  if(element.OpenOn.Sat == "T"){
                    element.showTOday = true
                  }
                }
                else if (dayFind == 0) {
                  today = 'Sun';
                  if(element.OpenOn.Sun == "T"){
                    element.showTOday = true
                  }
                }
                element.addedItems = 0;
                element.isAdded = false;
                element.addQuantity = 0;
              });
            }
          });
        }
       
        this.catList = itemList;
        const a = _.filter(itemList, { ItemList: [{ isShowforSuggestion: 'True' }] });
        let countCat1 = this.catList.length;
        const dataVaria = [];
        if (a.length) {
          if (a.length < countCat1) countCat1 = a.length;
          for (var i = 0; i < countCat1; i++) {
            if (a[i].ItemList.length) {
              a[i].ItemList.forEach(ele => {
                if(ele.isShowforSuggestion == 'True'){
                ele.data = JSON.parse(JSON.stringify(a[i]));
                dataVaria.push(ele);
                }
              });
            }
          }
        }
        // const c = _.filter(dataVaria, { isShowforSuggestion: 'True' });

        this.getLocationDetail.likePrdoucts = dataVaria;

        this.localStorage.set('BM_LocationDetail', this.getLocationDetail);
        if (this.localStorage.get('cartItem')) {
          this.cartList = this.localStorage.get('cartItem');
          this.catList.forEach(ele => {
            if (ele.ItemList.length) {
              ele.ItemList.forEach(element => {
                let addedItems = 0;
                if (this.cartList.length) {
                  this.cartList.forEach(cart => {
                    if (element.Id == cart.Id) {
                      if (element.AddOnList.length || (ele.P2 || ele.P3 || ele.P4 || ele.P5 || ele.P6)) addedItems += 1;
                      element.addQuantity = cart.addQuantity;
                      element.addedItems = cart.addedItems;
                      cart.max = element.MaxQ;
                      if (element.AddOnList.length || (ele.P2 || ele.P3 || ele.P4 || ele.P5 || ele.P6)) {
                        element.addedItems = addedItems;
                        cart.addedItems = addedItems;
                      }
                      else element.addedItems = 0;
                      if (cart.ItemAddOnList.length) element.addedItems = cart.addQuantity;
                      cart.isShowforSuggestion = element.isShowforSuggestion
                    }
                  });
                }
              });
            }
          });
        }
      }
      this.spinner.hide();
    });

  }
  getCartListData(list) {
    const a = _.find(list, 'specialOffer');
      if(a){
        this.observable.setSpecialOffer(true);
        this.localStorage.set('specialOfferData',a)
      }
    // list.forEach(element => {
    //   if(element.specialOffer){
    //     this.observable.setSpecialOffer(true);
    //   }
    // });
    this.cartList = list;
    this.localStorage.set('cartItem', this.cartList);
  }
  updateCartList(product) {
    const list = this.catList;
    list.forEach(ele => {
      const index = _.findIndex(ele.ItemList, { Id: product.Id });
      if (index > -1) {
        ele.ItemList[index].addQuantity = product.addQuantity;
        ele.ItemList[index].addedItems = product.addedItems;
      }
    });
    this.catList = list;
    if (this.cartList.length == 0) {
      this.cartList = [];
    }
    this.localStorage.set('cartItem', this.cartList);
  }


  getChainDetails() {
    this.api.getChainDetail(this.getLocationBody).subscribe((response: any) => {
    });
  }


  error = (message: string) => {
    this.toaster.errorToastr(message);
  }

}
