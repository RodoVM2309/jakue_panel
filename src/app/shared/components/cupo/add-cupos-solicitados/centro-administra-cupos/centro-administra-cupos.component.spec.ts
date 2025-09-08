import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroAdministraCuposComponent } from './centro-administra-cupos.component';

describe('CentroAdministraCuposComponent', () => {
  let component: CentroAdministraCuposComponent;
  let fixture: ComponentFixture<CentroAdministraCuposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentroAdministraCuposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroAdministraCuposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
