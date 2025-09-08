import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SituacionpuertoComponent } from './situacionpuerto.component';

describe('SituacionpuertoComponent', () => {
  let component: SituacionpuertoComponent;
  let fixture: ComponentFixture<SituacionpuertoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SituacionpuertoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SituacionpuertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
