import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularCentroCorredorComponent } from './vincular-centro-corredor.component';

describe('VincularCentroCorredorComponent', () => {
  let component: VincularCentroCorredorComponent;
  let fixture: ComponentFixture<VincularCentroCorredorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularCentroCorredorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularCentroCorredorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
