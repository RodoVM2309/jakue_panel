import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarDemandaComponent } from './cambiar-demanda.component';

describe('CambiarDemandaComponent', () => {
  let component: CambiarDemandaComponent;
  let fixture: ComponentFixture<CambiarDemandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambiarDemandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarDemandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
