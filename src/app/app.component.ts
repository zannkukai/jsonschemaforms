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
        form: {
          hide: true,
          navigation: {
            essential: true
          }
        },
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
        form: {
          hide: true,
          navigation: {
            essential: true
          }
        },
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

  // initial data
  model = {
    $schema: 'https://ils.rero.ch/schemas/documents.json',
    notes: ['note1', 'note2']
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
