import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Layout } from './component/layout/layout';
import { authGuard } from './guards/auth-guard';
import { Home } from './component/home/home';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: '',
        component: Layout,
        canActivate: [authGuard],
        children: [
            { path: '', component:Home},
            { path: 'home', component: Home },
        ]
    },
    { path: '**', component: Login},
];