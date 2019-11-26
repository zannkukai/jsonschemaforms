import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-dropdown-label-editor',
  templateUrl: './dropdown-label-editor.component.html'
})
export class DropdownLabelEditorComponent {
  // current form field configuration
  @Input()
  field: FormlyFieldConfig;

  // can we add a new element to the related array
  @Input()
  canAdd: boolean;

  // event when the add button is clicked
  @Output() addClicked = new EventEmitter<boolean>();

  /**
   * Emit a new Ouput event when the add button is clicked
   * @param event - Event, the click event.
   */
  addClick(event) {
    this.addClicked.emit(event);
  }
}
