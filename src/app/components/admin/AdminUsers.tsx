import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Shield, User, Mail, Calendar, Ban, CheckCircle } from 'lucide-react';
import { User as UserType } from '@/app/context/AuthContext';
import { toast } from 'sonner';

interface ExtendedUser extends UserType {
  status: 'active' | 'blocked';
  lastLogin?: string;
  totalOrders?: number;
  totalSpent?: number;
}

export function AdminUsers() {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    // Usuarios administradores del sistema
    const adminUser: ExtendedUser = {
      id: '1',
      email: 'admin@devotion.com',
      name: 'Administrador DEVOTION',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=3B82F6&color=fff',
      createdAt: new Date('2024-01-01').toISOString(),
      status: 'active',
      lastLogin: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
    };

    // Cargar clientes desde localStorage (órdenes de WhatsApp)
    const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    
    // Crear usuarios desde las órdenes únicas
    const customerEmails = new Set<string>();
    const customerUsers: ExtendedUser[] = [];

    orders.forEach((order: any) => {
      if (!customerEmails.has(order.customerEmail)) {
        customerEmails.add(order.customerEmail);
        const customerOrders = orders.filter((o: any) => o.customerEmail === order.customerEmail);
        const totalSpent = customerOrders.reduce((sum: number, o: any) => sum + o.total, 0);

        customerUsers.push({
          id: `customer-${customerEmails.size}`,
          email: order.customerEmail || 'cliente@example.com',
          name: order.customerName || 'Cliente',
          role: 'admin', // Todos son admin ahora
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(order.customerName || 'Cliente')}&background=3B82F6&color=fff`,
          createdAt: order.date || new Date().toISOString(),
          status: 'active',
          lastLogin: order.date || new Date().toISOString(),
          totalOrders: customerOrders.length,
          totalSpent: totalSpent,
        });
      }
    });

    setUsers([adminUser, ...customerUsers]);
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'blocked' as const : 'active' as const }
        : user
    );
    
    setUsers(updatedUsers);
    
    const user = updatedUsers.find(u => u.id === userId);
    toast.success(
      user?.status === 'blocked'
        ? 'Usuario bloqueado exitosamente'
        : 'Usuario activado exitosamente'
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h3 className="text-2xl font-serif text-gray-800">Gestión de Usuarios</h3>
          <p className="text-gray-600 text-sm mt-1">{users.length} usuarios registrados</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar usuarios..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none appearance-none bg-white"
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administradoras</option>
              <option value="user">Clientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#3B82F6] rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Usuarios Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Administradoras</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          {filteredUsers.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Órdenes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Gastado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Registro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=C9A961&color=000`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          {user.lastLogin && (
                            <div className="text-xs text-gray-500">
                              Último acceso: {new Date(user.lastLogin).toLocaleDateString('es-CO')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role === 'admin' ? 'Admin' : 'Cliente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.totalOrders || 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${(user.totalSpent || 0).toLocaleString('es-CO')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.createdAt).toLocaleDateString('es-CO')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Activo
                          </>
                        ) : (
                          <>
                            <Ban className="w-3 h-3" />
                            Bloqueado
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        disabled={user.role === 'admin'}
                        className={`text-sm font-medium transition-colors ${
                          user.role === 'admin'
                            ? 'text-gray-400 cursor-not-allowed'
                            : user.status === 'active'
                            ? 'text-red-600 hover:text-red-700'
                            : 'text-green-600 hover:text-green-700'
                        }`}
                      >
                        {user.status === 'active' ? 'Bloquear' : 'Activar'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron usuarios</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}