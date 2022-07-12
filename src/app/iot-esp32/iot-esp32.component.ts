import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IBMConfig } from '../shared/dynamic-form';

declare var Paho;

interface IotOrgForm {
  ORG: string;
  DEVICE_TYPE: string;
  DEVICE_ID: string;
  TOKEN: string;  
  TOPIC: string;
}



@Component({
  selector: 'app-iot-esp32',
  templateUrl: './iot-esp32.component.html',
  styleUrls: ['./iot-esp32.component.scss']
})
export class IotEsp32Component implements OnInit, AfterViewInit {

  ORG: string;
  DEVICE_TYPE: string;
  DEVICE_ID: string;
  username: string;
  password: string;
  monTopic: string;
  eventTopic: string;
  publishTopic: string; 
  mqttClient: any;
  MQTT_CONFIG: {
    host: string,
    port: number,
    clientId: string,
  };
  switch: boolean = true;
  isChecked = false;
  PotentiameterReading: any;
  iotForm: FormGroup;
  dynamicForm: any;
  configFile: IBMConfig = {orgId: '', api_key: '', auth_token: '', device_type: '', device_id: '', subscribe_mon: '', subscribe_evt: '', publish_evt: ''};
  isConfigured: boolean = false;
  deviceState: string = '';
  ibmConfig: IBMConfig = {orgId: '', api_key: '', auth_token: '', device_type: '', device_id: '', subscribe_mon: '', subscribe_evt: '', publish_evt: ''};
  loading: boolean;
  infoMessage: string;
  constructor( private ngZone: NgZone,
              private http: HttpClient ) { 
        }

  ngOnInit() {
  
  }

  ngAfterViewInit(): void {
    this.getForm();
  }

  getForm(){
    this.http.get('./assets/iotIBMOrgForm.json').subscribe((res) => {
      this.dynamicForm = res;
      // this.configFile = values;
    }, err => console.log("Error : ", err));
  }

  connectMQTT(orgConfig){
    let that = this;
    for (const key in orgConfig) {
        if(orgConfig[key] === ''){
          alert(key + ' is missing please check');
          return;
        }
    }
    if(!orgConfig.orgId){
      alert("org Id missing please check");
      return;
    }
    else {
      this.ORG = orgConfig.orgId;
      this.DEVICE_TYPE = orgConfig.device_type;
      this.DEVICE_ID = orgConfig.device_id;
      this.username = orgConfig.api_key;
      this.password = orgConfig.auth_token;
      this.monTopic = orgConfig.subscribe_mon;
      this.eventTopic = orgConfig.subscribe_evt;
      this.publishTopic = orgConfig.publish_evt;
      this.MQTT_CONFIG = {
        host: this.ORG + ".messaging.internetofthings.ibmcloud.com",
        port: 8883,
        clientId: "a:" + this.ORG + ":" +Math.random().toString(16).substr(2, 8)
      };
      this.loading = true;
              // Create a client instance
        this.mqttClient = new Paho.MQTT.Client(this.MQTT_CONFIG.host, Number(this.MQTT_CONFIG.port), this.MQTT_CONFIG.clientId);
          //Connect Options
  
          this.mqttClient.onConnectionLost = onConnectionLost;
          this.mqttClient.onMessageArrived = onMessageArrived;      
  
          //Creates a new Messaging.Message Object and sends it to the HiveMQ MQTT Broker
          this.mqttClient.connect({
          userName: this.username,
          password: this.password,
          keepAliveInterval: 3600,
          useSSL: true,
          timeout: 3,
          onSuccess: this.onConnect.bind(this),
          onFailure: this.onFailure.bind(this)});
  
          // called when the client loses its connection
            function onConnectionLost(responseObject) {
              if (responseObject.errorCode !== 0) {
                alert("onConnectionLost: "+responseObject.errorMessage);
                this.isConfigured = false;
              }
            }
  
            // called when a message arrives
            function onMessageArrived(message) {
              that.ngZone.run(() => {
                let changeFormat = JSON.parse(message.payloadString);
                that.PotentiameterReading = parseInt(changeFormat);
                if(changeFormat && changeFormat['Action']){
                  that.deviceState = changeFormat['Action'];
                  console.log('client connected : ', changeFormat);
                  console.log('client connected : ', that.deviceState);
                }
              });
            }
    }
  }
  
  onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    // console.log("onConnect");
    // this.mqttClient.subscribe("iot-2/evt/status/fmt/string");
    this.ngZone.run(() => {
      this.isConfigured = true;
      this.infoMessage = 'Connected';
      this.loading = false;
          this.mqttClient.subscribe(this.monTopic);
          this.mqttClient.subscribe(this.eventTopic);
    });
  }

  onFailure(e) { 
    this.ngZone.run(() => {
      this.loading = false;
      this.deviceState = 'Disconnect';
      this.infoMessage = 'Disconnect';
      this.isConfigured = false;
    })
  }

  onPublish(ev){
    //Send your message (also possible to serialize it as JSON or protobuf or just use a string, no limitations)
    if(this.isConfigured && this.mqttClient.isConnected()){
        if(!this.isChecked){
          var message = new Paho.MQTT.Message('0');
        }
        else{
          var message = new Paho.MQTT.Message('1');
        }
        message.destinationName = this.publishTopic;
        this.mqttClient.send(message);

    }
    else {
      alert("MQTT connection failed!");
    }
  }

  // async fileChange(event) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.readAsText(file, "UTF-8");
  //     reader.onload = (res: any) => {
  //     let configFile = JSON.parse(res.target.result.toString());
  //     setTimeout(() => {
  //       // this.getForm(configFile);
  //     }, 500);
  //     }
  //     reader.onerror = (error) => {
  //     }
  //   }
  // }

  isConnected(){
    this.ngZone.run(() => {
      const connected = this.mqttClient.isConnected();
      if(!connected){
        this.isConfigured = false;
        // if(this.configFile.orgId){
        //   this.connectMQTT(this.configFile);
        // }
        // else{
        //   this.isConfigured = false;
        // }
      }
    });
  }

  mqttConnection(){
    
  }

  disconnectMQTT(){
    if(this.mqttClient.isConnected()){
      this.mqttClient.disconnect();
      this.infoMessage = 'Disconnect';
      this.deviceState = 'Disconnect';
      this.isConfigured = false;
    }
  }

}
