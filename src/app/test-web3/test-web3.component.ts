import { Component, OnInit } from '@angular/core';
import { error } from 'protractor';
import { from } from 'rxjs';
import { Votingweb3Service } from '../service/votingweb3.service';
import { Web3Service } from '../service/web3.service';

const votingArtifact = require('../../../build/contracts/Voting.json');

@Component({
  selector: 'app-test-web3',
  templateUrl: './test-web3.component.html',
  styleUrls: ['./test-web3.component.css']
})
export class TestWeb3Component implements OnInit {

  /**
   * Liste des comptes 
   */
  public accounts: string[];

  /**
   * le compte
   */
  public accountAddress: string;

  public balance:number = 0;

  constructor(
    private web3Service: Web3Service,
    private votingweb3Service: Votingweb3Service
  ) { }

  ngOnInit() {
    this.watchAccount();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.accountAddress = accounts[0];
      this.refreshBalance(this.accountAddress);
    });
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

  click() {
    console.log("this.votingweb3Service:" + this.votingweb3Service);
    // this.votingweb3Service.addToWhiteList("test").subscribe(
    this.votingweb3Service.getWorkflowState().subscribe(
      result => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    )
    // this.web3Service.getBalance(this.accountAddress).subscribe(
    //   result =>{
    //     console.log(result);
    //     this.balance=result;
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // )
  }
  // Fonctionne !
  click2() {
    let artifactVoting = "";
    this.web3Service.artifactsToContract(votingArtifact).then(
      votingAbstraction => {
        votingAbstraction.deployed().then(
          deployed => {
            console.log(deployed);
            from(deployed._workflowState.call()).subscribe(
              result => {
                console.log(result);
              },
              error => {
                console.log(error);
              }
            );
          }
        )
      }
    )

    // this.web3Service.artifactsToContract(metacoin_artifacts)
    //   .then((MetaCoinAbstraction) => {
    //     this.MetaCoin = MetaCoinAbstraction;
    //     this.MetaCoin.deployed().then(deployed => {
    //       console.log(deployed);
    //       deployed.Transfer({}, (err, ev) => {
    //         console.log('Transfer event came in, refreshing balance');
    //         this.refreshBalance();
    //       });
    //     });

    //   });
  }




}
