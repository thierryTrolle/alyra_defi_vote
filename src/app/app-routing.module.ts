import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestWeb3Component } from './test-web3/test-web3.component';


const routes: Routes = [
  { path: '', redirectTo: '/test-web3', pathMatch: 'full' },//redirection par defaut
  { path: 'test-web3', component: TestWeb3Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
