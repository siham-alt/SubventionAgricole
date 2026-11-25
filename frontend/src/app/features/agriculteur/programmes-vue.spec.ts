import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammesVue } from './programmes-vue';

describe('ProgrammesVue', () => {
  let component: ProgrammesVue;
  let fixture: ComponentFixture<ProgrammesVue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgrammesVue],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgrammesVue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
