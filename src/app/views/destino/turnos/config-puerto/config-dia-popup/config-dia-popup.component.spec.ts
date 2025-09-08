import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigDiaPopupComponent } from './config-dia-popup.component';

describe('ConfigDiaPopupComponent', () => {
  let component: ConfigDiaPopupComponent;
  let fixture: ComponentFixture<ConfigDiaPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigDiaPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigDiaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
