import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfeccionCCPPComponent } from './confeccion-ccpp.component';

describe('ConfeccionCCPPComponent', () => {
  let component: ConfeccionCCPPComponent;
  let fixture: ComponentFixture<ConfeccionCCPPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfeccionCCPPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfeccionCCPPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
