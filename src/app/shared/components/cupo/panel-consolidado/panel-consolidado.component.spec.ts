import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelConsolidadoComponent } from './panel-consolidado.component';

describe('PanelConsolidadoComponent', () => {
  let component: PanelConsolidadoComponent;
  let fixture: ComponentFixture<PanelConsolidadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelConsolidadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelConsolidadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
