"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const auth_client_controller_1 = __importDefault(require("../controller/auth.client.controller"));
class ClientAuthRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new auth_client_controller_1.default();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
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
exports.default = ClientAuthRouter;
