import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionV2Component } from './asignacion-v2.component';

describe('AsignacionV2Component', () => {
  let component: AsignacionV2Component;
  let fixture: ComponentFixture<AsignacionV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
