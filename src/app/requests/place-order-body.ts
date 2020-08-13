class ItemList {
  Id: number;
  PortionId: number;
  UnitPrice: number;
  Qty: number;
  Amt: number;
  SpecialInstructions: string;
  categoryId: number;
  ItemAddOnList: any;
  ItemModList: any;
}
export class OrderDataDetail {
  PlaceOrder: string;
  isPrinterMsgOk: string;
  LocationId: number;
  MenuId: number;
  Status: number;
  CustId: number;
  CreatedOn: string;
  PreTaxAmt: number;
  DiscountAmt: any = null;
  DiscountType: any = null;
  Discount1Amt: any = null;
  Discount1Type: any = null;
  CouponAmt: any = null;
  CustCouponId: any = null;
  CouponType: any = null;
  RestChainCouponId: any = null;
  TaxAmt: number;
  DelzoneInd: number;
  SrvcFee: number;
  TipAmt: number;
  TotalAmt: number;
  deliveryCharges:number;
  PaymentTypeId: number;
  MercuryPaymentId: any = null;
  PaypalSecureToken: any = null;
  PaypalPayerId: any = null;
  HAInfo: any = null;
  CCInfo: any = {};
  ServiceId: number;
  DeliveryInfo: any;
  TimeSelection: number=0;
  DueOn: any;
  SpecialInstructions: string;
  OldOrderId: any;
  utm_source: string;
  ItemList: any;
  RestChainId: number;
  NGOId:string;
  DonateCode:string;
  DonateValue:number;
  NGOName:string;
  donateValueWithPrcent:number;
  tipvalueSelected:number;
  donateValSelected:number;
  ngoSelectedVal:string;
  StripeToken:string;
  carmake:string;
  carmodel:string;
  carcolor:string;
  carplatenumber:string;
  DineInTableNum:string;
}
class OrderData {
  orderData: OrderDataDetail;
}
export class PlaceOrderBody {
  tId: string;
  data: OrderData;
}
