import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesContact } from './messages-contact';

describe('MessagesContact', () => {
  let component: MessagesContact;
  let fixture: ComponentFixture<MessagesContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesContact],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesContact);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
