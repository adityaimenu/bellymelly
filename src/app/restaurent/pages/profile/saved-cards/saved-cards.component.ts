import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-saved-cards',
  templateUrl: './saved-cards.component.html',
  styleUrls: ['./saved-cards.component.scss']
})
export class SavedCardsComponent implements OnInit {
  @Input() public cardList: Array<any> = [];

  constructor() { }

  ngOnInit() {
  }

}
