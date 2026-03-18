import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Bell,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminOrders } from './admin/AdminOrders';
import { AdminUsers } from './admin/AdminUsers';
import { AdminNotifications } from './admin/AdminNotifications';
import { AdminSettings } from './admin/AdminSettings';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users' | 'notifications' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'orders', label: 'Órdenes', icon: ShoppingBag },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ] as const;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full bg-white z-[101] flex"
          >
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-black to-[#1a1a1a] transition-all duration-300 flex flex-col`}>
              {/* Logo & Toggle */}
              <div className="p-4 border-b border-[#3B82F6]/20">
                <div className="flex items-center justify-between">
                  {isSidebarOpen && (
                    <h1 className="font-serif text-[#3B82F6] text-lg">Admin Panel</h1>
                  )}
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-lg bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 transition-colors"
                  >
                    <Menu className="w-5 h-5 text-[#3B82F6]" />
                  </button>
                </div>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-[#3B82F6]/20">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar || 'https://ui-avatars.com/api/?name=Admin'}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full border-2 border-[#3B82F6]"
                  />
                  {isSidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{user?.name}</p>
                      <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-[#3B82F6] text-white shadow-lg'
                          : 'text-gray-300 hover:bg-[#3B82F6]/20 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                    </button>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="p-4 border-t border-[#3B82F6]/20">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#3B82F6]/20 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-serif text-gray-800">
                  {menuItems.find(item => item.id === activeTab)?.label}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-6"
                  >
                    {activeTab === 'dashboard' && <AdminDashboard />}
                    {activeTab === 'products' && <AdminProducts />}
                    {activeTab === 'orders' && <AdminOrders />}
                    {activeTab === 'users' && <AdminUsers />}
                    {activeTab === 'notifications' && <AdminNotifications />}
                    {activeTab === 'settings' && <AdminSettings />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}