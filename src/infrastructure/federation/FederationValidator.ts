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



import { IFederationValidator } from "./IFederationValidator";
import { injectable } from "inversify";
import { injectLicenseClient, injectKeyClient } from "@symlinkde/eco-os-pk-core";
import { PkCore } from "@symlinkde/eco-os-pk-models";
import * as forge from "node-forge";
import { CryptionUtils } from "@symlinkde/eco-os-pk-crypt";
import { CustomRestError } from "@symlinkde/eco-os-pk-api";
import { Log, LogLevel } from "@symlinkde/eco-os-pk-log";

@injectKeyClient
@injectLicenseClient
@injectable()
class FederationValidator implements IFederationValidator {
  private licenseClient!: PkCore.IEcoLicenseClient;
  private privateLicenseKey!: string;
  private keyClient!: PkCore.IEcoKeyClient;

  public async validateIncomingFederationRequest(checksum: string, body: any): Promise<void> {
    if (!CryptionUtils.validateRequestChecksum(checksum, body)) {
      throw new CustomRestError(
        {
          code: 403,
          message: "invalid federation checksum",
        },
        403,
      );
    }
    return;
  }

  public async getUserInformation(email: string, domain: string): Promise<any> {
    const key = await this.loadPrivateKeyFromLicenseService();
    const privateKey: any = forge.pki.privateKeyFromPem(forge.util.decode64(key));

    const decryptedEmail = await this.decryptedEmail(email, privateKey);
    // const decryptedDomain = this.decryptedDomain(domain, privateKey);

    try {
      const result = await this.keyClient.loadUsersKeyByEmail({ email: decryptedEmail });
      return result.data;
    } catch (err) {
      throw new CustomRestError(
        {
          code: 400,
          message: "can`t load keys from user",
        },
        400,
      );
    }
  }

  private async loadPrivateKeyFromLicenseService(): Promise<string> {
    if (!this.privateLicenseKey) {
      const result = await this.licenseClient.getPrivateKeyFromLicense();
      this.privateLicenseKey = result.data.privatekey;
    }

    return this.privateLicenseKey;
  }

  private async decryptedEmail(email: string, privateKey: any): Promise<string> {
    return new Promise((resolve) => {
      try {
        const decryptedEmail = forge.util.decode64(
          privateKey.decrypt(forge.util.decode64(email), "RSA-OAEP", {
            md: forge.md.sha512.create(),
          }),
        );
        resolve(decryptedEmail);
      } catch (err) {
        Log.log(err, LogLevel.error);
        throw new CustomRestError(
          {
            code: 400,
            message: "can't decrypt email",
          },
          400,
        );
      }
    });
  }
}

export { FederationValidator };
