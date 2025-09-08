import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPuertoPopupComponent } from './config-puerto-popup.component';

describe('ConfigPuertoPopupComponent', () => {
  let component: ConfigPuertoPopupComponent;
  let fixture: ComponentFixture<ConfigPuertoPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigPuertoPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPuertoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
