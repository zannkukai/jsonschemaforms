import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  // list of fields to be hidden
  _hiddenFields: FormlyFieldConfig[] = [];

  // Observable of hidden fields
  hiddenFields: BehaviorSubject<FormlyFieldConfig[]> = new BehaviorSubject([]);

  /**
   * Add a field to the hidden list
   * @param field - FormlyFieldConfig, form config to be added
   */
  addHiddenField(field: FormlyFieldConfig) {
    this._hiddenFields.push(field);
    this.hiddenFields.next(this._hiddenFields);
  }

  /**
   * Remove a field to the hidden list
   * @param field - FormlyFieldConfig, form config to be removed
   */
  removeHiddenField(field: FormlyFieldConfig) {
    this._hiddenFields = this._hiddenFields.filter(f => f.id !== field.id);
    this.hiddenFields.next(this._hiddenFields);
  }
}
