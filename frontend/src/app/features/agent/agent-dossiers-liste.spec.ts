import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDossiersListe } from './agent-dossiers-liste';

describe('AgentDossiersListe', () => {
  let component: AgentDossiersListe;
  let fixture: ComponentFixture<AgentDossiersListe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentDossiersListe],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentDossiersListe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
