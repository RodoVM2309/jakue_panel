import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaDePrivacidadComponent } from './politica-de-privacidad.component';

describe('PoliticaDePrivacidadComponent', () => {
  let component: PoliticaDePrivacidadComponent;
  let fixture: ComponentFixture<PoliticaDePrivacidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliticaDePrivacidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticaDePrivacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
