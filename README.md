## Mise en place et réalisation de test expect & revert 

Le scénario de test a été construit chronologiquement afin de réutiliser au maximum toutes les données.

Pour ce faire, `describe` est utilisé pour couvrir les fonctions suivantes dans le contrat intelligent :

- addVoter
- addProposal
- setVote
- startProposalsRegistering
- endProposalsRegistering
- startVotingSession
- endVotingSession
- tallyVotes

Dans chaque cas, les tests exécutent des cas où la fonction devrait fonctionner et vérifient les modifications dans le stockage. Les tests appellent également tous les modificateurs et nécessitent implémentés dans les fonctions ci-dessous.

Tous les événements émis dans le smart contract font l'objet de tests, qui incluent :

- VoterRegistered
- WorkflowStatusChange
- ProposalRegistered
- Voted

## How to run tests

### Using truffle

First, you have to run ganache in a separated console.

```console
$  ganache-cli // or ganache
```

Then, you can use truffle to run the test located in the `/test` folder using

```console
$ truffle test // or truffle test test/Test_Voting.js
```
Compiling your contracts...
===========================
> Compiling .\contracts\Voting.sol
> Compiling .\node_modules\@openzeppelin\contracts\access\Ownable.sol
> Compiling .\node_modules\@openzeppelin\contracts\utils\Context.sol
> Artifacts written to C:\Users\William\AppData\Local\Temp\test--17076-gL0cuZ0lzu4n     
> Compiled successfully using:
   - solc: 0.8.17+commit.8df45f5f.Emscripten.clang


  Contract:
 /********************** Test de Voting.sol **********************/

    
 /**********/
 Test de addVoter function
 /**********/

      ✔ the owner can register a voter 
          CONGRAT SUCCESS in =====> (98ms)
      ✔ revert when caller is not the owner 
          CONGRAT SUCCESS in =====> (160ms)
      ✔ revert when voters registration is not open 
          CONGRAT SUCCESS in =====> (90ms)
      ✔ revert when voter is already registered 
          CONGRAT SUCCESS in =====>
      ✔ emit a VoterRegistered event 
           CONGRAT SUCCESS in =====> (73ms)
      
 /**********/
 Test de getVoter function
 /**********/

        ✔ revert when caller is not a voter
      
 /**********/
Test de  startProposalsRegistering function
 /**********/

        ✔ change workflowStatus to ProposalsRegistrationStarted (82ms)
        ✔ add 'GENESIS' as first proposal (146ms)
        ✔ revert when caller is not the owner
        ✔ revert when registering proposals cant be started now (99ms)
        ✔ emit a WorkflowStatusChange event (80ms)
      
 /**********/
Test de addProposal function
 /**********/

        ✔ the voters add proposals (123ms)
        ✔ revert when caller is not a voter
        ✔ revert when proposals are not allowed yet (107ms)
        ✔ revert when description is empty (349ms)
        ✔ emit a ProposalRegistered event (234ms)
        
 /**********/
Test de getOneProposal function
 /**********/

          ✔ revert when caller is not a voter
        
 /**********/
Test de endProposalsRegistering function
 /**********/

          ✔ change workflowStatus to ProposalsRegistrationEnded (110ms)
          ✔ revert when caller is not the owner
          ✔ revert when registering proposals havent started yet (127ms)
          ✔ emit a WorkflowStatusChange event (66ms)
        
 /**********/
Test de startVotingSession function
 /**********/

          ✔ change workflowStatus to VotingSessionStarted (580ms)
          ✔ revert when caller is not the owner
          ✔ revert when registering proposals phase is not finished
          ✔ emit a WorkflowStatusChange event (526ms)
        
 /**********/
Test de setVote function
 /**********/

          ✔ proposal voteCount property increment (214ms)
          ✔ voter hasVoted property become true (541ms)
          ✔ voter votedProposalId property update (83ms)
          ✔ revert when caller is not a voter
          ✔ revert when voting session havent started yet (101ms)
          ✔ revert when voter has already voted (446ms)
          ✔ revert when proposal is not found (44ms)
          ✔ emit a Voted event (91ms)

 /**********/
