import { BrowserModule } from '@angular/platform-browser';
import { NgModule,APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestWeb3Component } from './test-web3/test-web3.component';
import { Web3Service } from './service/web3.service';
import { Votingweb3Service } from './service/votingweb3.service';
import { AdminComponent } from './admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatDividerModule, MatFormFieldModule, MatGridListModule, MatInputModule, MatListModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

export function web3Init(web3Service: Web3Service) {
  return () => web3Service.bootstrapWeb3();
}

export function votingWeb3Init(votingweb3Service: Votingweb3Service){
  return () => votingweb3Service.bootstrap();
}

@NgModule({
  declarations: [
    AppComponent,
    TestWeb3Component,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: web3Init,
      multi: true,
      deps: [Web3Service]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: votingWeb3Init,
      multi: true,
      deps: [Votingweb3Service]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
