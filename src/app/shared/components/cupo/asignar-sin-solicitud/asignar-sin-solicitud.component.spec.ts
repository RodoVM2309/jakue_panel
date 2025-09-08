import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarSinSolicitudComponent } from './asignar-sin-solicitud.component';

describe('AsignarSinSolicitudComponent', () => {
  let component: AsignarSinSolicitudComponent;
  let fixture: ComponentFixture<AsignarSinSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarSinSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarSinSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
