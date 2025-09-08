import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularCentroIntermediarioComponent } from './vincular-centro-intermediario.component';

describe('VincularCentroIntermediarioComponent', () => {
  let component: VincularCentroIntermediarioComponent;
  let fixture: ComponentFixture<VincularCentroIntermediarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularCentroIntermediarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularCentroIntermediarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
