import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayasIntermediasComponent } from './playas-intermedias.component';

describe('PlayasIntermediasComponent', () => {
  let component: PlayasIntermediasComponent;
  let fixture: ComponentFixture<PlayasIntermediasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayasIntermediasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayasIntermediasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
