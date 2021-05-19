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

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'cases', component: CasesComponent },
  { path: 'users', component: UsersComponent },
  { path: 'team', component: TeamComponent },
  { path: 'casedoc/:caseid', component: CasedocComponent },
  { path: 'my', component: UserProfileComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:blogID', component: SingleBlogComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'portfolio/:portfolioID', component: PortfolioDetailsComponent },

  // This one should be in last of the list
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
