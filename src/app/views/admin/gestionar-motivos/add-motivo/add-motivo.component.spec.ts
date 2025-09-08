import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMotivoComponent } from './add-motivo.component';

describe('AddMotivoComponent', () => {
  let component: AddMotivoComponent;
  let fixture: ComponentFixture<AddMotivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMotivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMotivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
