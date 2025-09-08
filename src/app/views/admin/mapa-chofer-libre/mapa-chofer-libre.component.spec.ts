import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaChoferLibreComponent } from './mapa-chofer-libre.component';

describe('MapaChoferLibreComponent', () => {
  let component: MapaChoferLibreComponent;
  let fixture: ComponentFixture<MapaChoferLibreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaChoferLibreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaChoferLibreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
