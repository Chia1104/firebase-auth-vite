import { incrementInitialState } from './states';
import { incrementCountMutation } from './mutations';
import { incrementCountAction } from './actions';

export const counters = {
    state: () => incrementInitialState,
    mutations: { incrementCountMutation },
    actions: { incrementCountAction }
}
