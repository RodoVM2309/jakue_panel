import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddOperadorChatComponent } from "./add-operador-chat.component";

describe("AddOperadorChatComponent", () => {
  let component: AddOperadorChatComponent;
  let fixture: ComponentFixture<AddOperadorChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddOperadorChatComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOperadorChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
