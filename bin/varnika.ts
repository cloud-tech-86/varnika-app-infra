#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';

import { VarnikaStack } from '../lib/varnika-stack';

const app = new cdk.App();

new VarnikaStack(
  app,
  'VarnikaAppInfraStack',
  {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION
    }
  }
);