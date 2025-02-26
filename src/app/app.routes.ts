import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './auth.guard';
import { AppComponent } from './app.component';
import { RegisterationComponent } from './registeration/registeration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ToDoListComponent } from './to-do-list/to-do-list.component';

export const routes: Routes = [{path: '', component: AppComponent},{path: 'registeration',component: RegisterationComponent},
     { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },{path: 'login', component: LoginComponent, canActivate: [loginGuard]},{ path: '', redirectTo: '/login', pathMatch: 'full' },{path: 'user-profile', component: UserProfileComponent},{path: '', component: AppComponent},{path: 'ToDoList', component: ToDoListComponent}];