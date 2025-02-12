import * as anchor from "@project-serum/anchor";
import * as assert from "assert";
import { Program } from "@project-serum/anchor";
import { CoinflipBet } from "../target/types/coinflip_bet";
const { SystemProgram } = anchor.web3;

let _flipResult;

describe("coinflip-bet", () => {
  // Use a local provider.
  const provider = anchor.AnchorProvider.local();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  it("Creates and initializes an account in a single atomic transaction (simplified)", async () => {
    // #region code-simplified
    // The program to execute.
    const program = anchor.workspace.CoinflipBet;

    // The Account to create.
    const flipResult = anchor.web3.Keypair.generate();

    // Create the new account and initialize it with the program.
    // #region code-simplified
    await program.rpc.initialize(new anchor.BN(1234), {
      accounts: {
        flipResult: flipResult.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [flipResult],
    });
    // #endregion code-simplified

    // Fetch the newly created account from the cluster.
    const account = await program.account.flipResult.fetch(flipResult.publicKey);

    // Check it's state was initialized.
    assert.ok(account.roll.eq(new anchor.BN(1234)));

    // Store the account for the next test.
    _flipResult = flipResult;
  });

  it("Updates a previously created account", async () => {
    const flipResult = _flipResult;

    // #region update-test

    // The program to execute.
    const program = anchor.workspace.CoinflipBet;

    // Invoke the update rpc.
    await program.rpc.update({
      accounts: {
        flipResult: flipResult.publicKey,
      },
    });

    // Fetch the newly updated account.
    const account = await program.account.flipResult.fetch(flipResult.publicKey);

    console.log("account data");
    console.log(account.roll);
    console.log(account.won);
  });
});