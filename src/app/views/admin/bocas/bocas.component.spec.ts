import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BocasComponent } from "./bocas.component";

describe("BocasComponent", () => {
  let component: BocasComponent;
  let fixture: ComponentFixture<BocasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BocasComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BocasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