Test de endVotingSession function
PS C:\Users\William\Documents\Alyra Projets\Projet2> truffle test 

Compiling your contracts...
===========================
> Compiling .\contracts\Voting.sol
> Compiling .\node_modules\@openzeppelin\contracts\access\Ownable.sol
> Compiling .\node_modules\@openzeppelin\contracts\utils\Context.sol
> Artifacts written to C:\Users\William\AppData\Local\Temp\test--16308-13EFhazM6jBO
> Compiled successfully using:
   - solc: 0.8.17+commit.8df45f5f.Emscripten.clang


  Contract: 
 /********************** Test de Voting.sol **********************/

    
 /**********/
 Test de addVoter function
 /**********/

      ✔ the owner can register a voter    
          CONGRAT SUCCESS in =====> (97ms)
      ✔ revert when caller is not the owner 
          CONGRAT SUCCESS in =====> (179ms) 
      ✔ revert when voters registration is not open 
          CONGRAT SUCCESS in =====> (137ms)
      ✔ revert when voter is already registered 
          CONGRAT SUCCESS in =====> (42ms)      
      ✔ emit a VoterRegistered event      
          CONGRAT SUCCESS in =====> (69ms)
      
 /**********/
 Test de getVoter function
 /**********/

        ✔ revert when caller is not a voter
             
 /**********/
Test de  startProposalsRegistering function
 /**********/

        ✔ change workflowStatus to ProposalsRegistrationStarted (95ms)
        ✔ add 'GENESIS' as first proposal (98ms)
        ✔ revert when caller is not the owner
        ✔ revert when registering proposals cant be started now (113ms)
        ✔ emit a WorkflowStatusChange event (83ms)
      
 /**********/
Test de addProposal function
 /**********/

        ✔ the voters add proposals (120ms)
        ✔ revert when caller is not a voter (41ms)
        ✔ revert when proposals are not allowed yet (108ms)
        ✔ revert when description is empty
        ✔ emit a ProposalRegistered event (84ms)
        
 /**********/
Test de getOneProposal function
 /**********/

          ✔ revert when caller is not a voter
        
 /**********/
Test de endProposalsRegistering function
 /**********/

          ✔ change workflowStatus to ProposalsRegistrationEnded (109ms)
          ✔ revert when caller is not the owner (38ms)
          ✔ revert when registering proposals havent started yet (111ms)
          ✔ emit a WorkflowStatusChange event (51ms)
        
 /**********/
Test de startVotingSession function
 /**********/

          ✔ change workflowStatus to VotingSessionStarted (159ms)
          ✔ revert when caller is not the owner (46ms)
          ✔ revert when registering proposals phase is not finished
          ✔ emit a WorkflowStatusChange event (167ms)
        
 /**********/
Test de setVote function
 /**********/

          ✔ proposal voteCount property increment (399ms)
          ✔ voter hasVoted property become true (174ms)
          ✔ voter votedProposalId property update (219ms)
          ✔ revert when caller is not a voter (163ms)
          ✔ revert when voting session havent started yet (214ms)
          ✔ revert when voter has already voted (241ms)
          ✔ revert when proposal is not found (103ms)
          ✔ emit a Voted event (132ms)

 /**********/
Test de endVotingSession function
 /**********/

            ✔ change workflowStatus to VotingSessionEnded (135ms)
            ✔ revert when caller is not the owner
            ✔ revert when voting session havent started yet (116ms)
            ✔ emit a WorkflowStatusChange event (265ms)

 /**********/
Last Test de tallyVotes function
 /**********/

            ✔ change workflowStatus to VotesTallied (372ms)
            ✔ set winningProposalId (188ms)
            ✔ revert when caller is not the owner (38ms)
            ✔ revert when current status is not voting session ended (209ms)
            ✔ GOOD Job CONGRATULATION --- emit a WorkflowStatusChange event (131ms)


  42 passing (50s)
  /*********************************************************************************************/

## Premier Test

Test de la function addVoter

![Reporter](img/output-test-reporter.png)

## Coverage

Fin du test Voting.js

![Fin des tests 42 passés avec SUCCESS ](img/output-test-reporter-2.png)