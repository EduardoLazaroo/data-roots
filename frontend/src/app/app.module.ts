import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { HomeComponent } from './home/home.component';
import { PermanentCropComponent } from './permanent-crop/permanent-crop.component';
import { LeafletCityProductionComponent } from './leaflet-city-production/leaflet-city-production.component';
import { AppRoutingModule } from './app-routing.module';
import { UfNamePipe } from './shared/uf-name.pipe';
import { ComparingStatesComponent } from './comparing-states/comparing-states.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PermanentCropComponent,
    ComparingStatesComponent,
    LeafletCityProductionComponent,
    UfNamePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxEchartsModule.forRoot({ echarts })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
