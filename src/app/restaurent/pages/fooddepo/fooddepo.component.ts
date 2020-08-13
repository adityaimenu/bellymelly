import { Component, OnInit } from '@angular/core';
import * as js from '../../../../assets/js/custom';
import { ApiService } from 'src/app/services/api/api.service';
import { LocalStorageService } from 'angular-web-storage';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CommonService } from 'src/app/services/common/common.service';
import { ObservableService } from 'src/app/services/observable-service/observable.service';
import { LoginService } from 'src/app/services/login/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from 'src/app/services/url/url.service';
import * as moment from "moment-timezone";
declare var $: any;
@Component({
  selector: 'app-fooddepo',
  templateUrl: './fooddepo.component.html',
  styleUrls: ['./fooddepo.component.scss']
})
export class FooddepoComponent implements OnInit {
  country: string;
  ngoCode: string;
  NgoDetails: any;
  NgoGoalDetails: any;
  ngoImage: string;
  NgoName: string;
  Locationlist = [];
  Orderlist = [];
  imageUrl: string;
  moneyRaised: number;
  moneyRaisedData:string;
  daysLeft: number=0;
  presentageValue:number;
  Amount:number;
  AmountExist:boolean=false;
  aboutUs:string;
  host:string;
  constructor(
    private api: ApiService,
    private localStorage: LocalStorageService,
    private toaster: ToastrManager,
    private common: CommonService,
    private observable: ObservableService,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private url: UrlService
  ) { }

  ngOnInit() {
    this.country = window.location.pathname.replace('/', '').split('/')[0]; 
    if(this.country == 'us'){
      moment.tz.setDefault("America/Jamaica");
    }else if(this.country == 'au'){
      moment.tz.setDefault("Australia/Sydney");
    }
    this.country = window.location.pathname.replace('/', '').split('/')[0]; 
    if(this.country == 'au'){
      this.host = 'https://bellymelly.com.au';
    } else if(this.country == 'us'){
      this.host = 'https://bellymelly.com';
    }
    this.imageUrl = this.url.imageUrl;
    this.activatedRoute.params.subscribe((params: any) => {
      this.ngoCode = params.org;
      this.getData(this.ngoCode)
    });

    
  }


  getData(ngoCode) {
    var data = `getNGOdetails&NGOCode=${ngoCode}`
    this.api.searchrRestaurants(data).subscribe((response: any) => {
      if (!response.NgoDetails) return this.warning('NGO data not found')
      this.NgoDetails = response.NgoDetails;
      this.ngoImage = this.NgoDetails.NgoPhotoLink
      this.aboutUs = this.NgoDetails.AboutUs;
      this.NgoName = this.NgoDetails.NgoName;
      this.Locationlist = response.Locationlist.length > 0 ? response.Locationlist : [];
      this.Orderlist = response.Orderlist.length > 0 ? response.Orderlist : [];
      this.moneyRaised = response.TotalDonationValue ? response.TotalDonationValue : 0;
      this.moneyRaisedData = Number(this.moneyRaised).toFixed(2);
      if (response.NgoGoalDetails) {
        this.Amount = response.NgoGoalDetails.Amount;
        this.AmountExist = true;
        this.presentageValue = this.moneyRaised * 100 / response.NgoGoalDetails.Amount;
      } else {
        this.presentageValue = 0;
      }
      this.presentageValueF(this.presentageValue)
      js.prog(this.presentageValue)
      if (!response.NgoGoalDetails) return this.daysLeft = 0;
      const enddate = response.NgoGoalDetails.EndDate.split(' ')[0];
      var time1 = moment().format('DD/MM/YYYY');
      var time2 = moment(enddate).format('DD/MM/YYYY');
      if (time1 > time2) {
        this.daysLeft = 0;
      } else {
        var a = moment(enddate);
        var b = moment();
       const c=  a.diff(b, 'days')
       if(c >= 0){
        this.daysLeft = c
       }else{
        this.daysLeft = 0 ;
       }
        
      }

    })
  }

  presentageValueF(val) {
    const a = Math.round(val)
    if (a >= 10) {
      const b = `0.${a}`;
      $('#mydivPresent').data('value', Number(b));
      return a;
    }
    else {
      const b = `0.0${a}`;
      $('#mydivPresent').data('value', Number(b));
      return a;
    }
  }

  error = (message: string) => {
    this.toaster.errorToastr(message);
  }
  warning = (message: string) => {
    this.toaster.warningToastr(message);
  }
  success = (message: string) => {
    this.toaster.successToastr(message);
  }
}
