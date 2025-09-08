import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensualComponent } from './mensual.component';

describe('MensualComponent', () => {
  let component: MensualComponent;
  let fixture: ComponentFixture<MensualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
