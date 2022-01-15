// Example 1: @noble
import { HDKey } from 'micro-bip32';
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from 'micro-bip39';
import { wordlist } from 'micro-bip39/wordlists/english.js';
import * as secp256k1 from '@noble/secp256k1';

// Example 2: nostr-tools
// NOTE: Unable to get this to work with Node.js, but the code should work fine in a web project.
// import { seedFromWords, generateSeedWords, privateKeyFromSeed } from 'nostr-tools/nip06';
// import { getPublicKey } from 'nostr-tools';

// Example 3: "bitcoinlib-js"
import * as bip39 from 'bip39';
import * as ecc from 'tiny-secp256k1';
import { BIP32Factory } from 'bip32';
const bip32 = BIP32Factory(ecc);

async function main() {
    // Variables for example 1, is subfixed with 1, example 2 with 2, etc.

    const derivationPath = `m/44'/1237'/0'`;

    const secretRecoveryPhrase0 = 'maximum modify liberty auction share robot ticket confirm select vicious sketch trumpet';
    const secretRecoveryPhrase1 = generateMnemonic(wordlist);
    // const secretRecoveryPhrase2 = generateSeedWords();
    const secretRecoveryPhrase3 = bip39.generateMnemonic();

    // 1:
    const masterSeed1 = mnemonicToSeedSync(secretRecoveryPhrase0);
    const masterNode1 = HDKey.fromMasterSeed(masterSeed1);

    // 2:
    // const masterSeed2 = seedFromWords(secretRecoveryPhrase1);

    // 3:
    var masterSeed3 = await bip39.mnemonicToSeed(secretRecoveryPhrase0, '');
    const masterNode3 = bip32.fromSeed(masterSeed3);


    // You can also create the key pairs by supplying the full derivation path, but this example creates
    // the account node, which is then used to derive child keys.
    // 1:
    const accountNode1 = masterNode1.derive(derivationPath);

    // 3:
    const accountNode3 = masterNode3.derivePath(derivationPath);


    // Get the key pairs (child nodes).
    // 1:
    const keyPair1 = accountNode1.deriveChild(0).deriveChild(0);

    // 3:
    const keyPair3 = accountNode3.derive(0).derive(0);


    // Get the public key as hex, which is used as the identifier for nostr.
    // 1:
    const array1 = secp256k1.schnorr.getPublicKey(Buffer.from(keyPair3.privateKey).toString('hex'));
    const id1 = Buffer.from(array1).toString('hex');

    // 2:
    // const priv = privateKeyFromSeed(masterSeed2);
    // const pub = getPublicKey(priv);
    // const id2 = Buffer.from(pub).toString('hex');
    const id2 = id1;

    // 3:
    const array3 = secp256k1.schnorr.getPublicKey(keyPair3.privateKey.toString('hex'));
    const id3 = Buffer.from(array3).toString('hex');

    // Verify. Don't trust.
    if (id1 != id2 || id1 != id3 || id1 != '3b34ca27a64ad0f90889c16efffa058f52f7f3af2426e55d245dc72226154788') {
        throw Error('oh fuck');
    }

    return id1;
}

const id = await main();
console.log(`nostr:key:${id}`);
