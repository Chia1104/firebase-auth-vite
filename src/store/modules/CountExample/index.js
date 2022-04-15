import { incrementInitialState } from './states';
import { incrementMutation } from './mutations';
import { incrementAction } from './actions';

export const countExample = {
    state: () => incrementInitialState,
    mutations: { incrementMutation },
    actions: { incrementAction }
}
