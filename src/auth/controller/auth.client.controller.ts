import { Request, Response } from 'express';
import AbstractController from '../../abstract/abstract.controller';
import CommonService from '../../common/commonService/common.service';
import { ILogin } from '../../common/types/commonTypes';
import ClientAuthService from '../services/auth.client.service';
import ClientValidator from '../utils/validator/client.users.validator';
import { ChecksumAlgorithm } from '@aws-sdk/client-s3';

class ClientAuthController extends AbstractController {
  private service = new ClientAuthService();
  private commonService = new CommonService();
  private clientValidator = new ClientValidator();
  constructor() {
    super();
  }

  // login
  // new agent registration
  public register = this.asyncWrapper.wrap(
    // { bodySchema: this.validator.agentRegistrationValidator },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.registrationService(req);

      if (data.success) {
        res.status(code).json(data);
      } else {
        this.error(data.message, code);
      }
    }
  );

  // login
  public login = this.asyncWrapper.wrap(
    // { bodySchema: this.validator.agentLoginValidator },
    {},
    async (req: Request, res: Response) => {
      const { email, password } = req.body as ILogin;

      const { code, ...data } = await this.service.loginService({
        email,
        password,
      });
      res.status(code).json(data);
    }
  );

  // get profile
  public getProfile = this.asyncWrapper.wrap(
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getProfile(req);
      res.status(code).json(data);
    }
  );
}

export default ClientAuthController;
