import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarSolicitudComponent } from './asignar-solicitud.component';

describe('AsignarSolicitudComponent', () => {
  let component: AsignarSolicitudComponent;
  let fixture: ComponentFixture<AsignarSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
