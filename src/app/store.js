import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import userReducer from '../features/user/userSlice';
import advisorReducer from '../features/advisor/AdvisorSlice';
import customerReducer from '../features/kiosk/CustomerSlice';

const rootReducer = {
  user: userReducer,
  advisor: advisorReducer,
  customer: customerReducer,
};

const persistConfig = {
  key: 'user',
  storage,
  whitelist: ['user'], // only user will be persisted
};

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
