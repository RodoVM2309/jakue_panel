import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InconsistenciaComponent } from './inconsistencia.component';

describe('InconsistenciaComponent', () => {
  let component: InconsistenciaComponent;
  let fixture: ComponentFixture<InconsistenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InconsistenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InconsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
