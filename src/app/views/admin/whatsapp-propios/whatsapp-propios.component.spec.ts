import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { WhatsappPropiosComponent } from "./whatsapp-propios.component";

describe("WhatsappPropiosComponent", () => {
  let component: WhatsappPropiosComponent;
  let fixture: ComponentFixture<WhatsappPropiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WhatsappPropiosComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappPropiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
