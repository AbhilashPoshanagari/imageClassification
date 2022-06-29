import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageComponent } from './image/image.component';
import { VideoComponent } from './video/video.component';
import { IotEsp32Component } from './iot-esp32/iot-esp32.component';

const routes: Routes = [
              {
              path: '',
              redirectTo: '/image',
              pathMatch: 'full'
            },
            {
              path: 'image',
              component: ImageComponent
            },
            {
              path: 'video',
              component: VideoComponent
            },
            {
              path: 'iot_esp32',
              component: IotEsp32Component
              // loadChildren: () =>import('./iot-esp32/iot-esp32.module').then(m => m.IotEsp32Module)
            }
          ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
