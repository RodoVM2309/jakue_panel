import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCuposSolicitadosComponent } from "./add-cupos-solicitados.component";

describe("AddCuposSolicitadosComponent", () => {
  let component: AddCuposSolicitadosComponent;
  let fixture: ComponentFixture<AddCuposSolicitadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCuposSolicitadosComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCuposSolicitadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
