import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirLogoCentroComponent } from './subir-logo-centro.component';

describe('SubirLogoCentroComponent', () => {
  let component: SubirLogoCentroComponent;
  let fixture: ComponentFixture<SubirLogoCentroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirLogoCentroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirLogoCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
