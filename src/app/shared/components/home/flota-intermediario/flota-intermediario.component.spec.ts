import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlotaIntermediarioComponent } from './flota-intermediario.component';

describe('FlotaIntermediarioComponent', () => {
  let component: FlotaIntermediarioComponent;
  let fixture: ComponentFixture<FlotaIntermediarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlotaIntermediarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlotaIntermediarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
