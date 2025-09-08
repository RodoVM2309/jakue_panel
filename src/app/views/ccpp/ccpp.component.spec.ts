import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcppComponent } from './ccpp.component';

describe('CcppComponent', () => {
  let component: CcppComponent;
  let fixture: ComponentFixture<CcppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
