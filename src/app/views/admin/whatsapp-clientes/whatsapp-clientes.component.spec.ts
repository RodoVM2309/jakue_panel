import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import {WhatsappClientesComponent } from "./whatsapp-clientes.component";

describe("WhatsappClientesComponent", () => {
  let component: WhatsappClientesComponent;
  let fixture: ComponentFixture<WhatsappClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WhatsappClientesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
