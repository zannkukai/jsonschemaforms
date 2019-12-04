import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFieldEditorComponent } from './add-field-editor.component';

describe('AddFieldEditorComponent', () => {
  let component: AddFieldEditorComponent;
  let fixture: ComponentFixture<AddFieldEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddFieldEditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFieldEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
