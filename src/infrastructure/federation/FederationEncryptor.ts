/**
 * Copyright 2018-2019 Symlink GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */



import { IFederationEncryptor } from "./IFederationEncryptor";
import * as forge from "node-forge";
import { injectable } from "inversify";
import { Log, LogLevel } from "@symlinkde/eco-os-pk-log";

@injectable()
class FederationEncryptor implements IFederationEncryptor {
  public async encryptBody<T>(publicKeyPem: string, body: any): Promise<T> {
    return new Promise((resolve) => {
      try {
        const key: any = forge.pki.publicKeyFromPem(forge.util.decode64(publicKeyPem));

        Object.keys(body).map((entry: any) => {
          if (body[entry] !== null) {
            if (Array.isArray(body[entry])) {
              body[entry].map((v: any, i: number) => {
                body[entry][i] = forge.util.encode64(key.encrypt(forge.util.encode64(body[entry][i]), "RSA-OAEP", { md: forge.md.sha512.create() }));
              });
            } else {
              body[entry] = forge.util.encode64(key.encrypt(forge.util.encode64(body[entry]), "RSA-OAEP", { md: forge.md.sha512.create() }));
            }
          }
        });
        resolve(body);
      } catch (err) {
        Log.log(err, LogLevel.error);
        throw new Error(err);
      }
    });
  }
}

export { FederationEncryptor };
