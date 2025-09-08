import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularTransporteComponent } from './vincular-transporte.component';

describe('VincularTransporteComponent', () => {
  let component: VincularTransporteComponent;
  let fixture: ComponentFixture<VincularTransporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularTransporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularTransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
