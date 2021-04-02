import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentpageComponent } from './documentpage.component';

describe('DocumentpageComponent', () => {
  let component: DocumentpageComponent;
  let fixture: ComponentFixture<DocumentpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
