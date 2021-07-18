// Core
import { useMemo } from 'react';
import * as R from 'ramda';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
    Store,
    createStore,
    applyMiddleware,
    StoreEnhancer,
    PreloadedState,
    Middleware,
} from 'redux';

// Middleware
import createSagaMiddleware, { Task } from 'redux-saga';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

// Instruments
import { AppStateType, rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';
import { verifyBrowser, verifyEnvironment } from '../helpers';

let store: Store | undefined;
type ExtendedStoreType = Store & {
    sagaTask: Task;
};

const bindMiddleware = (middleware: Middleware[]): StoreEnhancer => {
    const { isDevelopment } = verifyEnvironment();
    const isBrowser = verifyBrowser();

    if (isDevelopment) {
        if (isBrowser) {
            const logger = createLogger({
                duration:  true,
                timestamp: true,
                collapsed: true,
                diff:      true,
                colors:    {
                    title: (action): string => {
                        return action.error ? 'firebrick' : 'deepskyblue';
                    },
                    prevState: (): string => 'dodgerblue',
                    action:    (): string => 'greenyellow',
                    nextState: (): string => 'olivedrab',
                    error:     (): string => 'firebrick',
                },
            });

            middleware.push(logger);
        }
    }

    return composeWithDevTools(applyMiddleware(...middleware));
};

export const initStore = (preloadedState = {}): Store => {
    const defaultState = preloadedState ? createStore(rootReducer).getState() : {};
    const currentState = R.mergeDeepRight(defaultState, preloadedState);

    const sagaMiddleware = createSagaMiddleware();
    const initedStore = createStore<AppStateType, PreloadedState<never>, ExtendedStoreType, never>(
        rootReducer,
        currentState,
        bindMiddleware([thunk, sagaMiddleware]) as StoreEnhancer<ExtendedStoreType>,
    );

    initedStore.sagaTask = sagaMiddleware.run(rootSaga);

    return initedStore;
};

export const initializeStore = (preloadedState = {}): Store => {
    let initializedStore = store || initStore(preloadedState);

    if (preloadedState && store) {
        initializedStore = initStore(R.mergeDeepRight(store.getState(), preloadedState));

        store = undefined;
    }

    if (typeof window === 'undefined') {
        return initializedStore;
    }

    if (!store) {
        store = initializedStore;
    }
    return initializedStore;
};

export const useStore = (initialState = {}): Store => {
    const storeFn = () => initializeStore(initialState);
    
    return useMemo(storeFn, [initialState]);
};
