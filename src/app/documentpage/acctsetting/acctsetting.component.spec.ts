import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctsettingComponent } from './acctsetting.component';

describe('AcctsettingComponent', () => {
  let component: AcctsettingComponent;
  let fixture: ComponentFixture<AcctsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
