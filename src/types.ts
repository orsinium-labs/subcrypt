export namespace Types {
  /** Public key that can verify signature. */
  export interface VerifyKey {
    verify: CryptoKey;
  }

  /** Key that can be used to encrypt a message. */
  export interface EncryptKey {
    encrypt: CryptoKey;
  }

  /** Private key that can generate signature. */
  export interface SignKey {
    sign: CryptoKey;
  }

  /** Key that can be used to decrypt a message. */
  export interface DecryptKey {
    decrypt: CryptoKey;
  }

  /** Public key. */
  export interface PubKey extends VerifyKey, EncryptKey {}

  /** Private key. */
  export interface PrivKey extends SignKey, DecryptKey {}

  /** Asymmetric key pair that can be used to sign and verify messages. */
  export interface SignPair extends SignKey, VerifyKey {}

  /** Asymmetric key pair or symmetric key that can be used to encrypt and decrypt messages. */
  export interface EncPair extends EncryptKey, DecryptKey {}
}
