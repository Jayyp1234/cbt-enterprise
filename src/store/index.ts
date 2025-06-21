import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/authApi';
import { dashboardApi } from './services/dashboardApi';
import { staffApi } from './services/staffApi';
import { studentsApi } from './services/studentsApi';
import { paymentsApi } from './services/paymentsApi';
import { contentApi } from './services/contentApi';
import { userManagementApi } from './services/userManagementApi';
import { featuresApi } from './services/featuresApi';
import { settingsApi } from './services/settingsApi';
import { analyticsApi } from './services/analyticsApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
    [userManagementApi.reducerPath]: userManagementApi.reducer,
    [featuresApi.reducerPath]: featuresApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      dashboardApi.middleware,
      staffApi.middleware,
      studentsApi.middleware,
      paymentsApi.middleware,
      contentApi.middleware,
      userManagementApi.middleware,
      featuresApi.middleware,
      settingsApi.middleware,
      analyticsApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;