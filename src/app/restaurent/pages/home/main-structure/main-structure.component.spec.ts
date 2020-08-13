import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainStructureComponent } from './main-structure.component';

describe('MainStructureComponent', () => {
  let component: MainStructureComponent;
  let fixture: ComponentFixture<MainStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
