import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CasesComponent } from './cases/cases.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'cases', component: CasesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
