import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as js from '../../../../assets/js/custom';
import { UrlService } from "../../../services/url/url.service";
import * as _ from 'lodash';
import { LocalStorageService } from "angular-web-storage";
import { ModalComponent } from "./modal/modal.component";
import { ObservableService } from "../../../services/observable-service/observable.service";
import { CommonService } from "../../../services/common/common.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrManager } from 'ng6-toastr-notifications';
declare var $: any;
@Component({
  selector: 'app-dish-items',
  templateUrl: './dish-items.component.html',
  styles: [`
    :host {
      display: block;
      padding-bottom: 5rem;
    }
  `],
  styleUrls: ['./dish-items.component.scss'],

})
export class DishItemsComponent implements OnInit {
  @Input() public itemList: any[] = [];
  @Output() getCartList = new EventEmitter();
  cartTotalCountValData: number;
  imageUrl: string;
  cartList: any[] = [];
  addOnList: any[] = [];
  itemName: any;
  selectedItem: any;
  type: number;
  addOnItemList: any[] = [];
  currency: string;
  country: string;
  specialOfferData = [];
  prodictPrice: number;
  specialOfferDataExist: boolean = false;
  @ViewChild(ModalComponent, { static: false }) public modal: ModalComponent;
  mobUrl: string

  constructor(
    private url: UrlService,
    private localStorage: LocalStorageService,
    private observable: ObservableService,
    private common: CommonService,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrManager,
  ) { }

