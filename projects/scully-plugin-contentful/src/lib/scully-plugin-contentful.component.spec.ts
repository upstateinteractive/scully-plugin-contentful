import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScullyPluginContentfulComponent } from './scully-plugin-contentful.component';

describe('ScullyPluginContentfulComponent', () => {
  let component: ScullyPluginContentfulComponent;
  let fixture: ComponentFixture<ScullyPluginContentfulComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScullyPluginContentfulComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScullyPluginContentfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
