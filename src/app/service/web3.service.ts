import { Injectable } from '@angular/core';
import { Observable, Subject, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

declare let require: any;
const Web3 = require('web3');
const contract = require('@truffle/contract');

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private web3: any;
  private accounts: string[];
  public ready = false;

  public accountsObservable = new Subject<string[]>();

  constructor() {
    //now strating on app.module.js for start before ngInit of component
    // this.bootstrapWeb3();
  }

  public getWeb3():any{
    return this.web3;
  }

  public bootstrapWeb3() {
    console.log("bootstrapWeb3()");
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.ethereum !== 'undefined') {
      // Use Mist/MetaMask's provider
      window.ethereum.enable().then(() => {
        this.web3 = new Web3(window.ethereum);
      });
    } else {
      console.log('No web3? You should consider trying MetaMask!');
      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }

    setInterval(() => this.refreshAccounts(), 500);
  }

  public getEventAccountChange():Observable<any>{
    if (!this.web3) {
      // setTimeout(this.getEventAccountChange(), 100);
      return this.getEventAccountChange();
    }
    return from(window.ethereum.on('accountsChanged'));
  }


  /**
   * Transform artifact json to an usable instance
   * if web3 not loading again, try to wait 
   * @param artifacts 
   */
  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      console.log("web3 doesn't loaded !");
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }
    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;
  }

  public isAddress(address: string): boolean {
    return this.web3.isAddress(address);
  }

  /**
   * DEPRECATED envoie un chiffre apres l'autre en asynchrone
   * @param amount
   */
  public convertWeiToEth(amount: number): Observable<any> {
    return from(this.web3.utils.fromWei(amount, 'ether'));
  }

  public getBalance(address: String): Observable<any> {

    return from(this.web3.eth.getBalance(address));
    // Return lettre par lettre !!!
    // return from(this.web3.eth.getBalance(address)).pipe(
    //   mergeMap( balanceW => {
    //     console.log("balanceW:"+balanceW);
    //     return this.web3.utils.fromWei(balanceW,'ether');
    //   })
    // )
  }

  /**
   * refresh les comptes lors de changments metamask
   */
  private async refreshAccounts() {
    const accs = await this.web3.eth.getAccounts();
    // console.log('Refreshing accounts');

    // Get the initial account balance so it can be displayed.
    if (accs.length === 0) {
      console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
      return;
    }

    if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
      console.log('Observed new accounts');

      this.accountsObservable.next(accs);
      this.accounts = accs;
    }
    this.ready = true;
  }
}
