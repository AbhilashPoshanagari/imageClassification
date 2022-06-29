import { Component, OnChanges , Input, Output, SimpleChanges, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { JsonFormData } from '../shared/dynamic-form';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-json-forms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './json-forms.component.html',
  styleUrls: ['./json-forms.component.scss'],
})
export class JsonFormsComponent implements OnChanges  {
  @Input() jsonDynamicForm: JsonFormData;
  @Output()
  formValues: EventEmitter<any> = new EventEmitter<any>();
  public myForm: FormGroup;

  constructor( private fb: FormBuilder ) { 
    this.myForm = this.fb.group({});
  }

  ngOnChanges (changes: SimpleChanges) {
    console.log("Json Dynamic Data : ", this.jsonDynamicForm);
    if (!changes.jsonDynamicForm.firstChange) {
      this.createForm(this.jsonDynamicForm.controls);
    }
  }

  createForm(controllers){
    console.log("Controllers : ", controllers);
    for (let controls of controllers){
      this.myForm.addControl( controls.name, this.fb.control(controls.value)); 
    }
  }

  onSubmit(){
    
    if(this.myForm.valid){
      console.log('Form valid: ', this.myForm.valid);
    console.log('Form values: ', this.myForm.value);
      this.formValues.emit(this.myForm.value);
    }
  }

}
