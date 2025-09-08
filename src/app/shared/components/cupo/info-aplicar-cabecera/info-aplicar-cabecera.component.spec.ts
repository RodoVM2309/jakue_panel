import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAplicarCabeceraComponent } from './info-aplicar-cabecera.component';

describe('InfoAplicarCabeceraComponent', () => {
  let component: InfoAplicarCabeceraComponent;
  let fixture: ComponentFixture<InfoAplicarCabeceraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoAplicarCabeceraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoAplicarCabeceraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
