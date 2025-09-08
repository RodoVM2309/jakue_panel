import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoViajeComponent } from './info-viaje.component';

describe('InfoViajeComponent', () => {
  let component: InfoViajeComponent;
  let fixture: ComponentFixture<InfoViajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoViajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
