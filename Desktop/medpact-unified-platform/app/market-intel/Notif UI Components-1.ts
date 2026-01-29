// components/notifications/NotificationCenter.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService, NotificationData } from '@/lib/notification-service';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle, XCircle, Filter, Settings } from 'lucide-react';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === filter);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'market_alert': return <span className="text-blue-500">📈</span>;
      case 'competitive': return <span className="text-purple-500">⚔️</span>;
      case 'financial': return <span className="text-green-500">💰</span>;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-4 border-red-500 bg-red-50';
      case 'high': return 'border-l-4 border-orange-500 bg-orange-50';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
      default: return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  const handleNotificationClick = (notification: NotificationData) => {
    if (!notification.read) {
      notificationService.markAsRead(notification.id);
    }
  };

  const handleAction = (notificationId: string, actionId: string, url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
    notificationService.executeAction(notificationId, actionId);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => notificationService.markAllAsRead()}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    title="Mark all as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                {[
                  { id: 'all', name: 'All', count: notifications.length },
                  { id: 'market', name: 'Market', count: notifications.filter(n => n.category === 'market').length },
                  { id: 'competitive', name: 'Competitive', count: notifications.filter(n => n.category === 'competitive').length },
                  { id: 'operational', name: 'Ops', count: notifications.filter(n => n.category === 'operational').length },
                  { id: 'system', name: 'System', count: notifications.filter(n => n.category === 'system').length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-3 py-2 text-xs font-medium transition-colors ${
                      filter === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.name} {tab.count > 0 && `(${tab.count})`}
                  </button>
                ))}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {filteredNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                          !notification.read ? 'bg-blue-50' : 'bg-white'
                        } ${getPriorityStyles(notification.priority)}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-sm font-medium truncate ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-500 ml-2">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            {/* Actions */}
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex space-x-2 mt-2">
                                {notification.actions.map(action => (
                                  <button
                                    key={action.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAction(notification.id, action.id, action.url);
                                    }}
                                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                  >
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-3 right-3"></div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All Notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}