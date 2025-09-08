import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCamionComponent } from './tipo-camion.component';

describe('TipoCamionComponent', () => {
  let component: TipoCamionComponent;
  let fixture: ComponentFixture<TipoCamionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoCamionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoCamionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
