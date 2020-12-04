import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Votingweb3Service } from '../service/votingweb3.service';
import { Web3Service } from '../service/web3.service';

/**
 * For selected input proposal
 */
interface Proposal {
  id: number;
  value: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  /**
 * Account list, refresh all time
 */
  public accounts: string[];

  /**
   * Owner address to indicate in environnement
   */
  ownerAddress = environment.ownerAddress;

  /**
   * The current account used
   */
  public accountAddress: string;

  /**
   * The current account balance 
   */
  public balance: number = 0;

  /**
   * State of voting system refresh
   */
  public votingState: number;

  /**
   * The label showing on front 
   */
  public votingLabel:string;

  /**
   * TO know if voter is whitelisted
   */
  public isWhiteListed = false;

  /**
   * List of proposal
   */
  public proposalList: Proposal[] = new Array;

  /**
   * Selected value in selected porposal input 
   */
  selectedProposalId: string;
  selectedProposal: string;

  /**
   * Address to whitelist(input)
   */
  public address;

  /**
   * proposal field(input)
   */
  public proposal;

  /**
   * Once calculated 
   */
  public winnerProposal;

  /**
   * 
   * @param web3Service : Web3 for all operation account and web3
   * @param votingweb3Service : Voting system service.
   */
  constructor(
    private web3Service: Web3Service,
    private votingweb3Service: Votingweb3Service
  ) { }

  /**
   * On init 
   * => start refresh account 
   * => start refresh state of voting System.
   */
  ngOnInit() {
    console.log("ngOnInit");
    this.watchAccount();
    //refresh l'etat du system de vote
    setInterval(() => this.update(), 600);
  }

  /**
   * To know if current user is Owner
   */
  isOwner() {
    return this.ownerAddress == this.accountAddress;
  }

  /**
   * Update state of voting System
   */
  update() {
    //update state of votingSystem
    this.votingweb3Service.getWorkflowState().subscribe(
      state => {
        // console.log("state" + state);
        this.votingState = state;
        if(state==0){
          this.votingLabel="Registering Voters";
        }else if(state==1){
          this.votingLabel="Proposals Registration Started";
        }else if(state==2){
          this.votingLabel="Proposals Registration Ended";
        }else if (state == 3 && this.proposalList.length == 0) {
          this.votingLabel="Voting Session Started";
          this.loadProposal();
        }else if (state == 4 && this.proposalList.length == 0) {
          this.votingLabel="Voting Session Ended";
          this.loadWinnerProposal();
        }else if(state == 5){
          this.votingLabel="Votes Tallied";
        }
      }, error => {
        console.log(error);
      }
    )


    //update isWhiteListed
    this.votingweb3Service.isWhiteListed(this.accountAddress).subscribe(
      result => {
        // console.log(result.isRegistered);
        this.isWhiteListed = result.isRegistered;
        //result.isRegistered;
      }
    );
  }

  /**
   * To load winner proposal
   */
  loadWinnerProposal(){
    this.votingweb3Service.getWinnerProposal().subscribe(
      result=>this.winnerProposal=result
    )
  }

  /**
   * Load proposal
   */
  loadProposal() {
    console.log("loadProposal()");
    this.votingweb3Service.getProposalList().subscribe(
      result => {
        this.proposalList = new Array;
        let i = 1;
        result.forEach(
          element => {
            this.proposalList.push({ id: i, value: element });
            i++;
          }
        )
      }
    )
  }

  /**
   * Refresh account parameters
   */
  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.accountAddress = accounts[0];
      this.refreshBalance(this.accountAddress);
    });
  }

  /**
   * Voters sending proposal
   */
  sendProposal() {
    this.votingweb3Service.addProposal(this.proposal, this.accountAddress).subscribe(
      result => {
        console.log(result);
        // if (result.logs[0].event == "ProposalRegistered") {
        alert("proposal saved");
        // }
        this.proposal = "";
      }
    )
  }

  /**
   * Owner smartContract add address to whitelist
   */
  addWhiteAddress() {
    if (!this.address || this.address == "") {
      alert("address non set");
    }
    this.votingweb3Service.addToWhiteList(this.address, this.accountAddress).subscribe(
      result => {
        alert("address " + this.address + " allowed");
        this.address = "";
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Owner start proposal session 
   */
  launchProposalSession() {
    console.log("test");
    this.votingweb3Service.startPropositionSession(this.accountAddress).subscribe(
      result => {
        console.log(result);
        alert("proposal session starting");
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Owner stop proposal session
   */
  stopProposalSession() {
    this.votingweb3Service.stopProposalSession(this.accountAddress).subscribe(
      result => {
        console.log(result);
        alert("proposal session finish");
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Owner start voting session
   */
  startVotingSession() {
    this.votingweb3Service.startVotingSession(this.accountAddress).subscribe(
      result => {
        console.log(result);
        alert("Voting session starting");
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Voters voting for proposal
   */
  voting() {
    // alert(this.selectedProposalId+this.selectedProposal);
    if (this.selectedProposalId == "") {
      alert("you must selecting proposal");
    } else {
      this.votingweb3Service.voting(this.selectedProposalId, this.accountAddress).subscribe(
        result => {
          console.log(result);
          alert("Voting Succes, while voting session is not close, you can change your choice");
          this.selectedProposalId="";
        },
        error => console.log(error)
      )
    }
  }

  /**
   * Owner stop voting session
   */
  stopVotingSession() {
    this.votingweb3Service.stopVotingSession(this.accountAddress).subscribe(
      result => {
        console.log(result);
        alert("Voting session ending");
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Calculate winner proposal
   */
  computeResultVoting() {
    this.votingweb3Service.computeResultVoting(this.accountAddress).subscribe(
      result => {
        alert("Voting result computing !")
        this.loadWinnerProposal();
      },
      error => console.log(error)
    )
  }

  /**
   * Refresh balance in Ether
   * @param address refresh balance of customer.
   */
  private refreshBalance(address: string) {
    this.web3Service.getBalance(this.accountAddress).subscribe(
      result => {
        this.balance = result / 1000000000000000000;
      },
      error => {
        console.log(error);
      }
    )
  }

}
