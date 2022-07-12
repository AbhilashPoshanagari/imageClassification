import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IBMConfig } from '../shared/dynamic-form';

@Component({
  selector: 'app-ibm-config',
  templateUrl: './ibm-config.component.html',
  styleUrls: ['./ibm-config.component.scss']
})
export class IbmConfigComponent implements OnInit {
  ibmForm: FormGroup;
  formControllers: Array<any> = [];
  ibmConfig: IBMConfig = {orgId: '', api_key: '', auth_token: '', device_type: '', device_id: '', subscribe_mon: '', subscribe_evt: '', publish_evt: ''};
  @Output() formValues: EventEmitter<any> = new EventEmitter<any>()
  constructor(private fb: FormBuilder) { 
    this.ibmForm = this.fb.group({
                    orgId: '', 
                    api_key: '', 
                    auth_token: '', 
                    device_type: '', 
                    device_id: '', 
                    subscribe_mon: '', 
                    subscribe_evt: '', 
                    publish_evt: ''
                  })
  }

  ngOnInit(): void {
    for (const key in this.ibmConfig) {
      this.formControllers.push(key);
    }
  }

  onSubmit(){
    if(this.ibmForm.valid){
      console.log(this.ibmForm.value);
      this.formValues.emit(this.ibmForm.value);
    }
  }

  valuesFromFile(values){
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
          this.ibmForm.get(key)?.setValue(values[key]);
      }
    }
  }

}
