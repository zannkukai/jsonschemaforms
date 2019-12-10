import { Component, OnInit } from '@angular/core';
import { removeEmptyValues } from './utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  schema: any = {
    title: 'Test editor',
    description: 'description',
    type: 'object',
    required: ['code', 'name'],
    propertiesOrder: [
      'code',
      'name',
      'is_online'
    ],
    properties: {
      $schema: {
        title: 'JSONSchema URI',
        type: 'string'
      },
      code: {
        type: 'string',
        title: 'Code',
        description: 'location internal code'
        minLength: 3
      },
      name: {
        title: 'Name',
        description: 'the location common name',
        type: 'string',
        form: {
          placeholder: 'please enter the location name',
          focus: true
        }
      }
      is_online: {
        type: 'boolean',
        description: 'Is this location is an "online" location ?',
        title: 'Is online',
        default: false,
      }
    }
  };

  // initial data
  model = {
    $schema: 'https://ils.rero.ch/schemas/documents.json',
  };

  // ouput data
  outputModel = {};

  /**
   * Component initialisation
   */
  ngOnInit() {
    this.outputModel = {...this.model};
  }

  /**
   * Remove empty values for display
   * @param model - object, the data to clean
   * @returns object, the cleaned data
   */
  clean(model) {
    return removeEmptyValues(model);
  }

  /**
   * Called when the model has been change in the editor.
   * @param model - object, the new model
   */
  modelChanged(model) {
    // copy
    this.outputModel = {...model};
  }
}
