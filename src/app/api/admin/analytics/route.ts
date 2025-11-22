import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Helper to verify admin token
function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - Fetch analytics data
export async function GET(request: NextRequest) {
  try {
    const adminUser = verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get date range from query params
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'all'; // all, today, week, month

    // Calculate date filter
    let dateFilter = {};
    const now = new Date();
    
    if (range === 'today') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateFilter = { createdAt: { $gte: startOfDay } };
    } else if (range === 'week') {
      const startOfWeek = new Date(now.setDate(now.getDate() - 7));
      dateFilter = { createdAt: { $gte: startOfWeek } };
    } else if (range === 'month') {
      const startOfMonth = new Date(now.setDate(now.getDate() - 30));
      dateFilter = { createdAt: { $gte: startOfMonth } };
    }

    // Fetch orders with date filter
    const orders = await Order.find(dateFilter).sort({ createdAt: -1 });

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate average order value
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Calculate product popularity
    const productStats: { [key: string]: { name: string; quantity: number; revenue: number; orders: number } } = {};
    
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        const key = item.productName;
        if (!productStats[key]) {
          productStats[key] = {
            name: item.productName,
            quantity: 0,
            revenue: 0,
            orders: 0
          };
        }
        productStats[key].quantity += item.quantity;
        productStats[key].revenue += item.price * item.quantity;
        productStats[key].orders += 1;
      });
    });

    // Convert to array and sort by quantity
    const popularProducts = Object.values(productStats)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10); // Top 10 products

    // Calculate revenue by payment method
    const paymentMethodStats: { [key: string]: { count: number; revenue: number } } = {};
    orders.forEach(order => {
      const method = order.paymentMethod || 'Cash on Delivery';
      if (!paymentMethodStats[method]) {
        paymentMethodStats[method] = { count: 0, revenue: 0 };
      }
      paymentMethodStats[method].count += 1;
      paymentMethodStats[method].revenue += order.totalAmount;
    });

    // Calculate orders by status
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'Pending').length,
      preparing: orders.filter(o => o.status === 'Preparing').length,
      delivery: orders.filter(o => o.status === 'Out for Delivery').length,
      completed: orders.filter(o => o.status === 'Completed').length,
      cancelled: orders.filter(o => o.status === 'Cancelled').length,
    };

    // Calculate daily revenue for the last 7 days (for trend)
    const dailyRevenue: { date: string; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfDay && orderDate <= endOfDay;
      });
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      dailyRevenue.push({
        date: startOfDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayRevenue
      });
    }

    return NextResponse.json({
      success: true,
      analytics: {
        totalOrders: orders.length,
        totalRevenue,
        averageOrderValue,
        popularProducts,
        paymentMethodStats,
        ordersByStatus,
        dailyRevenue,
        range
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { message: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
