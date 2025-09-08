import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEstadoComponent } from './admin-estado.component';

describe('AdminEstadoComponent', () => {
  let component: AdminEstadoComponent;
  let fixture: ComponentFixture<AdminEstadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEstadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
