import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionZonaChoferComponent } from './asignacion-zona-chofer.component';

describe('AsignacionZonaChoferComponent', () => {
  let component: AsignacionZonaChoferComponent;
  let fixture: ComponentFixture<AsignacionZonaChoferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionZonaChoferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionZonaChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
