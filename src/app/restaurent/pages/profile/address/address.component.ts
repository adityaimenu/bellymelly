import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  @Input() public addressList: Array<any> = [];
  @Output() selectedAddress = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
