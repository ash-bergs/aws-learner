# Next.js Project with AWS Deployment

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). The project was developed with the goal of deploying it on AWS Amplify, but encountered various configuration and environment setup issues along the way.

## Getting Started

To get started, first run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the result.

You can begin editing the page by modifying `app/page.tsx`

## AWS Deployment Issues

During the development process, deployment was done through AWS Amplify, but several issues arose, including:

### 1. **Next.js Nested `web` Folder**

The project structure had the Next.js app in a nested folder. This caused issues with the Amplify build process.

### 2. **Missing Environment Variables**

Key environment variables, such as `NEXTAUTH_SECRET` and `NEXTAUTH_URL`, were missing in both the Next.js configuration and the AWS Amplify environment variables. This led to issues with authentication and other app features.

### 3. **Configuration Issues**

Initially, the project was configured with a `next.config.ts` file, which caused build failures since AWS Amplify only supports `next.config.js` or `next.config.mjs`. This was corrected by renaming the file and modifying the configuration accordingly. These changes arose after having to downgrade next, react, and react-dom to support the current version of next-auth.

### 4. **Amplify Build Spec**

Understanding and configuring the `buildspec.yml` for AWS Amplify required extra time, as the documentation needed to be carefully followed to ensure the build process was correctly set up for a Next.js app. This was ultimately solved by adjusting build settings and environment variables.

### 5. **NextAuth Setup**

Adding `next-auth` for authentication was a choice I made, as auth of some type was a key requirement. However, it created complexities in the build and deployment processes. This was mostly due to missing environment variables and misconfiguration in Next.js and Amplify. The solution involved ensuring that all necessary secrets were available to both the app and Amplify.

## Reusability for Different AWS Accounts

To meet the requirement of making this project reusable, the following steps were taken:

1. **Environment Variables**: All sensitive information such as secrets (`NEXTAUTH_SECRET`, etc.) will be managed securely using AWS Secrets Manager or environment variables configured in AWS Amplify. This ensures that the app can be deployed on any AWS account with minimal configuration changes.

2. **Dynamic Configuration**: The `next.config.js` and other configuration files are set up to adjust based on the AWS account and GitHub repo associated with the project, ensuring portability across different accounts and repositories.

3. **Scalable Deployment**: Using AWS Amplify’s CI/CD pipeline, the app can be deployed automatically on each push to the GitHub repository, ensuring that any account can deploy the project with ease.
