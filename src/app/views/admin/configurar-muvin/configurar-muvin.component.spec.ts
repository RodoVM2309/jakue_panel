import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarMuvinComponent } from "./configurar-muvin.component";

describe('ConfigurarMuvinComponent', () => {
  let component: ConfigurarMuvinComponent;
  let fixture: ComponentFixture<ConfigurarMuvinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurarMuvinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurarMuvinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
