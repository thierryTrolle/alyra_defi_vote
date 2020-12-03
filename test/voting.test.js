// const { BN, ether } = require('@openzeppelin/test-helpers');
// const { expect } = require('chai');
const Voting = artifacts.require('Voting');
const truffleAssert = require('truffle-assertions');


contract('"Voting"', function (accounts) {

    let [user1, user2, user3] = accounts;

    let votingInstance;

    beforeEach(async function () {
        this.votingInstance = votingInstance = await Voting.deployed();
    });

    // it('Je teste l\'ajout d\'une adresse whitelisté', async function () {
    //     let result = await votingInstance.addIntoWhiteList(user1, true);
    //     assert.equal(result.receipt.status, true);
    // });

    it("Je teste l\'ajout d\'une adresse whitelisté", async () => {
        /**
         * given
         */


        /**
         * When
         */
        let result = await votingInstance.addIntoWhiteList(user1, true);
        let voterObj = await votingInstance._whiteList.call(user1);

        // console.log(voterObj);

        /**
         * Then
         */
        assert.equal(result.receipt.status, true, "addIntoWhiteList");
        assert.equal(result.logs[0].event, "VoterRegistered", "ne lance pas d\'event VoterRegistered");
        assert.equal(voterObj.isRegistered, true, "Voter not registred");
        assert.equal(voterObj.hasVoted, false, "Voter has already voted ?");
        // assert.equal()

    });

    it("Je teste que l'on ne peut pas faire de proposition si le worflow status n'est pas ProposalsRegistrationStarted", async () => {
        /**
         * Given
         */
        await votingInstance.addIntoWhiteList(user1, true);


        /**
         * When
         */
        await truffleAssert.reverts(votingInstance.addProposition("une proposition",{ from: user1 }),"Propostion sessions closed");


        /**
         * Then
         */

    });

    it("Je teste que l\'on ne peut pas faire de proposition si on est pas whitelisté", async () => {
        /**
         * Given
         */
        await votingInstance.startPropositionSession();

        /**
         * When
         */
        await truffleAssert.reverts(votingInstance.addProposition("une proposition",{ from: user2 }),"You are not allowed to add a proposition");


        /**
         * Then
         */
    });

    it("Je teste l'ajout d'une propostition", async () => {
        /**
         * Given
         */
        votingInstance = await Voting.new();
        await votingInstance.addIntoWhiteList(user1, true);
        await votingInstance.startPropositionSession();

        /**
         * When
         */
        let result=await votingInstance.addProposition("une proposition",{ from: user1 });


        /**
         * Then
         */
        // console.log(result.logs);
        assert.equal(result.receipt.status, true, "addProposition ko");
        assert.equal(result.logs[0].event, "ProposalRegistered", "ne lance pas d\'event ProposalRegistered");
        assert.equal(result.logs[0].args.proposalId, 1, "etat doit etre 1 ");
    });

    it("Je teste l'ajout d'une adresse en whitelist", async () => {
        /**
         * Given
         */
        votingInstance = await Voting.new();
        var address="0x53329f21D76369982623aF52beFEA9aa42520401";

        /**
         * When
         */
        let result = await votingInstance.addIntoWhiteList(address, true);
        let voterObj = await votingInstance._whiteList.call(address);


        /**
         * Then
         */
        assert.equal(result.receipt.status, true, "addIntoWhiteList");
        assert.equal(result.logs[0].event, "VoterRegistered", "ne lance pas d\'event VoterRegistered");
        assert.equal(voterObj.isRegistered, true, "Voter not registred");
        assert.equal(voterObj.hasVoted, false, "Voter has already voted ?");

    });

    it("Je teste le processus de vote", async () => {
        /**
         * Given
         */
        votingInstance = await Voting.new();
        await votingInstance.addIntoWhiteList(user1, true);
        await votingInstance.addIntoWhiteList(user2, true);
        await votingInstance.addIntoWhiteList(user3, true);

        await votingInstance.startPropositionSession();
        await votingInstance.addProposition("un",{ from: user1 });
        await votingInstance.addProposition("deux",{ from: user2 });
        await votingInstance.addProposition("trois",{ from: user3 });
        await votingInstance.finishPropositionSession();

        await votingInstance.startVotingSession();


        //affichage des propositions
        let counter=await votingInstance.idCounter.call();
        for(i=1;i<counter;i++){
            let proposition=await votingInstance._proposalIdToDescription.call(i);
            console.log("la proposition "+i+":"+proposition);
        }

        await votingInstance.vote(2,{ from: user1 });
        await votingInstance.vote(2,{ from: user2 });
        await votingInstance.vote(3,{ from: user3 });
        await votingInstance.finishVote();


        /**
         * When
         */
        await votingInstance.calculateMostVotedProposition();
        let result=await votingInstance.getWinnerProposition();

        console.log(result);

        /**
         * Then
         */
        // console.log(result.logs);
        assert.equal(result, "deux", "ce n'est pas le resultat attendu !");
    });


});