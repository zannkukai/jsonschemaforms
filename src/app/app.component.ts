import { Component, ɵSWITCH_COMPILE_INJECTABLE__POST_R3__ } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7 } from 'json-schema';

function orderedJsonSchema(schema) {
  if (schema.properties) {
    if (schema.propertiesOrder) {
      schema._properties = {...schema.properties};
      schema.properties = {};
      for (const property of schema.propertiesOrder) {
        schema.properties[property] = schema._properties[property];
      }
    }
    for (const property in schema.properties) {
      orderedJsonSchema(schema.properties[property]);
    }
  }
  if (schema.items) {
    orderedJsonSchema(schema.items);
  }
  return schema;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  form: FormGroup;
  model: any;
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];

  type: string;
  schema: any = {
    title: 'Test editor',
    type: 'object',
    required: ['title', 'authors'],
    // propertiesOrder: ['types', 'title', 'authors', 'street', 'address'],
    properties: {
      object1: {
        type: 'object',
        title: 'object1',
        properties: {
          object2: {
            type: 'object',
            title: 'object2',
            properties: {
              value1: {type: 'string', title: 'value1'},
              value2: {type: 'string', title: 'value2'}
            }
          }
        }
      },
      collation: {
        type: 'object',
        title: 'collation',
        properties: {
          pages: {type: 'string', title: 'pages'},
          dimensions: {type: 'string', title: 'dimensions'}
        }
      },
      nested: {
        type: 'object',
        title: 'nested',
        properties: {
          level1: {
            type: 'array',
            title: 'level1',
            items: {
              type: 'object',
              title: 'level11',
              properties: {
                level2 :{
                  type: 'array',
                  title: 'level2',
                  items: {
                    type: 'object',
                    title: 'level21',
                    properties: {
                      value1: {type: 'string', title: 'value1'},
                      value2: {type: 'string', title: 'value2'}
                    }
                  }
                }
              }
            }
          },
          rlevel1: {
            type: 'array',
            title: 'rlevel1',
            items: {
              type: 'string',
              title: 'rvalue'
            }
          }
        }
      },
      title: {
        title: 'Title',
        type: 'string',
        form: {
          placeholder: 'please enter a title',
          focus: true
        }
      },
      notes: {
        title: 'Notes',
        type: 'array',
        items: {
          type: 'string',
          title: 'note',
          minLength: 3,
          form: {
            placeholder: 'please enter a new note'
          }
        }
      },
      address: {
        title: 'Addresses',
        type: 'array',
        items: {
          title: 'address',
          type: 'object',
          // propertiesOrder: ['city', 'street'],
          properties: {
            'street': { title: 'street', type: 'string' },
            'city': {
              type: 'array',
              title: 'cities',
              items: {
                title: 'city',
                type: 'string'
              }
            }
          }
        }
      },
      private: {
        title: 'Private',
        type: 'string',
        default: 'private',
        readOnly: true,
        minLength: 3,
        form: {
          placeholder: 'please enter a street'
        }
      },
      hidden: {
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
        title: 'Authors',
        items: {
          title: 'name',
          type: 'string',
          minLength: 3
        }
      },
      types: {
        type: 'string',
        title: 'Types',
        default: 'book',
        enum: [
          'book',
          'report'
        ]
      }
    }
  }


  constructor(
    private formlyJsonschema: FormlyJsonschema
  ) {
    // console.log('prop', new Properties(this.schema).properties);
    this.schema = orderedJsonSchema(this.schema);
    // this.type = type;
    this.form = new FormGroup({});
    // this.form.valueChanges.subscribe(x => console.log(x, this.form, this.model));
    this.options = {};
    this.fields = [formlyJsonschema.toFieldConfig(this.schema, {
      map: (field: FormlyFieldConfig, mapSource: JSONSchema7) => {
        // console.log(field, mapSource);
        const formOptions = mapSource.form;
        if (formOptions) {
          if (formOptions.hide === true) {
            // redefine the field
            field.hide = true;
          }
          if (formOptions.focus === true) {
            // redefine the field
            field.focus = true;
          }
          if (formOptions.placeholder) {
            // redefine the field
            field.templateOptions.placeholder = formOptions.placeholder;
          }
        }
        if (mapSource.type === 'string') {
          field.wrappers = ['form-field-horizontal'];
        }
        // if (mapSource.type === 'array') {
        //   if (field.validators && field.validators.minItems) {
        //     field.validators.minItems = ({ value }) => {
        //       return true;
        //     };
        //   }
        // }
        console.log(field, mapSource);
        return field;
      },
    })];
    // console.log(this.fields, this.form);
    this.model = {
      // title: 'test'
    };
  }

  submit(model) {
    console.log(model, this.model);
  }
}
