import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  ShoppingCart,
  Package,
  User,
  Trash2,
  Check,
  AlertCircle,
  Info,
  CheckCircle,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'order' | 'order_update' | 'user' | 'product' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadNotifications();
    
    // Simular notificaciones en tiempo real
    const interval = setInterval(() => {
      checkForNewOrders();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    const savedNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    
    // Si no hay notificaciones, crear algunas de ejemplo
    if (savedNotifications.length === 0) {
      const demoNotifications: Notification[] = [
        {
          id: '1',
          type: 'order',
          title: 'Nueva orden recibida',
          message: 'María González ha realizado una compra de $125,000',
          date: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          priority: 'high',
        },
        {
          id: '2',
          type: 'user',
          title: 'Nuevo usuario registrado',
          message: 'Laura Rodríguez se ha registrado en la plataforma',
          date: new Date(Date.now() - 7200000).toISOString(),
          read: false,
          priority: 'medium',
        },
        {
          id: '3',
          type: 'product',
          title: 'Stock bajo',
          message: 'El producto "Leggings Deportivos" tiene solo 3 unidades disponibles',
          date: new Date(Date.now() - 10800000).toISOString(),
          read: true,
          priority: 'high',
        },
      ];
      localStorage.setItem('adminNotifications', JSON.stringify(demoNotifications));
      setNotifications(demoNotifications);
    } else {
      setNotifications(savedNotifications);
    }
  };

  const checkForNewOrders = () => {
    // Esta función simula la verificación de nuevas órdenes
    // En producción, esto sería un websocket o polling al servidor
    const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const lastCheck = localStorage.getItem('lastOrderCheck');
    const now = new Date().toISOString();
    
    if (lastCheck) {
      const newOrders = orders.filter((order: any) => 
        new Date(order.date) > new Date(lastCheck)
      );
      
      if (newOrders.length > 0) {
        const newNotifications = newOrders.map((order: any) => ({
          id: Date.now().toString() + Math.random(),
          type: 'order' as const,
          title: 'Nueva orden recibida',
          message: `${order.customer} ha realizado una compra de $${order.total.toLocaleString('es-CO')}`,
          date: order.date,
          read: false,
          priority: 'high' as const,
        }));
        
        const allNotifications = [...newNotifications, ...notifications];
        setNotifications(allNotifications);
        localStorage.setItem('adminNotifications', JSON.stringify(allNotifications));
        
        toast.success(`${newOrders.length} nueva${newOrders.length > 1 ? 's' : ''} orden${newOrders.length > 1 ? 'es' : ''} recibida${newOrders.length > 1 ? 's' : ''}`);
      }
    }
    
    localStorage.setItem('lastOrderCheck', now);
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
    toast.success('Notificación eliminada');
  };

  const clearAll = () => {
    if (window.confirm('¿Estás segura de que quieres eliminar todas las notificaciones?')) {
      setNotifications([]);
      localStorage.setItem('adminNotifications', JSON.stringify([]));
      toast.success('Todas las notificaciones eliminadas');
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
      case 'order_update':
        return ShoppingCart;
      case 'user':
        return User;
      case 'product':
        return Package;
      case 'system':
        return Info;
      default:
        return Bell;
    }
  };

  const getIconColor = (priority?: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-600';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600';
      case 'low':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h3 className="text-2xl font-serif text-gray-800">Centro de Notificaciones</h3>
          <p className="text-gray-600 text-sm mt-1">
            {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            Marcar todas como leídas
          </button>
          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar todo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#3B82F6] rounded-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500 rounded-lg">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sin leer</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Leídas</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length - unreadCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-[#3B82F6] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-[#3B82F6] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sin leer ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'read'
                ? 'bg-[#3B82F6] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Leídas ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif, index) => {
            const Icon = getIcon(notif.type);
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all ${
                  !notif.read ? 'border-l-4 border-[#3B82F6]' : ''
                }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg flex-shrink-0 ${getIconColor(notif.priority)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{notif.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notif.date).toLocaleString('es-CO', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="p-2 text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-colors"
                              title="Marcar como leída"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay notificaciones</p>
            <p className="text-sm text-gray-400 mt-1">
              {filter === 'unread'
                ? 'Todas las notificaciones han sido leídas'
                : 'Las nuevas notificaciones aparecerán aquí'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}