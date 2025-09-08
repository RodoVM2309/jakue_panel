import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCuposDisponiblesComponent } from "./add-cupos-disponibles.component";

describe("AddCuposDisponiblesComponent", () => {
  let component: AddCuposDisponiblesComponent;
  let fixture: ComponentFixture<AddCuposDisponiblesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCuposDisponiblesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCuposDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
