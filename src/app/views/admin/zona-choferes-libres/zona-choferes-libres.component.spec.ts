import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonaChoferesLibresComponent } from './zona-choferes-libres.component';

describe('ZonaChoferesLibresComponent', () => {
  let component: ZonaChoferesLibresComponent;
  let fixture: ComponentFixture<ZonaChoferesLibresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonaChoferesLibresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonaChoferesLibresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
