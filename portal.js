import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Menu, X, Bell, Settings, User, TrendingUp, Activity, Zap, Target } from 'lucide-react';

export default function Portal() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data
  const chartData = [
    { name: 'Jan', value: 400, target: 500 },
    { name: 'Feb', value: 620, target: 550 },
    { name: 'Mar', value: 720, target: 600 },
    { name: 'Apr', value: 890, target: 700 },
    { name: 'May', value: 1100, target: 800 },
    { name: 'Jun', value: 1200, target: 900 },
  ];

  const pieData = [
    { name: 'Completed', value: 65, color: '#06b6d4' },
    { name: 'In Progress', value: 25, color: '#0ea5e9' },
    { name: 'Pending', value: 10, color: '#64748b' },
  ];

  const stats = [
    { icon: TrendingUp, label: 'Revenue', value: '$124.5K', change: '+12.5%', color: 'from-cyan-500 to-blue-500' },
    { icon: Activity, label: 'Active Users', value: '8,642', change: '+8.2%', color: 'from-violet-500 to-purple-500' },
    { icon: Zap, label: 'Performance', value: '94.2%', change: '+5.1%', color: 'from-amber-500 to-orange-500' },
    { icon: Target, label: 'Goals', value: '12/15', change: '+2 this week', color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg transition">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Portal</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400 font-mono">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition">
              <Settings size={20} />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition">
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-20 bottom-0 w-64 bg-slate-900/50 backdrop-blur border-r border-slate-800 transition-transform duration-300 z-30 ${!sidebarOpen && '-translate-x-full'}`}>
          <nav className="p-6 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'projects', label: 'Projects', icon: '🎯' },
              { id: 'team', label: 'Team', icon: '👥' },
              { id: 'reports', label: 'Reports', icon: '📋' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-500/30 to-violet-500/30 border border-cyan-500/50 text-cyan-300'
                    : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>{item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-10">
              <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
              <p className="text-slate-400">Here's what's happening with your portal today</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="group relative bg-slate-800/40 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition`}></div>
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                          <Icon size={24} />
                        </div>
                        <span className="text-xs text-emerald-400 font-semibold">{stat.change}</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {/* Bar Chart */}
              <div className="lg:col-span-2 bg-slate-800/40 backdrop-blur border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-6">Monthly Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#e2e8f0' }} />
                    <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="target" fill="#8b5cf6" radius={[8, 8, 0, 0]} opacity={0.5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-slate-800/40 backdrop-blur border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-6">Tasks Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#e2e8f0' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        {item.name}
                      </span>
                      <span className="text-slate-400">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-slate-800/40 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-6">Growth Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#e2e8f0' }} />
                  <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 5 }} />
                  <Line type="monotone" dataKey="target" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" opacity={0.7} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}