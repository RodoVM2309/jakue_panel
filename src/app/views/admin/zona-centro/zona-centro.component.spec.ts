import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonaCentroComponent } from './zona-centro.component';

describe('ZonaCentroComponent', () => {
  let component: ZonaCentroComponent;
  let fixture: ComponentFixture<ZonaCentroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonaCentroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonaCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
