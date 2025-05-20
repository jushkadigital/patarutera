# Project Architecture

## 1. Introduction

This document outlines the software architecture for the [Project Name] Travel Agency website. It describes the technology stack, architectural patterns, and key structural components, including the integration of a headless CMS (PayloadCMS) and the concept of dynamic content "blocks."

## 2. Technology Stack

The project will utilize a modern, robust technology stack designed for performance, developer experience, and maintainability:

*   **Framework:** Next.js 15 (with App Router)
*   **Styling:** Tailwind CSS v4
*   **Component Libraries:**
    *   Shadcn UI: For foundational UI elements.
    *   Aceternity UI: For complex, interactive, and visually rich components.
*   **Language:** TypeScript
*   **Package Manager:** (To be decided: pnpm, yarn, or npm)
*   **Headless CMS:** PayloadCMS - For managing dynamic content, including pages and reusable content "blocks."
*   **Version Control:** Git

## 3. High-Level Architecture

The architecture is designed around a decoupled frontend and backend (CMS).

*   **Frontend:** A Next.js 15 application responsible for rendering the user interface and fetching data. It will use the App Router for server-side rendering (SSR) and static site generation (SSG) capabilities where appropriate.
*   **Backend (Content Management):** PayloadCMS will serve as the headless CMS. It will provide a user-friendly interface for content editors to manage website content, including general pages, tours, blog posts, and reusable content "blocks."
*   **Data Fetching:** The Next.js application will fetch content from PayloadCMS via its API (likely GraphQL or REST).

```
[Diagram: Next.js Frontend <-> API (GraphQL/REST) <-> PayloadCMS]
```

## 4. Frontend Architecture

The frontend will be built using Next.js and its App Router paradigm.

### 4.1. Directory Structure (Conceptual)

```
/app
├── [slug]/
│   └── page.tsx       # Handles dynamic rendering of pages based on slug
├── layout.tsx         # Root layout
├── globals.css        # Global styles, Tailwind directives
├── /components        # Shared UI components (atoms, molecules)
│   ├── /ui            # Shadcn UI based components
│   └── /aceternity    # Aceternity UI based components
├── /blocks            # Reusable content sections (organisms)
│   ├── HeroBlock.tsx
│   ├── FeatureGridBlock.tsx
│   └── ...
├── /lib               # Utility functions, data fetching logic
└── ...                # Other routes (e.g., /api for Next.js route handlers if needed)
```

### 4.2. Dynamic Routing

The core of the content presentation will be handled by `app/[slug]/page.tsx`. This dynamic route will:
1.  Extract the `slug` from the URL.
2.  Fetch data from PayloadCMS corresponding to this `slug`. This data will include page-specific metadata and an ordered list of "blocks" to render.
3.  Dynamically render the appropriate layout and sequence of "blocks" based on the fetched data.

## 5. Content Blocks

"Blocks" are a central concept in this architecture. They represent reusable sections of a page, composed of one or more individual UI components from Shadcn UI or Aceternity UI.

*   **Definition:** Blocks are pre-designed sections (e.g., Hero Banner, Testimonial Slider, Feature List, Call to Action) that content editors can choose and arrange within PayloadCMS to build pages.
*   **Structure:** Each block type will have a defined set of fields in PayloadCMS (e.g., a Hero Block might have fields for a title, subtitle, background image, and CTA button).
*   **Implementation:** In the Next.js application, each block type will correspond to a React component (e.g., `HeroBlock.tsx`, `CallToActionBlock.tsx`) located in the `/blocks` directory. These block components will internally use components from `/components/ui` and `/components/aceternity`.
*   **CMS Integration:** PayloadCMS will be configured with "Block" fields, allowing editors to select, configure, and reorder these blocks for any given page. The CMS will store the page structure as a list of block types and their associated data.
*   **Rendering:** The `app/[slug]/page.tsx` file will receive the list of blocks and their data from PayloadCMS. It will then map over this list and render the corresponding block components in sequence.

**Example Block Mapping:**

| PayloadCMS Block Name | Frontend Component        | Description                                  |
|-----------------------|---------------------------|----------------------------------------------|
| `hero`                | `HeroBlock.tsx`           | Displays a large banner with title and CTA.  |
| `featureGrid`         | `FeatureGridBlock.tsx`    | Shows a grid of features with icons/text.    |
| `testimonialSlider`   | `TestimonialSliderBlock.tsx`| A slider for customer testimonials.          |

## 6. Data Flow

1.  User navigates to a URL (e.g., `/about-us`).
2.  Next.js (`app/about-us/page.tsx` or `app/[slug]/page.tsx` with `slug = 'about-us'`) receives the request.
3.  The page component fetches data for the `about-us` slug from PayloadCMS.
4.  PayloadCMS returns:
    *   Page metadata (SEO title, description, etc.).
    *   An ordered array of "blocks" with their respective data (e.g., `[{ blockType: 'hero', title: 'About Us', ... }, { blockType: 'textBlock', content: '...' }]`).
5.  The Next.js page component iterates through the array of blocks.
6.  For each block, it dynamically renders the corresponding React component (e.g., `<HeroBlock data={...} />`, `<TextBlock data={...} />`), passing the specific data for that block.
7.  The block components render their UI using base components from Shadcn UI and Aceternity UI, styled with Tailwind CSS.

## 7. State Management

*   **Server State:** React Query (or Next.js's built-in data fetching with `fetch`) will be used for managing server state (data fetched from PayloadCMS).
*   **Client State:** For localized client-side interactivity, React Context or Zustand may be considered if simple prop drilling becomes insufficient. Global state management solutions will be avoided unless strictly necessary.

## 8. Future Considerations

*   **Internationalization (i18n):** PayloadCMS supports localization, which can be integrated into the frontend.
*   **Personalization:** Blocks could be conditionally rendered based on user segments or other criteria.
*   **A/B Testing:** Different block configurations or content could be A/B tested. 