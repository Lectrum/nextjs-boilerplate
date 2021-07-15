// Core
import { combineReducers } from 'redux';

// Reducers


export const rootReducer = combineReducers({
    root: () => ({}),
});

export type AppStateType = ReturnType<typeof rootReducer>;
