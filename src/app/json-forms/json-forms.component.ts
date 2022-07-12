import { Component, OnChanges , Input, Output, SimpleChanges, ChangeDetectionStrategy, EventEmitter, OnInit } from '@angular/core';
import { JsonFormData, IBMConfig } from '../shared/dynamic-form';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-json-forms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './json-forms.component.html',
  styleUrls: ['./json-forms.component.scss'],
})
export class JsonFormsComponent implements OnChanges  {
  @Input() jsonDynamicForm: JsonFormData;
  @Input() ibmConfig: IBMConfig = {orgId: '', api_key: '', auth_token: '', device_type: '', device_id: '', subscribe_mon: '', subscribe_evt: '', publish_evt: ''};
  @Output()
  formValues: EventEmitter<any> = new EventEmitter<any>();
  public myForm: FormGroup = new FormGroup({});

  constructor( private fb: FormBuilder ) { 
    this.myForm = this.fb.group({});
  }

  ngOnChanges (changes: SimpleChanges) {
      if (changes.jsonDynamicForm && !changes.jsonDynamicForm.firstChange) {
        this.createForm(this.jsonDynamicForm.controls);
      }
  }

  createForm(controllers){
    controllers.forEach(controls => {
      this.myForm.addControl( controls.name, this.fb.control({value:controls.value, disabled: controls.disabled})); 
    });
    // for (let controls of controllers){
    //   this.myForm.addControl( controls.name, this.fb.control({value:controls.value, disabled: controls.disabled})); 
    // }
  }

  valuesFromFile(values){
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
          this.myForm.get(key)?.setValue(values[key]);
      }
    }
  }

  onSubmit(){
    if(this.myForm.valid){
      this.formValues.emit(this.myForm.value);
    }
  }

}
