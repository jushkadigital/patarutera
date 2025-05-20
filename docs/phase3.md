# Phase 3: Frontend Development - Structure & Routing

This phase focuses on building the core frontend structure, implementing dynamic routing, and setting up the main page for displaying content from PayloadCMS.

## 3.1. Next.js App Router & Core Structure

- [ ] **Implement Dynamic Routing using `app/[slug]/page.tsx`:**
  - This central page will handle various content types (General Pages, Tours, Blog Posts) based on the URL slug.
  - Logic within this page will determine the content type and render appropriately.

- [ ] **Create the Root Layout Component (`app/layout.tsx`):**
  - Ensure the root layout is set up with global styles, fonts, and metadata.
  - (This was largely addressed in Phase 2.1, but review and finalize).

- [ ] **Establish Frontend Directory Structure:**
  - Confirm and utilize the planned directory structure:
    - `src/app/` for core routing and pages (including `[slug]/page.tsx` and `destinos/page.tsx`).
    - `src/components/ui/` for Shadcn UI based components.
    - `src/components/aceternity/` for Aceternity UI based components.
    - `src/blocks/` for page section components corresponding to PayloadCMS blocks.
    - `src/lib/` for utility functions, data fetching logic, and CMS interaction helpers.
  - (Partially addressed in Phase 2.1, ensure it's complete and consistent).

- [ ] **Configure Global Styles (`globals.css`):**
  - Set up Tailwind CSS directives.
  - Define base styles, CSS variables (e.g., for Shadcn UI theming), and any global styling resets.
  - (Shadcn UI init handled some of this, review and augment as needed).

## 3.2. Dynamic Page Implementation (`app/[slug]/page.tsx`)

This is the core page for displaying most content from the CMS.

- [ ] **Implement Slug Extraction:**
  - Extract the `slug` from URL parameters within `app/[slug]/page.tsx`.

- [ ] **Develop Data Fetching Logic:**
  - Create functions to fetch page-specific data and an array of content blocks from PayloadCMS based on the `slug`.
  - Handle cases where content for a given slug is not found (e.g., show a 404 page).
  - Implement robust error handling for API requests.

- [ ] **Implement Dynamic Rendering Logic:**
  - In `app/[slug]/page.tsx`, map over the fetched content blocks data.
  - For each block, dynamically render the corresponding React component from the `src/blocks/` directory.
  - Pass the necessary data props to each block component.

## Next Steps

With Phase 3 complete, the website will be able to dynamically render different types of pages based on data fetched from PayloadCMS, using a flexible block-based content structure. The next phase will focus on developing the individual UI components (from Shadcn and Aceternity) and the reusable "Block" components themselves. 