/**
 * Redux Types
 * Type definitions for Redux store, actions, and selectors
 */

import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import type store from '../store/store';

// ============================================================================
// Store Types
// ============================================================================

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch;

// ============================================================================
// Typed Hooks
// ============================================================================

// Export pre-typed versions of useDispatch and useSelector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
