interface JsonFormValidators {
    min?: number;
    max?: number;
    required?: boolean;
    requiredTrue?: boolean;
    email?: boolean;
    minLength?: boolean;
    maxLength?: boolean;
    pattern?: string;
    nullValidator?: boolean;
  }
  
  interface JsonFormControlOptions {
    min?: string;
    max?: string;
    step?: string;
    icon?: string;
  }
  
  interface JsonFormControls {
    name: string;
    label: string;
    value: string;
    type: string;
    options?: JsonFormControlOptions;
    required: boolean;
    validators: JsonFormValidators;
  }
  
  export interface JsonFormData {
    controls: JsonFormControls[];
  }

  export interface IBMConfig {
    orgId: string;
     api_key: string; 
     auth_token: string;
     device_type: string; 
     device_id: string; 
     subscribe_mon: string; 
     subscribe_evt: string;
     publish_evt: string;
  }