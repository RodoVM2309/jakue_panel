import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaTalleresComponent } from './mapa-talleres.component';

describe('MapaTalleresComponent', () => {
  let component: MapaTalleresComponent;
  let fixture: ComponentFixture<MapaTalleresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaTalleresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaTalleresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
