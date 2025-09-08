import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaCuposVinculadosComponent } from './mapa-cupos-vinculados.component';

describe('MapaCuposVinculadosComponent', () => {
  let component: MapaCuposVinculadosComponent;
  let fixture: ComponentFixture<MapaCuposVinculadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaCuposVinculadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaCuposVinculadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
