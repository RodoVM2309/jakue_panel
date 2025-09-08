import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosAsignacionC3Component } from './filtros-asignacion-c3.component';

describe('FiltrosAsignacionC3Component', () => {
  let component: FiltrosAsignacionC3Component;
  let fixture: ComponentFixture<FiltrosAsignacionC3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosAsignacionC3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosAsignacionC3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
