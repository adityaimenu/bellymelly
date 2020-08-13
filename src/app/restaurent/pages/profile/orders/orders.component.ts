import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonService} from "../../../../services/common/common.service";
import { UrlService } from 'src/app/services/url/url.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @Input() public orderHistory: Array<any> = [];
  @Input() public locationDetails: any;
  @Output() getOrderInfo = new EventEmitter();
  Math = Math;
  currency: string;
  imageUrl:string;
  constructor(
    private common: CommonService,
    private url: UrlService
  ) { }

  ngOnInit() {
    this.imageUrl = this.url.imageUrl;
    this.common.getCountryInd().subscribe((isIndia: boolean) => {
      if (isIndia) {
        this.currency = this.common.currencyInd;
      } else {
        this.currency = this.common.currencyUs;
      }
    });
  }

}
