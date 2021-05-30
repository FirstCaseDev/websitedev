import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FilterPipe } from './home/filter.pipe';
import { HighlightPipe } from './casedoc/highlight.pipe';
import { CasesComponent } from './cases/cases.component';
import { ChartsModule } from 'ng2-charts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HighchartsChartModule } from 'highcharts-angular';
import { UsersComponent } from './users/users.component';
import User from './models/user';
import { CasedocComponent } from './casedoc/casedoc.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { GoogleAnalyticsService } from './google-analytics.service';
import { TeamComponent } from './team/team.component';
import { BlogComponent } from './blog/blog.component';
import { SingleBlogComponent } from './single-blog/single-blog.component';
import { PortfolioDetailsComponent } from './portfolio-details/portfolio-details.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { DmsComponent } from './dms/dms.component';
import { MainComponent } from './dms/main/main.component';
import { SidebarComponent } from './dms/sidebar/sidebar.component';

import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
// import {createPopper} from '@popperjs/core';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FilterPipe,
    HighlightPipe,
    CasesComponent,
    UsersComponent,
    CasedocComponent,
    UserProfileComponent,
    TeamComponent,
    BlogComponent,
    SingleBlogComponent,
    PortfolioDetailsComponent,
    PortfolioComponent,
    DmsComponent,
    SidebarComponent,
    MainComponent,
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
    NgxUsefulSwiperModule,
    NgbModule,
    MatChipsModule,
    MatIconModule,
    // createPopper
  ],
  providers: [Title, User, UsersComponent, GoogleAnalyticsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
