import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { EditorService } from '../editor.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/public_api';

interface FormlyFieldConfigSelection {
  name: string;
  field: FormlyFieldConfig;
}

@Component({
  selector: 'app-add-field-editor',
  templateUrl: './add-field-editor.component.html'
})
export class AddFieldEditorComponent implements OnInit, OnDestroy {
  // current input value
  value;

  // current list of object for autocomplete
  typeheadFields: FormlyFieldConfigSelection[] = [];

  // for unsubscribe
  _subscriber;

  // list of fields to populate autocomplete
  @Input()
  fields: FormlyFieldConfig[];

  /***
   * Constructor
   * @param editorService - EditorService, that keep the list of hidden fields
   */
  constructor(private editorService: EditorService) {}

  /***
   * Component init
   */
  ngOnInit() {
    this._subscriber = this.editorService.hiddenFields
      .asObservable()
      .subscribe(fields => this._populateAutoComplete(fields));
  }

  /***
   * Component destroy
   */
  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  /***
   * Shows the selected field when it is selected
   * @param match - TyepeaheadMath, the selected element
   */
  itemSelected(match: TypeaheadMatch) {
    this.showSelectedField(match.item.field);
  }

  /***
   * Shows the selected field when it is selected
   * @param match - TyepeaheadMath, the selected element
   */
  showSelectedField(field) {
    // show the field in the form
    field.hide = false;
    // reset the input value
    this.value = undefined;
    // remove the the element from the list of hidden fields
    this.editorService.removeHiddenField(field);
    // scroll at the right position
    // to avoid: Expression has changed after it was checked
    // See: https://blog.angular-university.io/angular-debugging/
    setTimeout(() => {
      const el = document.getElementById(field.id);
      el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /**
   * Get all essential fields to add as nav shortcut.
   * @returns - FormlyFieldConfigSelection[], the filtered selection values
   */
  getEssentials(): FormlyFieldConfigSelection[] {
    return this.typeheadFields.filter(
      f =>
        f.field.templateOptions.navigation &&
        f.field.templateOptions.navigation.essential === true
    );
  }

  private _populateAutoComplete(fields: FormlyFieldConfig[]) {
    this.typeheadFields = [];
    for (const field of fields) {
      this.typeheadFields.push({
        name: field.templateOptions.label,
        field
      });
    }
  }
}
