import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPuertoComponent } from './config-puerto.component';

describe('ConfigPuertoComponent', () => {
  let component: ConfigPuertoComponent;
  let fixture: ComponentFixture<ConfigPuertoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigPuertoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPuertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
