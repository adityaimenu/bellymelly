import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurentInfoComponent } from './restaurent-info.component';

describe('RestaurentInfoComponent', () => {
  let component: RestaurentInfoComponent;
  let fixture: ComponentFixture<RestaurentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
