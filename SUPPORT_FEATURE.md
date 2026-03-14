# CalcHQ Support Feature Implementation Plan

This document outlines the plan for adding a three-tiered support system to the CalcHQ application.

## 1. Feature Overview

The support system will consist of three levels:

*   **Level 1: Self-Help Search:** A search bar that allows users to find answers to their questions within the existing FAQ content.
*   **Level 2: AI Chat Assistance:** A chat modal that provides users with AI-powered assistance.
*   **Level 3: Email Support:** A direct email link for users to contact the support team.

## 2. Implementation Details

### 2.1. New `Support` Page

*   A new page will be created at `/support` to host the support system.
*   A link to this page will be added to the footer of the application.
*   The page will be built using React and styled with Tailwind CSS to match the existing design.

### 2.2. Level 1: Self-Help Search

*   A search input will be added to the `Support` page.
*   The search functionality will filter the `faqs` array from the `CALCULATORS` object in `client/src/lib/calculators.ts`.
*   Search results will be displayed dynamically below the search bar.

### 2.3. Level 2: AI Chat Assistance

*   A "Chat with AI" button will be placed on the `Support` page.
*   Clicking the button will open a `ChatModal` component.
*   A new tRPC router will be created at `server/supportRouter.ts`.
*   This router will have a `chat` procedure that takes a user's message as input and uses the `invokeLLM` function to get a response from the AI model.
*   The `ChatModal` component will use the tRPC client to call the `chat` procedure and display the conversation.

### 2.4. Level 3: Email Support

*   A "Contact Support" button or link will be added to the `Support` page.
*   This will be a `mailto:` link that opens the user's default email client with the `to` field pre-filled with `support@calchq.io`.

## 3. File Changes

The following files will be created or modified:

*   **Created:**
    *   `client/src/pages/Support.tsx`: The new support page.
    *   `client/src/components/ChatModal.tsx`: The AI chat modal component.
    *   `server/supportRouter.ts`: The new tRPC router for the support feature.
*   **Modified:**
    *   `client/src/App.tsx`: To add the new `/support` route.
    *   `client/src/components/Footer.tsx`: To add a link to the support page.
    *   `server/routers.ts`: To register the new `supportRouter`.
