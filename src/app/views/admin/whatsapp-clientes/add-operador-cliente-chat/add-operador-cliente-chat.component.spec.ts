import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddOperadorClienteChatComponent } from "./add-operador-cliente-chat.component";

describe("AddOperadorClienteChatComponent", () => {
  let component: AddOperadorClienteChatComponent;
  let fixture: ComponentFixture<AddOperadorClienteChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddOperadorClienteChatComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOperadorClienteChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
