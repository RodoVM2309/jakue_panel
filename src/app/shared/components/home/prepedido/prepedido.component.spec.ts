import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepedidoComponent } from './prepedido.component';

describe('PrepedidoComponent', () => {
  let component: PrepedidoComponent;
  let fixture: ComponentFixture<PrepedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
