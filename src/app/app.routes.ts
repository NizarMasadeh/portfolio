import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: { animation: 'HomePage' }
    },
    {
        path: 'about',
        component: AboutComponent,
        data: { animation: 'AboutPage' }

    },
    {
        path: 'projects',
        component: ProjectsComponent,
        data: { animation: 'ProjectsPage' }
    },
    {
        path: 'contact',
        component: ContactComponent,
        data: { animation: 'ContactPage' }
    }
];