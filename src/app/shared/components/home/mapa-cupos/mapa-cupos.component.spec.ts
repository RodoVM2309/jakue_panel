import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaCuposComponent } from './mapa-cupos.component';

describe('MapaCuposComponent', () => {
  let component: MapaCuposComponent;
  let fixture: ComponentFixture<MapaCuposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaCuposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaCuposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
