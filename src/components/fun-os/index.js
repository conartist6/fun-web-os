import React, { Component } from 'react';
import Desktop from '../desktop';
import Window from '../window';
import selectParent from 'select-parent';
import { map } from 'iter-tools/es2015';
import { connectFun } from '../../state';

import './style.scss';

export class FunOS extends Component {
  onMouseDown(evt) {
    const { actions, windows } = this.props;
    const windowTarget = selectParent('.window', evt.target);
    const target = windowTarget ? windowTarget.dataset.appName : 'desktop';

    if (target === 'desktop' || windowTarget.dataset.index < windows.size) {
      actions.focus(target);
    }
  }

  render() {
    const { windows, apps, children } = this.props;

    const windowEls = windows.map(wndw => {
      return (
        <Window
          window={wndw}
          app={apps.get(wndw.appName)}
          data-app-name={wndw.appName}
          key={wndw.appName}
        />
      );
    });
    return (
      <div className="operating-system" onMouseDown={evt => this.onMouseDown(evt)}>
        <Desktop />
        {windowEls}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { windows } = state;
  return { windows };
};

export default connectFun(mapStateToProps)(FunOS);
