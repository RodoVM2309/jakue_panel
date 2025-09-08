import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPedidoDadorComponent } from './add-pedido-dador.component';

describe('AddPedidoDadorComponent', () => {
  let component: AddPedidoDadorComponent;
  let fixture: ComponentFixture<AddPedidoDadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPedidoDadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPedidoDadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
