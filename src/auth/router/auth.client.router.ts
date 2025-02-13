import AbstractRouter from '../../abstract/abstract.router';
import AuthChecker from '../../common/middleware/authChecker/authChecker';
import ClientAuthController from '../controller/auth.client.controller';

class ClientAuthRouter extends AbstractRouter {
  private controller = new ClientAuthController();
  private authChecker = new AuthChecker();
  constructor() {
    super();
    this.callRouter();
  }
  private callRouter() {
    //login router
    this.router.route('/login').post(this.controller.login);

    //registration router
    this.router.route('/register').post(this.controller.register);

    // profile
    this.router
      .route('/profile')
      .get(this.authChecker.clientAuthChecker, this.controller.getProfile)
      .patch(this.authChecker.clientAuthChecker);
  }
}

export default ClientAuthRouter;
