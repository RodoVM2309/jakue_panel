import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularIntermediarioComponent } from './vincular-intermediario.component';

describe('VincularIntermediarioComponent', () => {
  let component: VincularIntermediarioComponent;
  let fixture: ComponentFixture<VincularIntermediarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularIntermediarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularIntermediarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
