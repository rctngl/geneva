import { Routes } from '@angular/router';
import { ToolsHomeComponent } from './apps/tools/tools-home/tools-home.component';
import { ToolsDetailComponent } from './apps/tools/tools-detail/tools-detail.component';
import { DashboardHomeComponent } from './apps/dashboard/dashboard-home/dashboard-home.component';
import { GraphHomeComponent } from './apps/graph/graph-home/graph-home.component';
import { ComposerHomeComponent } from './apps/composer/composer-home/composer-home.component';

export const routes: Routes = [
    { path: 'tools', component: ToolsHomeComponent },
    { path: 'tools/:id', component: ToolsDetailComponent },
    { path: 'dashboard', component: DashboardHomeComponent },
    { path: 'graph', component: GraphHomeComponent },
    { path: 'composer', component: ComposerHomeComponent },
    { path: '**', redirectTo: '/tools' },
];