  ngOnInit() {
    this.mobUrl = window.location.pathname.replace('/', '').split('/')[1]; // Without hasing
    this.observable.getTotalCount().subscribe((response: any) => {
      this.cartTotalCountValData = response;

    })

    this.common.getCountryInd().subscribe((isIndia: boolean) => {

      if (isIndia) {
        this.currency = this.common.currencyInd;
      } else {
        this.currency = this.common.currencyUs;
      }
    });
    this.activatedRoute.params.subscribe((params: any) => {

      this.country = window.location.pathname.replace('/', '').split('/')[0]; // Without hashing

    });
    this.imageUrl = this.url.imageUrl;
    js.fancyBox();
    js.tooltip();
    js.popover();
    if (this.localStorage.get('specialOfferData')) {
      this.specialOfferData = this.localStorage.get('specialOfferData')
    } else {
      this.specialOfferData = [];
    }

  }
  addQuantity(product, i) {
    js.addToCart(product.Name, product.Id, product.P1, this.mobUrl, this.itemList[i].CatName, [], 1);
    if (product.P1 == '-99') {
      this.prodictPrice = 0;
    } else {
      this.prodictPrice = product.P1;
    }
    if (product.SpecialOffer) {
      this.observable.getSpecialOffer().subscribe((response: any) => {
        if (response == true) {
          return this.specialOfferDataExist = true;
        } else {
          return this.specialOfferDataExist = false;
        }
      })
      if (this.specialOfferDataExist == true) return this.error('Only one Item allowed from this category.');
    }



    if (this.localStorage.get('cartItem')) this.cartList = this.localStorage.get('cartItem');
    if (Number(product.addQuantity) >= Number(product.MaxQ)) return;
    product.addQuantity = product.addQuantity + 1;
    product.isAdded = true;
    const index = _.findIndex(this.cartList, { Id: product.Id });
    if (index == -1) this.cartList.push({ Id: product.Id, isShowforSuggestion: product.isShowforSuggestion, P1: this.prodictPrice, portionId: this.itemList[i].P1.Id, addQuantity: product.addQuantity, catId: this.itemList[i].CatId,catName:this.itemList[i].CatName, Name: product.Name, price: product.P1, ItemAddOnList: [], instr: '', specialOffer: product.SpecialOffer, addedItems: 0, max: Number(product.MaxQ) });
    else {
      this.cartList[index].P1 = this.prodictPrice * product.addQuantity;
      this.cartList[index].addQuantity = product.addQuantity;
      if (this.cartList[index].ItemAddOnList.length) {
        let amt = 0;
        this.cartList[index].ItemAddOnList.forEach(ele => {
          amt += _.sumBy(ele.AddOnOptions, 'Amt');
        });
        this.cartList[index].P1 += amt * product.addQuantity;
      }
    }

    this.observable.setTotalCount(this.cartTotalCountValData)
    this.getCartList.emit(this.cartList);
    this.observable.setCartTotalA(_.sumBy(this.cartList, 'P1'))
  }
  removeQuantity(product,i) {
    if (product.SpecialOffer) {
      this.observable.setSpecialOffer(false)
      this.localStorage.set('specialOfferData', null)
    }
    // if(product.SpecialOffer){
    //   // const index1 = _.findIndex(this.specialOfferData, {Id: product.SpecialOffer.Id});
    //   this.specialOfferData = [];
    // }

    if (this.localStorage.get('cartItem')) this.cartList = this.localStorage.get('cartItem');


    if (product.addQuantity <= 1) {
      js.removeFromCart(product.Name, product.Id, product.P1, this.mobUrl, this.itemList[i].CatName, [], 1);
      product.addQuantity = 0;
      product.isAdded = false;
      const index = _.findIndex(this.cartList, { Id: product.Id });
      this.cartList.splice(index, 1);
      this.observable.updateQuantity(false);
      this.observable.setTotalCount(this.cartTotalCountValData)
      this.getCartList.emit(this.cartList);
      this.observable.setCartTotalA(_.sumBy(this.cartList, 'P1'))
    } else {
      product.addQuantity = product.addQuantity - 1;
      product.isAdded = true;
      const index = _.findIndex(this.cartList, { Id: product.Id });
      let amt = 0;
      if (this.cartList[index].ItemAddOnList.length) {
        this.cartList[index].ItemAddOnList.forEach(ele => {
          amt += _.sumBy(ele.AddOnOptions, 'Amt');
        });
      }
      this.cartList[index].P1 = (product.P1 + amt) * product.addQuantity;
      this.cartList[index].addQuantity = product.addQuantity;
      // this.observable.setTotalCount(this.cartTotalCountValData)
      this.getCartList.emit(this.cartList);
      this.observable.setCartTotalA(_.sumBy(this.cartList, 'P1'))
    }

  }
  getAddOns(data) {
    const id = data.price.id;
    const list = data.list;
    let amt = 0;
    if (list.length) {
      list.forEach(ele => {
        amt += _.sumBy(ele.AddOnOptions, 'Amt');
      });
    }
    const a = [];
    this.itemName.addQuantity = data.qty;
    this.itemName.addedItems += 1;
    if (this.localStorage.get('cartItem')) this.cartList = this.localStorage.get('cartItem');
    const i = _.findIndex(this.cartList, { Id: this.itemName.Id });
    if (i > -1) this.cartList[i].addedItems += 1;
    const datacart = { Id: this.itemName.Id, isShowforSuggestion: data.isShowforSuggestion, P1: (this.itemName[data.price.key.toUpperCase()] + amt) * data.qty, portionId: id, catId: data.catId, addQuantity: data.qty, Name: this.itemName.Name, price: this.itemName[data.price.key.toUpperCase()], ItemAddOnList: list, instr: data.instr, specialOffer: data.specialOffer, addedItems: this.itemName.addedItems, max: data.max };
    var catName = _.find(this.itemList, function (o) { return o.CatId == datacart.catId; });

    const variant = [];
    datacart.ItemAddOnList.forEach(element => {
      variant.push(element.Name)
    });

    js.addToCart(datacart.Name, datacart.Id, datacart.price, this.mobUrl, catName.CatName, variant.length > 0 ? variant:[], datacart.addQuantity);
    this.cartList.push({ Id: this.itemName.Id, isShowforSuggestion: data.isShowforSuggestion, P1: (this.itemName[data.price.key.toUpperCase()] + amt) * data.qty, portionId: id, catId: data.catId,catName:catName.CatName, addQuantity: data.qty, Name: this.itemName.Name, price: this.itemName[data.price.key.toUpperCase()], ItemAddOnList: list, instr: data.instr, specialOffer: data.specialOffer, addedItems: this.itemName.addedItems, max: data.max });
    this.getCartList.emit(this.cartList);
  }
  testRun() {
  }
  onAddItem(item, data) {
    this.addOnList = item.AddOnList;

    this.itemName = item;
    if (item.SpecialOffer) {
      this.observable.getSpecialOffer().subscribe((response: any) => {
        if (response == true) {
          return this.specialOfferDataExist = true;
        } else {
          return this.specialOfferDataExist = false;
        }
      })
      if (this.specialOfferDataExist == true) return this.error('Only one Item allowed from this category.');
    }

    this.itemName = [this.itemName]
    // if(item.SpecialOffer){

    // }
    this.itemName.forEach(element => {
      if (element.SpecialOffer) {
        element.P1 = 0;
      }

    });
    this.itemName = this.itemName[0]
    this.type = 0;
    this.selectedItem = data;
    this.addOnItemList = [];
    this.observable.setAddOn(item);
    setTimeout(() => {
      this.modal.onCloseAddOnModal();
      js.openFancyBox();
      if (item.P1 != -99) {
        $('#clickFirstSizeP1').trigger('click');
      } else if (item.P2 != -99) {
        $('#clickFirstSizeP2').trigger('click');
      }
      else if (item.P3 != -99) {
        $('#clickFirstSizeP3').trigger('click');
      }
      else if (item.P4 != -99) {
        $('#clickFirstSizeP4').trigger('click');
      }
      else if (item.P5 != -99) {
        $('#clickFirstSizeP5').trigger('click');
      }
      else if (item.P6 != -99) {
        $('#clickFirstSizeP6').trigger('click');
      }

    }, 200);

  }

  correctDesc(val) {
    var a = val.replace("â", "'")
    return a;
  }

  error = (message: string) => {
    this.toaster.errorToastr(message);
  }


}
