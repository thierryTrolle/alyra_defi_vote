import { Component, OnInit } from '@angular/core';
import { error } from 'protractor';
import { from } from 'rxjs';
import { Votingweb3Service } from '../service/votingweb3.service';
import { Web3Service } from '../service/web3.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    /**
   * Liste des comptes 
   */
  public accounts: string[];

  /**
   * le compte
   */
  public accountAddress: string;

  public balance:number = 0;

  public votingState=-1;

  public address;

  constructor(
    private web3Service: Web3Service,
    private votingweb3Service: Votingweb3Service
  ) { }

  ngOnInit() {
    this.watchAccount();
    //refresh l'etat du system de vote
    setInterval(() => this.updateVotingState(), 600);
  }

  updateVotingState(){
    this.votingweb3Service.getWorkflowState().subscribe(
      state => {
        console.log("state"+state);
        this.votingState=state;
      }
    )
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.accountAddress = accounts[0];
      this.refreshBalance(this.accountAddress);
    });
  }

  addWhiteAddress(){
    if(!this.address || this.address==""){
      alert("address non set");
    }
    this.votingweb3Service.addToWhiteList(this.address).subscribe(
      result => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    )
  }

  launchProposalSession(){
    console.log("test");
    this.votingweb3Service.getWorkflowState().subscribe(
      result => {
        console.log(result);
      },
      error=>{
        console.log(error);
      }
    )
  }

  /**
   * 
   * @param address refresh balance of customer.
   */
  private refreshBalance(address: string) {
    this.web3Service.getBalance(this.accountAddress).subscribe(
      result => {
        this.balance = result/1000000000000000000;
      },
      error => {
        console.log(error);
      }
    )
  }

}
