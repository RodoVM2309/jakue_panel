import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPedidoDadorRetornoComponent } from './add-pedido-dador-retorno.component';

describe('AddPedidoDadorRetornoComponent', () => {
  let component: AddPedidoDadorRetornoComponent;
  let fixture: ComponentFixture<AddPedidoDadorRetornoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPedidoDadorRetornoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPedidoDadorRetornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
