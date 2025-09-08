import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SituacionPuertoComponent } from './situacion-puerto.component';

describe('SituacionPuertoComponent', () => {
  let component: SituacionPuertoComponent;
  let fixture: ComponentFixture<SituacionPuertoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SituacionPuertoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SituacionPuertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
