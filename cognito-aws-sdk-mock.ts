import { expect } from 'chai';
import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';

// Importa la función que deseas probar
import { initialAuth } from './tu-archivo';

describe('Prueba unitaria para initialAuth', () => {
  beforeEach(() => {
    // Configura el AWS SDK Mock para el objeto AWS.CognitoIdentityServiceProvider
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('CognitoIdentityServiceProvider', 'initiateAuth', (params: any, callback: any) => {
      expect(params).to.deep.equal({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: 'tu-cliente-id',
        AuthParameters: {
          USERNAME: 'usuario',
          PASSWORD: 'contraseña',
        },
      });

      callback(null, {
        AuthenticationResult: {
          AccessToken: 'access-token',
          RefreshToken: 'refresh-token',
        },
      });
    });
  });

  afterEach(() => {
    // Restaura el AWS SDK Mock después de cada prueba
    AWSMock.restore('CognitoIdentityServiceProvider');
  });

  it('debería llamar a initiateAuth con los parámetros correctos y resolver la promesa', async () => {
    // Llama a la función que deseas probar
    const result = await initialAuth('usuario', 'contraseña');

    // Verifica el resultado de la promesa
    expect(result).to.deep.equal({
      AccessToken: 'access-token',
      RefreshToken: 'refresh-token',
    });
  });
});
