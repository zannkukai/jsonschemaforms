import { EventEmitter, Component, OnInit, Input, Output } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { EditorService } from '../editor.service';
import { JSONSchema7 } from 'json-schema';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { orderedJsonSchema, removeEmptyValues, isEmpty } from '../utils';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  // angular formGroop root
  form: FormGroup;

  // initial data
  @Input()
  model: any;

  // additionnal form options
  options: FormlyFormOptions;

  // form configuration
  fields: FormlyFieldConfig[];

  // list of fields to display in the TOC
  tocFields = [];

  // JSONSchema
  @Input()
  schema: any;

  // fire when the model has changed
  @Output() modelChanged = new EventEmitter<any>();

  /**
   * Constructor
   * @param formlyJsonschema - FormlyJsonschema, the ngx-fomly jsonschema service
   */
  constructor(
    private formlyJsonschema: FormlyJsonschema,
    private editorService: EditorService // private changeDetectorRef: ChangeDetectorRef
  ) {
    this.form = new FormGroup({});
  }

  ngOnInit() {
    this.schema = orderedJsonSchema(this.schema);

    // this.form.valueChanges.subscribe(x => console.log(x));
    this.options = {};

    // form configuration
    const fields = [
      this.formlyJsonschema.toFieldConfig(this.schema, {
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
            // select labels and values
            if (formOptions.navigation) {
              field.templateOptions.navigation = formOptions.navigation;
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
            // afterContentInit: () => this.changeDetectorRef.detectChanges(),
            afterViewInit: f => {
              if (
                f.hide === true &&
                isEmpty(removeEmptyValues(f.model)) === false
              ) {
                // to avoid: Expression has changed after it was checked
                // See: https://blog.angular-university.io/angular-debugging
                setTimeout(() => {
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
    this.fields = fields;
    this.form.statusChanges.subscribe(() => this.getTocFields());
  }

  /**
   * Call to emit event.
   * @param model - any, updated model
   */
  modelChange(model: any) {
    this.modelChanged.emit(model);
  }

  /**
   * Simulate the form submission
   * Actually, print the result on the console
   * @param model - object, JSON to POST on the backend
   */
  submit(model) {
    console.log(removeEmptyValues(model));
  }

  /**
   * Scroll the window in to the DOM element corresponding to a given config field.
   * @param event - click DOM event
   * @param field - FormlyFieldConfig, the form config corresponding to the DOM element to jump to.
   */
  scrollTo(event, field: FormlyFieldConfig) {
    event.preventDefault();
    setTimeout(() => {
      const el = document.getElementById(field.id);
      el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /**
   * Populate the field to add to the TOC
   */
  getTocFields() {
    setTimeout(
      () =>
        (this.tocFields = this.fields[0].fieldGroup.filter(
          f => f.hide !== true
        ))
    );
  }
}
