import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAtencionComponent } from './app-atencion.component';

describe('AppAtencionComponent', () => {
  let component: AppAtencionComponent;
  let fixture: ComponentFixture<AppAtencionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAtencionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
