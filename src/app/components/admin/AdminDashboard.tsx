import { motion } from 'motion/react';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Bell,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  totalProducts: number;
  productsChange: number;
  featuredProducts: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalCustomers: 0,
    customersChange: 0,
    totalProducts: 0,
    productsChange: 0,
    featuredProducts: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    // Cargar estadísticas desde localStorage
    const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Calcular revenue total
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);

    setStats({
      totalRevenue,
      revenueChange: 12.5,
      totalOrders: orders.length,
      ordersChange: 8.3,
      totalCustomers: users.length + 2, // +2 por los usuarios demo
      customersChange: 5.7,
      totalProducts: products.length || 140,
      productsChange: 2.1,
      featuredProducts: 10, // Ejemplo de productos destacados
    });

    // Cargar órdenes recientes
    setRecentOrders(orders.slice(0, 5));
  }, []);

  const statCards = [
    {
      title: 'Ingresos Totales',
      value: `$${stats.totalRevenue.toLocaleString('es-CO')}`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'from-green-400 to-green-600',
    },
    {
      title: 'Órdenes',
      value: stats.totalOrders.toString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Clientes',
      value: stats.totalCustomers.toString(),
      change: stats.customersChange,
      icon: Users,
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Productos Destacados',
      value: stats.featuredProducts,
      change: stats.productsChange,
      icon: Package,
      color: 'from-[#3B82F6] to-[#2563EB]',
    },
  ];

  const getStatusColor = (status: RecentOrder['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: RecentOrder['status']) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'processing':
        return 'En proceso';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span>{Math.abs(stat.change)}%</span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif text-gray-800">Órdenes Recientes</h3>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${order.amount.toLocaleString('es-CO')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString('es-CO')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay órdenes recientes</p>
              <p className="text-sm text-gray-400 mt-1">Las nuevas órdenes aparecerán aquí</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white">
          <TrendingUp className="w-8 h-8 mb-4" />
          <h4 className="font-serif text-lg mb-2">Ventas del Mes</h4>
          <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString('es-CO')}</p>
          <p className="text-sm opacity-90 mt-2">+{stats.revenueChange}% vs mes anterior</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <Package className="w-8 h-8 text-[#3B82F6] mb-4" />
          <h4 className="font-serif text-lg mb-2 text-gray-800">Productos Activos</h4>
          <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          <p className="text-sm text-gray-500 mt-2">En inventario</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <Users className="w-8 h-8 text-[#3B82F6] mb-4" />
          <h4 className="font-serif text-lg mb-2 text-gray-800">Clientes Totales</h4>
          <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
          <p className="text-sm text-gray-500 mt-2">Usuarios registrados</p>
        </div>
      </motion.div>
    </div>
  );
}