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
  @Input() ibmConfig: IBMConfig;
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
      for (const key in  this.ibmConfig) {
       if(key===controls.name){
        this.myForm.addControl( controls.name, this.fb.control(controls.value));
        if(this.ibmConfig[key] !== ''){
          this.myForm.get(controls.name).setValue(this.ibmConfig[key]);
        }
       }
      }

    }
  }

  onSubmit(){
    if(this.myForm.valid){
      this.formValues.emit(this.myForm.value);
    }
  }

}
