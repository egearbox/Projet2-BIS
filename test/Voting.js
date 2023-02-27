const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

contract("Voting", (accounts) => {
  const owner = accounts[0];
  const firstVoter = accounts[1];
  const secondVoter = accounts[2];
  const thirdVoter = accounts[3];
  const userNonVoter = accounts[4];

  let VotingInstance;

  describe("addVoter function", function () {
    beforeEach(async function () {
      VotingInstance = await Voting.new({ from: owner });
      await VotingInstance.addVoter(owner, { from: owner });
    });

    it("the owner can register a voter", async () => {
      await VotingInstance.addVoter(firstVoter, { from: owner });
      const voter = await VotingInstance.getVoter(firstVoter);
      expect(voter.isRegistered).to.equal(true);
    });

    // REVERT
    it("revert when caller is not the owner", async () => {
      await expectRevert(
        VotingInstance.addVoter(secondVoter, { from: firstVoter }),
        "Ownable: caller is not the owner"
      );
    });

    it("revert when voters registration is not open", async () => {
      await VotingInstance.startProposalsRegistering();
      await expectRevert(
        VotingInstance.addVoter(firstVoter, { from: owner }),
        "Voters registration is not open yet"
      );
    });

    it("revert when voter is already registered", async () => {
      await expectRevert(
        VotingInstance.addVoter(owner, { from: owner }),
        "Already registered"
      );
    });

    // EVENT
    it("emit a VoterRegistered event", async () => {
      expectEvent(
        await VotingInstance.addVoter(firstVoter, {
          from: owner,
        }),
        "VoterRegistered",
        { voterAddress: firstVoter }
      );
    });

    describe("getVoter function", function () {
      it("revert when caller is not a voter", async () => {
        await expectRevert(
          VotingInstance.getVoter(owner, {
            from: userNonVoter,
          }),
          "You're not a voter"
        );
      });
    });

    describe("startProposalsRegistering function", function () {
      it("change workflowStatus to ProposalsRegistrationStarted", async function () {
        await VotingInstance.startProposalsRegistering({ from: owner });
        const workflowStatus = await VotingInstance.workflowStatus.call();
        expect(workflowStatus).to.be.bignumber.equal(new BN(1));
      });

      it("add 'GENESIS' as first proposal", async function () {
        await VotingInstance.startProposalsRegistering({ from: owner });
        const firstProposal = await VotingInstance.getOneProposal(0);
        expect(firstProposal.description).equal("GENESIS");
      });

      // REVERT
      it("revert when caller is not the owner", async () => {
        await expectRevert(
          VotingInstance.startProposalsRegistering({ from: firstVoter }),
          "Ownable: caller is not the owner"
        );
      });

      it("revert when registering proposals cant be started now", async () => {
        await VotingInstance.startProposalsRegistering({ from: owner });
        await expectRevert(
          VotingInstance.startProposalsRegistering({ from: owner }),
          "Registering proposals cant be started now"
        );
      });

      // EVENT
      it("emit a WorkflowStatusChange event", async () => {
        expectEvent(
          await VotingInstance.startProposalsRegistering({
            from: owner,
          }),
          "WorkflowStatusChange",
          { previousStatus: new BN(0), newStatus: new BN(1) }
        );
      });
    });

    describe("addProposal function", function () {
      beforeEach(async function () {
        await VotingInstance.addVoter(firstVoter, { from: owner });
        await VotingInstance.addVoter(secondVoter, { from: owner });
        await VotingInstance.addVoter(thirdVoter, { from: owner });
        await VotingInstance.startProposalsRegistering({ from: owner });
      });

      it("the voters add proposals", async function () {
        await VotingInstance.addProposal("avoir une semaine de 4 jours", {
          from: firstVoter,
        });
        const proposal = await VotingInstance.getOneProposal(1);
        expect(proposal.description).equal("avoir une semaine de 4 jours");
      });

      // REVERT
      it("revert when caller is not a voter", async () => {
        await expectRevert(
          VotingInstance.addProposal("desc proposition 99", {
            from: userNonVoter,
          }),
          "You're not a voter"
        );
      });

      it("revert when proposals are not allowed yet", async () => {
        await VotingInstance.endProposalsRegistering();
        await expectRevert(
          VotingInstance.addProposal("desc proposition 99", { from: owner }),
          "Proposals are not allowed yet"
        );
      });

      it("revert when description is empty", async () => {
        await expectRevert(
          VotingInstance.addProposal("", { from: firstVoter }),
          "Vous ne pouvez pas ne rien proposer"
        );
      });

      // EVENT
      it("emit a ProposalRegistered event", async () => {
        expectEvent(
          await VotingInstance.addProposal("avoir une semaine de 4 jours", {
            from: owner,
          }),
          "ProposalRegistered",
          { proposalId: new BN(1) }
        );
      });

      describe("getOneProposal function", function () {
        it("revert when caller is not a voter", async () => {
          await expectRevert(
            VotingInstance.getOneProposal(0, {
              from: userNonVoter,
            }),
            "You're not a voter"
          );
        });
      });

      describe("endProposalsRegistering function", function () {
        it("change workflowStatus to ProposalsRegistrationEnded", async function () {
          await VotingInstance.endProposalsRegistering({ from: owner });
          const workflowStatus = await VotingInstance.workflowStatus.call();
          expect(workflowStatus).to.be.bignumber.equal(new BN(2));
        });

        // REVERT
        it("revert when caller is not the owner", async () => {
          await expectRevert(
            VotingInstance.endProposalsRegistering({ from: firstVoter }),
            "Ownable: caller is not the owner"
          );
        });

        it("revert when registering proposals havent started yet", async () => {
          await VotingInstance.endProposalsRegistering({ from: owner });
          await expectRevert(
            VotingInstance.endProposalsRegistering({ from: owner }),
            "Registering proposals havent started yet"
          );
        });

        // EVENT
        it("emit a WorkflowStatusChange event", async () => {
          expectEvent(
            await VotingInstance.endProposalsRegistering({
              from: owner,
            }),
            "WorkflowStatusChange",
            { previousStatus: new BN(1), newStatus: new BN(2) }
          );
        });
      });

      describe("startVotingSession function", function () {
        it("change workflowStatus to VotingSessionStarted", async function () {
          await VotingInstance.endProposalsRegistering({ from: owner });
          await VotingInstance.startVotingSession({ from: owner });
          const workflowStatus = await VotingInstance.workflowStatus.call();
          expect(workflowStatus).to.be.bignumber.equal(new BN(3));
        });

        // REVERT
        it("revert when caller is not the owner", async () => {
          await expectRevert(
            VotingInstance.startVotingSession({ from: firstVoter }),
            "Ownable: caller is not the owner"
          );
        });

        it("revert when registering proposals phase is not finished", async () => {
          await expectRevert(
            VotingInstance.startVotingSession({ from: owner }),
            "Registering proposals phase is not finished"
          );
        });

        // EVENT
        it("emit a WorkflowStatusChange event", async () => {
          await VotingInstance.endProposalsRegistering({ from: owner });
          expectEvent(
            await VotingInstance.startVotingSession({
              from: owner,
            }),
            "WorkflowStatusChange",
            { previousStatus: new BN(2), newStatus: new BN(3) }
          );
        });
      });

      describe("setVote function", function () {
        beforeEach(async function () {
          await VotingInstance.addProposal("desc proposition 1", {
            from: firstVoter,
          });
          await VotingInstance.addProposal("desc proposition 2", {
            from: secondVoter,
          });
          await VotingInstance.addProposal("desc proposition 3", {
            from: thirdVoter,
          });
          await VotingInstance.endProposalsRegistering({ from: owner });
          await VotingInstance.startVotingSession({ from: owner });
        });

        it("proposal voteCount property increment", async function () {
          const firstProposalBefore = await VotingInstance.getOneProposal(1);
          await VotingInstance.setVote(1, { from: owner });
          const firstProposalAfter = await VotingInstance.getOneProposal(1);

          expect(firstProposalAfter.voteCount).to.be.bignumber.equal(
            firstProposalBefore.voteCount + 1
          );
        });

        it("voter hasVoted property become true", async function () {
          await VotingInstance.setVote(1, { from: owner });
          const voter = await VotingInstance.getVoter(owner, { from: owner });
          expect(voter.hasVoted).to.be.true;
        });

        it("voter votedProposalId property update", async function () {
          await VotingInstance.setVote(1, { from: owner });
          const voter = await VotingInstance.getVoter(owner, { from: owner });

          expect(voter.votedProposalId).to.be.bignumber.equal(new BN(1));
        });

        // REVERT
        it("revert when caller is not a voter", async () => {
          await expectRevert(
            VotingInstance.setVote(1, { from: userNonVoter }),
            "You're not a voter"
          );
        });

        it("revert when voting session havent started yet", async () => {
          await VotingInstance.endVotingSession();
          await expectRevert(
            VotingInstance.setVote(1, { from: owner }),
            "Voting session havent started yet"
          );
        });

        it("revert when voter has already voted", async () => {
          await VotingInstance.setVote(1, { from: owner });
          await expectRevert(
            VotingInstance.setVote(1, { from: owner }),
            "You have already voted"
          );
        });

        it("revert when proposal is not found", async () => {
          await expectRevert(
            VotingInstance.setVote(4, { from: owner }),
            "Proposal not found"
          );
        });

        // EVENT
        it("emit a Voted event", async () => {
          expectEvent(
            await VotingInstance.setVote(1, {
              from: owner,
            }),
            "Voted",
            { voter: owner, proposalId: new BN(1) }
          );
        });

        describe("endVotingSession function", function () {
          it("change workflowStatus to VotingSessionEnded", async function () {
            await VotingInstance.endVotingSession({ from: owner });
            const workflowStatus = await VotingInstance.workflowStatus.call();
            expect(workflowStatus).to.be.bignumber.equal(new BN(4));
          });

          // REVERT
          it("revert when caller is not the owner", async () => {
            await expectRevert(
              VotingInstance.endVotingSession({ from: firstVoter }),
              "Ownable: caller is not the owner"
            );
          });

          it("revert when voting session havent started yet", async () => {
            await VotingInstance.endVotingSession({ from: owner });
            await expectRevert(
              VotingInstance.endVotingSession({ from: owner }),
              "Voting session havent started yet"
            );
          });

          // EVENT
          it("emit a WorkflowStatusChange event", async () => {
            expectEvent(
              await VotingInstance.endVotingSession({
                from: owner,
              }),
              "WorkflowStatusChange",
              { previousStatus: new BN(3), newStatus: new BN(4) }
            );
          });
        });

        describe("tallyVotes function", function () {
          beforeEach(async function () {
            await VotingInstance.setVote(2, { from: owner });
            await VotingInstance.setVote(1, { from: firstVoter });
            await VotingInstance.setVote(2, { from: secondVoter });
            await VotingInstance.setVote(3, { from: thirdVoter });
            await VotingInstance.endVotingSession({ from: owner });
          });

          it("change workflowStatus to VotesTallied", async function () {
            await VotingInstance.tallyVotes({ from: owner });
            const workflowStatus = await VotingInstance.workflowStatus.call();
            expect(workflowStatus).to.be.bignumber.equal(new BN(5));
          });

          it("set winningProposalId", async function () {
            await VotingInstance.tallyVotes({ from: owner });
            const winningProposalId =
              await VotingInstance.winningProposalID.call();
            expect(winningProposalId).to.be.bignumber.equal(new BN(2));
          });

          // REVERT
          it("revert when caller is not the owner", async () => {
            await expectRevert(
              VotingInstance.tallyVotes({ from: firstVoter }),
              "Ownable: caller is not the owner"
            );
          });

          it("revert when current status is not voting session ended", async () => {
            await VotingInstance.tallyVotes({ from: owner });
            await expectRevert(
              VotingInstance.tallyVotes({ from: owner }),
              "Current status is not voting session ended"
            );
          });

          // EVENT
          it("emit a WorkflowStatusChange event", async () => {
            expectEvent(
              await VotingInstance.tallyVotes({
                from: owner,
              }),
              "WorkflowStatusChange",
              { previousStatus: new BN(4), newStatus: new BN(5) }
            );
          });
        });
      });
    });
  });
});
