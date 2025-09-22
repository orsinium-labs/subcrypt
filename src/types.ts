/** Public key that can verify signature. */
interface VerifyKey {
  verify: CryptoKey;
}

/** Key that can be used to encrypt a message. */
interface EncryptKey {
  encrypt: CryptoKey;
}

/** Private key that can generate signature. */
interface SignKey {
  sign: CryptoKey;
}

/** Key that can be used to decrypt a message. */
interface DecryptKey {
  decrypt: CryptoKey;
}

/** Public key. */
interface PubKey extends VerifyKey, EncryptKey {}

/** Private key. */
interface PrivKey extends SignKey, DecryptKey {}

/** Asymmetric key pair that can be used to sign and verify messages. */
interface SignPair extends SignKey, VerifyKey {}

/** Asymmetric key pair or symmetric key that can be used to encrypt and decrypt messages. */
interface EncPair extends EncryptKey, DecryptKey {}
