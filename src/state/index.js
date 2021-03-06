import { Record, List, Map } from 'immutable';
import { entities } from 'potato-engine';
import path from 'path';
import { map, chain, entries } from 'iter-tools/es2015';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export const Window = Record({
  file: null,
  appName: null,
  index: 0,
  zIndex: 0,
});

export const File = Record({
  type: 'file', // file | app
  name: null,
});

export const State = Record({
  fileExtensionAssociations: Map(),
  desktopFiles: List(),
  selectedFile: null,
  windows: List(),
});

export default function reducer(state = new State(), action) {
  switch (action.type) {
    case 'SELECT_FILE':
      state = state.set('selectedFile', action.file);
      break;
    case 'OPEN_FILE': {
      let openWindow;
      state = state.withMutations(state => {
        state.selectedFile = null;
        const { file } = action;
        let appName;
        if (file.type === 'app') {
          appName = file.name;
        } else if (file.type === 'file') {
          const ext = path.extname(file.name);
          appName = state.fileExtensionAssociations.get(ext);
        }

        state.windows = state.windows.withMutations(windows => {
          openWindow = windows.find(wndw => wndw.appName === appName);

          if (openWindow) {
            openWindow = openWindow.set('file', file);

            windows.set(openWindow.index, openWindow);
          } else {
            windows.push(Window({ file, appName, zIndex: windows.size + 1, index: windows.size }));
          }
        });
      });

      if (openWindow) {
        state = focus(state, openWindow);
      }
      break;
    }
    case 'CLOSE_WINDOW':
      {
        state = state.set(
          'windows',
          state.windows.filter(w => w !== action.window).map(w => {
            return w
              .set('zIndex', w.zIndex - (w.zIndex > action.window.zIndex ? 1 : 0))
              .set('index', w.index - (w.index > action.window.index ? 1 : 0));
          }),
        );
      }
      break;
    case 'FOCUS':
      if (action.target === 'desktop') {
        state = state.set('selectedFile', null);
      } else {
        state = focus(state, windowByAppName(state.windows, action.target));
      }
      break;
  }

  return state;
}

export const windows = state => state.windows;
export const topWindow = createSelector(windows, windows => {
  return windows.reduce((top, wndw) => (top.zIndex > wndw.zIndex ? top : wndw));
});

function focus(state, target) {
  const { windows } = state;
  const top = topWindow(state);
  if (target === top) {
    return state;
  }
  return state.set(
    'windows',
    windows.map(wndw => {
      return wndw.set('zIndex', wndw.appName === target.appName ? windows.size : wndw.zIndex - 1);
    }),
  );
}

export const actions = {
  focus: target => ({
    type: 'FOCUS',
    target,
  }),
  close: wndw => ({
    type: 'CLOSE_WINDOW',
    window: wndw,
  }),
  selectFile: file => ({
    type: 'SELECT_FILE',
    file,
  }),
  openFile: file => ({
    type: 'OPEN_FILE',
    file,
  }),
};

export function connectFun(mapStateToProps, ...args) {
  return connect(
    mapStateToProps,
    dispatch => ({
      actions: bindActionCreators(actions, dispatch),
    }),
    ...args,
  );
}

export function hydrate(obj) {
  return State({
    fileExtensionAssociations: Map(obj.fileExtensionAssociations),
    desktopFiles: List(map(f => File(f), obj.desktopFiles)),
    windows: List(
      map((w, i) => Window({ ...w, zIndex: i + 1, index: i, file: File(w.file) }), obj.windows),
    ),
  });
}

function windowByAppName(windows, appName) {
  return windows.find(wndw => wndw.appName === appName);
}
