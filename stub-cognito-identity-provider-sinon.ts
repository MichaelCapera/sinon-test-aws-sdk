import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

// Import the function you want to test
import { authenticateUser } from './your-file';

describe('Unit test for authenticateUser', () => {
  let stubInitiateAuth: SinonStub;

  beforeEach(() => {
    // Stub the initiateAuth method
    stubInitiateAuth = stub(CognitoIdentityServiceProvider.prototype, 'initiateAuth');
  });

  afterEach(() => {
    // Restore the stub after each test
    stubInitiateAuth.restore();
  });

  it('should authenticate user using CognitoIdentityServiceProvider', async () => {
    // Configure the stub to resolve with a custom response
    const mockResponse = {
      AuthenticationResult: {
        AccessToken: 'access-token',
        IdToken: 'id-token',
        RefreshToken: 'refresh-token',
      },
    };
    stubInitiateAuth.returns({
      promise: () => Promise.resolve(mockResponse),
    });

    // Call the function you want to test
    const result = await authenticateUser('username', 'password');

    // Verify the function behavior and result
    expect(stubInitiateAuth.calledOnce).to.be.true;
    expect(stubInitiateAuth.args[0][0]).to.deep.equal({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: 'your-client-id',
      AuthParameters: {
        USERNAME: 'username',
        PASSWORD: 'password',
      },
    });

    expect(result).to.deep.equal({
      AccessToken: 'access-token',
      IdToken: 'id-token',
      RefreshToken: 'refresh-token',
    });
  });
});
