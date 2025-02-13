"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
const config_1 = __importDefault(require("../../config/config"));
const lib_1 = __importDefault(require("../../utils/lib/lib"));
class ClientAuthService extends abstract_service_1.default {
    //login service
    registrationService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { email, phone, name, password, institution_name } = req.body;
                const model = this.Model.agentModel(trx);
                // //check user
                // Check if the email already exists
                const data = yield model.getSingleUser({ email });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: 'Email already exists',
                    };
                }
                // Hash the password
                const hashedPass = yield lib_1.default.hashPass(password);
                // Create the agent record
                const agentRes = yield model.createParticipant({
                    password: hashedPass,
                    email,
                    phone,
                    name,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: 'User registered successfully', // Adjusted message
                };
            }));
        });
    }
    //login service
    loginService({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentModel();
            // Fetch the user by email
            const data = yield model.getSingleUser({ email });
            // If no user is found
            if (!data.length) {
                console.log('No User Found');
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.WRONG_CREDENTIALS,
                };
            }
            // Destructure password and the rest of the user details
            const _a = data[0], { password: hashPass } = _a, rest = __rest(_a, ["password"]);
            // Compare the provided password with the hashed password
            const checkPass = yield lib_1.default.compare(password, hashPass);
            // If the password matches, generate a token and return a success response
            if (checkPass) {
                const token = lib_1.default.createToken(Object.assign(Object.assign({}, rest), { type: 'client' }), // Include user details and user type
                config_1.default.JWT_SECRET_EMPLOYEE, // Use the agent-specific secret
                '240h' // Token valid for 240 hours
                );
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.LOGIN_SUCCESSFUL,
                    data: Object.assign({}, rest),
                    token,
                };
            }
            // If the password doesn't match
            return {
                success: false,
                code: this.StatusCode.HTTP_BAD_REQUEST,
                message: this.ResMsg.WRONG_CREDENTIALS,
            };
        });
    }
    // get profile
    getProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.employee;
            const model = this.Model.agentModel();
            // Fetch the user by email
            const data = yield model.getSingleUser({ id });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.LOGIN_SUCCESSFUL,
                data: data[0],
            };
        });
    }
}
exports.default = ClientAuthService;
