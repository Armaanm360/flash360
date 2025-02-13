import { Request } from 'express';
import AbstractServices from '../../abstract/abstract.service';
import { IForgetPassProps, ILogin } from '../../common/types/commonTypes';
import config from '../../config/config';
import Lib from '../../utils/lib/lib';
import { OTP_TYPE_FORGET_EMPLOYEE } from '../../utils/miscellaneous/constants';

class AgentAuthService extends AbstractServices {
  //new agent registration validator

  public async registrationService(req: Request) {
    return this.db.transaction(async (trx) => {
      const { email, phone, name, password, institution_name } = req.body;
      const model = this.Model.agentModel(trx);

      // //check user
      // Check if the email already exists
      const data = await model.getSingleTeacher({ email });

      if (data.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: 'Email already exists',
        };
      }

      // Hash the password
      const hashedPass = await Lib.hashPass(password);

      // Create the agent record
      const agentRes = await model.createTeacher({
        password: hashedPass,
        email,
        phone,
        name,
        institution_name,
      });

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: 'Admin registered successfully', // Adjusted message
        data: agentRes,
      };
    });
  }

  //login service
  public async loginService({ email, password }: ILogin) {
    const model = this.Model.agentModel();

    // Fetch the user by email
    const data = await model.getSingleTeacher({ email });

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
    const { password: hashPass, ...rest } = data[0];

    // Compare the provided password with the hashed password
    const checkPass = await Lib.compare(password, hashPass);

    // If the password matches, generate a token and return a success response
    if (checkPass) {
      const token = Lib.createToken(
        { ...rest, type: 'agent' }, // Include user details and user type
        config.JWT_SECRET_AGENT, // Use the agent-specific secret
        '240h' // Token valid for 240 hours
      );

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.LOGIN_SUCCESSFUL,
        data: { ...rest },
        token,
      };
    }

    // If the password doesn't match
    return {
      success: false,
      code: this.StatusCode.HTTP_BAD_REQUEST,
      message: this.ResMsg.WRONG_CREDENTIALS,
    };
  }

  // get profile
  public async getProfile(req: Request) {
    const { id } = req.agent;

    const model = this.Model.agentModel();

    // Fetch the user by email
    const data = await model.getSingleProfileAgent(id);

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.LOGIN_SUCCESSFUL,
      data: data[0],
    };
  }

  // update agent profile
  public async updateAgentProfile(req: Request) {
    const { id } = req.agent;

    const model = this.Model.agentModel();
    const body = req.body;

    // Fetch the user by email
    const data = await model.getSingleTeacher({ id });

    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const files = (req.files as Express.Multer.File[]) || [];
    if (files.length) {
      body['avatar'] = files[0].filename;
    }

    const res = await model.updateAgentProfile({ id }, body);

    if (files.length && data[0].avatar) {
      await this.manageFile.deleteFromCloud([data[0].avatar]);
    }

    if (res.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: 'profile updated successfully',
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: 'profile does not updated',
      };
    }
  }
}

export default AgentAuthService;
