# 📝 Productivity Hub

Welcome to **Productivity Hub**, a feature-rich mini productivity app designed to help users track tasks, link them to notes, and build routines — all in one place. This app aims to make staying productive fun and engaging through gamification, including a points system that unlocks badges for completing tasks and sticking to routines.

This project began as a Next.js take-home challenge deployed on AWS Amplify but is evolving into an app featuring modern libraries and tooling like **Dexie.js**, **Zustand**, and **Tailwind CSS**.

---

## 🚀 Features

- **Task Management**: Create, edit, and track tasks with categories and statuses.
- **Notes Linking**: (Coming Soon) Attach notes to tasks for better context and organization.
- **Routine Builder**: (Planned) Develop daily, weekly, and monthly routines.
- **Gamification**: (Planned) Earn points for completing tasks and unlock badges to stay motivated.
- **AWS Amplify Deployment**: Fully deployed on AWS with CI/CD integration for seamless updates.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs)
- **Database**: [Dexie.js](https://dexie.org) for client-side data persistence.
- **Styling**: [Tailwind CSS](https://tailwindcss.com) for modern and responsive design.
- **Authentication**: [NextAuth.js](https://next-auth.js.org) (planned for secure user sessions).
- **Deployment**: [AWS Amplify](https://aws.amazon.com/amplify) with CI/CD pipeline.

---

## 🌟 Vision for the App

### 1. **Unified Productivity Space**

A central hub where users can track tasks, add contextual notes, and design routines that keep them on track.

### 2. **Engagement Through Gamification**

Earn points for completing tasks and routines, with weekly/monthly badges to celebrate consistency.

### 3. **Accessible and Reusable**

Deployable on any AWS account with minimal configuration, allowing other developers to fork and build upon it.

---

## 🛠️ Getting Started

Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-repo/productivity-hub.git
cd productivity-hub
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🖥️ Deployment on AWS Amplify

The app is fully deployable on AWS Amplify. To set up your own deployment:

### 1. **Environment Variables**

Add the following to your Amplify environment:

- `NEXTAUTH_SECRET`: Your app’s NextAuth secret.
- `NEXTAUTH_URL`: The app's deployment URL (e.g., `https://your-app.amplifyapp.com`).

### 2. **Build Settings**

Ensure your `amplify.yml` or `buildspec.yml` is configured to build a Next.js app:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: out
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

## 🐞 Troubleshooting Deployment Issues

### 1. **Environment Variables**

Ensure all required secrets (e.g., `NEXTAUTH_SECRET`) are set in the Amplify environment.

### 2. **Next.js Configuration**

- Ensure your `next.config.js` is properly formatted. AWS Amplify doesn’t support `next.config.ts`.
- Use the correct target output: `export` for static deployment or `server` for dynamic features.

---

## 🔮 Future Roadmap

- [ ] **Notes Integration**: Link notes to tasks.
- [ ] **Routine Tracker**: Add support for routines (daily, weekly, monthly).
- [ ] **Gamification**: Implement a points system and badges.
- [ ] **User Authentication**: Secure user sessions with NextAuth.js.
- [ ] **Responsive Design**: Further enhance usability across all devices.
- [ ] **Cloud Syncing**: Sync tasks and routines across devices using AWS services.

---

## 🧩 Reusability for Other AWS Accounts

To make the app deployable on any AWS account:

1. Configure secrets in **AWS Secrets Manager** or Amplify’s environment variables.
2. Use dynamic configuration in `next.config.js` to adapt based on the deployment environment.
3. Leverage Amplify’s CI/CD pipelines to handle builds automatically on push to your GitHub repository.

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for features or improvements, feel free to open an issue or submit a pull request.
