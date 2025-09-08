import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularZonaComponent } from './vincular-zona.component';

describe('VincularZonaComponent', () => {
  let component: VincularZonaComponent;
  let fixture: ComponentFixture<VincularZonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularZonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularZonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
