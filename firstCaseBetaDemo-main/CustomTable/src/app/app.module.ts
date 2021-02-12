import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FilterPipe } from './home/filter.pipe';
import { CasesComponent } from './cases/cases.component';
import { ChartsModule } from 'ng2-charts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HighchartsChartModule } from 'highcharts-angular';
import { UsersComponent } from './users/users.component';
import User from './models/user';
import { CasedocComponent } from './casedoc/casedoc.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FilterPipe,
    CasesComponent,
    UsersComponent,
    CasedocComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatSliderModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    HighchartsChartModule,
    BrowserAnimationsModule,
  ],
  providers: [Title, User, UsersComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
