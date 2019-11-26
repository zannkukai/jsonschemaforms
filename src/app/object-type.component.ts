import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { EditorService } from './editor.service';

@Component({
  selector: 'app-formly-object-type',
  templateUrl: './object-type.component.html',
  styles: [
    `
      .object-block {
        border-left: 2px solid #ddd;
      }
    `
  ]
})
export class ObjectTypeComponent extends FieldType implements OnInit {
  // default value
  defaultOptions = {
    defaultValue: {}
  };

  /**
   * Constructor
   * @param editorService - EditorService, that keep the list of hidden fields
   */
  constructor(private editorService: EditorService) {
    super();
  }

  /***
   * Component init
   */
  ngOnInit() {
    this.addHiddenFields();
  }

  /**
   * Push the field to hide in the editor Service
   */
  addHiddenFields() {
    if (!this.isRoot()) {
      return;
    }
    for (const f of this.field.fieldGroup) {
      if (f.hide) {
        this.editorService.addHiddenField(f);
      }
    }
  }

  /**
   * Is my parent an array?
   * @returns boolean, true if my parent is an array
   */
  isParrentArray() {
    return this.field.parent.type === 'array';
  }

  /**
   * Is my children objects?
   * @param field - FormlyFieldConfig, from config
   * @returns boolean, true if my childre are objects
   */
  isChildenObject(field) {
    return field.type === 'object';
  }

  /**
   * Am I at the root of the form?
   * @returns boolean, true if I'm the root
   */
  isRoot() {
    return this.field.parent.parent === undefined;
  }

  /**
   * Hide the field
   * @param field - FormlyFieldConfig, the field to hide
   */
  hide(field: FormlyFieldConfig) {
    field.hide = true;
    field.formControl.reset();
    if (this.isRoot()) {
      this.editorService.addHiddenField(field);
    }
  }

  /**
   * Show the field
   * @param field - FormlyFieldConfig, the field to show
   */
  show(field: FormlyFieldConfig) {
    field.hide = false;
  }

  /**
   * Is the field can be hidden?
   * @param field - FormlyFieldConfig, the field to hide
   * @returns boolean, true if the field can be hidden
   */
  canHide(field: FormlyFieldConfig) {
    return !field.templateOptions.required && !field.hide;
  }
}
