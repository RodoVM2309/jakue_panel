import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BajadaMasivaComponent } from './bajada-masiva.component';

describe('BajadaMasivaComponent', () => {
  let component: BajadaMasivaComponent;
  let fixture: ComponentFixture<BajadaMasivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BajadaMasivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BajadaMasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
