var { expressjwt: jwt } = require("express-jwt");

const getTokenFromHeaders = (req: any) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

export const authenticate = {
  required: jwt({
    secret: 'secret',
    algorithms: ['HS256'],
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: 'secret',
    algorithms: ['HS256'],
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};
