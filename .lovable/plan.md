

# Demo Enhancement Plan for eCert Platform

## Goal
Make the demo **interactive and story-driven** so potential customers can click through the key flows and understand the system's value, without building a real backend. Focus on mock interactions (dialogs, toasts, state transitions) that simulate real workflows.

---

## What We Will Add

### 1. Interactive Approval Flow (Approvals page)
- Clicking **Approve** opens a confirmation dialog with reason textarea, then shows a success toast and removes the item from the list (local state)
- Clicking **Reject** opens a dialog asking for rejection reason, then toast + remove
- Clicking the **Eye** icon opens a detail drawer/dialog showing full applicant info, ID verification status, and documents

### 2. Certificate Detail Drawer (Certificates page)
- Clicking any certificate row opens a slide-out sheet showing:
  - Full certificate info, holder details, status timeline (Draft > Pending > Active)
  - Action buttons: Extend, Revoke, Download, View QR
  - Clicking "View QR" shows a mock QR code image pointing to `/verify/{certNo}`

### 3. Issue Certificate Dialog (Certificates page)
- "Issue Certificate" button opens a multi-step dialog:
  - Step 1: Select program, enter holder info
  - Step 2: Identity verification (mock upload area)
  - Step 3: Review and submit
  - Shows success toast with generated cert number

### 4. Program Detail Dialog (Programs page)
- Clicking a program card opens a dialog showing full program config: name, issuer, duration, renewal rules, cert number format, linked template
- Edit fields are pre-filled (read-only feel with edit capability)

### 5. Verify Page with Search (VerifyPublic)
- Add a search input at the top so users can type a cert number
- Typing any of the mock cert numbers shows the result; invalid numbers show "Not Found"
- Makes the public verify page feel functional

### 6. Holder Portal Interactions (HolderPortal)
- "QR Code" button opens a dialog showing a mock QR code
- "Download" button shows a toast "Certificate PDF downloaded"
- "ขอต่ออายุ" (Renew) button opens a simple renewal request dialog

### 7. Dashboard Click-Through
- "View All" buttons on Pending Approvals and Recent Certificates navigate to their respective pages
- Stat cards are clickable, navigating to relevant pages

### 8. Toast Feedback Everywhere
- All action buttons (Export, Save Settings, Create, etc.) show appropriate toast messages to feel responsive

---

## Technical Approach
- All interactions use **local React state** (useState) -- no backend needed
- Use existing shadcn components: `Dialog`, `Sheet`, `toast` from sonner
- Mock QR codes rendered as a styled placeholder with the verify URL text
- Page navigation via `useNavigate` for "View All" links
- Keep all mock data in `mockData.ts`, reference from components

## Files to Create/Edit
- `src/pages/Approvals.tsx` -- approval/reject dialogs, detail view, local state
- `src/pages/Certificates.tsx` -- row click detail sheet, issue dialog, QR view
- `src/pages/Programs.tsx` -- program detail dialog
- `src/pages/VerifyPublic.tsx` -- search input + lookup logic
- `src/pages/HolderPortal.tsx` -- QR dialog, download toast, renewal dialog
- `src/pages/Dashboard.tsx` -- clickable stat cards and "View All" navigation
- `src/pages/Events.tsx` -- event detail dialog with discount rules
- `src/pages/SettingsPage.tsx` -- save toast
- `src/pages/Templates.tsx` -- template preview dialog

This plan adds ~9 interactive touchpoints across all pages, turning the static screens into a clickable demo that tells the full eCert story.

