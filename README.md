# subcrypt

[ [github](https://github.com/orsinium-labs/subcrypt) ] [ [npm](https://www.npmjs.com/package/subcrypt) ]

Type-safe cross-environment encryption (RSA/AES) library for JS/TS built on top of [crypto.subtle](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto).

Features:

* Works in browser, node.js, react native, and expo.
* Type-safe and written in TypeScript.
* Safe defaults.
* Friendly API that doesn't require deep technical knowledge of cryptography.
* 100% test coverage.

## Installation

```bash
npm i --save subcrypto
```

For React Native (or Expo) projects, you also need to install [react-native-webview-crypto](https://github.com/webview-crypto/react-native-webview-crypto?tab=readme-ov-file):

```bash
npm install --save react-native-webview react-native-webview-crypto
```

See the [project documentation](https://github.com/webview-crypto/react-native-webview-crypto?tab=readme-ov-file#usage) on how to enable `react-native-webview-crypto` polyfill.

## Usage

Symmetric encryption:

```js
import { Salt, SymEnc, encrypt, decrypt } from "subcrypt";

// generate a new AES key
let key = await SymEnc.generate();

// or derive it from a password
const salt = Salt.fromString("som3thing r@ndom");
key = await SymEnc.derive("p@ssw0rd", salt);

// export key
const dump = await SymEnc.armor(key);

// encrypt a message
const encMsg = await encrypt(key, "oh hi mark", salt);

// import key
key = await SymEnc.dearmor(dump);

// decrypt encrypted message
const plainMsg = await decrypt(key, encMsg, salt);
```

Asymmetric encryption:

```js
import { EncryptKey, EncPair, encrypt, decrypt } from "subcrypt";

// generate a new RSA key pair
let pair = await EncPair.generate();

// export public encryption key
const dump = await EncryptKey.armor(key);

// import key
const encKey = await EncryptKey.dearmor(dump);

// encrypt a message using the encryption key
const encMsg = await encrypt(encKey, "oh hi mark");

// or using the key pair
encMsg = await encrypt(pair, "oh hi mark");

// decrypt encrypted message
const plainMsg = await decrypt(pair, encMsg);
```

Asymmetric signatures:

```js
import { SignPair, VerifyKey, encrypt, decrypt } from "subcrypt";

// generate a new RSA key pair
let pair = await SignPair.generate();

// encrypt a message using the pair
const msg = "oh hi mark";
const sig = await sign(pair, msg);

// export public verification key
const dump = await VerifyKey.armor(key);

// import key
const verifyKey = await VerifyKey.dearmor(dump);

// verify message using the public key
const isOk = await verify(verifyKey, msg, sig);

// or using the key pair
isOk = await verify(pair, msg, sig);
```
