import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicionesViaje2Component } from './condiciones-viaje2.component';

describe('CondicionesViaje2Component', () => {
  let component: CondicionesViaje2Component;
  let fixture: ComponentFixture<CondicionesViaje2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondicionesViaje2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondicionesViaje2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
