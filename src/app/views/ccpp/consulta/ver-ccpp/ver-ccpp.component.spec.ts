import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCcppComponent } from './ver-ccpp.component';

describe('VerCcppComponent', () => {
  let component: VerCcppComponent;
  let fixture: ComponentFixture<VerCcppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerCcppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerCcppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
