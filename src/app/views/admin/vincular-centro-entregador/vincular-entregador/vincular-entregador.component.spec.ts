import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularEntregadorComponent } from './vincular-entregador.component';

describe('VincularEntregadorComponent', () => {
  let component: VincularEntregadorComponent;
  let fixture: ComponentFixture<VincularEntregadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularEntregadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularEntregadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
