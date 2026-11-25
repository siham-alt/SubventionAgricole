import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentAccueil } from './agent-accueil';

describe('AgentAccueil', () => {
  let component: AgentAccueil;
  let fixture: ComponentFixture<AgentAccueil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentAccueil],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentAccueil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
