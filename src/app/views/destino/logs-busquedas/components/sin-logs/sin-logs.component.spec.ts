import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinLogsComponent } from './sin-logs.component';

describe('SinLogsComponent', () => {
  let component: SinLogsComponent;
  let fixture: ComponentFixture<SinLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
