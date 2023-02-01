import { datastoreInitialState } from './states';
import { getRacesMutation } from './mutations';
import { getRacesAction } from './actions';

export const datastore = {
    state: () => datastoreInitialState,
    mutations: { getRacesMutation },
    actions: { getRacesAction }
}
