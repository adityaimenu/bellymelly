import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "../../../../services/common/common.service";

@Component({
  selector: 'app-manage-coupons',
  templateUrl: './manage-coupons.component.html',
  styleUrls: ['./manage-coupons.component.scss']
})
export class ManageCouponsComponent implements OnInit {
  @Input() public couponList: Array<any> = [];
  currency: string;
  constructor(
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
  }

}
