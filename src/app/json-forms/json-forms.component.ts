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
  public myForm: FormGroup;

  constructor( private fb: FormBuilder ) { 
    this.myForm = this.fb.group({});
  }

  ngOnChanges (changes: SimpleChanges) {
      if (changes.jsonDynamicForm && !changes.jsonDynamicForm.firstChange) {
        this.createForm(this.jsonDynamicForm.controls);
      }
  }

  createForm(controllers){
    for (let controls of controllers){

      // for (const key in  this.ibmConfig) {
      //  if(key===controls.name){
      //   this.myForm.addControl( controls.name, this.fb.control(controls.value));
      //   if(this.ibmConfig[key] !== ''){
      //     this.myForm.get(controls.name).setValue(this.ibmConfig[key]);
      //   }
      //  }
      // }
    if(!this.ibmConfig.orgId){
        this.myForm.addControl( controls.name, this.fb.control({value:controls.value, disabled: controls.disabled})); 
      }
      else if(this.ibmConfig.orgId){
          for (let key in this.ibmConfig) {
            if(key == controls.name){
              controls.value = this.ibmConfig[key];
            }
          }
        this.myForm.addControl( controls.name, this.fb.control({value:controls.value, disabled: controls.disabled}));
        this.myForm.get(controls.name)?.setValue(controls.value);
      }
    }
  }

  onSubmit(){
    if(this.myForm.valid){
      this.formValues.emit(this.myForm.value);
    }
  }

}
