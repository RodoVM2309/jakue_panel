import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcaCamionComponent } from './marca-camion.component';

describe('MarcaCamionComponent', () => {
  let component: MarcaCamionComponent;
  let fixture: ComponentFixture<MarcaCamionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarcaCamionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcaCamionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
