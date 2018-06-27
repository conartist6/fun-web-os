import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import path from 'path';
import { connectFun } from '../../state';

import './style.scss';

export class File extends Component {
  onMouseDown(evt) {
    if (evt.button !== 0) {
      return;
    }

    const { file, selected, actions } = this.props;

    evt.preventDefault();
    evt.stopPropagation();

    const now = Date.now();
    const isDblClick = selected && this._lastClick && now - this._lastClick < 500;

    this._lastClick = now;
    isDblClick ? actions.openFile(file) : actions.selectFile(file);
  }
  render() {
    const { file, selected } = this.props;
    let ext = path.extname(file.name);
    ext = ext && ext.slice(1);

    return (
      <div
        className={cx({ file: true, selected, [`ext-${ext}`]: !!ext })}
        onMouseDown={evt => this.onMouseDown(evt)}
      >
        <div className="icon" />
        <div className="name">
          <div>{file.name}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, { file }) {
  const selected = state.selectedFile === file;
  return { selected };
}

export default connectFun(mapStateToProps)(File);
