import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificarInconsistenciaComponent } from './notificar-inconsistencia.component';

describe('NotificarInconsistenciaComponent', () => {
  let component: NotificarInconsistenciaComponent;
  let fixture: ComponentFixture<NotificarInconsistenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificarInconsistenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificarInconsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
