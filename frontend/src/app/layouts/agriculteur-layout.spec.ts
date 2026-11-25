import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriculteurLayout } from './agriculteur-layout';

describe('AgriculteurLayout', () => {
  let component: AgriculteurLayout;
  let fixture: ComponentFixture<AgriculteurLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgriculteurLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(AgriculteurLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
