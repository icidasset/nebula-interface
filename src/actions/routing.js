import * as types from '../constants/action_types/routing';


function appPageOnEnter(getState) {
  const state = getState();

  // if the user is not signed in,
  // redirect to the sign-in page.
  if (!state.auth.user) {
    return goTo('/sign-in', 302);
  }
}


const ROUTING_TABLE = {
  '/app': { container: 'AppPage', onEnter: appPageOnEnter },
  '/sign-in': { container: 'SignInPage' },
  '/sign-up': { container: 'SignUpPage' },

  // redirects
  '/login': { redirectTo: '/sign-in' },
  '/register': { redirectTo: '/sign-up' }
};


/// Actions
///
export function goTo(path, status=200) {
  return (dispatch, getState) => {
    let tableItem;
    let onEnterThunk;

    // remove extraneous stuff from the path
    path = '/' + path.replace(/(^\/*|\/*$)/g, '');

    // get table item
    tableItem = ROUTING_TABLE[path];

    // if *found*
    if (tableItem) {
      if (tableItem.redirectTo) {
        dispatch(goTo(tableItem.redirectTo, 302));

      } else {
        if (tableItem.onEnter) {
          onEnterThunk = tableItem.onEnter(getState);
        }

        if (onEnterThunk) {
          dispatch(onEnterThunk);
        } else {
          dispatch(setStatus(status));
          dispatch(setPath(path));
          dispatch(setContainer(tableItem.container));
        }

      }

    // if *not found*
    } else {
      dispatch(setStatus(404));
      dispatch(setPath(path));
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
