import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { TestWeb3Component } from './test-web3/test-web3.component';


const routes: Routes = [
  { path: '', redirectTo: '/test-admin', pathMatch: 'full' },//redirection par defaut
  { path: 'test-web3', component: TestWeb3Component },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
