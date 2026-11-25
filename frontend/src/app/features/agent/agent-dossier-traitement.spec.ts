import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDossierTraitement } from './agent-dossier-traitement';

describe('AgentDossierTraitement', () => {
  let component: AgentDossierTraitement;
  let fixture: ComponentFixture<AgentDossierTraitement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentDossierTraitement],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentDossierTraitement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
