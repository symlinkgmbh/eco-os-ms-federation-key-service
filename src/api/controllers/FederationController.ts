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



import { injectFederationService, IFederationService, injectFederationValidator } from "../../infrastructure/federation";
import { Request } from "express";
import { IFederationValidator } from "../../infrastructure/federation/IFederationValidator";

@injectFederationService
@injectFederationValidator
export class FederationController {
  private federationService!: IFederationService;
  private federationValidator!: IFederationValidator;

  public async loadRemoteUserPublicKeys(req: Request): Promise<any> {
    return await this.federationService.resolveRemoteUserKeys(req.body.email);
  }

  public async initFederation(req: Request): Promise<any> {
    return await this.federationService.processFederationFromPublicFederationService(req.body.domain);
  }

  public async validateIncomingFederationRequest(req: Request): Promise<void> {
    return await this.federationValidator.validateIncomingFederationRequest(req.body.checksum, req.body.body);
  }

  public async getUserKeys(req: Request): Promise<any> {
    return await this.federationValidator.getUserInformation(req.body.email, req.body.domain);
  }
}
