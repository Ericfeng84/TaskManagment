# UI Optimization Plan for Dashboard Page

This document outlines the plan to optimize the UI of the `Dashboard.tsx` page based on the provided design image.

## 1. Update Main Layout (`Dashboard.tsx`)

-   **Background:** Change the main container's background color to a light gray (`#f3f4f6` or equivalent Tailwind CSS class `bg-gray-100`).
-   **Header Section:**
    -   Remove the existing `<header>` element.
    -   Create a new `div` to act as the page header.
    -   Add an `h1` element with the text "我的项目" (My Projects). It should have a large font size and bold weight.
    -   Add a "创建新项目" (Create New Project) button to the right of the header.
        -   The button should have a blue background, white text, and rounded corners.
        -   It should include a "+" icon before the text.

## 2. Create `ProjectCard.tsx` Component

-   Create a new reusable component at `client/src/components/ProjectCard.tsx`.
-   This component will accept a `project` object as a prop.

## 3. Implement New Project Card UI

The `ProjectCard.tsx` component will have the following structure and styling:

-   **Container:**
    -   A `div` with a white background, rounded corners (`rounded-lg`), and a subtle box shadow (`shadow-md`).
    -   Padding on all sides (`p-6`).
-   **Card Header:**
    -   A `div` using Flexbox (`flex justify-between items-center`) to contain the project title and the "more options" icon.
    -   **Project Title:** An `h3` element for the project name.
    -   **More Options:** A "..." icon button on the top-right.
-   **Card Body:**
    -   **Description:** A `p` element for the project description with a muted text color (`text-gray-600`).
    -   **Task Progress Section:**
        -   A label "任务进度" (Task Progress).
        -   A progress bar container with a light gray background.
        -   An inner progress bar element with a blue background, whose width will be calculated based on task completion.
        -   A text element to display the progress (e.g., "1 / 6").
-   **Card Footer:**
    -   A `div` using Flexbox (`flex justify-between items-center`).
    -   **Avatars:** A section on the left to display circular user avatars. This will be a placeholder for now.
    -   **Action Button:** A "进入看板" (View Board) button on the right, styled as the primary action button (blue background, white text).

## 4. Integrate `ProjectCard` into `Dashboard.tsx`

-   Import the new `ProjectCard` component into `Dashboard.tsx`.
-   In the main content area, replace the existing project mapping logic.
-   Use a CSS Grid (`grid`) to lay out the project cards in a responsive manner (e.g., 1 column on small screens, 2 on medium, and 3 on large screens).
-   Map over the `projects` array and render a `<ProjectCard>` for each project, passing the `project` data as a prop.