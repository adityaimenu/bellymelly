import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from "../../../services/common/common.service";
import { LocalStorageService } from 'angular-web-storage';
import { ObservableService } from 'src/app/services/observable-service/observable.service';

import { Router } from '@angular/router';
import * as js from '../../../../assets/js/custom';
import * as _ from 'lodash';
@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent implements OnInit {

  currency: string;
  timeInterval: any;
  mobUrl: string;
  country: string;
  orderId: string;
  orderData:any;
  locationDetails:any;

  host:string;
  constructor(
    private common: CommonService,
    private localStorage: LocalStorageService,
    private observable: ObservableService,
    private router: Router
  ) { }

  ngOnInit() {
    this.country = window.location.pathname.replace('/', '').split('/')[0]; 
    if(this.country == 'au'){
      this.host = 'https://bellymelly.com.au';
    } else if(this.country == 'us'){
      this.host = 'https://bellymelly.com';
    }
    this.mobUrl = window.location.pathname.replace('/', '').split('/')[1]; // Without hasing
    this.observable.getthankyouData().subscribe((response: any) => {
      if (response) {
        this.orderId = response.orderId;
        this.orderData = response.data;
        this.locationDetails = response.locationDetails;
        response.data.ItemList.forEach(element => {
          element.id = element.Id;
          element.name = element.Name;
          element.brand = this.mobUrl;
          element.category = element.catName;
          if(element.ItemAddOnList.length > 0){
            const variant =[]
            element.ItemAddOnList.forEach(ele => {
              variant.push(ele.Name)
            });
            element.variant = variant.toString();
          }else{
            element.variant = '';
          }
         
          element.quantity = element.Qty;
          element.price = element.UnitPrice;
          delete element.Name
          delete element.Id
          delete element.PortionId
          delete element.UnitPrice
          delete element.Qty
          delete element.Amt
          delete element.SpecialInstructions
          delete element.NameOfThePerson
          delete element.ItemAddOnList
          delete element.isShowforSuggestion
          delete element.ItemModList
          delete element.max
        });
     
      js.transactionData(response.orderId, this.mobUrl, 'USD', (response.data.TotalAmt).toFixed(2), response.data.TaxAmt.toFixed(2), response.data.donateValSelected?response.data.donateValSelected:0, response.data.ItemList,this.orderData)
    return
    } else {
        if(window.location.hostname == 'localhost'){
          this.router.navigateByUrl(`${this.country}/${this.mobUrl}/checkout`); //testing
        }else{
          this.router.navigateByUrl(`${this.mobUrl}/thankyou`);
        }
      }
    })

    this.common.getCountryInd().subscribe((isIndia: boolean) => {
      if (isIndia) {
        this.currency = this.common.currencyInd;
      } else {
        this.currency = this.common.currencyUs;
      }
    });
    document.getElementById('openOrderSuccess').click();
  }


}
