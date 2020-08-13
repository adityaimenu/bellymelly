import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LocalStorageService} from "angular-web-storage";
import {ToastrManager} from "ng6-toastr-notifications";
import {PlaceOrderBody} from "../../../../requests/place-order-body";
import {ApiService} from "../../../../services/api/api.service";
import * as _ from 'lodash';
import * as moment from "moment-timezone";
import {Route, Router} from "@angular/router";
import {ObservableService} from "../../../../services/observable-service/observable.service";
declare var swal: any;

@Component({
  selector: 'app-cod',
  templateUrl: './cod.component.html',
  styleUrls: ['./cod.component.scss']
})
export class CodComponent implements OnInit {
  @Output() onPlaceOrder = new EventEmitter();
  @Input() public isOrderPlaced: boolean;
  placeOrderBody = new PlaceOrderBody();
  locationDetails: any;
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  orderData: any;
  orderId: string;

  constructor(
    private localStorage: LocalStorageService,
    private toaster: ToastrManager,
    private api: ApiService,
    private router: Router,
    private observable: ObservableService
  ) { }

  ngOnInit() {
  
  }
  
}
