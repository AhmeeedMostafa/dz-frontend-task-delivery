# DZ store task solution

The thought process mainly goes around keeping the exact architecture provided in the task, with adding my code for achieving the needed business requirements taking into consideration clear separations for the pages' components for easier maintenance, reusability and having performance in a good level.

## Architecture Decisions

### State Management

- **React Context API**: Used for managing the shopping cart state across the application, allowing any component to access and modify the cart contents.
- **localStorage**: Implemented cart persistence using Browser Storage API (localStorage) to maintain the cart state between sessions on the browser.

### Method used

- **SSR**: As most of the components are depending on dynamic content (regardless of categories it might be dynamic/static depends on the use-case).

### Routing

- **Next.js App Router**: As requested utilized the App Router feature to implement clean, nested routing.
- **Dynamic Routes**: Created dynamic routes for product details and category pages to handle variable content.

## Features Implemented

1. **Products Page (Main Page)**
   - Displays a grid of products.
   - Server-side rendering for initial load performance.

2. **Product Page**
   - Shows detailed information about a specific product.
   - Image gallery with thumbnail navigation.
   - "Add to Cart" functionality.
   - Related categories.

3. **Categories Page**
   - Lists all available product categories.
   - Grid layout with category images and descriptions.

4. **Category Detail Page**
   - Displays products filtered by category.

5. **Cart Page & Functionality**
   - Add, remove, and update quantities of products.
   - Persistent storage using localStorage.
   - Cart indicator in the header showing total items.

6. **Checkout Page**
   - Order summary with item details.
   - Price calculation including tax.
   - Shipping information form.
   - Order submission to API.

7. **Orders Page**
   - Displays order history.
   - Shows order status, date, and total.

8. **Order Detail Page**
   - Comprehensive view of a specific order.
   - Lists ordered items, quantities, and prices.
   - Order summary with subtotal, tax, and total.
   - Customer information.

## Performance Optimization

1. **Image Optimization**: Next.js Image component for automatic optimization.
2. **Lazy Loading**: Components and images loaded only when needed.
3. **Skeleton Loaders**: Visual placeholders during data fetching.

## Accessibility

1. **Semantic HTML**: Used some semantic tags throughout the application.
2. **ARIA attributes**: Added where appropriate for screen readers.
3. **Keyboard navigation**: Some interactive elements are keyboard accessible.

## Error Handling

- **Form validation**: Client-side validation before submission.
- **Graceful degradation**: Appropriate error catching.

## Libraries and Tools Used

- **Next.js 14**: Framework for React applications.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: For type safety and improved developer experience.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: High-quality, accessible UI components.
- **Lucide Icons**: Comprehensive icon library.
- **Sonner**: Toast notifications for user feedback.

## Further performance improvements

Given more time, the following improvements could be made:

- Apply infinite scrolling, and if applied then applying next virtualization concept will be good to have.
- Usage of windowing/virtualization concept in-case there will be a lot of products added in the DOM page this will be beneficial for memory and faster processing.
- Use SSG for categories page if it is only manageable from the admin/store side and not expected to be dynamically updated.