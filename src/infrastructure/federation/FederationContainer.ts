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



import "reflect-metadata";
import { Container } from "inversify";
import { IFederationService } from "./IFederationService";
import { IFederationEncryptor } from "./IFederationEncryptor";
import { FEDERATIONTYPES } from "./FederationTypes";
import { FederationService } from "./FederationService";
import { FederationEncryptor } from "./FederationEncryptor";
import { IFederationStorage } from "./IFederationStorage";
import { FederationStorage } from "./FederationStorage";
import { IFederationValidator } from "./IFederationValidator";
import { FederationValidator } from "./FederationValidator";
import { IFederationContentHandler } from "./IFederationContentHandler";
import { FederationContentHandler } from "./FederationContentHandler";

const federationContainer = new Container();

federationContainer
  .bind<IFederationEncryptor>(FEDERATIONTYPES.IFederationEncryptor)
  .to(FederationEncryptor)
  .inTransientScope();
federationContainer
  .bind<IFederationStorage>(FEDERATIONTYPES.IFederationStorage)
  .to(FederationStorage)
  .inTransientScope();
federationContainer
  .bind<IFederationValidator>(FEDERATIONTYPES.IFederationValidator)
  .to(FederationValidator)
  .inRequestScope();
federationContainer
  .bind<IFederationService>(FEDERATIONTYPES.IFederationService)
  .toDynamicValue(() => {
    return new FederationService(federationContainer.get<IFederationEncryptor>(FEDERATIONTYPES.IFederationEncryptor), federationContainer.get<IFederationStorage>(FEDERATIONTYPES.IFederationStorage));
  })
  .inRequestScope();

federationContainer
  .bind<IFederationContentHandler>(FEDERATIONTYPES.IFederationContentHandler)
  .to(FederationContentHandler)
  .inRequestScope();
export { federationContainer };
