import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCuposSolicitadosV2Component } from './add-cupos-solicitados-v2.component';

describe('AddCuposSolicitadosV2Component', () => {
  let component: AddCuposSolicitadosV2Component;
  let fixture: ComponentFixture<AddCuposSolicitadosV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCuposSolicitadosV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCuposSolicitadosV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
