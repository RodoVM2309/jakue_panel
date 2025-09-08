import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioSinEmailComponent } from './usuario-sin-email.component';

describe('UsuarioSinEmailComponent', () => {
  let component: UsuarioSinEmailComponent;
  let fixture: ComponentFixture<UsuarioSinEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioSinEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioSinEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
