import * as statusCodes from '../constants/status_codes';
import * as types from '../constants/action_types/routing';
import * as authActions from './auth';


function indexPageEnter(getState) {
  const state = getState();

  // if the user is not signed in,
  // redirect to the 'static' about page.
  if (!state.auth.user) {
    document.location.replace('/about');
  } else {
    return goTo('/app', statusCodes.REDIRECT);
  }
}


function appPageOnEnter(getState) {
  const state = getState();

  // if the user is not signed in,
  // redirect to the sign-in page.
  if (!state.auth.user) {
    return goTo('/sign-in', statusCodes.REDIRECT);
  }
}


function signOutPageEnter() {
  return (dispatch) => {
    dispatch(authActions.deauthenticate());
  };
}


const ROUTING_TABLE = {
  '/': { container: 'IndexPage', onEnter: indexPageEnter },
  '/app': { container: 'AppPage', onEnter: appPageOnEnter },
  '/sign-in': { container: 'SignInPage' },
  '/sign-up': { container: 'SignUpPage' },
  '/sign-out': { redirectTo: '/sign-in', onEnter: signOutPageEnter },

  // redirects
  '/login': { redirectTo: '/sign-in' },
  '/logout': { redirectTo: '/sign-out' },
  '/register': { redirectTo: '/sign-up' },
};


/// Actions
///
export function goTo(path, status = statusCodes.ADD_HISTORY) {
  return (dispatch, getState) => {
    let onEnterThunk;

    // current path
    const currentPath = getState().routing.path;

    // remove extraneous stuff from the path
    const cleanPath = `/${path.replace(/(^\/*|\/*$)/g, '')}`;

    // get table item
    const tableItem = ROUTING_TABLE[cleanPath];

    // exit if already there
    if (cleanPath === currentPath) return;

    // if *found*
    if (tableItem) {
      // -- redirect
      if (tableItem.redirectTo) {
        if (tableItem.onEnter) {
          onEnterThunk = tableItem.onEnter(getState);
          if (onEnterThunk) dispatch(onEnterThunk);
        }

        dispatch(goTo(tableItem.redirectTo, statusCodes.REDIRECT));

      // -- default
      } else {
        if (tableItem.onEnter) {
          onEnterThunk = tableItem.onEnter(getState);
        }

        if (onEnterThunk) {
          dispatch(onEnterThunk);
        } else {
          dispatch(setStatus(status));
          dispatch(setPath(cleanPath));
          dispatch(setContainer(tableItem.container));
        }

      }

    // if *not found*
    } else {
      dispatch(setStatus(statusCodes.NOT_FOUND));
      dispatch(setPath(cleanPath));
      dispatch(setContainer('NotFoundPage'));

    }
  };
}


/// Private
///
function setPath(path) {
  return { type: types.SET_PATH, path };
}

function setStatus(status) {
  return { type: types.SET_STATUS, status };
}

function setContainer(container) {
  return { type: types.SET_CONTAINER, container };
}
