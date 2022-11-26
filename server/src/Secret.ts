import { createPrivateKey, createPublicKey } from "crypto";
import { readFile } from "fs/promises";

const privateKeyFile = await readFile("private.key").then((data) => data);
export const secret = createPrivateKey(privateKeyFile);
const pubKey = createPublicKey(secret);

if (
  process.argv.map((arg) => arg.endsWith("Secret.js")).filter((x) => x).length >
  0
) {
  console.log("JWK-formatted, public part of the private key");
  console.log(pubKey.export({ format: "jwk" }));
}
