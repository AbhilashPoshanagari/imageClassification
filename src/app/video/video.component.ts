import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tfvis from '@tensorflow/tfjs-vis';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewInit {
  @ViewChild('video') video: ElementRef;
  predictions: any;
  model: any;
  loading: boolean;
  constructor() { }

  async ngOnInit() {
    const surface2 = {name: 'Values Distribution', tab: 'Model Inspection'};
    this.loading = true;
    this.model = await mobilenet.load();
    console.log("model : ",this.model);
    this.loading = false;
    const testVal = tf.tensor2d([4.4, 2.9, 1.4, 0.2], [1, 4]);
    tfvis.show.valuesDistribution(surface2, testVal);
  }

  async ngAfterViewInit() {
      const vid = this.video.nativeElement;
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            console.log("success : ");
            vid.srcObject = stream;
            setInterval(async () => {
                  this.predictions = await this.model.classify(this.video.nativeElement);
                  console.log("predictions : ", this.predictions);
               }, 3000);
          })
          .catch((err0r) => {
            console.log('Something went wrong!');
          });
      }
    }
}
