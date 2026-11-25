import { TestBed } from '@angular/core/testing';

import { MessageContact } from './message-contact';

describe('MessageContact', () => {
  let service: MessageContact;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageContact);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
