import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoChoferesComponent } from './estado-choferes.component';

describe('EstadoChoferesComponent', () => {
  let component: EstadoChoferesComponent;
  let fixture: ComponentFixture<EstadoChoferesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoChoferesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoChoferesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
