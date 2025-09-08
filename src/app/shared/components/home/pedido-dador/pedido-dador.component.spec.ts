import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoDadorComponent } from './pedido-dador.component';

describe('PedidoDadorComponent', () => {
  let component: PedidoDadorComponent;
  let fixture: ComponentFixture<PedidoDadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoDadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoDadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
