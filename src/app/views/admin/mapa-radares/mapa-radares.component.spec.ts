import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaRadaresComponent } from './mapa-radares.component';

describe('MapaRadaresComponent', () => {
  let component: MapaRadaresComponent;
  let fixture: ComponentFixture<MapaRadaresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaRadaresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaRadaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
