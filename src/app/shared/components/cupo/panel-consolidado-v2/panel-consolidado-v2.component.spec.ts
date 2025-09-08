import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelConsolidadoV2Component } from './panel-consolidado-v2.component';

describe('PanelConsolidadoV2Component', () => {
  let component: PanelConsolidadoV2Component;
  let fixture: ComponentFixture<PanelConsolidadoV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelConsolidadoV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelConsolidadoV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
