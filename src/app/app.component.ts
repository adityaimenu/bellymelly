import { Component, OnInit } from '@angular/core';
import * as js from '../assets/js/custom';
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "./services/common/common.service";
import {ApiService} from "./services/api/api.service";
import {UrlService} from "./services/url/url.service";
import{Router, NavigationEnd} from '@angular/router';
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'restaurent-view';
  constructor(
    private spinner: NgxSpinnerService,
    private common: CommonService,
    private api: ApiService,
    private url: UrlService,
    public router: Router
  ) {
    js.sticky();
    // this.router.events.subscribe(event => {
    //   if(event instanceof NavigationEnd){ 
    //     gtag('config', 'AW-656619478', {
    //               'page_path': event.urlAfterRedirects
    //             }
    //            );
    //    } 
    // })
    
  }
  ngOnInit() {
  }
}
