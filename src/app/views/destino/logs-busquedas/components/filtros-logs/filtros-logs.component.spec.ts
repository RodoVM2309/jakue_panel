import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosLogsComponent } from './filtros-logs.component';

describe('FiltrosLogsComponent', () => {
  let component: FiltrosLogsComponent;
  let fixture: ComponentFixture<FiltrosLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
