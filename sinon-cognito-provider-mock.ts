const sinon = require('sinon');
const { expect } = require('chai');
const AWS = require('aws-sdk');

// Importa la función que deseas probar
const { signUpUser } = require('./tu-archivo');

describe('Prueba unitaria para signUpUser', () => {
  let signUpStub;

  beforeEach(() => {
    // Crea un stub para la función signUp del objeto AWS.CognitoIdentityServiceProvider
    signUpStub = sinon.stub(AWS.CognitoIdentityServiceProvider.prototype, 'signUp');
  });

  afterEach(() => {
    // Restaura el stub después de cada prueba
    signUpStub.restore();
  });

  it('debería llamar a signUp con los parámetros correctos y resolver la promesa', async () => {
    // Configura el stub para resolver la promesa con un objeto de respuesta simulado
    signUpStub.returns({
      promise: () =>
        Promise.resolve({
          UserSub: 'usuario-id',
          Username: 'usuario',
        }),
    });

    // Llama a la función que deseas probar
    const result = await signUpUser('usuario', 'contraseña');

    // Verifica que signUp haya sido llamado con los parámetros correctos
    expect(signUpStub.calledOnceWithExactly({
      ClientId: 'tu-cliente-id',
      Password: 'contraseña',
      Username: 'usuario',
    })).to.be.true;

    // Verifica que la función haya resuelto la promesa con el resultado esperado
    expect(result).to.deep.equal({
      UserSub: 'usuario-id',
      Username: 'usuario',
    });
  });
});
