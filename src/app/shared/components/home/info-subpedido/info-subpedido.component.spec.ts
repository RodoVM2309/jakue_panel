import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSubpedidoComponent } from './info-subpedido.component';

describe('InfoSubpedidoComponent', () => {
  let component: InfoSubpedidoComponent;
  let fixture: ComponentFixture<InfoSubpedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSubpedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSubpedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
