// Dashboard view types
export const dashboardViews = ['overview', 'payments', 'events', 'messages', 'profile'] as const;
export type DashboardView = typeof dashboardViews[number];

// Admin view types
export const adminViews = ['overview', 'apartments', 'payments', 'events', 'announcements', 'reports'] as const;
export type AdminView = typeof adminViews[number];