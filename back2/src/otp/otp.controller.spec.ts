import { Test } from '@nestjs/testing';
import { GenerateOtpRequest } from 'src/models/requestDTOs/GenerateOtpRequest';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

describe('OtpController', () => {
  let service: OtpService;
  let controller: OtpController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [OtpService],
      controllers: [OtpController],
    }).compile();

    service = await moduleRef.resolve(OtpService);
    controller = await moduleRef.resolve(OtpController);
  });

  describe('generate otp', () => {
    it('should be defined', () => {
      expect(controller.getOtp).toBeDefined();
    });
    //TODO write test again for otp generation when redis is ready.
  });
});
