import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PermanentCropComponent } from './permanent-crop/permanent-crop.component';
import { LeafletCityProductionComponent } from './leaflet-city-production/leaflet-city-production.component';
import { ComparingStatesComponent } from './comparing-states/comparing-states.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'permanent-crop', component: PermanentCropComponent },
  { path: 'leaflet-city-production', component: LeafletCityProductionComponent },
  { path: 'comparing-states', component: ComparingStatesComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
