import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Profile } from './components/profile/profile';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: Profile },
];
