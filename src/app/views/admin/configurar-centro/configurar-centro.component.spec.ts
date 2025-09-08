import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarCentroComponent } from './configurar-centro.component';

describe('ConfigurarCentroComponent', () => {
  let component: ConfigurarCentroComponent;
  let fixture: ComponentFixture<ConfigurarCentroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurarCentroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurarCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
