import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInconsistenciaComponent } from './ver-inconsistencia.component';

describe('VerInconsistenciaComponent', () => {
  let component: VerInconsistenciaComponent;
  let fixture: ComponentFixture<VerInconsistenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerInconsistenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerInconsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
