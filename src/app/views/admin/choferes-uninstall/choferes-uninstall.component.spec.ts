import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoferesUnistallComponent } from './choferes-unistall.component';

describe('ChoferesUnistallComponent', () => {
  let component: ChoferesUnistallComponent;
  let fixture: ComponentFixture<ChoferesUnistallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoferesUnistallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoferesUnistallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
