import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { concat, from, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Web3Service } from './web3.service';

declare let require: any;
const votingArtifact = require('../../../build/contracts/Voting.json');

@Injectable({
  providedIn: 'root'
})
export class Votingweb3Service {

  private votingInstance: any;

  private votingState: Observable<any>;

  constructor(private web3Service: Web3Service) {
  }

  /**
   * Launching by app.module.ts
   */
  public bootstrap() {
    console.log('web3 state: ' + this.web3Service);
    this.web3Service.artifactsToContract(votingArtifact).then(
      abstract => {
        abstract.deployed().then(
          deployed => {
            //affecte l'instance voting
            this.votingInstance = deployed;

            console.log("Votingweb3Service ready !");

            //FIXME catch with event websocket
            setInterval(() => this.refreshVotingState(), 600);
          }
        )
      }
    );
  }

  private refreshVotingState() {
    if (!this.votingInstance) {
      console.log("this.votingInstance doesn't loaded !");
      setTimeout(() => { console.log("Waiting refreshVotingState()"); }, 100);
      return this.refreshVotingState();
    }
    this.votingState = from(this.votingInstance._workflowState.call());
    // console.log("refresh voting state");
  }

  addToWhiteList(address, addressUser): Observable<any> {
    return from(this.votingInstance.addIntoWhiteList(address, true, { from: addressUser }));
  }

  addProposal(proposal, user) {
    return from(this.votingInstance.addProposition(proposal, { from: user }));
  }

  isWhiteListed(address): Observable<any> {
    return from(this.votingInstance._whiteList.call(address));
  }

  getWorkflowState(): Observable<any> {
    return from(this.votingInstance._workflowState.call());
  }

  startPropositionSession(addressUser) {
    return from(this.votingInstance.startPropositionSession({ from: addressUser }));
  }

  stopProposalSession(addressUser) {
    return from(this.votingInstance.finishPropositionSession({ from: addressUser }));
  }

  startVotingSession(addressUser) {
    return from(this.votingInstance.startVotingSession({ from: addressUser }));
  }

  private async getProposalListAsync():Promise<string[]> {
    
    let proposalList:string[]=new Array;
    
    let counter = await this.votingInstance.idCounter.call();
    for (let i = 1; i < counter; i++) {
      let proposition = await this.votingInstance._proposalIdToDescription.call(i);
      console.log("la proposition " + i + ":" + proposition);
      proposalList.push(proposition);
    }
    return proposalList;
  }

  public getProposalList():Observable<string[]>{
    return from(this.getProposalListAsync());
  } 

  public voting(idProposal,addressVoter):Observable<any>{
    return from(this.votingInstance.vote(idProposal,{ from: addressVoter }));
  }

  stopVotingSession(addressUser) {
    return from(this.votingInstance.finishVote({ from: addressUser }));
  }

  computeResultVoting(addressUser):Observable<any>{
    return from(this.votingInstance.calculateMostVotedProposition({ from: addressUser }));
  }

  getWinnerProposal():Observable<any>{
    return from(this.votingInstance.getWinnerProposition());
  }

  // getPropositionList(){
  //   let counter;
  //   from(this.votingInstance.idCounter.call()).pipe(
  //     mergeMap(counterId => {
  //       counter = counterId;
  //       let list: Observable<any>[] = new Array(counter - 1);
  //       // let concatObservable= from(this.votingInstance._proposalIdToDescription.call(i));
  //       for (var i = 1; i < counter; i++) {
  //         list.push(from(this.votingInstance._proposalIdToDescription.call(i)))
  //       }
  //       return concat(list);
  //     })
  //   ).subscribe(
  //     result=>{
  //       result.subscribe(
  //         newResult=>console.log(newResult)
  //       )
  //     }
  //   )
  // }

  // getPropositionList():Observable<string>{
  //   let counter;
  //   return from(this.votingInstance.idCounter.call()).pipe(
  //     mergeMap(counterId => {
  //       counter = counterId;
  //       let list:string[] = new Array(counter - 1);
  //       // let concatObservable= from(this.votingInstance._proposalIdToDescription.call(i));
  //       var i;
  //       for (i = 1; i < counter; i++) {
  //         from(this.votingInstance._proposalIdToDescription.call(i)).subscribe(
  //           proposal=>{
  //             list.push(i+proposal);
  //             console.log("eee"+i+proposal);
  //           }
  //         )
  //       }
  //       return from(list);
  //     })
  //   )
  // }

}
