import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddZonaDestinoComponent } from './add-zona-destino.component';

describe('AddZonaDestinoComponent', () => {
  let component: AddZonaDestinoComponent;
  let fixture: ComponentFixture<AddZonaDestinoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddZonaDestinoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddZonaDestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
