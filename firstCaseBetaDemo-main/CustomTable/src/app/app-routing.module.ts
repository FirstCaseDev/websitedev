import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { CasesComponent } from './cases/cases.component';

const routes: Routes = [
  { path: '', redirectTo: "/home", pathMatch: 'full' },
  // { path: '**', redirectTo: '/home', pathMatch: 'full' },
  // { path: '/', redirectTo: '/home', pathMatch: 'full' },
  
  { path: 'home', component: HomeComponent },
  { path: 'cases', component: CasesComponent },
  { path: 'users', component: UsersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
