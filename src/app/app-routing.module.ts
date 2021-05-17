import { LoginGuard } from './guards/login.guard';
import { DashboardGuard } from './guards/dashboard.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// The list of routes that exist in the application, their respective components, and any guards in place to protect the routes
const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [DashboardGuard]},
  { path: '', component: LoginComponent, canActivate: [LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
