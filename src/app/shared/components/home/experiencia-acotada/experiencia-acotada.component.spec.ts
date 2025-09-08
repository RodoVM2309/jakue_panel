import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienciaAcotadaComponent } from './experiencia-acotada.component';

describe('ExperienciaAcotadaComponent', () => {
  let component: ExperienciaAcotadaComponent;
  let fixture: ComponentFixture<ExperienciaAcotadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienciaAcotadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienciaAcotadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
