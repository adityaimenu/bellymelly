import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "../../../services/common/common.service";
import { LocalStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit {
  @Input() orderId: string;
  @Input() locationDetail: any;
  @Input() orderData: any;
  currency: string;
  timeInterval: any;
  mobUrl: string;
  country: string;
  host:string;
  constructor(
    private common: CommonService,
    private localStorage : LocalStorageService
  ) { }

  ngOnInit() {
    this.country = window.location.pathname.replace('/', '').split('/')[0]; 
    if(this.country == 'au'){
      this.host = 'https://bellymelly.com.au';
    } else if(this.country == 'us'){
      this.host = 'https://bellymelly.com';
    }
    this.common.getCountryInd().subscribe((isIndia: boolean) => {
      if (isIndia) {
        this.currency = this.common.currencyInd;
      } else {
        this.currency = this.common.currencyUs;
      }
    });
    this.mobUrl = window.location.pathname.replace('/', '').split('/')[1]; // Without hasing
   
  }

}
