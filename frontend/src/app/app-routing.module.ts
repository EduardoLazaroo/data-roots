import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PermanentCropComponent } from './permanent-crop/permanent-crop.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'permanent-crop', component: PermanentCropComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
