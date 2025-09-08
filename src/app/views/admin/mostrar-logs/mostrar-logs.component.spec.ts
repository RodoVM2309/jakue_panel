import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarLogsComponent } from './mostrar-logs.component';

describe('MostrarLogsComponent', () => {
  let component: MostrarLogsComponent;
  let fixture: ComponentFixture<MostrarLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
