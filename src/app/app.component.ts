import {
  Component,
  ɵSWITCH_COMPILE_INJECTABLE__POST_R3__
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7 } from 'json-schema';
import { EditorService } from './editor.service';

/**
 * Fix order in JSONSchema
 * This re-order the object properties given a local defined
 * `propertiesOrder` property.
 * @param schema - object, the JSONSchema
 * @returns object, a fresh copy of the ordred JSONSchema
 */
function orderedJsonSchema(schema) {
  if (schema.properties) {
    if (schema.propertiesOrder) {
      // copy the data
      schema._properties = { ...schema.properties };
      // new ordered properties
      schema.properties = {};
      // copy in the right order
      for (const property of schema.propertiesOrder) {
        schema.properties[property] = schema._properties[property];
      }
    }
    // recursion for objects
    for (const property of Object.keys(schema.properties)) {
      orderedJsonSchema(schema.properties[property]);
    }
  }
  // recursion for array
  if (schema.items) {
    orderedJsonSchema(schema.items);
  }
  return schema;
}

/**
 * Tell if a value can be considered as empty
 * @param value - any, the value to check
 * @returns boolean, true if the value is empty
 */
function isEmpty(value) {
  return (
    // null or undefined
    value == null ||
    // has length and it's zero (array, string)
    (value.hasOwnProperty('length') && value.length === 0) ||
    // is an Object and has no keys
    (value instanceof Object && Object.keys(value).length === 0)
  );
}

/**
 * Recursively remove the empty values
 * @param data - object, the data to be cleaned
 * @returns object, a fresh copy of the clean data
 */
