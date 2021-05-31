import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { CasedocComponent } from './casedoc/casedoc.component';
import { CasesComponent } from './cases/cases.component';
import { TeamComponent } from './team/team.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { BlogComponent } from './blog/blog.component';
import { SingleBlogComponent } from './single-blog/single-blog.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfolioDetailsComponent } from './portfolio-details/portfolio-details.component';
import { DmsComponent } from './dms/dms.component';

const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'cases', component: CasesComponent },
  { path: 'users', component: UsersComponent },
  { path: 'about-us', component: TeamComponent },
  { path: 'casedoc/:caseid', component: CasedocComponent },
  { path: 'my', component: UserProfileComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:blogID', component: SingleBlogComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'portfolio/:portfolioID', component: PortfolioDetailsComponent },
  { path: 'dms', component: DmsComponent },

  // This one should be in last of the list
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
