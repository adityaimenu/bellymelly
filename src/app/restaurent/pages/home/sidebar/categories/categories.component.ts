import {Component, Input, OnInit} from '@angular/core';
import * as js from '../../../../../../assets/js/custom';
import {ActivatedRoute} from "@angular/router";
declare var $: any;
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  @Input() public catList: any[] = [];
  
   baseUrl: string;
   window = window;
   selectedIndex: number;
  categoryList = [
    {title: 'Pizza', class: '', href: '#pizza'},
    {title: 'Rolls & Chips', class: '', href: '#rolls'},
    {title: 'French Fries', class: '', href: '#french-fries'},
    {title: 'Rice & Noodles', class: '', href: '#rice-noodles'},
    {title: 'Pasta Dinner', class: '', href: '#pasta'},
    {title: 'Veg Main Course', class: '', href: '#veg-main-course'},
    {title: 'Others', class: '', href: '#others'},
  ];
  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.selectedIndex = 0;
    js.scrollLink();
    js.activeOnScroll();
    this.activatedRoute.params.subscribe((params: any) => {
      this.baseUrl = location.pathname.replace('/','').split('/')[0] + '/' + params.mobUrl;
    });
  }
  goToByScroll(id, index){
    this.selectedIndex = index;
    $('html,body').animate({scrollTop: $("#"+id).offset().top-80},'slow');
  }

}
