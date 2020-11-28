import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestWeb3Component } from './test-web3/test-web3.component';
import { Web3Service } from './service/web3.service';
import { Votingweb3Service } from './service/votingweb3.service';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    TestWeb3Component,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [Web3Service,Votingweb3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
