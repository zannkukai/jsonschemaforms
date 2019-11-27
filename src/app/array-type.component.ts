import { Component, OnInit, AfterViewInit, OnChanges } from "@angular/core";
import {
  FieldArrayType,
  FormlyFieldConfig,
  FormlyFormOptions
} from "@ngx-formly/core";
import { FormArray, FormGroup } from "@angular/forms";
import { AngularWaitBarrier } from "blocking-proxy/built/lib/angular_wait_barrier";

@Component({
  selector: "formly-array-type",
  template: `
    <div
      class="alert alert-danger"
      role="alert"
      *ngIf="showError && formControl.errors"
    >
      <formly-validation-message [field]="field"></formly-validation-message>
    </div>

    <ng-container *ngFor="let field of field.fieldGroup; let i = index">
      <div *ngIf="isChildrenObject()">
        <div
          *ngIf="field.templateOptions.label"
          class="btn-group d-block"
          dropdown
        >
          <button
            id="button-basic"
            dropdownToggle
            type="button"
            class="btn btn-link dropdown-toggle text-decoration-none text-reset p-0 dropdown-toggle"
            aria-controls="dropdown-basic"
          >
            {{ field.templateOptions.label }}
            <span *ngIf="field.templateOptions.required">*</span>
            <span class="ml-2 caret"></span>
          </button>
          <div
            id="dropdown-basic"
            *dropdownMenu
            class="dropdown-menu"
            role="menu"
            aria-labelledby="button-basic"
          >
            <button
              *ngIf="canAdd()"
              class="dropdown-item"
              (click)="add(i)"
              translate
            >
              New
            </button>
            <a class="dropdown-item disabled" href="/cataloging/help" translate
              >Help</a
            >
          </div>
        </div>
        <p *ngIf="field.templateOptions.description">{{ to.description }}</p>

        <div
          class="alert alert-danger"
          role="alert"
          *ngIf="field.options.showError && field.formControl.errors"
        >
          <formly-validation-message
            [field]="field"
          ></formly-validation-message>
        </div>
      </div>
      <div
        class="d-flex mb-2"
        [ngClass]="{ 'pl-4 object-block': !isChildrenObject() }"
      >
        <button
          *ngIf="!isChildrenObject()"
          (click)="add(i)"
          class="btn btn-light bg-white mr-2"
        >
          <i class="fa fa-plus"></i>
        </button>
        <div class="flex-grow-1">
          <formly-field [field]="field"></formly-field>
        </div>
        <button
          (click)="remove(i)"
          class="btn btn-light bg-white ml-2"
          [ngClass]="{ 'mb-2': isChildrenObject() }"
        >
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .object-block {
        border-left: 2px solid #ddd;
      }
    `
  ]
})
export class ArrayTypeComponent extends FieldArrayType
  implements OnInit, AfterViewInit {
  ngOnInit() {
    this.field.templateOptions.parent = this;
    console.log(this);
  }
  ngAfterViewInit() {
    // viewChild is set after the view has been initialized
    // if (this.field.templateOptions.required) {
    super.add(0);
    // }
  }

  canAdd() {
    // console.log(this.field.templateOptions.required);
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

  isChildrenObject() {
    // return true;
    return this.field.fieldArray.type === "object";
  }

  hide() {
    this.field.hide = true;
    for (let i = 0; i < this.formControl.length; i++) {
      this.remove(0);
    }
  }
}
