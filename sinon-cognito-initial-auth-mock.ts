const sinon = require('sinon');
const { expect } = require('chai');
const AWS = require('aws-sdk');

// Importa la función que deseas probar
const { initialAuth } = require('./tu-archivo');

describe('Prueba unitaria para initialAuth', () => {
  let initAuthStub;

  beforeEach(() => {
    // Crea un stub para la función initAuth del objeto AWS.CognitoIdentityServiceProvider
    initAuthStub = sinon.stub(AWS.CognitoIdentityServiceProvider.prototype, 'initiateAuth');
  });

  afterEach(() => {
    // Restaura el stub después de cada prueba
    initAuthStub.restore();
  });

  it('debería llamar a initiateAuth con los parámetros correctos y resolver la promesa', async () => {
    // Configura el stub para resolver la promesa con un objeto de respuesta simulado
    initAuthStub.returns({
      promise: () =>
        Promise.resolve({
          AuthenticationResult: {
            AccessToken: 'access-token',
            RefreshToken: 'refresh-token',
          },
        }),
    });

    // Llama a la función que deseas probar
    const result = await initialAuth('usuario', 'contraseña');

    // Verifica que initiateAuth haya sido llamado con los parámetros correctos
    expect(initAuthStub.calledOnceWithExactly({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: 'tu-cliente-id',
      AuthParameters: {
        USERNAME: 'usuario',
        PASSWORD: 'contraseña',
      },
    })).to.be.true;

    // Verifica que la función haya resuelto la promesa con el resultado esperado
    expect(result).to.deep.equal({
      AccessToken: 'access-token',
      RefreshToken: 'refresh-token',
    });
  });
});
