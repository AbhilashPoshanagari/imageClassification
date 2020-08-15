import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as mobilenet from '@tensorflow-models/mobilenet';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @ViewChild('img') img: ElementRef;
  model: any;
  loading: boolean;
  imgSrc: any;
  predictions: any;
  constructor(  ) { }

  async ngOnInit() {
    this.loading = true;
    this.model = await mobilenet.load();
    console.log("model : ",this.model);
    this.loading = false;
  }



  async fileChange(event) {
    const file = event.target.files[0];
    console.log("file : ", file);
    if (file) {
      const reader = new FileReader();
      console.log("file reader : ", reader);
      reader.readAsDataURL(file);

      reader.onload = (res: any) => {
        this.imgSrc = res.target.result;
        console.log("image : ", this.imgSrc);
      };
      setTimeout(async () => {
              console.log("image : ", this.img.nativeElement);
              this.predictions = await this.model.classify(this.img.nativeElement);
              console.log("Predictions : ", this.predictions);
            }, 5000);
    }

  }



}
