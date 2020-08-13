import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {LocalStorageService} from "angular-web-storage";
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class ObservableService {
  isCartQuantity: BehaviorSubject<boolean>;
  selectedAddOnObj: BehaviorSubject<any>;
  TotalCountData: BehaviorSubject<any>;
  orderData: BehaviorSubject<any>;
  getCartTotal: BehaviorSubject<any>
  getEditAddresses: BehaviorSubject<any>;
  // TotalCountData=  new Subject<any>();
  locationDetails:  BehaviorSubject<any>;
  isCheckoutWithoutLogin: BehaviorSubject<boolean>;
  dineinExist: BehaviorSubject<any>;
  SpecialOfferData: BehaviorSubject<boolean>;
  isAddressSelectedResp = new Subject<any>();
  thankyouData : BehaviorSubject<any>;
  selectedAddress : BehaviorSubject<any>;
  isOrderPlaced = new BehaviorSubject<boolean>(false);
  constructor(private localStorage: LocalStorageService) {
    const list = localStorage.get('cartItem');

    this.getCartTotal =  new BehaviorSubject<any>(_.sumBy(list, 'P1'));
    this.getEditAddresses = new BehaviorSubject<any>(null);
    this.selectedAddOnObj = new BehaviorSubject<any>(null);
    this.isCheckoutWithoutLogin = new BehaviorSubject<any>(false);
    
    
    // this.SpecialOfferData = new BehaviorSubject<any>(false);
    if (this.localStorage.get('BM_LocationDetail')) {
      this.locationDetails = new BehaviorSubject<any>(null);
    } else {
      this.locationDetails = new BehaviorSubject<any>(null);
    }
    if (list && list.length) {
      this.isCartQuantity = new BehaviorSubject<boolean>(true);
    } else {
      this.isCartQuantity = new BehaviorSubject<boolean>(false);
    }

    if (this.localStorage.get('setTotalCountData')) {
      this.TotalCountData = new BehaviorSubject<any>(this.localStorage.get('setTotalCountData'));
    } else {
      this.TotalCountData = new BehaviorSubject<any>(null);
    }
    if (this.localStorage.get('placeOrderData')) {
      this.orderData = new BehaviorSubject<any>(this.localStorage.get('placeOrderData'));
    } else {
      this.orderData = new BehaviorSubject<any>(null);
    }


    if (this.localStorage.get('specialOfferData')) {
      this.SpecialOfferData = new BehaviorSubject<any>(true);
    } else {
      this.SpecialOfferData = new BehaviorSubject<any>(false);
    }

    if (this.localStorage.get('thankyouData')) {
      this.thankyouData = new BehaviorSubject<any>(null);
    } else {
      this.thankyouData = new BehaviorSubject<any>(null);
    }



    if (this.localStorage.get('selectedAddress')) {
      this.selectedAddress = new BehaviorSubject<any>(null);
    } else {
      this.selectedAddress = new BehaviorSubject<any>(null);
    }

    if (this.localStorage.get('dineinExist')) {
      this.dineinExist = new BehaviorSubject<any>(null);
    } else {
      this.dineinExist = new BehaviorSubject<any>(null);
    }

    // this.TotalCountData = new BehaviorSubject<any>(0);
  }
  isQuantity(): Observable<boolean> {
    return this.isCartQuantity.asObservable();
  }
  updateQuantity(value: boolean) {
    this.isCartQuantity.next(value);
  }
  getAddOnObj(): Observable<any> {
    return this.selectedAddOnObj.asObservable();
  }
  setAddOn(obj: any) {
    this.selectedAddOnObj.next(obj);
  }
  getLocationDetails(): Observable<any> {
    return this.locationDetails.asObservable();
  }
  setLocationDetails(data: any) {
    this.locationDetails.next(data);
  }
  getIsCheckoutWithoutLogin(): Observable<boolean> {
    return this.isCheckoutWithoutLogin.asObservable();
  }
  setIsCheckout(value: boolean) {
    this.isCheckoutWithoutLogin.next(value);
  }
  isAddressSelected(): Observable<any> {
    return this.isAddressSelectedResp.asObservable();
  }
  onSelectAddressResp(value: any) {
    this.isAddressSelectedResp.next(value);
  }
  getOrderPlacedStatus(): Observable<any> {
    return this.isOrderPlaced.asObservable();
  }
  setOrderPlaced(flag: any) {
    this.isOrderPlaced.next(flag);
  }


  getTotalCount(): Observable<any> {
    return this.TotalCountData.asObservable();
  }
  setTotalCount(obj: any) {
    this.TotalCountData.next(obj);
  }

  

  getCartTotalA(): Observable<any> {
    return this.getCartTotal.asObservable();
  }
  setCartTotalA(obj: any) {
    this.getCartTotal.next(obj);
  }
  getEditAddress(): Observable<any> {
    return this.getEditAddresses.asObservable();
  }
  setEditAddress(obj: any) {
    this.getEditAddresses.next(obj);
  }

  getSpecialOffer(): Observable<boolean> {
    return this.SpecialOfferData.asObservable();
  }
  setSpecialOffer(value: boolean) {
    this.SpecialOfferData.next(value);
  }

  getthankyouData(): Observable<any> {
    return this.thankyouData.asObservable();
  }
  setthankyouData(value: any) {
    this.thankyouData.next(value);
  }

  getSelectedAddrssData(): Observable<any> {
    return this.selectedAddress.asObservable();
  }
  setSelectedAddrssData(value: any) {
    this.selectedAddress.next(value);
  }

  getdinein(): Observable<any> {
    return this.dineinExist.asObservable();
  }
  setdinein(value: any) {
    this.dineinExist.next(value);
  }

}
