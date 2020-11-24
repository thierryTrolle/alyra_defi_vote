import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../service/web3.service';

@Component({
  selector: 'app-test-web3',
  templateUrl: './test-web3.component.html',
  styleUrls: ['./test-web3.component.css']
})
export class TestWeb3Component implements OnInit {

  /**
   * Liste des comptes 
   */
  public accounts:string[];

  /**
   * le compte
   */
  public accountAddress:string;

  public balance=0;

  constructor(
    private web3Service:Web3Service
  ) { }

  ngOnInit() {
    // Le service web3 se charge apres !
    // this.web3Service.getAccounts().subscribe(
    //   result =>{
    //     console.log(result);
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // )

    this.watchAccount();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.accountAddress= accounts[0];
      this.refreshBalance(this.accountAddress);
    });
  }

  /**
   * 
   * @param address refresh balance of customer.
   */
  private refreshBalance(address:string){
    this.web3Service.getBalance(this.accountAddress).subscribe(
      result =>{
        this.balance=result;
      },
      error => {
        console.log(error);
      }
    )
  }

  click(){
    this.web3Service.getBalance(this.accountAddress).subscribe(
      result =>{
        console.log(result);
        this.balance=result;
      },
      error => {
        console.log(error);
      }
    )
  }


}
