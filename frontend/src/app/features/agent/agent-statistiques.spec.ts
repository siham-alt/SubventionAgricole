import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentStatistiques } from './agent-statistiques';

describe('AgentStatistiques', () => {
  let component: AgentStatistiques;
  let fixture: ComponentFixture<AgentStatistiques>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentStatistiques],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentStatistiques);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
