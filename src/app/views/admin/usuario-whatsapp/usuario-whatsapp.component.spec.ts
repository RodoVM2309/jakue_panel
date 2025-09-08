import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioWhatsappComponent } from './usuario-whatsapp.component';

describe('UsuarioWhatsappComponent', () => {
  let component: UsuarioWhatsappComponent;
  let fixture: ComponentFixture<UsuarioWhatsappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioWhatsappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
