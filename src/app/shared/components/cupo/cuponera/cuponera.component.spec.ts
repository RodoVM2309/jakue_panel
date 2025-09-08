import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuponeraComponent } from './cuponera.component';

describe('CuponeraComponent', () => {
  let component: CuponeraComponent;
  let fixture: ComponentFixture<CuponeraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuponeraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuponeraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
