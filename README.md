# VEN-DENS Online Store

A no-backend React + Vite + Tailwind storefront with product search, category filters, cart, and WhatsApp checkout.

## Requirements
- Node.js 20.19+ or 22.12+ recommended
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL Vite prints (usually http://localhost:5173).

## Test a production build
```bash
npm run build
npm run preview
```

## Edit products
Open `src/data/products.js`. For each product you can edit:
- `name`, `category`, `price`, `oldPrice`
- `badge`, `description`, `image`
- `available` (`false` hides the ability to add it to cart)

For local product photos, create `public/products/` and set an image like:
`image: '/products/headphones.jpg'`

Use a unique numeric `id` for each product. Prices are in Sri Lankan rupees.

## Configure WhatsApp and delivery fee
At the top of `src/App.jsx`:
```js
const WHATSAPP_NUMBER = '94740785016'
const DELIVERY_FEE = 350
```
WhatsApp number must contain country code and digits only, without `+`, spaces, or dashes. Change the delivery fee to your real rate or set it to `0` if needed.

## Deploy to Vercel
1. Create a GitHub repository and push this project.
2. Sign in to Vercel and choose **Add New → Project**.
3. Import your GitHub repository.
4. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
5. Click **Deploy**. No environment variables are required.
6. After edits, commit and push to GitHub; Vercel will redeploy automatically.

You can also deploy with the Vercel CLI:
```bash
npm install -g vercel
vercel
vercel --prod
```

## Important
- This project has no backend, admin panel, database, or online payment processing.
- Product edits require changing `src/data/products.js` and redeploying the site.
- The cart is saved in the visitor's browser using localStorage.
- WhatsApp opens a pre-filled order. The customer must press **Send** in WhatsApp for the business to receive it.
- Sample product listings and prices are placeholders. Verify availability, specifications, product photos, and prices before publishing.
- The delivery fee is a configurable example, not a confirmed business rate.
- Product image URLs currently use Unsplash. For a commercial storefront, replace them with your own product photos or images you have permission to use.
