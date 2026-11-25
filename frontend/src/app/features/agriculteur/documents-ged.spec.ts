import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsGed } from './documents-ged';

describe('DocumentsGed', () => {
  let component: DocumentsGed;
  let fixture: ComponentFixture<DocumentsGed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsGed],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsGed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
