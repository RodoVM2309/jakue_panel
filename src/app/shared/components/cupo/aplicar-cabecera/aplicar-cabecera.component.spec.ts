import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicarCabeceraComponent } from './aplicar-cabecera.component';

describe('AplicarCabeceraComponent', () => {
  let component: AplicarCabeceraComponent;
  let fixture: ComponentFixture<AplicarCabeceraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AplicarCabeceraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AplicarCabeceraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
