import { TestBed } from '@angular/core/testing';

import { ScullyPluginContentfulService } from './scully-plugin-contentful.service';

describe('ScullyPluginContentfulService', () => {
  let service: ScullyPluginContentfulService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScullyPluginContentfulService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
