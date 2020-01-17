/**
 * Copyright 2018-2020 Symlink GmbH
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




import { injectable } from "inversify";
import { IFederationStorage } from "./IFederationStorage";
import { MsFederation, PkStorageFederation } from "@symlinkde/eco-os-pk-models";
import { federationContainer, FEDERATION_TYPES } from "@symlinkde/eco-os-pk-storage-federation";

@injectable()
class FederationStorage implements IFederationStorage {
  private federationStorage: PkStorageFederation.IFederationService;

  constructor() {
    this.federationStorage = federationContainer.get<PkStorageFederation.IFederationService>(FEDERATION_TYPES.IFederationService);
  }

  public async get(domain: string): Promise<Array<MsFederation.IFederationStorageObject>> {
    const result = await this.federationStorage.search({ domain });
    if (result === null) {
      return [];
    }
    return result;
  }

  public async set(key: string, obj: MsFederation.IFederationStorageObject): Promise<boolean> {
    await this.federationStorage.create(obj);
    return true;
  }

  public async getAll(): Promise<Array<MsFederation.IFederationStorageObject>> {
    const result = await this.federationStorage.search({});
    if (result === null) {
      return [];
    }

    return result;
  }

  public async prune(): Promise<boolean> {
    // TODO: implement this
    return true;
  }
}

export { FederationStorage };
