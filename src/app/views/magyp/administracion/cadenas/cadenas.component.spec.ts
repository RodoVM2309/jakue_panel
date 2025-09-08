import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadenasComponent } from './cadenas.component';

describe('CadenasComponent', () => {
  let component: CadenasComponent;
  let fixture: ComponentFixture<CadenasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadenasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadenasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
