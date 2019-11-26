import { Component, OnInit } from '@angular/core';
import { FieldArrayType, FormlyFieldConfig } from '@ngx-formly/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'formly-array-type',
  template: `
  <div class="mb-3">
  <div class="float-right  text-right">
  <button [ngClass]="{'disabled': !canAdd()}"
  class="btn btn-outline-secondary btn-sm" type="button" (click)="add(i)"><i class="fa fa-plus"></i></button>
</div>
      <h5 *ngIf="to.label">{{ to.label }} <span *ngIf="field.templateOptions.required">*</span></h5>

    <p *ngIf="to.description">{{ to.description }}</p>

    <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
      <formly-validation-message [field]="field"></formly-validation-message>
    </div>

    <div *ngFor="let field of field.fieldGroup;let i = index;" class="row">
      <div class="text-left col-1">
      <div class="btn-group" dropdown>
      <button id="button-basic" dropdownToggle type="button"
        class="btn btn-link text-decoration-none text-muted p-0" aria-controls="dropdown-basic"
        aria-haspopup="true" aria-expanded="false">
        ...
      </button>
      <div class="dropdown-menu" *dropdownMenu>
        <!-- <button class="dropdown-item" (click)="addItem($event)">Add</button> -->
        <button *ngIf="canAdd()" class="dropdown-item" (click)="add(i)" translate>New</button>
        <button *ngIf="canRemove()" class="dropdown-item" (click)="remove(i)" translate>Remove</button>
        <button *ngIf="true" class="dropdown-item" (click)="hide()" translate>Hide</button>
        <a class="dropdown-item disabled" href="/cataloging/help" translate>Help</a>
      </div>
    </div>
      </div>
    <formly-field class="col-11" [field]="field"></formly-field>
    </div>

  </div>
  `,
})
export class ArrayTypeComponent extends FieldArrayType implements OnInit {
  onPopulate(field: FormlyFieldConfig) {
    console.log('pop', field);
    super.onPopulate(field);
    // console.log();
    // if (field.templateOptions.required) {
    //   this.add(0);
    // }
  }

  ngOnInit() {
    console.log('init');
    // if (this.field.templateOptions.required) {
    //   super.add(0);
    // }
  }

  canAdd() {
    console.log(this.field.templateOptions.required);
    const maxItems = this.field.templateOptions.maxItems;
    if (maxItems === undefined) {
      return true;
    }
    return this.field.fieldGroup.length < maxItems;
  }

  canRemove() {
    const minItems = this.field.templateOptions.minItems;
    if (minItems === undefined) {
      return true;
    }
    return this.field.fieldGroup.length > minItems;
  }

  add(i: number) {
    super.add(i);
    this.field.fieldGroup[this.field.fieldGroup.length - 1].focus = true;
  }

  hide() {
    this.field.hide = true;
    for(let i=0; i<this.formControl.length; i++) {
      this.remove(0);
    }
  }

}
