import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoVentanillaComponent } from './info-ventanilla.component';

describe('InfoVentanillaComponent', () => {
  let component: InfoVentanillaComponent;
  let fixture: ComponentFixture<InfoVentanillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoVentanillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoVentanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
