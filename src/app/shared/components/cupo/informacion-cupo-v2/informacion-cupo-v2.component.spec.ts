import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionCupoV2Component } from './informacion-cupo-v2.component';

describe('InformacionCupoV2Component', () => {
  let component: InformacionCupoV2Component;
  let fixture: ComponentFixture<InformacionCupoV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionCupoV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionCupoV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
