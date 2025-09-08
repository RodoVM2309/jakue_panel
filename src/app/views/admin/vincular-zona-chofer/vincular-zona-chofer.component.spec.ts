import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularZonaChoferComponent } from './vincular-zona-chofer.component';

describe('VincularZonaChoferComponent', () => {
  let component: VincularZonaChoferComponent;
  let fixture: ComponentFixture<VincularZonaChoferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularZonaChoferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularZonaChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
