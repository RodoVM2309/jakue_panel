import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSolicitudesC3Component } from './add-solicitudes-c3.component';

describe('AddSolicitudesC3Component', () => {
  let component: AddSolicitudesC3Component;
  let fixture: ComponentFixture<AddSolicitudesC3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSolicitudesC3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSolicitudesC3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
