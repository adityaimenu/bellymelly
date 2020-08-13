import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSidebarComponent } from './location-sidebar.component';

describe('LocationSidebarComponent', () => {
  let component: LocationSidebarComponent;
  let fixture: ComponentFixture<LocationSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
