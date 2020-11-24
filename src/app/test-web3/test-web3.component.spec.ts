import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWeb3Component } from './test-web3.component';

describe('TestWeb3Component', () => {
  let component: TestWeb3Component;
  let fixture: ComponentFixture<TestWeb3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestWeb3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWeb3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
