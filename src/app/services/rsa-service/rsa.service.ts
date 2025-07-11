// rsa.service.ts
import * as forge from 'node-forge';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RsaService {
  publicKey: string = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5bY/kCAma9DsB2ntwTDG
fi2GlN43XGnpFa4/w8usVKpjLc8WPao7jiFr3mN0gXwII1l+GXxgSMG81upBpUTF
ZlEMJsZkd+b3ARE2vPa+IwZHoc4AW2+5Zg950i9xX3v/gVsx7SRACW4Cqkjgi/y6
sWKIe5t9LIn5EloYTllRE/cFSQlP7um30G+UQRnQBn0f/9zQmJMWxpQBXJlnmnYE
FEDBNZeZcMkU9R0x/FF7RVUtCD97LQ7A0bXs6RI8Sve41Fy4YJBWOBky/JrVlv3d
PaWTIxW24HL1R5DNrvUiAEJJWl2da/WpGy3vHReNmkJXpwCJI6XxSXNQYpcXMmF2
SwIDAQAB
-----END PUBLIC KEY-----`;

  encrypt(text: string): string {
    const publicKey = forge.pki.publicKeyFromPem(this.publicKey);
    const encrypted = publicKey.encrypt(text, 'RSA-OAEP');
    return forge.util.encode64(encrypted);
  }
}
