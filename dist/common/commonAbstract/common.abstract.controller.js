"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customEror_1 = __importDefault(require("../../utils/lib/customEror"));
const middleware_1 = __importDefault(require("../middleware/asyncWrapper/middleware"));
class CommonAbstractController {
    constructor() {
        this.asyncWrapper = new middleware_1.default();
    }
    error(message, status, type) {
        throw new customEror_1.default(message || 'Something went wrong', status || 500
        // type || 'Internal server Error'
        );
    }
}
exports.default = CommonAbstractController;
