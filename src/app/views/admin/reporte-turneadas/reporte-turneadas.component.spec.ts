import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTurneadasComponent } from './reporte-turneadas.component';

describe('ReporteTurneadasComponent', () => {
  let component: ReporteTurneadasComponent;
  let fixture: ComponentFixture<ReporteTurneadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteTurneadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteTurneadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
