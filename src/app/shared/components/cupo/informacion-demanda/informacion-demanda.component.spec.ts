import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionDemandaComponent } from './informacion-demanda.component';

describe('InformacionDemandaComponent', () => {
  let component: InformacionDemandaComponent;
  let fixture: ComponentFixture<InformacionDemandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionDemandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionDemandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
