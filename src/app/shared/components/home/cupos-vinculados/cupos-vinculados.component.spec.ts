import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuposVinculadosComponent } from './cupos-vinculados.component';

describe('CuposVinculadosComponent', () => {
  let component: CuposVinculadosComponent;
  let fixture: ComponentFixture<CuposVinculadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuposVinculadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuposVinculadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
