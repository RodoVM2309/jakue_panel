import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPedidoDadorCortoComponent } from './add-pedido-dador-corto.component';

describe('AddPedidoDadorCortoComponent', () => {
  let component: AddPedidoDadorCortoComponent;
  let fixture: ComponentFixture<AddPedidoDadorCortoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPedidoDadorCortoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPedidoDadorCortoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
