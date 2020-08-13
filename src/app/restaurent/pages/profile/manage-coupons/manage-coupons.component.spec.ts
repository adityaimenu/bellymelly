import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCouponsComponent } from './manage-coupons.component';

describe('ManageCouponsComponent', () => {
  let component: ManageCouponsComponent;
  let fixture: ComponentFixture<ManageCouponsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCouponsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
