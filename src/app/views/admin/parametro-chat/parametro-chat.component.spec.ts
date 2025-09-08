import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ParametroChatComponent } from "./parametro-chat.component";

describe("ParametroChatComponent", () => {
  let component: ParametroChatComponent;
  let fixture: ComponentFixture<ParametroChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParametroChatComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametroChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
