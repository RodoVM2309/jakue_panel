import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSolicitudesComponent } from './grid-solicitudes.component';

describe('GridSolicitudesComponent', () => {
  let component: GridSolicitudesComponent;
  let fixture: ComponentFixture<GridSolicitudesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridSolicitudesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
