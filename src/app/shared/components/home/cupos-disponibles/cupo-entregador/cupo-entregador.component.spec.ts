import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CupoEntregadorComponent } from './cupo-entregador.component';

describe('CupoEntregadorComponent', () => {
  let component: CupoEntregadorComponent;
  let fixture: ComponentFixture<CupoEntregadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CupoEntregadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CupoEntregadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
