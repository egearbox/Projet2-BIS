## Mise en place et réalisation de test expect & expectrevert & event / emit

Le scénario de test a été construit chronologiquement afin de réutiliser au maximum toutes les données.

Couvrons les fonctions suivantes dans le contrat intelligent Voting.sol :

## 8 functions
- addVoter
- addProposal
- setVote
- startProposalsRegistering
- endProposalsRegistering
- startVotingSession
- endVotingSession
- tallyVotes

"" ***************************
expect() / expectRevert() / 
"" ***************************

Dans chaque cas, la fonction doit fonctionner on s'attend en sortie que (voter.isRegistered).to.equal(true):
//What did'n you Except ? 
it("the owner can register a voter \n  expect(voter.isRegistered).to.equal(true); \n        CONGRAT SUCCESS in =====>", async () => {
      await VotingInstance.addVoter(Voter1, { from: owner });
      const voter = await VotingInstance.getVoter(Voter1);
      expect(voter.isRegistered).to.equal(true);
    });
   En sortie:     CONGRAT SUCCESS in =====> (73ms)

Vérifier une sortie controler par l'appel de  function addVoter(address _addr) external onlyOwner {
"Ownable: caller is not the owner" implémentés dans la fonction du contract Ownable.sol de @openzeppelin \n
return _owner;\n    }\n\n    /**\n     * @dev Throws if the sender is not the owner.\n     */\n    function _checkOwner() internal view virtual {\n        require(owner() == _msgSender(), \"Ownable: caller is not the owner\");\n    }\n\n    /**\n 

// REVERT
    it("revert when caller is not the owner \n          CONGRAT SUCCESS in =====>", async () => {
      await expectRevert(
        VotingInstance.addVoter(Voter2, { from: Voter1 }),
        "Ownable: caller is not the owner"
      );

"" ***************************
Tous les événements émis dans le smart contract font l'objet de tests, qui incluent :
## 4 events
- VoterRegistered
- WorkflowStatusChange
- ProposalRegistered
- Voted

## Exemple du :
 /**********/
 Test de addVoter function 1 expect() / 3 expectRevert() / 1 Emit/Event()
 /**********/

      ✔ the owner can register a voter 
  expect(voter.isRegistered).to.equal(true);
        CONGRAT SUCCESS in =====> (73ms)
      ✔ revert when caller is not the owner 
          CONGRAT SUCCESS in =====> (155ms)
      ✔ revert when voters registration is not open 
          CONGRAT SUCCESS in =====> (98ms)
      ✔ revert when voter is already registered 
          CONGRAT SUCCESS in =====>
      ✔ emit a VoterRegistered event 
          CONGRAT SUCCESS in =====> (59ms)

## Premier Test

Test de la function addVoter

![Reporter](img/addVoter.png)

## FIN

Fin du test Voting.js

![Fin des tests 42 passés avec SUCCESS ](img/output-test-reporter-2.png)
##Pour tester ce projet:
git clone https://github.com/egearbox/Projet2-BIS.git
npm init
// si besoin $ npm install dotenv @truffle/hdwallet-provider @openzeppelin/test-helpers @openzeppelin/contracts
truffle init
truffle compile
ganache // sinon pas de blockchain en locale 
truffle deploy
truffle migrate //all inclusively
et voilou un smart contract de vote test deployer avec des outils simple is the best ...merci a vous....

### truffle a la console (cela sonne recette de cuisine, non ?)
First, you have to run ganache in a separated console.// séparez un truc de la console remuez et votre ganache est prêted

```console
$  ganache-cli // or ganache
```

Then, you can use truffle to run the test located in the `/test` folder using

```console
$ truffle test // or truffle test test/Test_Voting.js
```