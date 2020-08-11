import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageComponent } from './image/image.component';
import { VideoComponent } from './video/video.component';

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
            }
          ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
