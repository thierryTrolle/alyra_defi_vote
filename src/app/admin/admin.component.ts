import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Votingweb3Service } from '../service/votingweb3.service';
import { Web3Service } from '../service/web3.service';


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
 * Liste des comptes 
 */
  public accounts: string[];

  /**
   * Owner address to indicate in environnement
   */
  ownerAddress = environment.ownerAddress;

  /**
   * le compte
   */
  public accountAddress: string;

  public balance: number = 0;

  public votingState: number;

  public isWhiteListed = false;

  /**
   * List of proposal
   */
  public proposalList: Proposal[] = new Array;

  /**
   * Selected value in selected input 
   */
  selectedProposalId: string;
  selectedProposal: string;

  /**
   * Address to whitelist
   */
  public address;

  /**
   * proposal field
   */
  public proposal;

  public winnerProposal;

  constructor(
    private web3Service: Web3Service,
    private votingweb3Service: Votingweb3Service
  ) { }

  ngOnInit() {
    console.log("ngOnInit");
    this.watchAccount();
    //refresh l'etat du system de vote
    setInterval(() => this.update(), 600);
  }

  isOwner() {
    return this.ownerAddress == this.accountAddress;
  }

  update() {
    //maj etat du vote 
    this.votingweb3Service.getWorkflowState().subscribe(
      state => {
        // console.log("state" + state);
        this.votingState = state;
        if (state == 3 && this.proposalList.length == 0) {
          this.loadProposal();
        }
        if (state == 4 && this.proposalList.length == 0) {
          this.loadWinnerProposal();
        }
      }, error => {
        console.log(error);
      }
    )


    //maj isWhite Listed
    this.votingweb3Service.isWhiteListed(this.accountAddress).subscribe(
      result => {
        // console.log(result.isRegistered);
        this.isWhiteListed = result.isRegistered;
        //result.isRegistered;
      }
    );
  }

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

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.accountAddress = accounts[0];
      this.refreshBalance(this.accountAddress);
    });
  }

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

  voting() {
    // alert(this.selectedProposalId+this.selectedProposal);
    if (this.selectedProposalId == "") {
      alert("you must selecting proposal");
    } else {
      this.votingweb3Service.voting(this.selectedProposalId, this.accountAddress).subscribe(
        result => {
          console.log(result);
          alert("Voting Succes, while voting session is not close, you can change your choice");
        },
        error => console.log(error)
      )
    }
  }

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
   * 
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
