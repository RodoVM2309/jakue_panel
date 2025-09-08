import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSancionViajesComponent } from './add-sancion-viajes.component';

describe('AddSancionViajesComponent', () => {
  let component: AddSancionViajesComponent;
  let fixture: ComponentFixture<AddSancionViajesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSancionViajesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSancionViajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
