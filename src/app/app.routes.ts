import { Routes } from '@angular/router';
import { TableComponent } from './table/table.component';

export const routes: Routes = [
	{ path: '', component: TableComponent },
];

/* for reference only

https://angular.io/guide/router

const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
];

html
<nav>
  <ul>
    <li><a routerLink="/first-component" routerLinkActive="active" ariaCurrentWhenActive="page">First Component</a></li>
    <li><a routerLink="/second-component" routerLinkActive="active" ariaCurrentWhenActive="page">Second Component</a></li>
  </ul>
</nav>

*/