import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularCentroEntregadorComponent } from './vincular-centro-entregador.component';

describe('VincularCentroEntregadorComponent', () => {
  let component: VincularCentroEntregadorComponent;
  let fixture: ComponentFixture<VincularCentroEntregadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularCentroEntregadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularCentroEntregadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
