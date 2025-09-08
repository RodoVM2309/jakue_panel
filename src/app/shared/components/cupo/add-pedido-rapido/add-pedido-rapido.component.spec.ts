import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPedidoRapidoComponent } from "./add-pedido-rapido.component";

describe("AddPedidoRapidoComponent", () => {
  let component: AddPedidoRapidoComponent;
  let fixture: ComponentFixture<AddPedidoRapidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPedidoRapidoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPedidoRapidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
