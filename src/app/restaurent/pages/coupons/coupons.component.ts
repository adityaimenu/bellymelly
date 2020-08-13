import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CouponList} from "../../../models/coupon-list";
import {PlaceOrderBody} from "../../../requests/place-order-body";
import {LocalStorageService} from "angular-web-storage";
import {ApiService} from "../../../services/api/api.service";
import {ToastrManager} from "ng6-toastr-notifications";
import {CommonService} from "../../../services/common/common.service";
declare var $: any;

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {
  @Input() public couponList: Array<CouponList> = [];
  @Input() public getLocation: any;
  @Input() public Discounts: any;
  
  @Output() public isPromoApplied = new EventEmitter();
  placeOrderBody = new PlaceOrderBody();
  locationDetails: any;
  currency: string;

  constructor(
    public localStorage: LocalStorageService,
    private api: ApiService,
    private toaster: ToastrManager,
    private common: CommonService
  ) { }

  ngOnInit() {
    this.common.getCountryInd().subscribe((isIndia: boolean) => {
      if (isIndia) {
        this.currency = this.common.currencyInd;
      } else {
        this.currency = this.common.currencyUs;
      }
    });
    this.locationDetails = this.localStorage.get('BM_LocationDetail');
  }
  applyCoupon(coupon: any, type) {
    this.placeOrderBody = this.localStorage.get('placeOrderData');
    if (type == 1 && this.placeOrderBody.data.orderData.ServiceId != coupon.Service.ServiceId) return this.error(`Available only for ${coupon.Service.ServiceName} options.`);
    let minAmount;
    let Discount;
    if (type == 0) {
      minAmount = coupon.MinOrderAmt;
      Discount = coupon.Discount;
    } else {
      minAmount = coupon.MinAmt;
      Discount = coupon.Disc;
    }
    if (Number(this.placeOrderBody.data.orderData.PreTaxAmt) < Number(minAmount)) return this.error(`Amount should be greater than from ${minAmount} to use this coupon.`);
    let discount;
    if (coupon.Type == '%') {
      if (coupon.PreTax == 'T') discount = this.placeOrderBody.data.orderData.PreTaxAmt * Discount;
      else discount = this.placeOrderBody.data.orderData.TotalAmt * Discount;
      if (coupon.MaxCap > 0 && Math.round(discount) > coupon.MaxCap) discount = coupon.MaxCap;
      discount = Number(discount.toFixed(2))
    } else {
      discount = Discount;
      if (coupon.MaxCap > 0 && Math.round(discount) > coupon.MaxCap) discount = coupon.MaxCap;
      discount = Number(discount.toFixed(2))
    }
    if (coupon.PreTax == 'T') {
      if (type == 0)  {
        this.placeOrderBody.data.orderData.CouponType = 0;
        if (discount > this.placeOrderBody.data.orderData.PreTaxAmt) {
          this.placeOrderBody.data.orderData.PreTaxAmt = 0;
        } else {
          const amount = this.placeOrderBody.data.orderData.PreTaxAmt - discount;
          this.placeOrderBody.data.orderData.TaxAmt = amount * this.locationDetails.Tax;
          this.placeOrderBody.data.orderData.TotalAmt = amount + this.placeOrderBody.data.orderData.TaxAmt;
        }
      } else {
        if (discount > this.placeOrderBody.data.orderData.PreTaxAmt) {
          this.placeOrderBody.data.orderData.PreTaxAmt = 0;
        } else {
          const amount = this.placeOrderBody.data.orderData.PreTaxAmt - discount;
          this.placeOrderBody.data.orderData.TaxAmt = amount * this.locationDetails.Tax;
          this.placeOrderBody.data.orderData.TotalAmt = amount + this.placeOrderBody.data.orderData.TaxAmt;
        }
      }
    } else {
      if (type == 0) {
        this.placeOrderBody.data.orderData.CouponType = 1;
        if (discount > this.placeOrderBody.data.orderData.TotalAmt) {
          this.placeOrderBody.data.orderData.TotalAmt = 0;
        } else {
          this.placeOrderBody.data.orderData.TotalAmt = this.placeOrderBody.data.orderData.TotalAmt - discount;
        }
      } else {
        if (discount > this.placeOrderBody.data.orderData.TotalAmt) {
          this.placeOrderBody.data.orderData.TotalAmt = 0;
        } else {
          this.placeOrderBody.data.orderData.TotalAmt = this.placeOrderBody.data.orderData.TotalAmt - discount;
        }
      }
    }
    if (type == 0) {
      this.placeOrderBody.data.orderData.CouponAmt = discount;
      coupon.discountType = 0;
      coupon.finalName = coupon.CouponCode;
      if (coupon.CType == 'Specific') this.placeOrderBody.data.orderData.CustCouponId = coupon.CustCouponId;
      if (coupon.CType == 'Generic') this.placeOrderBody.data.orderData.RestChainCouponId = coupon.Id;
    } else {
      this.placeOrderBody.data.orderData.DiscountAmt = discount;
      this.placeOrderBody.data.orderData.DiscountType = coupon.Id;
      coupon.finalName = coupon.Description;
      coupon.discountType = 1;
    }
    coupon.finalDiscount = discount;
    this.localStorage.set('selectedCouponBM', coupon);
    this.localStorage.set('placeOrderData', this.placeOrderBody);
    this.isPromoApplied.emit(this.placeOrderBody);
    document.getElementById('closeCouponModal').click();
  }
  applyDiscount(discount) {
    this.placeOrderBody = this.localStorage.get('placeOrderData');
    if (this.placeOrderBody.data.orderData.ServiceId != discount.Service.ServiceId) return this.error(`Available only for ${discount.Service.ServiceName} options.`);
    this.toaster.successToastr('Not Completed, Working on it.');
  }
  error = (message: string) => {
    this.toaster.errorToastr(message);
  }

}
