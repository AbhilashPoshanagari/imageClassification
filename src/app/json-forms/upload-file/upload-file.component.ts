import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  formValues: any = {};
  @Output() sendValues: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {

  }

  async fileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (res: any) => {
      let values = JSON.parse(res.target.result.toString());
      this.sendValues.emit(values);
      }
      reader.onerror = (error) => {
      }
    }
  }

}
