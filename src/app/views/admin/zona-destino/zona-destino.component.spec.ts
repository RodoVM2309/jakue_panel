import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonaDestinoComponent } from './zona-destino.component';

describe('ZonaDestinoComponent', () => {
  let component: ZonaDestinoComponent;
  let fixture: ComponentFixture<ZonaDestinoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonaDestinoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonaDestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
