import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(() => {
    healthController = new HealthController();
  });

  describe('#getHealth', () => {
    it('should return ok string', () => {
      expect(healthController.getHealth()).toStrictEqual('ok');
    });
  });
});
