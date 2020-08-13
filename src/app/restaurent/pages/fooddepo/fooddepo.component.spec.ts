import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooddepoComponent } from './fooddepo.component';

describe('FooddepoComponent', () => {
  let component: FooddepoComponent;
  let fixture: ComponentFixture<FooddepoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooddepoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooddepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
