# Admin Panel Guide - Salt N Sugar

## 🎉 Admin Panel is Ready!

Your complete admin dashboard has been successfully set up for managing the Salt N Sugar bakery website.

## 📍 Admin Panel Access

**URL:** `http://localhost:3000/admin/login`

**Default Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change the password after your first login!

---

## 🎯 Features

### 1. **Hero Photos Management**
- Upload children celebration photos (Base64 format)
- Add custom titles for each photo
- Set display order
- Auto-rotating carousel on homepage
- Delete unwanted photos

### 2. **Product Management**
- Add new cakes with full details:
  - Product ID (URL-friendly, e.g., `chocolate-cake`)
  - Product Name
  - Description
  - Category (Birthday, Wedding, Custom, etc.)
  - Product Image (Base64 format)
  - Rating (0-5 stars)
  - Ingredients (comma-separated)
  - Multiple sizes with individual prices
- Edit existing products
- Delete products
- Products automatically appear on:
  - Homepage (Favorite Cakes section)
  - Product detail pages
  - Cart system
  - WhatsApp orders

---

## 📸 How to Upload Images

### Converting Images to Base64:

**Method 1: Online Tool**
1. Go to https://www.base64-image.de/
2. Upload your image
3. Copy the Base64 code
4. Paste in admin panel

**Method 2: Using Node.js**
```javascript
const fs = require('fs');
const imageBase64 = fs.readFileSync('image.jpg', 'base64');
console.log(`data:image/jpeg;base64,${imageBase64}`);
```

**Method 3: Browser Console**
```javascript
// Drag image to browser, then:
const input = document.createElement('input');
input.type = 'file';
input.onchange = e => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => console.log(reader.result);
  reader.readAsDataURL(file);
};
input.click();
```

---

## 🚀 Getting Started

### Step 1: Login
1. Navigate to `http://localhost:3000/admin/login`
2. Enter credentials (admin / admin123)
3. Click "Login to Dashboard"

### Step 2: Add Hero Photos
1. Click "🎉 Hero Photos" tab
2. Paste image Base64 URL
3. Enter title (e.g., "Happy Children Celebrating")
4. Set order (0 = first)
5. Click "Add Hero Photo"
6. Photos auto-rotate every 5 seconds on homepage

### Step 3: Add Products
1. Click "🎂 Products" tab
2. Fill in all product details:
   - **Product ID:** `chocolate-dream` (lowercase, hyphens, no spaces)
   - **Product Name:** `Chocolate Dream`
   - **Description:** Detailed product description
   - **Category:** Select from dropdown
   - **Rating:** 5.0 (adjustable)
   - **Image:** Base64 string
   - **Ingredients:** `Chocolate, Cream, Vanilla, Sugar`
   - **Sizes:** Set prices for Small, Medium, Large
3. Click "Add Product"
4. Product instantly appears on website!

### Step 4: Edit Products
1. Find product in list
2. Click "Edit" button
3. Modify any field
4. Click "Update Product"
5. Changes reflect immediately

### Step 5: Delete Items
- Click "Delete" on any photo/product
- Confirm deletion
- Item removed from website

---

## 🔒 Security Notes

### Important:
- Admin panel is JWT-protected
- Token expires after 7 days
- Only authenticated admins can add/edit/delete
- Public can only view active items

### To Create Additional Admin Users:
1. Modify `scripts/createAdmin.js`
2. Change username, email, password
3. Run: `node scripts/createAdmin.js`

---

## 📱 How It All Works

### When Admin Adds Photo:
1. Admin uploads Base64 image
2. Saved to MongoDB HeroPhoto collection
3. Homepage fetches photos via `/api/admin/hero-photos`
4. Auto-rotates every 5 seconds
5. Customers see on homepage hero section

### When Admin Adds Product:
1. Admin enters all product details
2. Saved to MongoDB Product collection
3. Website fetches via `/api/admin/products`
4. Product appears in:
   - Homepage "Favorite Cakes" grid
   - Individual product page `/product/[id]`
   - Search results
   - Cart system
   - WhatsApp order messages

