import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaritaComponent } from './garita.component';

describe('GaritaComponent', () => {
  let component: GaritaComponent;
  let fixture: ComponentFixture<GaritaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaritaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaritaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
