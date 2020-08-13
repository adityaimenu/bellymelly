import {Component, Input, OnInit} from '@angular/core';
import * as js from 'src/assets/js/custom'
declare var $: any
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() public catListNew: any[] = [];
  constructor() { }

  ngOnInit() {
  
   

  }

}
