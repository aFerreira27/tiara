## Blueprint

### Overview

The Krowne Base feature is the homepage of the application, rendered to the right of the sidebar. It allows users to search for products by SKU, product name, or tags. The search results are displayed as product cards. Clicking on a product card will navigate the user to a product detail page for that product. The product data is stored in a Google Cloud PostgreSQL database.

### Project Outline

- **Homepage (`src/app/krowne-base/page.tsx`):** Displays a search bar and a grid of product cards. Handles user authentication and redirects unauthenticated users to the login page.
- **Search Bar Component (`src/components/krownebase/SearchBar.tsx`):** Provides a search input field.
- **Add Product Button Component (`src/components/krownebase/AddProductButton.tsx`):** Button to trigger the add product overlay.
- **Add Product Overlay Component (`src/components/krownebase/AddProductOverlay.tsx`):** Displays options for adding products (Manually, From Spreadsheet, From PIMly). The local `AddProductForm` component has been removed to resolve a naming conflict with the imported component.
- **Product Card Component (`src/components/krownebase/ProductCard.tsx`):** Displays a product image, name, SKU, series, and tags. Clicking the card navigates to the product detail page.
- **Product Detail Page (`src/app/krowne-base/[sku]/page.tsx`):** Displays detailed information about a single product, including a single image, description, features, specifications, certifications, and downloadable files, based on the SKU in the URL. The product name is now mapped from the `product_description` field (with `sku` as a placeholder in the heading), other details are mapped from their corresponding fields in the updated `Product` interface, and tags are handled as a comma-separated string. The `AddProductForm` component now has a prop type definition for `onClose`.
- **Data Fetching:** Logic to fetch product data from the Google Cloud PostgreSQL database based on search queries or product ID. The `getProducts` function in `lib/product-db.ts` now filters out any potential `undefined` values from the parameters before executing the database query.

### Plan for Current Request

- Updated the `Product` interface in `types/product.ts` to reflect that the `images` field is a single URL string or null.
- Modified the image gallery in `ProductDetail.tsx` to display a single image based on the `product.images` URL and removed the multi-image navigation.
- Added null checks for `product.images` in `handlePreviousImage` and `handleNextImage` functions in `ProductDetail.tsx` to prevent errors when accessing the `images` field.
- Updated the field mappings in `ProductDetail.tsx` to use the correct fields from the updated `Product` interface for product name (using `sku` as placeholder), description, standard features, specifications, and certifications.
- Updated the tags handling in `ProductDetail.tsx` to treat `product.tags` as a comma-separated string.
- Added null checks for other fields in `ProductDetail.tsx` such as `tags`, `product_description`, `features`, `aq_description`, and `california_prop_warning`.
- Added checks for individual download fields (`spec_sheet`, `manuals`, `sell_sheet`, `brochure`) in `ProductDetail.tsx` before rendering download buttons.
- Removed the local `AddProductForm` component from `AddProductOverlay.tsx` to resolve the naming conflict.
- Added the `AddProductFormProps` interface and updated the `AddProductForm` component in `src/components/krownebase/AddProductForm.tsx` to accept the `onClose` prop.
- Filtered out potential `undefined` values from the `params` array in the `getProducts` function in `lib/product-db.ts`.
- Ran `npm run lint -- --fix` to ensure code quality and fix any linting issues.
