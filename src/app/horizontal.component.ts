import { Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-horizontal-wrapper',
  template: `
    <div class="form-group mb-0 row">
      <label [attr.for]="id" class="col-sm-2 col-form-label" *ngIf="to.label">
       {{ to.label }} <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
      </label>
      <div class="col-sm-10">
        <ng-template  #fieldComponent></ng-template>
        <div *ngIf="showError" class="col-sm-3 invalid-feedback d-block">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
      </div>
    </div>
  `,
})
export class HorizontalComponent extends FieldWrapper implements OnInit {
  private _parent;
  ngOnInit() {
    this._parent = this.field.parent.templateOptions.parent;
  }
  add() {
    if (this._parent) {
      this._parent.add(0);
    }
  }
  remove() {
      if (this._parent) {
        this._parent.remove(0);
      }
  }
  hasParentArray() {
    return this.field.parent.type === 'array';
  }
}
