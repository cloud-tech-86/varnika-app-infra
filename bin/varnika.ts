#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { VarnikaStack } from '../lib/varnika-stack';

import devConfig from '../config/dev.json';
import prodConfig from '../config/prod.json';

const app = new cdk.App();

const environment =
  app.node.tryGetContext('env') || 'dev';

const config =
  environment === 'prod'
    ? prodConfig
    : devConfig;

new VarnikaStack(
  app,
  `Varnika-${environment}`,
  {
    env: {
      account: config.accountId,
      region: config.region
    },

    terminationProtection:
      environment === 'prod'
  }
);