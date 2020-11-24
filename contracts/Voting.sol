// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;


import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Un smart contract de vote peut être simple ou complexe, selon les exigences des élections que vous souhaitez soutenir. Le vote peut porter sur un petit nombre de propositions (ou de candidats) 	      présélectionnées, ou sur un nombre potentiellement important de propositions suggérées de manière dynamique par les électeurs eux-mêmes.
 * *
 * Dans ce cadres, vous allez écrire un smart contract de vote pour une petite organisation. Les électeurs, que l'organisation connaît tous, sont inscrits sur une liste blanche (whitelist) grâce à leur adresse Ethereum, peuvent soumettre de nouvelles propositions lors d'une session d'enregistrement des propositions, et peuvent voter sur les propositions lors de la session de vote.
 * Le vote n'est pas secret ; chaque électeur peut voir les votes des autres.
 * Le gagnant est déterminé à la majorité simple ; la proposition qui obtient le plus de voix l'emporte.
 * 
 * Les struct, event et enumerations sont imposées.
 * 
 * */
contract Voting is Ownable{
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    
    struct Proposal {
        string description;
        uint voteCount;
    }
    
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    
    WorkflowStatus private _workflowState;
    
    mapping(address=>Voter)  public _whiteList;
    
    //map idPropostion => Proposition  
    mapping(uint=>Proposal) _proposalList;
    
    
    //Liaison entre propositon et idDeProposition
    mapping(uint=>string) _proposalIdToDescription;
    uint idCounter=1;
    
    event VoterRegistered(address voterAddress);
    event ProposalsRegistrationStarted();
    event ProposalsRegistrationEnded();
    event ProposalRegistered(uint proposalId);
    event VotingSessionStarted();
    event VotingSessionEnded();
    event Voted (address voter, uint proposalId);
    event VotesTallied();
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    
    //la proposition final
    string _finalProposition="default";
    
    
    /**
     * @dev Allow adresse to participate.
     * */
    function addIntoWhiteList(address _adresse, bool isAuthorised ) public onlyOwner{
        _whiteList[_adresse]=Voter(isAuthorised,false,0);
        emit VoterRegistered(_adresse);
    }
    
    /**
     * @dev Open porposition session
     * */
    function startPropositionSession() public onlyOwner{
        require(_workflowState==WorkflowStatus.RegisteringVoters,"workflowState must be RegisteringVoters");
        _workflowState=WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.VotingSessionStarted);
        emit ProposalsRegistrationStarted();
    }
    
    /**
     * @dev Stop proposition sesion 
     * */
    function finishPropositionSession() public onlyOwner{
        require(_workflowState==WorkflowStatus.ProposalsRegistrationStarted,"workflowState must be ProposalsRegistrationStarted");
        _workflowState=WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
        emit ProposalsRegistrationEnded();
    }
    
    /**
     * @dev start voting sesion 
     * */
    function startVotingSession() public onlyOwner{
        require(_workflowState==WorkflowStatus.ProposalsRegistrationEnded,"workflowState must be ProposalsRegistrationEnded");
        _workflowState=WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
        emit VotingSessionStarted();
    }
    
    /**
     * @dev allow account to add proposition 
     * */
    function addProposition(string memory proposition) public{
        require(_workflowState==WorkflowStatus.ProposalsRegistrationStarted, "Propostion sessions closed");
        require(_whiteList[msg.sender].isRegistered,"You are not allowed to add a proposition");
        
        //Proposal proposal=Proposal(proposition,0);
        _proposalList[idCounter]=Proposal(proposition,0);
        _proposalIdToDescription[idCounter]=proposition;
        emit ProposalRegistered(idCounter);
        
        idCounter++;
    }
    
    /**
     * @dev allow account to vote 
     * */
    function vote(uint _idProposition) public{
        require(_whiteList[msg.sender].isRegistered,"You are not allowed to vote");
        require(!_whiteList[msg.sender].hasVoted,"you already voted");
        
        //Set propriété du votant
        _whiteList[msg.sender].hasVoted=true;
        _whiteList[msg.sender].votedProposalId=_idProposition;
       
       //Set propriété de la proposition 
       _proposalList[_idProposition].voteCount++;//FIXME à tester passage par réference
       emit Voted (msg.sender, _idProposition);
       
    }
    
    
    /**
     * @dev stop voting sesion 
     * */
    function finishVote() public onlyOwner{
        require(_workflowState==WorkflowStatus.VotingSessionStarted,"workflowState must be VotingSessionStarted");
        _workflowState=WorkflowStatus.VotingSessionEnded;
        emit VotingSessionEnded();
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }
    
    /**
     *  @dev calculate most proposition voted.
     * TODO : Question est ce que la recherche dans le mapping est ordonné FIFO (ratachement _proposalList <=> _proposalIdToDescription)
     * */
    function calculateMostVotedProposition() public{
        require(_workflowState==WorkflowStatus.VotingSessionEnded,"workflowState must be VotingSessionEnded");
        string memory finalProposition="";
        uint max=0;
        
        
        //set de la proposition qui a le plus de vote
        for(uint i=1; i<idCounter; i++){
            if(_proposalList[i].voteCount>max){
                finalProposition=_proposalList[i].description;
                max=_proposalList[i].voteCount;
            }
        }
        _finalProposition=finalProposition;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
        emit VotesTallied();
    }
    
     /**
     *  @dev return most proposition voted.
     * */
    function getWinnerProposition() public view returns(string memory){
        return _finalProposition;
    }
}


