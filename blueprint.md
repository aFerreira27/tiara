## Krowne Base Application Blueprint

### Overview

The Krowne Base application is a Next.js project designed to manage product information. It features a dashboard, a product base, a "Krowne Lens" feature (under development), a "Krowne Sync" feature (under development), and a spec sheet generator. The application uses Firebase for potential future backend integrations and includes authentication capabilities.

### Detailed Outline

**1. Project Structure:**

*   Standard Next.js App Router structure.
*   `/app`: Contains route-based pages.
*   `/components`: Houses reusable React components.
*   `/lib`: Contains utility functions and libraries, including a new `product-formatter.ts` for data cleaning and formatting.
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
*   **Spec Sheet Generation:** Allows users to search for a product by SKU and generate a specification sheet with formatted data.

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
*   `spec-sheet-generator/page.tsx`: Spec Sheet Generator page.
    *   Fetches product data by SKU.
    *   Uses `formatProductData` to clean and structure the product information.
    *   Generates an HTML spec sheet based on the formatted data.
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
*   Product data is typed using the `Product` and `FormattedProduct` interfaces.

**7. Error Handling:**

*   Includes basic error handling for API calls.

### Plan and Steps for Current Change

**Change:** Implement a function to clean and format product data for the spec sheet generator and integrate it into the application.

**Plan:**

1.  Create `lib/product-formatter.ts` with a `formatProductData` function and `FormattedProduct` interface.
2.  Update `src/app/spec-sheet-generator/page.tsx` to use `formatProductData` and the `FormattedProduct` type.
3.  Modify `generateSpecSheetHTML` to use the new formatted data structure.
4.  Update `blueprint.md` to document these changes.

**Steps:**

1.  Create `lib/product-formatter.ts` with the specified interface and function.
2.  Refine the `formatProductData` function to structure the specifications.
3.  Update `src/app/spec-sheet-generator/page.tsx` to import and use `formatProductData`.
4.  Modify the `generateSpecSheetHTML` function in `src/app/spec-sheet-generator/page.tsx` to use the `FormattedProduct` structure and access nested specification data.
5.  Update `blueprint.md` to reflect the new file and the changes in `src/app/spec-sheet-generator/page.tsx`.
