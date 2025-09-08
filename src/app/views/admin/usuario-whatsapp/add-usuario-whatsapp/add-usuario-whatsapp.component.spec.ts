import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUsuarioWhatsappComponent } from './add-usuario-whatsapp.component';

describe('AddUsuarioWhatsappComponent', () => {
  let component: AddUsuarioWhatsappComponent;
  let fixture: ComponentFixture<AddUsuarioWhatsappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUsuarioWhatsappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUsuarioWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
