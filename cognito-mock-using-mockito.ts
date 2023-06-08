import { expect } from 'chai';
import { instance, mock, when } from 'ts-mockito';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import sinon from 'sinon';

// Import the function you want to test
import { authenticateUser } from './your-file';

describe('Unit test for authenticateUser', () => {
  it('should authenticate user using CognitoIdentityServiceProvider', async () => {
    // Create a mock of CognitoIdentityServiceProvider
    const mockCognito = mock(CognitoIdentityServiceProvider);

    // Stub the method you want to mock
    const stubMethod = sinon.stub().callsArgWith(1, null, {
      // mock response object
      AccessToken: 'access-token',
      IdToken: 'id-token',
      RefreshToken: 'refresh-token',
    });

    // Stub the method on the mock object
    when(mockCognito.initiateAuth).thenReturn(stubMethod);

    // Get an instance of the mock object
    const cognitoInstance = instance(mockCognito);

    // Call the function you want to test
    const result = await authenticateUser(cognitoInstance, 'username', 'password');

    // Verify the function behavior and result
    expect(stubMethod.calledOnce).to.be.true;
    expect(stubMethod.args[0][0]).to.deep.equal({
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
