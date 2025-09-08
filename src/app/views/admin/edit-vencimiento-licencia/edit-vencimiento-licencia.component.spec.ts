import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVencimientoLicenciaComponent } from './edit-vencimiento-licencia.component';

describe('EditVencimientoLicenciaComponent', () => {
  let component: EditVencimientoLicenciaComponent;
  let fixture: ComponentFixture<EditVencimientoLicenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVencimientoLicenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVencimientoLicenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
