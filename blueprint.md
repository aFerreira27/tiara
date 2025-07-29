## Krowne Base Application Blueprint

### Overview

The Krowne Base application is a Next.js project designed to manage product information. It features a dashboard, a product base, a "Krowne Lens" feature (under development), a "Krowne Sync" feature (under development), and a spec sheet generator (under development). The application uses Firebase for potential future backend integrations and includes authentication capabilities.

### Detailed Outline

**1. Project Structure:**

*   Standard Next.js App Router structure.
*   `/app`: Contains route-based pages.
*   `/components`: Houses reusable React components.
*   `/lib`: Contains utility functions and libraries.
*   `/public`: Stores static assets.
*   `/types`: Defines TypeScript types.
*   `dataconnect`: Directory for Firebase Data Connect configuration (schema and connectors).

**2. Core Features:**

*   **Product Listing:** Displays a list of products with search and filtering capabilities.
*   **Product Detail View:** Shows detailed information for a selected product.
*   **Add New Product:** Allows users to add new products to the list.
*   **Authentication:** Includes basic sign-in functionality.
*   **Navigation:** Sidebar for navigating between different sections of the application.
*   **API Endpoints:** Provides API routes for fetching and adding products, and managing tags.

**3. Components:**

*   `AppLayout.tsx`: Provides the main layout for the application, including the sidebar.
*   `SearchBar.tsx`: Component for filtering products by search term.
*   `ProductCard.tsx`: Displays a summary of a single product.
    *   Includes `onClick` prop for handling click events.
*   `ProductDetail.tsx`: Shows detailed information about a selected product.
    *   Includes `product` and `onClose` props.
*   `AddProductButton.tsx`: Button to trigger the add product overlay.
*   `AddProductForm.tsx`: Form for adding new product details.
*   `AddProductOverlay.tsx`: Modal overlay containing the add product form.
    *   Includes `isOpen`, `onClose`, and `onAddProduct` props.
*   `Sidebar.tsx`: The main sidebar component.
*   `SidebarLogo.tsx`: Displays the application logo in the sidebar.
*   `SidebarNavigation.tsx`: Contains navigation links within the sidebar.
*   `SidebarPopover.tsx`: Provides a popover for user actions or additional options.
*   `SidebarUser.tsx`: Displays user information in the sidebar.
*   `Providers.tsx`: Wraps the application with necessary contexts (e.g., NextAuth).
*   `SignInButton.tsx`: Button for initiating the sign-in process.
*   `Overlay.tsx`: A generic overlay component used by others.
*   `ConnectionsOverlayContent.tsx`: Content for a connections-related overlay (under development).
*   `ProfileOverlayContent.tsx`: Content for a user profile overlay (under development).
*   `SupportOverlayContent.tsx`: Content for a support-related overlay (under development).

**4. Pages (in `/app`):**

*   `page.tsx`: The root landing page.
*   `layout.tsx`: The root layout for the application.
*   `favicon.ico`: Application favicon.
*   `globals.css`: Global styles.
*   `dashboard/page.tsx`: Dashboard page (under development).
*   `krowne-base/page.tsx`: The main product listing page.
    *   Includes fetching and displaying products.
    *   Implements search and filtering logic.
    *   Handles displaying product details and the add product overlay.
    *   Corrected import path for `Product` to `../../../types/product`.
    *   Implemented `handleSearchInputChange` to correctly handle search input.
*   `krowne-base/[sku]/page.tsx`: Dynamic route for individual product pages.
*   `krowne-lens/page.tsx`: Krowne Lens page (under development).
*   `krowne-sync/page.tsx`: Krowne Sync page (under development).
*   `spec-sheet-generator/page.tsx`: Spec Sheet Generator page (under development).
*   `api/tags/route.ts`: API route for tags.
*   `api/products/route.ts`: API route for products.
*   `api/upload-csv/route.ts`: API route for CSV uploads.
*   `api/auth/[...nextauth]/route.ts`: API route for NextAuth authentication.
*   `api/tags/[sku]/routs.ts`: API route for tags by SKU.
*   `api/tags/preview/[sku]/route.ts`: API route for tag previews by SKU.

**5. Styling:**

*   Uses Tailwind CSS for styling.
*   Global styles defined in `globals.css`.

**6. Data Management:**

*   Fetches product data from the `/api/products` endpoint.
*   Uses `useState` and `useEffect` hooks for managing component state and side effects.
*   Product data is typed using the `Product` interface.

**7. Error Handling:**

*   Includes basic error handling for API calls.

### Plan and Steps for Current Change

**Change:** Resolve type errors in `ProductDetail.tsx` and `AddProductOverlay.tsx` by adding missing prop definitions to their respective interfaces.

**Plan:** Update `ProductDetailProps` and `AddProductOverlayProps` interfaces to include the necessary prop types.

**Steps:**

1.  Open `src/components/krownebase/ProductDetail.tsx`.
2.  Update `ProductDetailProps` to include `product: Product;` and `onClose: () => void;`.
3.  Open `src/components/krownebase/AddProductOverlay.tsx`.
4.  Update `AddProductOverlayProps` to include `onClose: () => void;` and `onAddProduct: (newProduct: Product) => Promise<void>;`.
5.  Save both files.
6.  Run `npm run lint -- --fix` to address any linting issues.
7.  Monitor the dev server output for errors.
8.  Check the browser preview to ensure the components are working correctly and the type errors are resolved.
