import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-object-type',
  template: `
    <legend *ngIf="isRoot()">{{ to.label }}</legend>
    <p *ngIf="isRoot() && to.description">{{ to.description }}</p>
    <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
      <formly-validation-message [field]="field"></formly-validation-message>
    </div>
    <div *ngFor="let f of field.fieldGroup" class="mb-2">
      <h5 *ngIf="!isParrentArray()">{{ f.templateOptions.label }}</h5>
      <div class="pl-4" [ngClass]="{'object-block': f.type === 'object' }">
        <formly-field [field]="f"></formly-field>
      </div>
    </div>
  `,
  styles: [
    `
    .object-block {
      border-left: 2px solid #ddd;
    }
    `
  ]
})
export class ObjectTypeComponent extends FieldType {
  defaultOptions = {
    defaultValue: {},
  };

  isParrentArray() {
    return this.field.parent.type === 'array';
  }

  isRoot() {
    return this.field.parent.parent === undefined;
  }

}
