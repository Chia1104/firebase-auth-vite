import { incrementInitialState } from './states';
import { incrementMutation } from './mutations';
import { incrementAction } from './actions';

export const testCount = {
    state: () => incrementInitialState,
    mutations: { incrementMutation },
    actions: { incrementAction }
}
