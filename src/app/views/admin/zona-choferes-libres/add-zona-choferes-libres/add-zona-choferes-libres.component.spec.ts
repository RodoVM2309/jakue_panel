import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddZonaChoferesLibresComponent } from './add-zona-choferes-libres.component';

describe('AddZonaChoferesLibresComponent', () => {
  let component: AddZonaChoferesLibresComponent;
  let fixture: ComponentFixture<AddZonaChoferesLibresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddZonaChoferesLibresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddZonaChoferesLibresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