function removeEmptyValues(data) {
  // array?
  if (data instanceof Array) {
    // new array with non empty values
    const newArray = [];
    for (const d of data) {
      // recursion
      const value = removeEmptyValues(d);
      if (!isEmpty(value)) {
        newArray.push(value);
      }
    }
    return newArray;
  }
  // object?
  if (data instanceof Object) {
    // new object with non empty values
    const newObject = {};
    for (const key of Object.keys(data)) {
      const value = removeEmptyValues(data[key]);
      if (!isEmpty(value)) {
        newObject[key] = value;
      }
    }
    return newObject;
  }
  return data;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  // angular formGroop root
  form: FormGroup;
  // initial data
  model: any;
  // additionnal form options
  options: FormlyFormOptions;
  // form configuration
  fields: FormlyFieldConfig[];
  // JSONSchema
  schema: any = {
    title: 'Test editor',
    description: 'description',
    type: 'object',
    required: ['title', 'authors', 'types'],
    propertiesOrder: [
      'types',
      'title',
      'language',
      'authors',
      'collation',
      'notes',
      'address',
      'private',
      'object1',
      'nested'
    ],
    properties: {
      $schema: {
        title: 'JSONSchema URI',
        type: 'string'
      },
      language: {
        type: 'string',
        title: 'language',
        minLength: 3,
        form: {
          validation: {
            messages: {
              minlength:
                'Should be in the ISO 639 format, with 3 characters, ie "eng" for English.'
            }
          }
        }
      },
      object1: {
        type: 'object',
        title: 'object1',
        form: { hide: true },
        description: 'description',
        properties: {
          object2: {
            type: 'object',
            description: 'description',
            title: 'object2',
            properties: {
              value1: {
                type: 'string',
                description: 'description',
                title: 'value1'
              },
              value2: {
                type: 'string',
                description: 'description',
                title: 'value2'
              }
            }
          }
        }
      },
      collation: {
        type: 'object',
        description: 'description',
        title: 'collation',
        form: { hide: true },
        properties: {
          pages: {
            type: 'string',
            description: 'description',
            title: 'pages'
          },
          dimensions: {
            type: 'string',
            description: 'description',
            title: 'dimensions',
            form: {
              hide: true
            }
          }
        }
      },
      nested: {
        type: 'object',
        description: 'description',
        title: 'nested',
        form: { hide: true },
        properties: {
          level1: {
            type: 'array',
            minItems: 1,
            description: 'description',
            title: 'level1',
            items: {
              type: 'object',
              description: 'description',
              title: 'level11',
              properties: {
                level2: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 5,
                  description: 'description',
                  title: 'level2',
                  items: {
                    type: 'object',
                    description: 'description',
                    title: 'level21',
                    properties: {
                      value1: {
                        type: 'string',
                        description: 'description',
                        title: 'value1'
                      },
                      value2: {
                        type: 'string',
                        description: 'description',
                        title: 'value2'
                      }
                    }
                  }
                }
              }
            }
          },
          rlevel1: {
            type: 'array',
            description: 'description',
            minItems: 1,
            title: 'rlevel1',
            items: {
              type: 'string',
              description: 'description',
              title: 'rvalue'
            }
          }
        }
      },
      title: {
        title: 'Title',
        description: 'un super titre',
        type: 'string',
        form: {
          placeholder: 'please enter a title',
          focus: true
        }
      },
      notes: {
        title: 'Notes',
        description: 'description',
        type: 'array',
        minItems: 1,
        form: {
          hide: true
        },
        items: {
          type: 'string',
          description: 'description',
          title: 'note',
          minLength: 3,
          form: {
            placeholder: 'please enter a new note'
          }
        }
      },
      address: {
        description: 'description',
        title: 'Addresses',
        type: 'array',
        minItems: 1,
        form: { hide: true },
        items: {
          description: 'description',
          title: 'address',
          type: 'object',
          properties: {
            street: {
              description: 'description',
              title: 'street',
              type: 'string'
            },
            number: {
              type: 'array',
              minItems: 1,
              description: 'Building numbers',
              title: 'numbers',
              form: {
                hide: true
              },
              items: {
                description: 'Building number: i.e. No. 2',
                title: 'number',
                type: 'string'
              }
            }
          }
        }
      },
      private: {
        description: 'description',
        title: 'Private',
        type: 'string',
        default: 'private',
        readOnly: true,
        minLength: 3
      },
      hidden: {
        description: 'description',
        title: 'Hidden field',
        type: 'string',
        form: {
          hide: true
        }
      },
      authors: {
        type: 'array',
        minItems: 1,
        maxItems: 3,
        description: 'description',
        title: 'Authors',
        form: {
          helpURL: 'http://www.rdaregistry.info/Elements/m/object/#P30267'
        },
        items: {
          type: 'object',
          description: 'description',
          title: 'author',
          required: [
            'first_name',
            'last_name',
            'roles',
            'organisation',
            'library',
            'patron_barcode'
          ],
          properties: {
            first_name: {
              description: 'description',
              title: 'last name',
              type: 'string',
              minLength: 3
            },
            last_name: {
              description: 'description',
              title: 'first name',
              type: 'string',
              minLength: 3
            },
            roles: {
              type: 'array',
              minItems: 1,
              title: 'roles',
              uniqueItems: true,
              items: {
                type: 'string',
                enum: ['librarian', 'system librarian', 'patron']
              }
            },
            patron_barcode: {
              type: 'string',
              title: 'Patron barcode',
              minLength: 6,
              form: {
                hideExpression: '!model.roles.some(r => r === "patron")'
              }
            },
            library: {
              type: 'string',
              title: 'Library afiliated to the librarian',
              minLength: 6,
              form: {
                hideExpression:
                '!model.roles.some(r => r === "librarian" || r === "system librarian")',
                expressionProperties: {
                  'templateOptions.required':
                    'model.roles.some(r => r === "librarian" || r === "system librarian")'
                }
              }
            },
            organisation: {
              type: 'string',
              title: 'Organisation afiliated to the system librarian',
              minLength: 6,
              form: {
                hideExpression:
                '!model.roles.some(r => r === "librarian" || r === "system librarian")',
                expressionProperties: {
                  'templateOptions.required':
                    'model.roles.some(r => r === "system librarian")'
                }
              }
            }
          }
        }
      },
      types: {
        type: 'string',
        description: 'description',
        title: 'Types',
        default: 'book',
        enum: ['book', 'report'],
        form: {
          options: [
            {
              label: 'Livre',
              value: 'book'
            },
            {
              label: 'Rapport',
              value: 'report'
            }
          ]
        }
      }
    }
  };

  /**
   * Constructor
   * @param formlyJsonschema - FormlyJsonschema, the ngx-fomly jsonschema service
   */
  constructor(
    private formlyJsonschema: FormlyJsonschema,
    private editorService: EditorService) {

    this.schema = orderedJsonSchema(this.schema);
    this.form = new FormGroup({});
    this.options = {};

    // form configuration
    this.fields = [
      formlyJsonschema.toFieldConfig(this.schema, {
        // post process JSONSChema7 to FormlyFieldConfig conversion
        map: (field: FormlyFieldConfig, mapSource: JSONSchema7) => {
          // additionnal JSONSchema configurations
          const formOptions = mapSource.form;
          if (formOptions) {
            // hide a field at startup
            if (formOptions.hide === true) {
              field.hide = true;
            }
            // put the focus in this field
            if (formOptions.focus === true) {
              field.focus = true;
            }
            // input placeholder
            if (formOptions.placeholder) {
              field.templateOptions.placeholder = formOptions.placeholder;
            }
            // select labels and values
            if (formOptions.options) {
              field.templateOptions.options = formOptions.options;
            }
            // select labels and values
            if (formOptions.helpURL) {
              field.templateOptions.helpURL = formOptions.helpURL;
            }
            // select labels and values
            if (formOptions.expressionProperties) {
              field.expressionProperties = formOptions.expressionProperties;
            }
            // select labels and values
            if (formOptions.hideExpression) {
              field.hideExpression = formOptions.hideExpression;
            }
            // custom validation messages
            if (formOptions.validation) {
              const messages = formOptions.validation.messages;
              if (!field.validation) {
                field.validation = {};
              }
              if (!field.validation.messages) {
                field.validation.messages = {};
              }
              for (const key of Object.keys(messages)) {
                field.validation.messages[key] = (
                  error,
                  f: FormlyFieldConfig
                ) => `${messages[key]}`;
              }
            }
          }

          // render input fields inline
          if (mapSource.type === 'string') {
            field.wrappers = ['form-field-horizontal'];
          }

          // initial population of arrays with a minItems constraints
          if (mapSource.minItems && !mapSource.hasOwnProperty('default')) {
            field.defaultValue = new Array(mapSource.minItems);
          }

          // show the field if the model contains a value
          field.hooks = {
            // not on ngInit because add-fields-editor component act on ngInit already
            afterViewInit: f => {
              if (
                f.hide === true &&
                isEmpty(removeEmptyValues(f.model)) === false
              ) {
                // to avoid: Expression has changed after it was checked
                // See: https://blog.angular-university.io/angular-debugging
                setTimeout( () => {
                  f.hide = false;
                  this.editorService.removeHiddenField(f);
                });
              }
            }
          };
          return field;
        }
      })
    ];

    // initial data
    this.model = {
      $schema: 'https://ils.rero.ch/schemas/documents.json',
      notes: ['note1', 'note2']
    };
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
   * Simulate the form submission
   * Actually, print the result on the console
   * @param model - object, JSON to POST on the backend
   */
  submit(model) {
    console.log(removeEmptyValues(model));
  }
}
