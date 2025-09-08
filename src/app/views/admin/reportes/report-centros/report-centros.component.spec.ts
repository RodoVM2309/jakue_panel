import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCentrosComponent } from './report-centros.component';

describe('ReportCentrosComponent', () => {
  let component: ReportCentrosComponent;
  let fixture: ComponentFixture<ReportCentrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCentrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCentrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
