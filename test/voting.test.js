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

    it("Je teste l'ajout d'une propostition'", async () => {
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
});