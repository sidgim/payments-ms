import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  STRIPE_SECRET_KEY: string;
  WEBHOOK_SECRET: string;
  SUCCESS_URL: string;
  CANCEL_URL: string;
  NATS_SERVERS: string[];
}

const envVarsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().default(3000).required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    WEBHOOK_SECRET: joi.string().required(),
    SUCCESS_URL: joi.string().uri().required(),
    CANCEL_URL: joi.string().uri().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  STRIPE_SECRET_KEY: envVars.STRIPE_SECRET_KEY,
  WEBHOOK_SECRET: envVars.WEBHOOK_SECRET,
  SUCCESS_URL: envVars.SUCCESS_URL,
  CANCEL_URL: envVars.CANCEL_URL,
  NATS_SERVERS: envVars.NATS_SERVERS,
};
