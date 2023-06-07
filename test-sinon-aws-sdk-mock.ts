import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as awsSdkMock from 'aws-sdk-mock';
import { AuthService } from './AuthService';

describe('AuthService', () => {
  let authService: AuthService;
  let mockCognitoIdentityServiceProvider: any;

  before(() => {
    // Configura el mock para el cliente CognitoIdentityServiceProvider
    awsSdkMock.mock('CognitoIdentityServiceProvider', 'initiateAuth', (params: any, callback: any) => {
      if (params.AuthFlow === 'USER_PASSWORD_AUTH' && params.AuthParameters.Username === 'testuser' && params.AuthParameters.Password === 'password') {
        // Simula una respuesta exitosa
        callback(null, { AuthenticationResult: { AccessToken: 'mockAccessToken' } });
      } else {
        // Simula un error de autenticación
        callback(new Error('Invalid credentials'));
      }
    });

    mockCognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
    authService = new AuthService(mockCognitoIdentityServiceProvider);
  });

  after(() => {
    // Restaura el comportamiento original del cliente CognitoIdentityServiceProvider
    awsSdkMock.restore('CognitoIdentityServiceProvider');
  });

  it('should return an access token on successful login', async () => {
    // Simula los parámetros de autenticación
    const username = 'testuser';
    const password = 'password';

    // Utiliza Sinon para espiar el método initiateAuth
    const initiateAuthStub: SinonStub = sinon.stub(mockCognitoIdentityServiceProvider, 'initiateAuth');

    // Configura el comportamiento esperado del método initiateAuth
    initiateAuthStub.callsFake((params: any, callback: any) => {
      // Simula una respuesta exitosa
      callback(null, { AuthenticationResult: { AccessToken: 'mockAccessToken' } });
    });

    // Llama al método login y comprueba el resultado
    const result = await authService.login(username, password);
    expect(result).to.equal('mockAccessToken');

    // Verifica que el método initiateAuth haya sido llamado con los parámetros correctos
    expect(initiateAuthStub.calledOnce).to.be.true;
    expect(initiateAuthStub.args[0][0].AuthFlow).to.equal('USER_PASSWORD_AUTH');
    expect(initiateAuthStub.args[0][0].AuthParameters.Username).to.equal(username);
    expect(initiateAuthStub.args[0][0].AuthParameters.Password).to.equal(password);

    // Restaura el comportamiento original del método initiateAuth
    initiateAuthStub.restore();
  });

  it('should throw an error on failed login', async () => {
    // Simula los parámetros de autenticación inválidos
    const username = 'testuser';
    const password = 'wrongpassword';

    // Utiliza Sinon para espiar el método initiateAuth
