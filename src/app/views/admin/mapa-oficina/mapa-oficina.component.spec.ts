import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaOficinaComponent } from './mapa-oficina.component';

describe('MapaOficinaComponent', () => {
  let component: MapaOficinaComponent;
  let fixture: ComponentFixture<MapaOficinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaOficinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaOficinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
