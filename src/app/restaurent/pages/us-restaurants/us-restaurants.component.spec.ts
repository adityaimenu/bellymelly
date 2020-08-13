import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsRestaurantsComponent } from './us-restaurants.component';

describe('UsRestaurantsComponent', () => {
  let component: UsRestaurantsComponent;
  let fixture: ComponentFixture<UsRestaurantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsRestaurantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
