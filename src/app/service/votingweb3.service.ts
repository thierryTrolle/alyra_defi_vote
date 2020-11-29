import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Web3Service } from './web3.service';

declare let require: any;
const votingArtifact = require('../../../build/contracts/Voting.json');

@Injectable({
  providedIn: 'root'
})
export class Votingweb3Service {

  private votingInstance:any;

  private votingState:Observable<any>;

  constructor(private web3Service: Web3Service) {
    console.log('web3 state: ' + web3Service);
    web3Service.artifactsToContract(votingArtifact).then(
      abstract => {
        abstract.deployed().then(
          deployed=>{
            //affecte l'instance voting
            this.votingInstance=deployed;
          }
        )
      }
    );
  }

  // private refreshVotingState(){
  //   if (!this.votingInstance) {
  //     console.log("this.votingInstance doesn't loaded !");
  //     setTimeout(() => {  console.log("Waiting refreshVotingState()"); }, 100);
  //     return this.refreshVotingState();
  //   }
  //   this.votingState=from(this.votingInstance._workflowState.call());
  //   console.log("refresh voting state");
  // }

  addToWhiteList(address):Observable<any>{
    return from(this.votingInstance.addIntoWhiteList(address,true));
  }

  getWorkflowState():Observable<any>{
    return from(this.votingInstance._workflowState.call());
  }

}
