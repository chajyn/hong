const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const EnvSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string()
    .required()
    .description('mongodb uri'),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT secret key'),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
    .default(30)
    .description('minutes after which access tokens expire'),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
    .default(30)
    .description('days after which refresh tokens expire'),
  })
  .unknown()

const { value: envVars, error } = EnvSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if(error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGO_URI,
    options: { createIndexes: true, useNewUrlParser: true, useUnifiedTopology: true },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  }
}