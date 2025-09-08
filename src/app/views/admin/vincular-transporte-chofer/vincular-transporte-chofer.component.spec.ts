import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularTransporteChoferComponent } from './vincular-transporte-chofer.component';

describe('VincularTransporteChoferComponent', () => {
  let component: VincularTransporteChoferComponent;
  let fixture: ComponentFixture<VincularTransporteChoferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularTransporteChoferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularTransporteChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
