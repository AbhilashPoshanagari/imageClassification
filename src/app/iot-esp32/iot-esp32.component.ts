import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  configFile: any = {};
  isConfigured: boolean = false;
  constructor( private ngZone: NgZone,
              private http: HttpClient ) { 
        }

  ngOnInit() {
  
  }

  ngAfterViewInit(): void {
    this.http.get('./assets/iotIBMOrgForm.json').subscribe((res) => {
      this.dynamicForm = res;
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
    this.ORG = orgConfig.orgId;
    this.DEVICE_TYPE = orgConfig.device_type;
    this.DEVICE_ID = orgConfig.device_id;
    this.username = orgConfig.api_key;
    this.password = orgConfig.auth_token;
    this.monTopic = orgConfig.subscribe_mon;
    this.eventTopic = orgConfig.subscribe_evt;
    this.MQTT_CONFIG = {
      host: this.ORG + ".messaging.internetofthings.ibmcloud.com",
      port: 1883,
      clientId: "a:" + this.ORG + ":" +Math.random().toString(16).substr(2, 8)
    };
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
        useSSL: false,
        timeout: 3,
        onSuccess: this.onConnect.bind(this),
        onFailure: this.onFailure.bind(this)});

        // called when the client loses its connection
          function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
              alert("onConnectionLost: "+responseObject.errorMessage);
            }
          }

          // called when a message arrives
          function onMessageArrived(message) {
            that.ngZone.run(() => {
              let changeFormat = JSON.parse(message.payloadString);
              that.PotentiameterReading = parseInt(changeFormat);
            });
          }
  }
  
  onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    // console.log("onConnect");
    // this.mqttClient.subscribe("iot-2/evt/status/fmt/string");
    this.isConfigured = true;
        this.mqttClient.subscribe(this.monTopic);
        this.mqttClient.subscribe(this.eventTopic);
  }

  onFailure(e) { 
    console.log("MQTT connection failed at " + Date.now() + "\nerror: " + e.errorCode + " : " + e.errorMessage);
  }

  onPublish(){
    //Send your message (also possible to serialize it as JSON or protobuf or just use a string, no limitations)
    if(this.isConfigured && this.mqttClient.isConnected()){
        if(this.isChecked){
          this.isChecked = false;
          var message = new Paho.MQTT.Message('0');      // "iot-2/type/esp32_Testing/id/esp32_testing2/evt/blink/fmt/string"
        }
        else{
          this.isChecked = true;
          var message = new Paho.MQTT.Message('1');      // "iot-2/type/esp32_Testing/id/esp32_testing2/evt/blink/fmt/string"
        }
        message.destinationName = "iot-2/type/esp32_Testing/id/esp32_testing2/evt/blink/fmt/string";
        // message.qos = 0;
        this.mqttClient.send(message);
    }
    else {
      alert("MQTT connection failed!");
    }
    
  }

  async fileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (res: any) => {
      this.configFile = JSON.parse(res.target.result.toString());
      this.connectMQTT(this.configFile);
      }
      reader.onerror = (error) => {
      }
    }
  }

}