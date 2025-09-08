import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMtrComponent } from './dashboard-mtr.component';

describe('DashboardMtrComponent', () => {
  let component: DashboardMtrComponent;
  let fixture: ComponentFixture<DashboardMtrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMtrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMtrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
