# AWS SAM Backend Template

## Requirements

- SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- Node.js - [Install Node.js 20](https://nodejs.org/en/), including the NPM package management tool.
- Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)
- esbuild - If using esbuild as build method for bundling Lambdas, you should install esbuild globally on your machine with `npm install -g esbuild`.

> [!NOTE]
> Read [SAM_CLI.md](SAM_CLI.md) for more info on SAM CLI usage.

## Setup

1. Run `npm install` at the root to install necessary dependencies
2. Run `npm run build` to build `src` and `layers` based on what is defined in the `template.yaml`. Optionally you can run only `sam build` to ignore `layers` build step.
3. Make sure Docker is running on your machine and test the setup running `sam local invoke HelloWorld`.

## Development

1. `npm run build:watch`
2. Upon new changes, nodemon will re-run build script.

### Start API

- `npm run serve` -> alias for `sam local start-api`
- `npm run serve:watch` -> run `npm run serve` on file changes.

### Invoke single lambda

- `sam local invoke <LambdaLogicalID>`

### Dependencies

Dependencies can be added in 2 ways:

1. Within the same Lambda code definition. For example, running `npm init` and `npm install <package-name>` inside your lambda code folder. Using this method, esbuild will bundle the dependency code along the lambda code when running sam build, without the need to add the dependecny as an external layer.

2. As an external package whenever we know that it will be available at runtime. In this case, we install the package as a `devDependency` in the root of the project and now we are ready to import that dependency in any lambda defined in `./src`. If we add a dependency this way, we must add the dependency to the `template.yaml` -> `ExternalPackages` parameter list, in order for esbuild (the bundler) not to include those packages with the Lambda code. This is the case for exampe, for external layers and packages included in the Lambda NodeJS runtime, like the `@aws-sdk`.

### Environment variables

Environment variables must be set first at the `template.yaml` level, as a Parameter with the Default attribute set to the value we want to use when developing in a dev environment or locally. Now, after we run `sam build` (or `npm run build` to include layer build process) we can consume this envs from any other resource (like Lambda) just by referencing the Paramenter, e.g:

```yaml
HelloWorldFunction:
  Type: AWS::Serverless::Function
  Properties:
    CodeUri: src/hello-world/
    Timeout: 20
    FunctionName: !Sub "HelloWorld-${Environment}"
    Layers:
      - !Ref commons
    Environment:
      Variables:
        #Here when can get the value of the env by getting process.env.MY_ENV
        - MY_ENV: !Ref MyEnv
```

> [!IMPORTANT]
> Aditionally, for every new environment variable declared as a Parameter, we must declare its corresponding value for each environment in each of the `./ci/.env.*` files.

### Layers and External Packages

- **Layers** are created under `./layers/{layer-name}` and you can take `commons` layer as a base example to create new ones. When using `commons` layer within a Lambda, it should be referenced in the `Layers` attribute at the lambda resource definition. See the example:

  ```yaml
  HelloWorldFunction:
    Type: AWS::Serverless::Function
    Properties:
    CodeUri: src/hello-world/
    FunctionName: HelloWorld
    Role: !Ref LambdaRole
    Layers:
      - !Ref commons
    Events:
      HelloWorld:
      Type: Api
      Properties:
        Path: /hello
        Method: get
  ```
- **External Packages** are those packages that are used within a Lambda source code definition but are not supposed to be bundled with the lambda code by esbuild, although they will be available at runtime. External Packages Paramater in the `template.yaml` file stores all those package's names that should be ignored by esbuild when running `sam build`. The layer `commons` is also marked as External Package since it will also be available at runtime if declaring in the `Layer` resource field.

## Deploy

### App Name

Replace `<app-name>` in ./ci/buildspec.yaml with the name you want to set to the CloudFormation stack. Other implicit resources (like ApiGateway API) will also create using this name. e.g: `--stack-name=my-new-app-$ENV`, then you will have a new stack in CF with the name `my-new-app-dev`, and a new API in ApiGateway with the name `my-new-app-dev` too, when deploying to dev environment.

### Environment variables

The `buildspec.yaml` file asumes it has 3 environment variable files (one for each environment, dev, staging, prod) available in the `ci` directory.
When setting up CodePipeline, each CodePipeline project should be configured to have the following environment variable set at buildtime (when running `buildspec.yaml` script at the build-step in CodeBuild):
`ENV=<env>`, where `<env>` should be replaced with `dev`, `staging`, or `prod` (the .env.\* files sufixes).
Every time a new environment variable is added to the `template.yaml` in the form of a parameter, each of these `.env.*` files should be populated with the corresponding value
