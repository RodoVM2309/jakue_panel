import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MapaEstacionesComponent } from "./mapa-estaciones.component";

describe("MapaEstacionesComponent", () => {
  let component: MapaEstacionesComponent;
  let fixture: ComponentFixture<MapaEstacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapaEstacionesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaEstacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
