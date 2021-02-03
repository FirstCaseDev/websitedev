import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FilterPipe } from './home/filter.pipe';
import { CasesComponent } from './cases/cases.component';
import { ChartsModule } from 'ng2-charts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HighchartsChartModule } from 'highcharts-angular'
import { UsersComponent } from './users/users.component'
import User from './models/user'


@NgModule({
  declarations: [AppComponent, HomeComponent, FilterPipe, CasesComponent, UsersComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    HighchartsChartModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
             return localStorage.getItem('login_token');
            },
        allowedDomains: ['localhost:4200'],
        disallowedRoutes: []
      }
    })
  ],
  providers: [Title, User, UsersComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
