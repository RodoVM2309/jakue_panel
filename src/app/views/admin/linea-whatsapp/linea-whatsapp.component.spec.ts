import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaWhatsappComponent } from './linea-whatsapp.component';

describe('LineaWhatsappComponent', () => {
  let component: LineaWhatsappComponent;
  let fixture: ComponentFixture<LineaWhatsappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineaWhatsappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineaWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
