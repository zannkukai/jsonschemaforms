import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-horizontal-wrapper',
  template: `
    <div class="form-group mb-0 row">
      <label [attr.for]="id" class="col-sm-2 col-form-label" *ngIf="to.label">
        <span [tooltip]="to.description">{{ to.label }}</span>
        <ng-container *ngIf="to.required && to.hideRequiredMarker !== true"
          >*</ng-container
        >
      </label>
      <div class="col-sm-10">
        <ng-template #fieldComponent></ng-template>
        <div *ngIf="showError" class="col-sm-3 invalid-feedback d-block">
          <formly-validation-message
            [field]="field"
          ></formly-validation-message>
        </div>
      </div>
    </div>
  `
})
export class HorizontalComponent extends FieldWrapper {}
