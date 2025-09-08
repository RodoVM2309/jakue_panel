import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionC3Component } from './asignacion-c3.component';

describe('AsignacionC3Component', () => {
  let component: AsignacionC3Component;
  let fixture: ComponentFixture<AsignacionC3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionC3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionC3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
