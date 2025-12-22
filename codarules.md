# Book Search App - Project Constitution

## 🎯 Project Overview
A web-based Book Search Application using the Google Books API. The app allows users to search for books, view details, and save favorites to local storage.

## 🛠 Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** JavaScript (JSX) - **NO TYPESCRIPT**.
- **State Management:** Redux Toolkit (Thunks + Axios, NOT RTK Query).
- **UI Components:** Shadcn UI + Tailwind CSS.
- **API:** Google Books API (Volumes endpoint).

## 🏗 Architectural Rules
1. **Client Components:** Use `"use client";` at the top of files that use Redux hooks (`useDispatch`, `useSelector`) or React hooks.
2. **Redux Pattern:** - All API calls must use `createAsyncThunk` in slices.
   - Use Axios for all requests.
   - Store favorites in Redux state and sync with `localStorage`.
3. **Data Handling:** - Always access book data via `item.volumeInfo`.
   - Implement fallback images for missing `thumbnail` links.
   - Convert `http` thumbnail URLs to `https`.

## 🎨 UI & UX Standards
- **Style:** Clean, minimalist, modern.
- **Components:** Always prefer Shadcn UI components over raw HTML tags.
- **Responsiveness:** Use Tailwind's responsive classes (grid-cols-1 md:grid-cols-3, etc.).
- **Feedback:** Always show a loading skeleton or spinner during `pending` thunk states.

## 🚫 Constraints (What NOT to do)
- **NO RTK Query:** Strictly use createAsyncThunk.
- **NO TypeScript:** All files must be `.js` or `.jsx`.
- **NO Barrel Exports:** Import components directly to keep builds fast.
- **NO Inline Styles:** Use Tailwind CSS exclusively.

## 🔄 Interaction Guidelines
- Before making large architectural changes, explain the plan to the user.
- If a package is missing, provide the `npm install` command.
- When an error occurs, analyze the stack trace before suggesting a fix.