import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

import {
  PlatformConfig,
  KmsConstruct,
  VpcConstruct,
  SecurityGroupConstruct,
  S3Construct,
  Ec2Construct
} from '@cloudtech/platform-cdk';

import config from '../config/dev.json';

export class VarnikaStack extends cdk.Stack {

  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StackProps
  ) {

    super(scope, id, props);

    const platformConfig =
      config as PlatformConfig;

    // Import Existing IAM Role

    const role = iam.Role.fromRoleArn(
      this,
      'PowerRole',
      platformConfig.roleArn,
      {
        mutable: false
      }
    );

    // KMS Key

    const kmsKey = new KmsConstruct(
      this,
      'Kms',
      {
        aliasName: 'alias/varnika-key'
      }
    );

    // VPC

    const vpc = new VpcConstruct(
      this,
      'Vpc',
      {
        vpcName: 'varnika-vpc',
        cidr: platformConfig.vpcCidr,
        maxAzs: 2,
        natGateways: 1
      }
    );

    // Security Group

    const sg = new SecurityGroupConstruct(
      this,
      'SecurityGroup',
      {
        vpc: vpc.vpc,
        securityGroupName: 'varnika-sg'
      }
    );

    // S3 Bucket

    const bucket = new S3Construct(
      this,
      'DataBucket',
      {
        config: platformConfig,
        kmsKey: kmsKey.key
      }
    );

    // EC2 Instance

    const ec2 = new Ec2Construct(
      this,
      'AppServer',
      {
        config: platformConfig,
        vpc: vpc.vpc,
        securityGroup: sg.securityGroup,
        role
      }
    );

    // Outputs

    new cdk.CfnOutput(
      this,
      'VpcId',
      {
        value: vpc.vpc.vpcId
      }
    );

    new cdk.CfnOutput(
      this,
      'BucketName',
      {
        value: bucket.bucket.bucketName
      }
    );

    new cdk.CfnOutput(
      this,
      'InstanceId',
      {
        value: ec2.instance.instanceId
      }
    );

  }
}