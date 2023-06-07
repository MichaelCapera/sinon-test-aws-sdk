import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AuthService } from './AuthService';

describe('AuthService', () => {
  let authService: AuthService;
  let mockCognitoIdentityServiceProvider: CognitoIdentityServiceProvider;
  let initiateAuthStub: SinonStub;

  beforeEach(() => {
    // Crea un stub para el método initiateAuth del cliente CognitoIdentityServiceProvider
    initiateAuthStub = sinon.stub();

    // Crea un objeto mock para el cliente CognitoIdentityServiceProvider
    mockCognitoIdentityServiceProvider = {
      initiateAuth: initiateAuthStub
    } as any;

    authService = new AuthService(mockCognitoIdentityServiceProvider);
  });

  it('should return an access token on successful login', async () => {
    // Simula los parámetros de autenticación
    const username = 'testuser';
    const password = 'password';

    // Configura el comportamiento esperado del método initiateAuth
    initiateAuthStub.resolves({ AuthenticationResult: { AccessToken: 'mockAccessToken' } });

    // Llama al método login y comprueba el resultado
    const result = await authService.login(username, password);
    expect(result).to.equal('mockAccessToken');

    // Verifica que el método initiateAuth haya sido llamado con los parámetros correctos
    expect(initiateAuthStub.calledOnce).to.be.true;
    expect(initiateAuthStub.args[0][0].AuthFlow).to.equal('USER_PASSWORD_AUTH');
    expect(initiateAuthStub.args[0][0].AuthParameters.Username).to.equal(username);
    expect(initiateAuthStub.args[0][0].AuthParameters.Password).to.equal(password);
  });

  it('should throw an error on failed login', async () => {
    // Simula los parámetros de autenticación inválidos
    const username = 'testuser';
    const password = 'wrongpassword';

    // Configura el comportamiento esperado del método initiateAuth
    initiateAuthStub.rejects(new Error('Invalid credentials'));

    // Llama al método login y comprueba que lance un error
    await expect(authService.login(username, password)).to.be.rejectedWith('Invalid credentials');

    // Verifica que el método initiateAuth haya sido llamado con los parámetros correctos
    expect(initiateAuthStub.calledOnce).to.be.true;
    expect(initiateAuthStub.args[0][0].AuthFlow).to.equal('USER_PASSWORD_AUTH');
    expect(initiateAuthStub.args[0][0].AuthParameters.Username).to.equal(username);
    expect(initiateAuthStub.args[0][0].AuthParameters.Password).to.equal(password);
  });
});