### When Customer Orders:
1. Customer adds product to cart
2. Clicks "Send Order via WhatsApp"
3. WhatsApp opens with:
   - Product name, size, quantity
   - Total price
   - Request for delivery details
4. Customer discusses with admin on WhatsApp
5. Admin confirms order

---

## 🎨 Customization Tips

### Product IDs
- Use lowercase
- Replace spaces with hyphens
- Examples: `chocolate-fantasy`, `red-velvet-dream`, `strawberry-delight`

### Image Sizes
- Recommended: 800x800px for products
- Recommended: 1200x1200px for hero photos
- Format: JPEG or PNG
- Keep file size under 2MB for faster loading

### Categories
Current categories:
- Birthday Cakes
- Wedding Cakes
- Custom Cakes
- Cupcakes
- Desserts

To add more, edit: `src/app/admin/dashboard/page.tsx`

---

## 📊 API Endpoints

### Admin Login
- **POST** `/api/admin/login`
- Body: `{ username, password }`
- Returns: JWT token

### Hero Photos
- **GET** `/api/admin/hero-photos` - Fetch all
- **POST** `/api/admin/hero-photos` - Add (Admin only)
- **DELETE** `/api/admin/hero-photos?id=xxx` - Delete (Admin only)

### Products
- **GET** `/api/admin/products` - Fetch all active
- **GET** `/api/admin/products?admin=true` - Fetch all (Admin view)
- **POST** `/api/admin/products` - Add (Admin only)
- **PUT** `/api/admin/products` - Update (Admin only)
- **DELETE** `/api/admin/products?id=xxx` - Delete (Admin only)

---

## 🐛 Troubleshooting

### Can't Login?
- Check MongoDB is running
- Verify credentials (admin / admin123)
- Run `node scripts/createAdmin.js` again

### Photos Not Showing?
- Verify Base64 string starts with `data:image/`
- Check image size (max 2MB recommended)
- Ensure "active" is true

### Products Not Appearing?
- Check "active" is true
- Verify Product ID is unique
- Refresh homepage (Ctrl+F5)

### Images Loading Slow?
- Compress images before converting to Base64
- Use JPEG instead of PNG for photos
- Consider hosting images externally

---

## 🎯 Next Steps

1. **Change Default Password**
   - Login to admin panel
   - Navigate to settings (to be implemented)
   - Or modify directly in database

2. **Add Your Photos**
   - Take photos of happy children with your cakes
   - Convert to Base64
   - Upload via admin panel

3. **Add Your Products**
   - List all your current cakes
   - Include accurate prices
   - Add mouth-watering descriptions

4. **Test WhatsApp Orders**
   - Add product to cart
   - Click "Send Order via WhatsApp"
   - Verify your number (923335981875) receives the message

5. **Promote Your Website**
   - Share URL with customers
   - Post on social media
   - Add to business cards

---

## 💡 Pro Tips

- **Use High-Quality Images:** Professional photos increase orders
- **Update Regularly:** Keep products fresh and seasonal
- **Monitor Reviews:** Check customer feedback in Testimonials
- **Respond Quickly:** Reply to WhatsApp orders within minutes
- **Seasonal Specials:** Add holiday-themed cakes during festivals
- **Customer Photos:** Upload real customer celebration photos to hero section

---

## 📞 Technical Support

For issues or questions:
1. Check console for errors (F12)
2. Verify MongoDB connection
3. Check terminal for server errors
4. Review this guide again

---

## 🎊 Success Checklist

- [x] Admin panel created
- [x] First admin user created
- [x] Hero photos management ready
- [x] Product management ready
- [x] WhatsApp integration active
- [ ] Change default admin password
- [ ] Upload your first hero photo
- [ ] Add your first product
- [ ] Test complete customer flow

---

**Congratulations! Your Salt N Sugar admin panel is fully operational! 🎂✨**
