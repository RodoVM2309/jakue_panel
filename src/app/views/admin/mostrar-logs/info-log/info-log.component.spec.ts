import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoLogComponent } from './info-log.component';

describe('InfoLogComponent', () => {
  let component: InfoLogComponent;
  let fixture: ComponentFixture<InfoLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
