import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddressResponsiveComponent } from './add-address-responsive.component';

describe('AddAddressResponsiveComponent', () => {
  let component: AddAddressResponsiveComponent;
  let fixture: ComponentFixture<AddAddressResponsiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAddressResponsiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAddressResponsiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
