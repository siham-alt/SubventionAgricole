import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammesPublic } from './programmes-public';

describe('ProgrammesPublic', () => {
  let component: ProgrammesPublic;
  let fixture: ComponentFixture<ProgrammesPublic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgrammesPublic],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgrammesPublic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
