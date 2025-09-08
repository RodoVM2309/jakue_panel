import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirManualComponent } from './subir-manual.component';

describe('SubirManualComponent', () => {
  let component: SubirManualComponent;
  let fixture: ComponentFixture<SubirManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
