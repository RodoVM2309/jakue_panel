import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddParametroChatComponent } from "./add-parametro-chat.component";

describe("AddParametroChatComponent", () => {
  let component: AddParametroChatComponent;
  let fixture: ComponentFixture<AddParametroChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddParametroChatComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParametroChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
