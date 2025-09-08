import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddBocasComponent } from "./add-bocas.component";

describe("AddBocasComponent", () => {
  let component: AddBocasComponent;
  let fixture: ComponentFixture<AddBocasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddBocasComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBocasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
