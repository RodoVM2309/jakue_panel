/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ViajesTransportadoraComponent } from './viajes-transportadora.component';

describe('ViajesTransportadoraComponent', () => {
  let component: ViajesTransportadoraComponent;
  let fixture: ComponentFixture<ViajesTransportadoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViajesTransportadoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajesTransportadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
