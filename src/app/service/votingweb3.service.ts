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

  constructor(private web3Service: Web3Service) {
    console.log('web 3 state: ' + web3Service);
    web3Service.artifactsToContract(votingArtifact).then(
      abstract => {
        abstract.deployed().then(
          deployed=>{
            this.votingInstance=deployed;
          }
        )
      }
    );
  }

  addToWhiteList(address:string):Observable<any>{
    return from(this.votingInstance.addIntoWhiteList(address,false));
  }

  getWorkflowState():Observable<any>{
    return from(this.votingInstance._workflowState.call());
  }

}
