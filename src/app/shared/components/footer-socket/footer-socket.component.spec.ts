import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSocketComponent } from './footer-socket.component';

describe('FooterSocketComponent', () => {
  let component: FooterSocketComponent;
  let fixture: ComponentFixture<FooterSocketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterSocketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterSocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
