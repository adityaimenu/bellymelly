import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-paytm',
  templateUrl: './paytm.component.html',
  styleUrls: ['./paytm.component.scss']
})
export class PaytmComponent implements OnInit {
  @Input() public amount: any;
  @Input() public isOrderByPaytm: boolean;
  @Output() pay = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
