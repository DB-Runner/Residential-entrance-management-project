// Dashboard view types
export const dashboardViews = ['overview', 'payments', 'events', 'voting', 'profile'] as const;
export type DashboardView = typeof dashboardViews[number];

export const adminViews = ['overview', 'apartments', 'payments', 'events', 'voting', 'reports'] as const;
export type AdminView = typeof adminViews[number];