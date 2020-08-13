import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as js from '../../../../../assets/js/custom';
declare var $: any;
import * as _ from 'lodash';
import { ToastrManager } from "ng6-toastr-notifications";
import { ObservableService } from "../../../../services/observable-service/observable.service";
import { CommonService } from "../../../../services/common/common.service";
import { Alert } from "selenium-webdriver";
import { resetFakeAsyncZone } from '@angular/core/testing';
import { element } from 'protractor';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() public addOnList: any[] = [];
  @Input() public itemName: any;
  @Input() public item: any;
  @Input() public type: any;
  @Input() public country: string;
  @Input() public addOnItemList: any[] = [];
  @Output() getAddOnItems = new EventEmitter();
  @Output() addQuantity = new EventEmitter();
  @Output() removeQuantity = new EventEmitter();
  idCount = 0;
  Math = Math;
  selectedObj: any;
  addOnBody: any;
  quantity = 1;
  prices = {
    p1: false,
    p2: false,
    p3: false,
    p4: false,
    p5: false,
    p6: false
  };
  displayAmount = 0;
  unitPrice: number;
  portionId: number;
  specialInstr = '';
  checkAmount = 0;
  minMaxCheck:boolean=false;
  requiredAddOn: Array<any> = [];
  currency = '';
  flags = {
    isValidate: false,
    validateArray: [],
    isSizeSelected: false
  };

  constructor(
    private toaster: ToastrManager,
    private observable: ObservableService,
    private common: CommonService
  ) { }

  ngOnInit() {
    this.country = window.location.pathname.replace('/', '').split('/')[0]; 
    this.common.getCountryInd().subscribe((isIndia: boolean) => {
      if (isIndia) {
        this.currency = this.common.currencyInd;
      } else {
        this.currency = this.common.currencyUs;
      }
    });
    this.addOnBody = { price: { name: '', id: 0, key: '' }, qty: 1, max: 0, catId: 0, instr: this.specialInstr };
    js.checked();
    this.observable.isQuantity().subscribe((result: boolean) => {
      if (!result) this.displayAmount = 0;
    });
    this.observable.getAddOnObj().subscribe((result: any) => {
      if (result && result.AddOnList.length) {
        this.requiredAddOn = [];
        this.selectedObj = result;
        this.quantity = 1;
        result.AddOnList.forEach(ele => {
          if (ele.Reqd == 'T') this.requiredAddOn.push(ele.ItemAddOnId);
          if (ele.AddOnOptions.length) {
            ele.AddOnOptions.forEach(element => {
              element.isSelected = false;
            });
          }
        });
      }
    });
 
  }
  addToBag() {

    if (this.addOnBody.price.id <= 0) return this.error('Please choose a size first.');
    const tempArray = [];
    if (this.itemName.AddOnList.length) {
      this.itemName.AddOnList.forEach(ele => {
        if (ele.Reqd == 'T') tempArray.push(ele.ItemAddOnId);
      });
    }
    let newTempArr = [];
    if (tempArray.length) {
      tempArray.forEach(ele => {
        const index = _.findIndex(this.addOnItemList, { ItemAddOnId: ele });
        if (index == -1) newTempArr.push(ele);
      });
      if (newTempArr.length) return this.error('Please choose required add-on item first.');
      newTempArr = [];
      this.addOnItemList.forEach(ele => {
        if (!ele.AddOnOptions.length) newTempArr.push(ele);
      });
    }
    if (newTempArr.length) return this.error('Please choose required add-on item first.');
    var checForlenth = []
    var checForlenthMin=[];
    this.addOnItemList.forEach(element => {
      if (element.Max < element.AddOnOptions.length) {
        checForlenth.push({ element: element.Max, name: element.Name })
      }
      if (element.Min > element.AddOnOptions.length) {
        checForlenthMin.push({ element: element.Min, name: element.Name })
      }
    });

    if (checForlenth.length) {
      return this.error(`You can only choose a maximum of ${checForlenth[0].element} options for ${checForlenth[0].name}`);
    }else if (checForlenthMin.length){
      return this.error(`You can only choose a minimum of ${checForlenthMin[0].element} options for ${checForlenthMin[0].name}`);
    }else{
      if (!checForlenth.length) {
        this.addOnBody.list = this.addOnItemList;
        this.addOnBody.specialOffer = this.itemName.SpecialOffer;
        this.addOnBody.instr = this.specialInstr;
        this.addOnBody.max = this.itemName.MaxQ;
        this.addOnBody.isShowforSuggestion = this.itemName.isShowforSuggestion;
        this.addOnBody.catId = this.item.CatId;
        this.addOnBody.qty = this.quantity;
  
        this.getAddOnItems.emit(this.addOnBody);
 
        this.quantity = 1;
        this.displayAmount = 0;
        this.requiredAddOn = [];
        this.flags.validateArray = [];
        this.flags.isSizeSelected = false;
        this.addOnBody = { price: { name: '', id: 0 } };
        this.specialInstr = '';
        $.fancybox.close();
        $('input.custom-control-input').prop('checked', false);
        js.resetAddOnAll();
        for (const key in this.prices) {
          this.prices[key] = false;
        }
      }else {
        return this.error(`You can only choose a maximum of ${checForlenth[0].element} options for ${checForlenth[0].name}`);
      }
    }

  

  }
  onChangePrice(val, price) {
   
    $('.custom-control-input').prop("checked", false);

    this.addOnItemList = [];
    this.displayAmount = price;
    this.flags.isSizeSelected = true;
    js.resetAddOn();
    for (const key in this.prices) {

      if (key.toString() == val) {
        this.addOnBody.price.name = this.item[key.toUpperCase()].Name;
        this.addOnBody.price.id = this.item[key.toUpperCase()].Id;
        this.addOnBody.price.key = key;
        this.prices[key] = true;
      } else this.prices[key] = false;
    }

  }
  onSelectAddOnByCheck(item, option) {
    if (!this.prices.p1 && !this.prices.p2 && !this.prices.p3 && !this.prices.p4 && !this.prices.p5 && !this.prices.p6) return this.error('Please select a size first.');
    const i = this.requiredAddOn.indexOf(item.ItemAddOnId);
    if (i > -1) {
      const newInd = this.flags.validateArray.indexOf(item.ItemAddOnId);
      if (newInd == -1) this.flags.validateArray.push(item.ItemAddOnId);
    }
    const index = _.findIndex(this.addOnItemList, { ItemAddOnId: item.ItemAddOnId });
    if (index > -1){
      var day = _.find(this.addOnItemList, { ItemAddOnId: item.ItemAddOnId });
      this.displayAmount = this.displayAmount - day.AddOnOptions[0].UnitPrice;
      this.addOnItemList.splice(index, 1);
    } 
    for (const key in this.prices) {
      if (this.prices[key]) {
        this.portionId = this.item[key.toUpperCase()].ItemAddOnId;
        if (option[key.toUpperCase()] > 0) {
          this.unitPrice = option[key.toUpperCase()];
        } else {
          this.unitPrice = 0;
        }
      }
    }
  
    this.displayAmount += this.unitPrice;
    this.addOnItemList.push({
      ItemAddOnId: item.ItemAddOnId,
      Name: item.Name,
      AddOnOptions: [
        {
          AddOnOptionModifier1: null,
          AddOnOptionModifier2: null,
          Amt: this.unitPrice,
          Dflt: null,
          DisplayType: null,
          Id: option.Id,
          isSelected: true,
          Name: option.Name,
          PortionId: this.portionId,
          Qty: '1',
          UnitPrice: this.unitPrice
        }
      ]
    });
  }
  onSelectAddOn(item, option, flag) {
 
    if (!this.prices.p1 && !this.prices.p2 && !this.prices.p3 && !this.prices.p4 && !this.prices.p5 && !this.prices.p6) return this.error('Please select a size first.');
    for (const key in this.prices) {
      if (this.prices[key]) {
        this.portionId = this.item[key.toUpperCase()].Id;
        if (option[key.toUpperCase()] > 0) {
          this.unitPrice = option[key.toUpperCase()];
        } else {
          this.unitPrice = 0;
        }
      }
    }
    if (flag) {
      option.isSelected = true;
      if (this.requiredAddOn.indexOf(item.ItemAddOnId) > -1) {
        if (this.flags.validateArray.indexOf(item.ItemAddOnId) == -1) {
          this.flags.validateArray.push(item.ItemAddOnId);
        }
      }
      let modifierOne = null, modifierTwo = null;
      if (item.AddOnOptionModifier1 && item.AddOnOptionModifier1.Id == 10) modifierOne = item.AddOnOptionModifier1;
      else modifierTwo = item.AddOnOptionModifier1;
      if (item.AddOnOptionModifier2 && item.AddOnOptionModifier2.Id == 11) modifierTwo = item.AddOnOptionModifier2;
      else modifierOne = item.AddOnOptionModifier2;
      const amount = this.country.toUpperCase() == 'US' || 'AU' ? modifierOne ? modifierOne.Factor1 : this.unitPrice : this.unitPrice;
      this.displayAmount += amount;
      const index = _.findIndex(this.addOnItemList, { ItemAddOnId: item.ItemAddOnId });
      if (index > -1) {
        this.addOnItemList[index].AddOnOptions.push({
          Amt: amount,
          Dflt: null,
          DisplayType: null,
          Id: option.Id,
          isSelected: true,
          Name: option.Name,
          PortionId: this.portionId,
          Qty: '1',
          UnitPrice: this.unitPrice,
          AddOnOptionModifier1: this.country.toUpperCase() == 'US' || 'AU' ? item.AddOnOptionModifier1 ? { Label: item.AddOnOptionModifier1.Label1, Text: item.AddOnOptionModifier1.Id, Factor: item.AddOnOptionModifier1.Factor1 } : null : null,
          AddOnOptionModifier2: this.country.toUpperCase() == 'US' || 'AU' ? item.AddOnOptionModifier2 ? { Label: item.AddOnOptionModifier2.Label1, Text: item.AddOnOptionModifier2.Id, Factor: item.AddOnOptionModifier2.Factor1 } : null : null
        });
      } else {

        this.addOnItemList.push({
          ItemAddOnId: item.ItemAddOnId,
          Name: item.Name,
          Min:item.Min?item.Min:0,
          Max:item.Max?item.Max:0,
          AddOnOptions: [
            {
              Amt: amount,
              Dflt: null,
              DisplayType: null,
              Id: option.Id,
             
              isSelected: true,
              Name: option.Name,
              PortionId: this.portionId,
              Qty: '1',
              UnitPrice: this.unitPrice,
              AddOnOptionModifier1: this.country.toUpperCase() == 'US' || 'AU' ? item.AddOnOptionModifier1 ? { Label: item.AddOnOptionModifier1.Label1, Text: item.AddOnOptionModifier1.Id, Factor: item.AddOnOptionModifier1.Factor1 } : null : null,
              AddOnOptionModifier2: this.country.toUpperCase() == 'US' || 'AU' ? item.AddOnOptionModifier2 ? { Label: item.AddOnOptionModifier2.Label1, Text: item.AddOnOptionModifier2.Id, Factor: item.AddOnOptionModifier2.Factor1 } : null : null
            }
          ]
        });
      }
    }
     else {
      option.isSelected = false;
      if (this.flags.validateArray.indexOf(item.ItemAddOnId) > -1) this.flags.validateArray.splice(this.flags.validateArray.indexOf(item.ItemAddOnId), 1);
      const index = _.find(this.addOnItemList, { ItemAddOnId: item.ItemAddOnId });
      const ind = _.findIndex(this.addOnItemList, { ItemAddOnId: item.ItemAddOnId });
      let amount = 0;
      let isLength = false;
      let finalIndex;
      if (index) {
        this.addOnItemList.forEach((ele) => {
          if (ele.AddOnOptions.length) {
            isLength = true;
            ele.AddOnOptions.forEach((element, i) => {
              if (Number(element.Id) == Number(option.Id)) {
                finalIndex = i;
                amount += element.Amt;
              }
            })
          }
        });
        this.displayAmount = this.displayAmount - amount;
        if (!isLength){
          this.addOnItemList.splice(index, 1);
        } else{
          this.addOnItemList[ind].AddOnOptions.splice(finalIndex, 1);
          if(this.addOnItemList[ind].AddOnOptions.length == 0){
            this.addOnItemList.splice(ind,1)
          }
        }
      }
    }
  }
  onChangeModifier(item, option, label, id, factor, type) {
    const index = _.findIndex(this.addOnItemList, { ItemAddOnId: item.ItemAddOnId });
    if (type) {
      if (index > -1) {
        const optionIndex = _.findIndex(this.addOnItemList[index].AddOnOptions, { Id: option.Id });
        this.displayAmount = Number(this.displayAmount) - (Number(this.addOnItemList[index].AddOnOptions[optionIndex].Amt) * Number(this.addOnItemList[index].AddOnOptions[optionIndex].Amt * this.addOnItemList[index].AddOnOptions[optionIndex].AddOnOptionModifier2 ? this.addOnItemList[index].AddOnOptions[optionIndex].AddOnOptionModifier2.Factor : 1));
        this.addOnItemList[index].AddOnOptions[optionIndex].Amt = Number(factor) * Number(option.P1);
        this.addOnItemList[index].AddOnOptions[optionIndex].AddOnOptionModifier1 = { Label: label, Text: id, Factor: factor };
        this.displayAmount = Number(this.displayAmount) + Number(this.addOnItemList[index].AddOnOptions[optionIndex].Amt);
      }
    } else {
      if (index > -1) {
        const optionIndex = _.findIndex(this.addOnItemList[index].AddOnOptions, { Id: option.Id });
        this.displayAmount = Number(this.displayAmount) - Number(this.addOnItemList[index].AddOnOptions[optionIndex].Amt) * Number(option.P1);
        this.addOnItemList[index].AddOnOptions[optionIndex].Amt = Number(this.addOnItemList[index].AddOnOptions[optionIndex].AddOnOptionModifier1.Factor) * Number(factor);
        this.displayAmount = Number(this.displayAmount) + Number(this.addOnItemList[index].AddOnOptions[optionIndex].Amt);
        this.addOnItemList[index].AddOnOptions[optionIndex].AddOnOptionModifier2 = { Label: label, Text: id, Factor: factor };
      }
    }
  }
  getIdForChk() {
    return `chk-${this.idCount + 1}`;
  }
  onCloseAddOnModal() {
    const flag = this;
  
    // $('#animatedModal .fancybox-button.fancybox-close-small').click(function () {
    //   flag.addOnItemList = [];
    //   flag.prices['p1'] = false;
    //   flag.prices['p2'] = false;
    //   flag.prices['p3'] = false;
    //   flag.prices['p4'] = false;
    //   flag.prices['p5'] = false;
    //   flag.prices['p6'] = false;
    //   flag.displayAmount = 0;
    //   flag.flags.isSizeSelected = false;
    //   flag.flags.validateArray = [];
    //   flag.addOnBody.price.id = '';
    //   flag.unitPrice = 0;
    //   flag.quantity = 1;
    //   flag.specialInstr = '';
    //   $('nb-radio label input').prop('checked', false);
    //   $('input.custom-control-input').prop('checked', false);
    // });

    flag.addOnItemList = [];
    flag.prices['p1'] = false;
    flag.prices['p2'] = false;
    flag.prices['p3'] = false;
    flag.prices['p4'] = false;
    flag.prices['p5'] = false;
    flag.prices['p6'] = false;
    flag.displayAmount = 0;
    flag.flags.isSizeSelected = false;
    flag.flags.validateArray = [];
    flag.addOnBody.price.id = '';
    flag.unitPrice = 0;
    flag.quantity = 1;
    flag.specialInstr = '';
    // $('nb-radio label input').prop('checked', false);
    $('input.custom-control-input').prop('checked', false);
  }
  updateQuantity(flag) {
    if (flag) {
      if (this.quantity >= this.itemName.MaxQ) return;
      this.quantity++;
    } else {
      if (this.quantity <= 1) return;
      this.quantity--;
    }
  }
  error = (message: string) => {
    this.toaster.errorToastr(message);
  }

  
}
