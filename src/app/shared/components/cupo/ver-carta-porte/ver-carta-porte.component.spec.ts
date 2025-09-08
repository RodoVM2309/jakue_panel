import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCartaPorteComponent } from './ver-carta-porte.component';

describe('VerCartaPorteComponent', () => {
  let component: VerCartaPorteComponent;
  let fixture: ComponentFixture<VerCartaPorteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerCartaPorteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerCartaPorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
