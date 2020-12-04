import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Web3Service } from './web3.service';

declare let require: any;
const votingArtifact = require('../../../build/contracts/Voting.json');


/**
 * Service for smartContract Voting.
 */
@Injectable({
  providedIn: 'root'
})
export class Votingweb3Service {

  /**
   * Instance of service
   */
  private votingInstance: any;

  /**
   * Launch by app.module.js to start before component
   * @param web3Service web3 service
   */
  constructor(private web3Service: Web3Service) {
  }

  /**
   * Launching by app.module.ts
   */
  public bootstrap() {
    this.web3Service.artifactsToContract(votingArtifact).then(
      abstract => {
        abstract.deployed().then(
          deployed => {
            //affecte l'instance voting
            this.votingInstance = deployed;

            console.log("Votingweb3Service ready !");

            //FIXME catch with event websocket
            // setInterval(() => this.refreshVotingState(), 600);
          }
        )
      }
    );
  }
  // deprecated
  // private refreshVotingState() {
  //   if (!this.votingInstance) {
  //     console.log("this.votingInstance doesn't loaded !");
  //     setTimeout(() => { console.log("Waiting refreshVotingState()"); }, 100);
  //     return this.refreshVotingState();
  //   }
  //   return from(this.votingInstance._workflowState.call());
  // }

  /**
   * 
   * @param address Add address to whiteList
   * @param addressUser address to add
   */
  addToWhiteList(address, addressUser): Observable<any> {
    return from(this.votingInstance.addIntoWhiteList(address, true, { from: addressUser }));
  }

  /**
   * Voters add proposal
   * @param proposal string proposal
   * @param user : address who add
   */
  addProposal(proposal, user) {
    return from(this.votingInstance.addProposition(proposal, { from: user }));
  }

  /**
   * Owner whitelist address
   * @param address address who whitelist
   */
  isWhiteListed(address): Observable<any> {
    return from(this.votingInstance._whiteList.call(address));
  }

  /**
   * Get state workflow voting.
   */
  getWorkflowState(): Observable<any> {
    return from(this.votingInstance._workflowState.call());
  }

  /**
   * Owner start session.
   * @param addressUser address who start
   */
  startPropositionSession(addressUser) {
    return from(this.votingInstance.startPropositionSession({ from: addressUser }));
  }

  /**
   * Owner stop session.
   * @param addressUser address who stop
   */
  stopProposalSession(addressUser) {
    return from(this.votingInstance.finishPropositionSession({ from: addressUser }));
  }

  /**
   * Owner start voting session.
   * @param addressUser address who start
   */
  startVotingSession(addressUser) {
    return from(this.votingInstance.startVotingSession({ from: addressUser }));
  }

  /**
   * Build proposal list to show
   */
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

  /**
   * Get ordonated list of proposal 
   * index(idProposal) begin by 1
   */
  public getProposalList():Observable<string[]>{
    return from(this.getProposalListAsync());
  } 

  /**
   * User voting 
   * @param idProposal : id proposal from get Proposal
   * @param addressVoter : address who voting
   */
  public voting(idProposal,addressVoter):Observable<any>{
    return from(this.votingInstance.vote(idProposal,{ from: addressVoter }));
  }

  /**
   * Owenr stop session voting
   * @param addressUser address who stop
   */
  stopVotingSession(addressUser) {
    return from(this.votingInstance.finishVote({ from: addressUser }));
  }

  /**
   * compute result vote
   * @param addressUser address who wompute
   */
  computeResultVoting(addressUser):Observable<any>{
    return from(this.votingInstance.calculateMostVotedProposition({ from: addressUser }));
  }

  /**
   * get Result
   */
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
