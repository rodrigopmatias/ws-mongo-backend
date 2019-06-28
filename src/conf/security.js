export default {
  secret: process.env.APP_SECURITY_SECRET || 'secr3t',
  hashPassword: process.env.APP_SECURITY_HASHPASSWORD || 'sha224WithRSAEncryption',
};
