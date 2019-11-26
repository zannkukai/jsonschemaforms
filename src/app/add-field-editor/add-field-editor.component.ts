import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { EditorService } from '../editor.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/public_api';

@Component({
  selector: 'app-add-field-editor',
  templateUrl: './add-field-editor.component.html'
})
export class AddFieldEditorComponent implements OnInit, OnDestroy {
  // current input value
  value;
  // current list of object for autocomplete
  typeheadFields = [];

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
  showSelectedField(match: TypeaheadMatch) {
    // show the field in the form
    match.item.field.hide = false;
    // reset the input value
    this.value = undefined;
    // remove the the element from the list of hidden fields
    this.editorService.removeHiddenField(match.item.field);
    // scroll at the right position
    // to avoid: Expression has changed after it was checked
    // See: https://blog.angular-university.io/angular-debugging/
    setTimeout(() => {
      const el = document.getElementById(match.item.field.id);
      el.scrollIntoView({ behavior: 'smooth' });
    });
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
