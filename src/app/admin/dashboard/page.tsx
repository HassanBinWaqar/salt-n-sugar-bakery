'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HeroPhoto {
  _id: string;
  imageUrl: string;
  title: string;
  order: number;
  active: boolean;
}

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  ingredients: string[];
  sizes: Array<{
    size: string;
    price: number;
  }>;
  active: boolean;
  inStock?: boolean;
  stockQuantity?: number;
  displayOrder?: number;
}

interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  profileImage?: string;
  gender?: string;
  approved: boolean;
  createdAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  items: Array<{
    productName: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Completed' | 'Cancelled';
  paymentMethod: string;
  orderDate: string;
  deliveryDate?: string;
  notes?: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  popularProducts: {
    name: string;
    quantity: number;
    revenue: number;
    orders: number;
  }[];
  paymentMethodStats: {
    [key: string]: {
      count: number;
      revenue: number;
    };
  };
  ordersByStatus: {
    pending: number;
    preparing: number;
    delivery: number;
    completed: number;
    cancelled: number;
  };
  dailyRevenue: {
    date: string;
    revenue: number;
  }[];
  range: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'hero' | 'products' | 'reviews' | 'orders' | 'customers' | 'analytics' | 'settings'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');

  // Hero Photos State
  const [heroPhotos, setHeroPhotos] = useState<HeroPhoto[]>([]);
  const [newHeroPhoto, setNewHeroPhoto] = useState({
    imageUrl: '',
    title: '',
    order: 0
  });

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    description: '',
    category: 'Birthday Cakes',
    image: '',
    images: [] as string[],
    rating: 5.0,
    reviews: 0,
    ingredients: '',
    sizes: [
      { size: 'Small', price: 0 },
      { size: 'Medium', price: 0 },
      { size: 'Large', price: 0 }
    ],
    inStock: true,
    stockQuantity: 0
  });
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<'all' | 'today' | 'pending' | 'preparing' | 'delivery' | 'completed'>('all');
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    items: [{ productName: '', size: 'Small', quantity: 1, price: 0 }],
    totalAmount: 0,
    paymentMethod: 'Cash on Delivery',
    deliveryDate: '',
    notes: ''
  });
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Customers State
  const [customers, setCustomers] = useState<User[]>([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Analytics State
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsRange, setAnalyticsRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Settings State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('admin-token');
    if (!adminToken) {
      router.push('/admin/login');
      return;
    }
    
    // Verify token is valid by making a test request
    verifyToken(adminToken);
  }, [router]);

  const verifyToken = async (adminToken: string) => {
    try {
      const response = await fetch('/api/admin/products?admin=true', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('admin-token');
        localStorage.removeItem('admin-user');
        router.push('/admin/login');
        return;
      }
      
      setToken(adminToken);
      setIsAuthenticated(true);
      
      // Pass token directly to avoid timing issues
      fetchHeroPhotosWithToken(adminToken);
      fetchProductsWithToken(adminToken);
      fetchReviewsWithToken(adminToken);
      fetchOrdersWithToken(adminToken);
      fetchCustomersWithToken(adminToken);
      fetchAnalyticsWithToken(adminToken);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('admin-token');
      localStorage.removeItem('admin-user');
      router.push('/admin/login');
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    
    // Clear cookie
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    router.push('/admin/login');
  };

  // Hero Photos Functions
  const fetchHeroPhotos = async () => {
    try {
      const response = await fetch('/api/admin/hero-photos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setHeroPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error fetching hero photos:', error);
    }
  };

  const fetchHeroPhotosWithToken = async (adminToken: string) => {
    try {
      const response = await fetch('/api/admin/hero-photos', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setHeroPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error fetching hero photos:', error);
    }
  };

  const handleAddHeroPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/hero-photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newHeroPhoto)
      });

      const data = await response.json();
      if (data.success) {
        alert('Hero photo added successfully!');
        setNewHeroPhoto({ imageUrl: '', title: '', order: 0 });
        fetchHeroPhotos();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error adding hero photo');
    }
  };

  const handleDeleteHeroPhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/hero-photos?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('Hero photo deleted successfully!');
        fetchHeroPhotos();
      }
    } catch (error) {
      alert('Error deleting hero photo');
    }
  };

  const toggleHeroPhotoActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch('/api/admin/hero-photos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, active: !currentActive })
      });

      const data = await response.json();
      if (data.success) {
        fetchHeroPhotos();
      }
    } catch (error) {
      alert('Error toggling hero photo status');
    }
  };

  // Reviews Functions
  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchReviewsWithToken = async (adminToken: string) => {
    try {
      const response = await fetch('/api/admin/reviews', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await response.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleApproveReview = async (reviewId: string, approved: boolean) => {
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reviewId, approved })
      });

      const data = await response.json();
      if (data.review) {
        alert(`Review ${approved ? 'approved' : 'rejected'} successfully!`);
        fetchReviews();
      }
    } catch (error) {
      alert('Error updating review');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.message) {
        alert('Review deleted successfully!');
        fetchReviews();
      }
    } catch (error) {
      alert('Error deleting review');
    }
  };

  // Orders Functions
  const fetchOrders = async (filter?: string) => {
    try {
      const filterParam = filter || orderFilter;
      const url = filterParam === 'all' 
        ? '/api/admin/orders' 
        : `/api/admin/orders?filter=${filterParam}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchOrdersWithToken = async (adminToken: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newOrder)
      });

      const data = await response.json();
      if (data.success) {
        alert('Order added successfully!');
        setNewOrder({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          deliveryAddress: '',
          items: [{ productName: '', size: 'Small', quantity: 1, price: 0 }],
          totalAmount: 0,
          paymentMethod: 'Cash on Delivery',
          deliveryDate: '',
          notes: ''
        });
        fetchOrders();
      }
    } catch (error) {
      alert('Error adding order');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, status })
      });

      const data = await response.json();
      if (data.success) {
        alert('Order status updated!');
        fetchOrders();
      }
    } catch (error) {
      alert('Error updating order status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('Order deleted successfully!');
        fetchOrders();
      }
    } catch (error) {
      alert('Error deleting order');
    }
  };

  const addOrderItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productName: '', size: 'Small', quantity: 1, price: 0 }]
    });
  };

  const removeOrderItem = (index: number) => {
    const updatedItems = newOrder.items.filter((_, i) => i !== index);
    setNewOrder({ ...newOrder, items: updatedItems });
    calculateTotal(updatedItems);
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewOrder({ ...newOrder, items: updatedItems });
    calculateTotal(updatedItems);
  };

  const calculateTotal = (items: any[]) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setNewOrder(prev => ({ ...prev, totalAmount: total }));
  };

  // Products Functions
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products?admin=true');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchProductsWithToken = async (adminToken: string) => {
    try {
      const response = await fetch('/api/admin/products?admin=true', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        ingredients: newProduct.ingredients.split(',').map(i => i.trim()),
        sizes: newProduct.sizes.filter(s => s.price > 0)
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();
      if (data.success) {
        alert('Product added successfully!');
        setNewProduct({
          id: '',
          name: '',
          description: '',
          category: 'Birthday Cakes',
          image: '',
          images: [],
          rating: 5.0,
          reviews: 0,
          ingredients: '',
          sizes: [
            { size: 'Small', price: 0 },
            { size: 'Medium', price: 0 },
            { size: 'Large', price: 0 }
          ],
          inStock: true,
          stockQuantity: 0
        });
        fetchProducts();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error adding product');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingProduct)
      });

      const data = await response.json();
      if (data.success) {
        alert('Product updated successfully!');
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error updating product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('Product deleted successfully!');
        fetchProducts();
      }
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const toggleProductActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ _id: id, active: !currentActive })
      });

      const data = await response.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (error) {
      alert('Error toggling product status');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)? This action cannot be undone.`)) return;

    try {
      const deletePromises = selectedProducts.map(id =>
        fetch(`/api/admin/products?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      );

      await Promise.all(deletePromises);
      alert('Products deleted successfully!');
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      alert('Error deleting products');
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id));
    }
  };

  const addGalleryImage = (base64Image: string) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: [...(editingProduct.images || []), base64Image]
      });
    } else {
      setNewProduct({
        ...newProduct,
        images: [...newProduct.images, base64Image]
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    if (editingProduct) {
      const updatedImages = [...(editingProduct.images || [])];
      updatedImages.splice(index, 1);
      setEditingProduct({ ...editingProduct, images: updatedImages });
    } else {
      const updatedImages = [...newProduct.images];
      updatedImages.splice(index, 1);
      setNewProduct({ ...newProduct, images: updatedImages });
    }
  };

  // Customers Functions
  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCustomers(data.users);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchCustomersWithToken = async (adminToken: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCustomers(data.users);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleDeleteCustomer = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('Customer deleted successfully!');
        fetchCustomers();
      }
    } catch (error) {
      alert('Error deleting customer');
    }
  };

  const exportCustomersToCSV = () => {
    if (customers.length === 0) {
      alert('No customers to export');
      return;
    }

    // Create CSV content
    const headers = ['Name', 'Email', 'Joined Date'];
    const rows = filteredCustomers.map(customer => [
      customer.name,
      customer.email,
      new Date(customer.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `salt-n-sugar-customers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => {
    const searchLower = customerSearchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower)
    );
  });

  // Analytics Functions
  const fetchAnalytics = async (range: 'all' | 'today' | 'week' | 'month' = analyticsRange) => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${range}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchAnalyticsWithToken = async (adminToken: string) => {
    try {
      const response = await fetch(`/api/admin/analytics?range=all`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const changeAnalyticsRange = (range: 'all' | 'today' | 'week' | 'month') => {
    setAnalyticsRange(range);
    fetchAnalytics(range);
  };

  // Settings Functions
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password changed successfully! Please login again.');
        localStorage.removeItem('admin-token');
        router.push('/admin/login');
      } else {
        alert(data.message || 'Failed to change password');
      }
    } catch (error) {
      alert('Error changing password');
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(productSearchQuery.toLowerCase());
    const matchesCategory = productCategoryFilter === 'All' || product.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-pink/10 to-mint/20 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-pink/10 to-mint/20">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin <span className="text-coral">Dashboard</span>
              </h1>
              <p className="text-gray-600 mt-1">Salt N Sugar Management Panel</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-coral hover:text-coral/80 font-semibold transition-colors">
                View Website →
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'hero'
                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            🎉 Hero Photos
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            🎂 Products
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'reviews'
                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            ⭐ Reviews
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            📦 Orders
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'customers'
                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            👥 Customers
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            📱 Analytics
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Dashboard Overview Section */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Products Card */}
              <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FFB4C5] rounded-3xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">🎂</div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{products.length}</div>
                    <div className="text-sm opacity-90">Total</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Products</h3>
                <p className="text-sm opacity-90 mt-1">
                  Active: {products.filter(p => p.active).length} | 
                  Inactive: {products.filter(p => !p.active).length}
                </p>
              </div>

              {/* Hero Photos Card */}
              <div className="bg-gradient-to-br from-[#C0E6E4] to-[#A0D6D4] rounded-3xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">🎉</div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{heroPhotos.length}</div>
                    <div className="text-sm opacity-90">Total</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Hero Photos</h3>
                <p className="text-sm opacity-90 mt-1">
                  Active: {heroPhotos.filter(h => h.active).length} | 
                  Inactive: {heroPhotos.filter(h => !h.active).length}
                </p>
              </div>

              {/* Reviews Card */}
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">⭐</div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{reviews.length}</div>
                    <div className="text-sm opacity-90">Total</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Reviews</h3>
                <p className="text-sm opacity-90 mt-1">
                  Approved: {reviews.filter(r => r.approved).length} | 
                  Pending: {reviews.filter(r => !r.approved).length}
                </p>
              </div>

              {/* Average Rating Card */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">📊</div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {reviews.length > 0 
                        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                        : '0.0'}
                    </div>
                    <div className="text-sm opacity-90">Stars</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Avg. Rating</h3>
                <p className="text-sm opacity-90 mt-1">
                  From {reviews.filter(r => r.approved).length} approved reviews
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('hero')}
                  className="flex items-center gap-4 p-6 bg-gradient-to-br from-cream to-pink/20 rounded-2xl hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl">🎉</div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 group-hover:text-coral transition-colors">Add Hero Photo</h3>
                    <p className="text-sm text-gray-600">Upload celebration photos</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className="flex items-center gap-4 p-6 bg-gradient-to-br from-cream to-mint/20 rounded-2xl hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl">🎂</div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 group-hover:text-coral transition-colors">Add Product</h3>
                    <p className="text-sm text-gray-600">Create new cake listing</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center gap-4 p-6 bg-gradient-to-br from-cream to-yellow-100 rounded-2xl hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl">⭐</div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 group-hover:text-coral transition-colors">Manage Reviews</h3>
                    <p className="text-sm text-gray-600">
                      {reviews.filter(r => !r.approved).length} pending approval
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Reviews</h2>
              <div className="space-y-4">
                {reviews.slice(0, 5).map((review) => (
                  <div 
                    key={review._id}
                    className={`p-4 rounded-xl border-2 flex items-start gap-4 ${
                      review.approved 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-yellow-200 bg-yellow-50'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {review.profileImage ? (
                        <img
                          src={review.profileImage}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] flex items-center justify-center text-2xl">
                          {review.gender === 'male' ? '👨' : review.gender === 'female' ? '👩' : '🧑'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          review.approved 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {review.approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm line-clamp-2">{review.review}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {reviews.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-2">📭</div>
                    <p className="text-gray-500">No reviews yet</p>
                  </div>
                )}

                {reviews.length > 5 && (
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="w-full py-3 text-coral hover:text-coral/80 font-semibold transition-colors"
                  >
                    View All Reviews →
                  </button>
                )}
              </div>
            </div>

            {/* Website Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-coral/10 to-pink/10 rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📱 WhatsApp Orders</h3>
                <p className="text-gray-700 mb-3">
                  Your website is configured to send orders directly to WhatsApp for easy communication with customers.
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-semibold">Number:</span>
                  <span className="font-mono">+92 333 5981875</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-mint/30 to-mint/10 rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🌐 Website Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-gray-700">Website is live</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-gray-700">{products.filter(p => p.active).length} products available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-gray-700">{heroPhotos.filter(h => h.active).length} hero photos active</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📸 Image Storage</h3>
                <div className="space-y-3">
                  {(() => {
                    const productImages = products.reduce((acc, p) => {
                      const mainImageSize = (p.image?.length * 0.75) / 1024 || 0;
                      const gallerySize = (p.images || []).reduce((sum, img) => sum + (img.length * 0.75) / 1024, 0);
                      return acc + mainImageSize + gallerySize;
                    }, 0);
                    const heroImages = heroPhotos.reduce((acc, h) => acc + (h.imageUrl?.length * 0.75) / 1024 || 0, 0);
                    const totalImages = products.reduce((acc, p) => acc + 1 + (p.images?.length || 0), 0) + heroPhotos.length;
                    const totalStorageKB = productImages + heroImages;
                    const totalStorageMB = totalStorageKB / 1024;

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Total Images:</span>
                          <span className="font-bold text-gray-900">{totalImages}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Storage Used:</span>
                          <span className={`font-bold ${
                            totalStorageMB > 10 ? 'text-red-600' : 
                            totalStorageMB > 5 ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}>
                            {totalStorageMB < 1 
                              ? `${totalStorageKB.toFixed(0)}KB` 
                              : `${totalStorageMB.toFixed(2)}MB`}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-300">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Products:</span>
                            <span className="text-gray-900">{(productImages / 1024).toFixed(2)}MB</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Hero Photos:</span>
                            <span className="text-gray-900">{(heroImages / 1024).toFixed(2)}MB</span>
                          </div>
                        </div>
                        {totalStorageMB > 5 && (
                          <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded text-xs">
                            ⚠️ High storage usage. Consider compressing images.
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Photos Section */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            {/* Add Hero Photo Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Hero Photo</h2>
              <form onSubmit={handleAddHeroPhoto} className="space-y-4">
                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-lg">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Check file size
                        const fileSizeKB = file.size / 1024;
                        const fileSizeMB = fileSizeKB / 1024;
                        
                        if (fileSizeKB > 1000) {
                          alert(`⚠️ Image size is ${fileSizeMB.toFixed(2)}MB - Too large!\n\nHero images should be under 500KB for fast loading.\nPlease compress the image first.`);
                          e.target.value = '';
                          return;
                        } else if (fileSizeKB > 500) {
                          const proceed = confirm(`⚠️ Image size: ${fileSizeKB.toFixed(0)}KB\n\nRecommended: Under 300KB for hero images\nDo you want to proceed?`);
                          if (!proceed) {
                            e.target.value = '';
                            return;
                          }
                        }
                        
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewHeroPhoto({ ...newHeroPhoto, imageUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FF6B6B] file:text-white hover:file:bg-[#FF8C8C] cursor-pointer"
                  />
                  
                  {/* Image Size Guidelines */}
                  <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded text-sm text-blue-800">
                    💡 Hero images appear on homepage - keep under 300KB for fast loading
                  </div>
                  
                  {newHeroPhoto.imageUrl && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-cream to-pink/10 rounded-2xl border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-900 font-bold">Preview</p>
                        <p className="text-sm text-gray-600">
                          Size: ~{((newHeroPhoto.imageUrl.length * 0.75) / 1024).toFixed(0)}KB
                        </p>
                      </div>
                      <img src={newHeroPhoto.imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl shadow-lg" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-lg">Title</label>
                  <input
                    type="text"
                    value={newHeroPhoto.title}
                    onChange={(e) => setNewHeroPhoto({ ...newHeroPhoto, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                    placeholder="Happy Children Celebrating"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-lg">Display Order</label>
                  <input
                    type="number"
                    value={newHeroPhoto.order}
                    onChange={(e) => setNewHeroPhoto({ ...newHeroPhoto, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                    placeholder="0"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white font-bold py-4 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Add Hero Photo
                </button>
              </form>
            </div>

            {/* Existing Hero Photos */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Hero Photos</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroPhotos.map((photo) => (
                  <div key={photo._id} className="border-2 border-gray-200 rounded-xl p-4 relative">
                    {/* Active/Inactive Badge */}
                    <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold ${
                      photo.active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                    }`}>
                      {photo.active ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className={`w-full h-40 object-cover rounded-lg mb-3 ${!photo.active ? 'opacity-50' : ''}`}
                    />
                    <h3 className="font-bold text-gray-900 mb-2">{photo.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">Order: {photo.order}</p>
                    
                    {/* Toggle Switch */}
                    <div className="flex items-center justify-between mb-3 bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">Visibility</span>
                      <button
                        onClick={() => toggleHeroPhotoActive(photo._id, photo.active)}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          photo.active ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            photo.active ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteHeroPhoto(photo._id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Section */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Add/Edit Product Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900 font-bold mb-3 text-lg">Product ID</label>
                    <input
                      type="text"
                      value={editingProduct ? editingProduct.id : newProduct.id}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({ ...editingProduct, id: e.target.value })
                        : setNewProduct({ ...newProduct, id: e.target.value })}
                      required
                      disabled={!!editingProduct}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none disabled:bg-gray-100 text-gray-900 font-medium"
                      placeholder="chocolate-cake"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-900 font-bold mb-3 text-lg">Product Name</label>
                    <input
                      type="text"
                      value={editingProduct ? editingProduct.name : newProduct.name}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({ ...editingProduct, name: e.target.value })
                        : setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                      placeholder="Chocolate Fantasy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-lg">Description</label>
                  <textarea
                    value={editingProduct ? editingProduct.description : newProduct.description}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({ ...editingProduct, description: e.target.value })
                      : setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                    placeholder="Product description..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900 font-bold mb-3 text-lg">Category</label>
                    <select
                      value={editingProduct ? editingProduct.category : newProduct.category}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({ ...editingProduct, category: e.target.value })
                        : setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                    >
                      <option>Birthday Cakes</option>
                      <option>Wedding Cakes</option>
                      <option>Custom Cakes</option>
                      <option>Cupcakes</option>
                      <option>Desserts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-900 font-bold mb-3 text-lg">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={editingProduct ? editingProduct.rating : newProduct.rating}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({ ...editingProduct, rating: parseFloat(e.target.value) })
                        : setNewProduct({ ...newProduct, rating: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-lg">Main Product Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Check file size (warn if > 500KB, recommend < 200KB)
                        const fileSizeKB = file.size / 1024;
                        const fileSizeMB = fileSizeKB / 1024;
                        
                        if (fileSizeKB > 1000) {
                          alert(`⚠️ Image size is ${fileSizeMB.toFixed(2)}MB!\n\nLarge images increase database size and slow down your website.\n\nRecommendation:\n• Ideal: Under 200KB\n• Maximum: 500KB\n• Your image: ${fileSizeKB.toFixed(0)}KB\n\nPlease compress the image before uploading.`);
                          e.target.value = '';
                          return;
                        } else if (fileSizeKB > 500) {
                          const proceed = confirm(`⚠️ Image size: ${fileSizeKB.toFixed(0)}KB\n\nThis image is larger than recommended (200KB).\nIt may slow down your website.\n\nDo you want to proceed anyway?`);
                          if (!proceed) {
                            e.target.value = '';
                            return;
                          }
                        }
                        
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64String = reader.result as string;
                          const base64SizeKB = (base64String.length * 0.75) / 1024;
                          
                          if (editingProduct) {
                            setEditingProduct({ ...editingProduct, image: base64String });
                          } else {
                            setNewProduct({ ...newProduct, image: base64String });
                          }
                          
                          // Show success message with size info
                          if (base64SizeKB < 200) {
                            console.log(`✅ Image uploaded successfully (${base64SizeKB.toFixed(0)}KB - Optimal size)`);
                          } else {
                            console.log(`⚠️ Image uploaded (${base64SizeKB.toFixed(0)}KB - Consider compressing)`);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FF6B6B] file:text-white hover:file:bg-[#FF8C8C] cursor-pointer"
                  />
                  
                  {/* Image Size Guidelines */}
                  <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>💡 Image Size Guidelines:</strong><br />
                      ✅ Ideal: Under 200KB | ⚠️ Max: 500KB | ❌ Avoid: Over 1MB<br />
                      Tip: Use <a href="https://tinypng.com" target="_blank" rel="noopener" className="underline font-semibold">TinyPNG</a> or <a href="https://squoosh.app" target="_blank" rel="noopener" className="underline font-semibold">Squoosh</a> to compress images
                    </p>
                  </div>

                  {(editingProduct ? editingProduct.image : newProduct.image) && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-cream to-pink/10 rounded-2xl border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-gray-900 font-bold text-lg">Main Image Preview</p>
                          <p className="text-sm text-gray-600">
                            Size: ~{(((editingProduct ? editingProduct.image : newProduct.image).length * 0.75) / 1024).toFixed(0)}KB
                          </p>
                        </div>
                        {(editingProduct || newProduct.image) && (
                          <label className="px-4 py-2 bg-[#FFB4C5] hover:bg-[#FFC4D5] text-white font-semibold rounded-lg cursor-pointer transition-all">
                            🔄 Replace Image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fileSizeKB = file.size / 1024;
                                  if (fileSizeKB > 1000) {
                                    alert(`⚠️ Image too large: ${(fileSizeKB / 1024).toFixed(2)}MB\nPlease use an image under 1MB.`);
                                    e.target.value = '';
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (editingProduct) {
                                      setEditingProduct({ ...editingProduct, image: reader.result as string });
                                    } else {
                                      setNewProduct({ ...newProduct, image: reader.result as string });
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                      <img 
                        src={editingProduct ? editingProduct.image : newProduct.image} 
                        alt="Preview" 
                        className="w-full h-64 object-cover rounded-xl shadow-lg" 
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-lg">Gallery Images (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Check file size
                        const fileSizeKB = file.size / 1024;
                        const fileSizeMB = fileSizeKB / 1024;
                        
                        if (fileSizeKB > 1000) {
                          alert(`⚠️ Image size is ${fileSizeMB.toFixed(2)}MB - Too large!\n\nPlease compress the image to under 500KB.`);
                          e.target.value = '';
                          return;
                        } else if (fileSizeKB > 500) {
                          const proceed = confirm(`⚠️ Image size: ${fileSizeKB.toFixed(0)}KB\n\nRecommended: Under 200KB\nDo you want to proceed?`);
                          if (!proceed) {
                            e.target.value = '';
                            return;
                          }
                        }
                        
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          addGalleryImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                      e.target.value = '';
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FFB4C5] file:text-white hover:file:bg-[#FFC4D5] cursor-pointer"
                  />
                  {((editingProduct?.images && editingProduct.images.length > 0) || newProduct.images.length > 0) && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-mint/20 to-cream rounded-2xl border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-gray-900 font-bold text-lg">Image Gallery</p>
                          <p className="text-sm text-gray-600">
                            {(editingProduct?.images || newProduct.images).length} image(s) • 
                            Total: ~{((editingProduct?.images || newProduct.images).reduce((acc, img) => acc + (img.length * 0.75) / 1024, 0)).toFixed(0)}KB
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(editingProduct?.images || newProduct.images).map((img, idx) => (
                          <div key={idx} className="relative group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                            <img 
                              src={img} 
                              alt={`Gallery ${idx + 1}`} 
                              className="w-full h-40 object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2">
                              {/* Replace Button */}
                              <label className="opacity-0 group-hover:opacity-100 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-all">
                                🔄
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const fileSizeKB = file.size / 1024;
                                      if (fileSizeKB > 1000) {
                                        alert('Image too large! Please use under 1MB.');
                                        e.target.value = '';
                                        return;
                                      }
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        const updatedImages = editingProduct 
                                          ? [...(editingProduct.images || [])]
                                          : [...newProduct.images];
                                        updatedImages[idx] = reader.result as string;
                                        if (editingProduct) {
                                          setEditingProduct({ ...editingProduct, images: updatedImages });
                                        } else {
                                          setNewProduct({ ...newProduct, images: updatedImages });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                    e.target.value = '';
                                  }}
                                />
                              </label>
                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                              <p className="text-white text-xs text-center font-semibold">
                                #{idx + 1} • {((img.length * 0.75) / 1024).toFixed(0)}KB
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Gallery Info */}
                      {(editingProduct?.images || newProduct.images).length >= 4 && (
                        <div className="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                          <p className="text-sm text-yellow-800">
                            💡 <strong>Tip:</strong> You have {(editingProduct?.images || newProduct.images).length} gallery images. 
                            Consider keeping only the best 3-5 images to reduce database size.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900 font-bold mb-3 text-lg">Stock Status</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct ? (editingProduct.inStock ?? true) : newProduct.inStock}
                          onChange={(e) => editingProduct
                            ? setEditingProduct({ ...editingProduct, inStock: e.target.checked })
                            : setNewProduct({ ...newProduct, inStock: e.target.checked })}
                          className="w-5 h-5 text-[#FF6B6B] rounded focus:ring-[#FF6B6B]"
                        />
                        <span className="ml-2 text-gray-900 font-medium">In Stock</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-900 font-bold mb-3 text-lg">Stock Quantity (Optional)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct ? (editingProduct.stockQuantity ?? 0) : newProduct.stockQuantity}
                      onChange={(e) => editingProduct
                        ? setEditingProduct({ ...editingProduct, stockQuantity: parseInt(e.target.value) || 0 })
                        : setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                      placeholder="Leave 0 for unlimited"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-lg">Ingredients (comma-separated)</label>
                  <input
                    type="text"
                    value={editingProduct 
                      ? editingProduct.ingredients.join(', ') 
                      : newProduct.ingredients}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({ ...editingProduct, ingredients: e.target.value.split(',').map(i => i.trim()) })
                      : setNewProduct({ ...newProduct, ingredients: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                    placeholder="Chocolate, Cream, Vanilla, etc."
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-4 text-lg">Sizes & Prices (in Rs.)</label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {(editingProduct ? editingProduct.sizes : newProduct.sizes).map((size, index) => (
                      <div key={index} className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
                        <label className="block text-base font-bold text-gray-900 mb-3">{size.size}</label>
                        <input
                          type="number"
                          value={size.price}
                          onChange={(e) => {
                            const updatedSizes = [...(editingProduct ? editingProduct.sizes : newProduct.sizes)];
                            updatedSizes[index].price = parseFloat(e.target.value);
                            if (editingProduct) {
                              setEditingProduct({ ...editingProduct, sizes: updatedSizes });
                            } else {
                              setNewProduct({ ...newProduct, sizes: updatedSizes });
                            }
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                          placeholder="Price in Rs."
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white font-bold py-4 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-8 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-4 rounded-full transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Search Products</label>
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="Search by name or description..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Filter by Category</label>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900"
                  >
                    <option value="All">All Categories</option>
                    <option value="Birthday Cakes">Birthday Cakes</option>
                    <option value="Wedding Cakes">Wedding Cakes</option>
                    <option value="Custom Cakes">Custom Cakes</option>
                    <option value="Cupcakes">Cupcakes</option>
                    <option value="Cookies">Cookies</option>
                    <option value="Brownies">Brownies</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 font-bold">
                    {selectedProducts.length} product(s) selected
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedProducts([])}
                      className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                    >
                      Clear Selection
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
                    >
                      🗑️ Delete Selected
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Products */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Current Products ({filteredProducts.length})
                </h2>
                {filteredProducts.length > 0 && (
                  <button
                    onClick={toggleSelectAll}
                    className="px-4 py-2 text-sm font-semibold text-[#FF6B6B] hover:text-[#FF8C8C] transition-colors"
                  >
                    {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#FF6B6B] transition-colors">
                    <div className="flex gap-6">
                      {/* Selection Checkbox */}
                      <div className="flex items-start pt-2">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleProductSelection(product._id)}
                          className="w-5 h-5 text-[#FF6B6B] rounded focus:ring-[#FF6B6B] cursor-pointer"
                        />
                      </div>

                      {/* Product Image with Gallery Indicator */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        {product.images && product.images.length > 0 && (
                          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            +{product.images.length} 📷
                          </span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                          <div className="flex gap-2">
                            {product.inStock === false ? (
                              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                                OUT OF STOCK
                              </span>
                            ) : product.stockQuantity && product.stockQuantity > 0 ? (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                                Stock: {product.stockQuantity}
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                                IN STOCK
                              </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              product.active 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {product.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        
                        <div className="flex gap-4 text-sm text-gray-600 mb-3">
                          <span>📁 {product.category}</span>
                          <span>⭐ {product.rating}</span>
                          <span>🆔 {product.id}</span>
                        </div>
                        
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {product.sizes.map((size, idx) => (
                            <span key={idx} className="px-3 py-1 bg-mint/30 rounded-full text-sm font-semibold">
                              {size.size}: Rs.{size.price.toLocaleString()}
                            </span>
                          ))}
                        </div>

                        {product.images && product.images.length > 0 && (
                          <div className="flex gap-2 mb-3">
                            {product.images.slice(0, 3).map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`Gallery ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                              />
                            ))}
                            {product.images.length > 3 && (
                              <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg text-gray-600 text-sm font-bold">
                                +{product.images.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Toggle Switch */}
                        <div className="flex items-center justify-between mb-3 bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm font-semibold text-gray-700">Product Status</span>
                          <button
                            onClick={() => toggleProductActive(product._id, product.active)}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                              product.active ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                product.active ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                          >
                            ⚡ Quick Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 text-lg">
                      {productSearchQuery || productCategoryFilter !== 'All' 
                        ? 'No products match your filters' 
                        : 'No products yet'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Filter Buttons */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    filterStatus === 'all'
                      ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Reviews ({reviews.length})
                </button>
                <button
                  onClick={() => setFilterStatus('approved')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    filterStatus === 'approved'
                      ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Approved ({reviews.filter(r => r.approved).length})
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    filterStatus === 'pending'
                      ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Pending ({reviews.filter(r => !r.approved).length})
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {reviews
                  .filter(review => {
                    if (filterStatus === 'all') return true;
                    if (filterStatus === 'approved') return review.approved;
                    if (filterStatus === 'pending') return !review.approved;
                    return true;
                  })
                  .map((review) => (
                    <div 
                      key={review._id} 
                      className={`border-2 rounded-xl p-6 ${
                        review.approved 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-yellow-200 bg-yellow-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {review.profileImage ? (
                            <img
                              src={review.profileImage}
                              alt={review.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] flex items-center justify-center text-3xl">
                              {review.gender === 'male' ? '👨' : review.gender === 'female' ? '👩' : '🧑'}
                            </div>
                          )}
                        </div>

                        {/* Review Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{review.name}</h3>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              review.approved 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-yellow-200 text-yellow-800'
                            }`}>
                              {review.approved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{review.review}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span>📧 {review.email}</span>
                            <span>📅 {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            {!review.approved && (
                              <button
                                onClick={() => handleApproveReview(review._id, true)}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
                              >
                                ✓ Approve
                              </button>
                            )}
                            {review.approved && (
                              <button
                                onClick={() => handleApproveReview(review._id, false)}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {reviews.filter(review => {
                  if (filterStatus === 'all') return true;
                  if (filterStatus === 'approved') return review.approved;
                  if (filterStatus === 'pending') return !review.approved;
                  return true;
                }).length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-500 text-lg">No reviews to display</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            {/* Filter Buttons */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => { setOrderFilter('all'); fetchOrders('all'); }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    orderFilter === 'all'
                      ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Orders ({orders.length})
                </button>
                <button
                  onClick={() => { setOrderFilter('today'); fetchOrders('today'); }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    orderFilter === 'today'
                      ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Today&apos;s Orders
                </button>
                <button
                  onClick={() => { setOrderFilter('pending'); fetchOrders('pending'); }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    orderFilter === 'pending'
                      ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Pending ({orders.filter(o => o.status === 'Pending').length})
                </button>
                <button
                  onClick={() => { setOrderFilter('preparing'); fetchOrders('preparing'); }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    orderFilter === 'preparing'
                      ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Preparing ({orders.filter(o => o.status === 'Preparing').length})
                </button>
                <button
                  onClick={() => { setOrderFilter('delivery'); fetchOrders('delivery'); }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    orderFilter === 'delivery'
                      ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Out for Delivery ({orders.filter(o => o.status === 'Out for Delivery').length})
                </button>
                <button
                  onClick={() => { setOrderFilter('completed'); fetchOrders('completed'); }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    orderFilter === 'completed'
                      ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Completed ({orders.filter(o => o.status === 'Completed').length})
                </button>
              </div>
            </div>

            {/* Add Order Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Add New Order (from WhatsApp)</h2>
              <form onSubmit={handleAddOrder} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-900 font-bold mb-3 text-lg">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={newOrder.customerName}
                      onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                      placeholder="Customer full name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-900 font-bold mb-3 text-lg">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={newOrder.customerPhone}
                      onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                      placeholder="+92 XXX XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-900 font-bold mb-3 text-lg">Email (Optional)</label>
                    <input
                      type="email"
                      value={newOrder.customerEmail}
                      onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                      placeholder="customer@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-900 font-bold mb-3 text-lg">Payment Method</label>
                    <select
                      value={newOrder.paymentMethod}
                      onChange={(e) => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-lg">Delivery Address *</label>
                  <textarea
                    required
                    value={newOrder.deliveryAddress}
                    onChange={(e) => setNewOrder({ ...newOrder, deliveryAddress: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                    rows={2}
                    placeholder="Full delivery address"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-lg">Delivery Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newOrder.deliveryDate}
                    onChange={(e) => setNewOrder({ ...newOrder, deliveryDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                  />
                </div>

                {/* Order Items */}
                <div>
                  <label className="block text-gray-900 font-bold mb-4 text-lg">Order Items *</label>
                  <div className="space-y-4">
                    {newOrder.items.map((item, index) => (
                      <div key={index} className="grid md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            required
                            value={item.productName}
                            onChange={(e) => updateOrderItem(index, 'productName', e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF6B6B] focus:outline-none text-gray-900"
                            placeholder="Product name"
                          />
                        </div>
                        <div>
                          <select
                            value={item.size}
                            onChange={(e) => updateOrderItem(index, 'size', e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF6B6B] focus:outline-none text-gray-900"
                          >
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                          </select>
                        </div>
                        <div>
                          <input
                            type="number"
                            required
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF6B6B] focus:outline-none text-gray-900"
                            placeholder="Qty"
                          />
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            required
                            min="0"
                            value={item.price}
                            onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value))}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF6B6B] focus:outline-none text-gray-900"
                            placeholder="Rs."
                          />
                          {newOrder.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOrderItem(index)}
                              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addOrderItem}
                      className="w-full py-3 border-2 border-dashed border-gray-400 rounded-xl text-gray-600 hover:border-[#FF6B6B] hover:text-[#FF6B6B] font-semibold transition-all"
                    >
                      + Add Another Item
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-lg">Notes (Optional)</label>
                  <textarea
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:outline-none text-gray-900 font-medium"
                    rows={2}
                    placeholder="Special instructions or notes"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-mint/30 to-pink/30 rounded-xl">
                  <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                  <span className="text-3xl font-bold text-coral">Rs. {newOrder.totalAmount.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white font-bold py-4 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  📦 Add Order
                </button>
              </form>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders List</h2>
              <div className="space-y-6">
                {orders.map((order) => {
                  const statusColors = {
                    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    'Preparing': 'bg-blue-100 text-blue-800 border-blue-300',
                    'Out for Delivery': 'bg-purple-100 text-purple-800 border-purple-300',
                    'Completed': 'bg-green-100 text-green-800 border-green-300',
                    'Cancelled': 'bg-red-100 text-red-800 border-red-300'
                  };

                  return (
                    <div key={order._id} className="border-2 border-gray-200 rounded-2xl p-6">
                      {/* Order Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{order.orderNumber}</h3>
                          <p className="text-gray-600">
                            {new Date(order.orderDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full font-semibold border-2 ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm text-gray-500">Customer</p>
                          <p className="font-bold text-gray-900">{order.customerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-bold text-gray-900">{order.customerPhone}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Delivery Address</p>
                          <p className="font-semibold text-gray-900">{order.deliveryAddress}</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-cream/50 rounded-lg">
                              <span className="font-medium text-gray-900">
                                {item.productName} ({item.size}) × {item.quantity}
                              </span>
                              <span className="font-bold text-coral">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total & Payment */}
                      <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-coral/10 to-pink/10 rounded-xl">
                        <div>
                          <p className="text-sm text-gray-600">Payment Method</p>
                          <p className="font-bold text-gray-900">{order.paymentMethod}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-2xl font-bold text-coral">Rs. {order.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Status Update & Actions */}
                      <div className="flex gap-3 flex-wrap">
                        {order.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'Preparing')}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all"
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === 'Preparing' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'Out for Delivery')}
                            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-all"
                          >
                            Out for Delivery
                          </button>
                        )}
                        {order.status === 'Out for Delivery' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'Completed')}
                            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all"
                          >
                            Mark Completed
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
                        >
                          🗑️ Delete
                        </button>
                      </div>

                      {order.notes && (
                        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                          <p className="text-sm text-gray-600">Notes:</p>
                          <p className="font-medium text-gray-900">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-500 text-lg">No orders to display</p>
                    <p className="text-gray-400 text-sm mt-2">Add orders manually when you receive them via WhatsApp</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Customers Section */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] bg-clip-text text-transparent">
                👥 Customer Database
              </h2>
              <button
                onClick={exportCustomersToCSV}
                className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-shadow"
              >
                📥 Export to CSV
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 Search by name or email..."
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FFB4C5] outline-none transition-all"
              />
            </div>

            {/* Customer Count */}
            <div className="mb-6">
              <p className="text-gray-600 font-semibold text-lg">
                Total Customers: <span className="text-[#FF6B6B]">{filteredCustomers.length}</span>
              </p>
            </div>

            {/* Customers List */}
            <div className="space-y-4">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer._id}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-[#FFF8F0] to-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{customer.name}</h3>
                            <p className="text-gray-600">{customer.email}</p>
                          </div>
                        </div>
                        <div className="ml-16">
                          <p className="text-gray-500 text-sm">
                            📅 Joined: {new Date(customer.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCustomer(customer._id)}
                        className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">
                    {customerSearchQuery ? 'No customers found matching your search' : 'No customers registered yet'}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {customerSearchQuery ? 'Try a different search term' : 'Customers who register will appear here'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WhatsApp Analytics Section */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] bg-clip-text text-transparent">
                  📱 WhatsApp Analytics
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => changeAnalyticsRange('today')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      analyticsRange === 'today'
                        ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => changeAnalyticsRange('week')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      analyticsRange === 'week'
                        ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => changeAnalyticsRange('month')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      analyticsRange === 'month'
                        ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    This Month
                  </button>
                  <button
                    onClick={() => changeAnalyticsRange('all')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      analyticsRange === 'all'
                        ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Time
                  </button>
                </div>
              </div>

              {analytics ? (
                <>
                  {/* Revenue Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FFB4C5] rounded-2xl p-6 text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">💰</span>
                        <h3 className="text-lg font-semibold">Total Revenue</h3>
                      </div>
                      <p className="text-4xl font-bold">Rs. {analytics.totalRevenue.toLocaleString()}</p>
                      <p className="text-sm opacity-90 mt-1">{analytics.totalOrders} orders</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#C0E6E4] to-[#FFB4C5] rounded-2xl p-6 text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">📊</span>
                        <h3 className="text-lg font-semibold">Avg Order Value</h3>
                      </div>
                      <p className="text-4xl font-bold">Rs. {Math.round(analytics.averageOrderValue).toLocaleString()}</p>
                      <p className="text-sm opacity-90 mt-1">Per order average</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#FFB4C5] to-[#FF6B6B] rounded-2xl p-6 text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">📦</span>
                        <h3 className="text-lg font-semibold">Total Orders</h3>
                      </div>
                      <p className="text-4xl font-bold">{analytics.totalOrders}</p>
                      <p className="text-sm opacity-90 mt-1">WhatsApp orders</p>
                    </div>
                  </div>

                  {/* Orders by Status */}
                  <div className="bg-gradient-to-br from-[#FFF8F0] to-white rounded-2xl p-6 mb-8 border-2 border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>📋</span> Orders by Status
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-4 bg-yellow-100 rounded-xl">
                        <p className="text-3xl font-bold text-yellow-600">{analytics.ordersByStatus.pending}</p>
                        <p className="text-sm text-gray-600 mt-1">Pending</p>
                      </div>
                      <div className="text-center p-4 bg-blue-100 rounded-xl">
                        <p className="text-3xl font-bold text-blue-600">{analytics.ordersByStatus.preparing}</p>
                        <p className="text-sm text-gray-600 mt-1">Preparing</p>
                      </div>
                      <div className="text-center p-4 bg-purple-100 rounded-xl">
                        <p className="text-3xl font-bold text-purple-600">{analytics.ordersByStatus.delivery}</p>
                        <p className="text-sm text-gray-600 mt-1">Out for Delivery</p>
                      </div>
                      <div className="text-center p-4 bg-green-100 rounded-xl">
                        <p className="text-3xl font-bold text-green-600">{analytics.ordersByStatus.completed}</p>
                        <p className="text-sm text-gray-600 mt-1">Completed</p>
                      </div>
                      <div className="text-center p-4 bg-red-100 rounded-xl">
                        <p className="text-3xl font-bold text-red-600">{analytics.ordersByStatus.cancelled}</p>
                        <p className="text-sm text-gray-600 mt-1">Cancelled</p>
                      </div>
                    </div>
                  </div>

                  {/* Daily Revenue Trend (Last 7 Days) */}
                  <div className="bg-gradient-to-br from-[#FFF8F0] to-white rounded-2xl p-6 mb-8 border-2 border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <span>📈</span> Revenue Trend (Last 7 Days)
                    </h3>
                    <div className="space-y-3">
                      {analytics.dailyRevenue.map((day, index) => {
                        const maxRevenue = Math.max(...analytics.dailyRevenue.map(d => d.revenue));
                        const percentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                        return (
                          <div key={index} className="flex items-center gap-4">
                            <p className="text-sm font-semibold text-gray-600 w-20">{day.date}</p>
                            <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] h-full rounded-full transition-all duration-500 flex items-center justify-end pr-4"
                                style={{ width: `${percentage}%` }}
                              >
                                {day.revenue > 0 && (
                                  <span className="text-white font-bold text-sm">
                                    Rs. {day.revenue.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Most Popular Products */}
                  <div className="bg-gradient-to-br from-[#FFF8F0] to-white rounded-2xl p-6 mb-8 border-2 border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <span>🏆</span> Most Ordered Products (Top 10)
                    </h3>
                    {analytics.popularProducts.length > 0 ? (
                      <div className="space-y-4">
                        {analytics.popularProducts.map((product, index) => (
                          <div
                            key={index}
                            className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow bg-white"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] rounded-full flex items-center justify-center text-white font-bold text-xl">
                                  #{index + 1}
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-gray-800">{product.name}</h4>
                                  <p className="text-sm text-gray-500">Ordered in {product.orders} order{product.orders !== 1 ? 's' : ''}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-[#FF6B6B]">Rs. {product.revenue.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Total Revenue</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">📦 Units Sold:</span>
                                <span className="font-bold text-gray-800">{product.quantity}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">💵 Avg Price:</span>
                                <span className="font-bold text-gray-800">Rs. {Math.round(product.revenue / product.quantity).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No product data available</p>
                        <p className="text-gray-400 text-sm mt-2">Orders with products will appear here</p>
                      </div>
                    )}
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-gradient-to-br from-[#FFF8F0] to-white rounded-2xl p-6 border-2 border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <span>💳</span> Payment Methods
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(analytics.paymentMethodStats).map(([method, stats]) => (
                        <div key={method} className="bg-white border-2 border-gray-200 rounded-xl p-5">
                          <h4 className="font-bold text-lg text-gray-800 mb-2">{method}</h4>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              Orders: <span className="font-bold text-gray-800">{stats.count}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Revenue: <span className="font-bold text-[#FF6B6B]">Rs. {stats.revenue.toLocaleString()}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Avg: <span className="font-bold text-gray-800">Rs. {Math.round(stats.revenue / stats.count).toLocaleString()}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">Loading analytics...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Section */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] bg-clip-text text-transparent mb-8">
              ⚙️ Admin Settings
            </h2>

            {/* Change Password Card */}
            <div className="bg-gradient-to-br from-[#FFF8F0] to-white rounded-2xl p-8 border-2 border-gray-200 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">🔐</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Change Password</h3>
                  <p className="text-gray-600">Update your admin account password</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-gray-800 font-bold mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FFB4C5] outline-none transition-all"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-bold mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FFB4C5] outline-none transition-all"
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-bold mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FFB4C5] outline-none transition-all"
                    placeholder="Confirm new password"
                  />
                </div>

                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4">
                    <p className="text-red-700 font-semibold">⚠️ Passwords do not match</p>
                  </div>
                )}

                {newPassword && newPassword.length < 6 && (
                  <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4">
                    <p className="text-yellow-700 font-semibold">⚠️ Password must be at least 6 characters</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all text-lg"
                >
                  🔒 Change Password
                </button>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> After changing your password, you will be logged out and need to login again with your new password.
                  </p>
                </div>
              </form>
            </div>

            {/* Additional Settings Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-br from-[#C0E6E4] to-white rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-bold text-gray-800 mb-3">🛡️ Security Tips</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Use a strong, unique password</li>
                  <li>• Include numbers and special characters</li>
                  <li>• Change password regularly</li>
                  <li>• Never share your password</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#FFB4C5] to-white rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-bold text-gray-800 mb-3">ℹ️ Account Info</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Username: <strong>admin</strong></li>
                  <li>• Role: Administrator</li>
                  <li>• Full access to all features</li>
                  <li>• Manage products, orders & more</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
