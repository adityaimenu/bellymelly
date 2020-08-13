import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishItemsComponent } from './dish-items.component';

describe('DishItemsComponent', () => {
  let component: DishItemsComponent;
  let fixture: ComponentFixture<DishItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
