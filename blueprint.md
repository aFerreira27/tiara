## Project Blueprint

### Overview

This project is a Next.js application built within the Firebase Studio environment. It utilizes the App Router for file-based routing and NextAuth.js with the Azure AD provider for authentication, and Firebase Authentication.

### Project Outline

- **Authentication:** Implemented using NextAuth.js with the Azure AD provider. Configured in `src/app/api/auth/[...nextauth]/route.ts`. Requires `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID`, and `NEXTAUTH_URL` environment variables. Also uses Firebase Authentication.
- **Routing:** File-based routing is used within the `/app` directory.
- **Components:** Reusable React components are stored in the `/components` directory.
- **Environment Variables:** Production environment variables are managed in `apphosting.yaml`. Sensitive variables are stored in Google Cloud Secret Manager and referenced in `apphosting.yaml`.

### Plan for Current Change

**Objective:** Correct the `NEXTAUTH_URL` in `apphosting.yaml` and document the need to update Azure AD application settings.

**Steps:**

1.  Read the content of `apphosting.yaml`.
2.  Update the `NEXTAUTH_URL` in `apphosting.yaml` to a placeholder value `YOUR_PRODUCTION_URL`.
3.  Write the updated content back to `apphosting.yaml`.
4.  Update the `blueprint.md` file to document this change, including the requirement to update the Azure AD application's redirect URIs.

**Important:** After this change, you **must** update the redirect URIs in your Azure AD application registration to use your production URL (e.g., `https://your-production-url/api/auth/callback/azure-ad`). You also need to replace `YOUR_PRODUCTION_URL` in `apphosting.yaml` with your actual production URL.