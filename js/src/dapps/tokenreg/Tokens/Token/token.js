import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import { RaisedButton, SelectField, MenuItem } from 'material-ui';

import FindIcon from 'material-ui/svg-icons/action/find-in-page';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

import Loading from '../../Loading';
import Chip from '../../Chip';
import AddMeta from './add-meta';

import styles from './token.css';

import { metaDataKeys } from '../../constants';

export default class Token extends Component {
  static propTypes = {
    handleAddMeta: PropTypes.func,
    handleUnregister: PropTypes.func,
    handleMetaLookup: PropTypes.func,
    isLoading: PropTypes.bool,
    isPending: PropTypes.bool,
    isOwner: PropTypes.bool,
    isTokenOwner: PropTypes.bool,
    address: PropTypes.string,
    tla: PropTypes.string,
    name: PropTypes.string,
    base: PropTypes.number,
    index: PropTypes.number,
    meta: PropTypes.object,
    owner: PropTypes.string,
    ownerAccountInfo: PropTypes.shape({
      name: PropTypes.string,
      meta: PropTypes.object
    }),
    metaPending: PropTypes.bool,
    metaMined: PropTypes.bool
  };

  state = {
    metaKeyIndex: 0
  };

  render () {
    const { isLoading, address, tla, base, name, meta, owner } = this.props;

    if (isLoading) {
      return (
        <div className={ [ styles.token, styles.loading ].join(' ') }>
          <Loading size={ 1 } />
        </div>
      );
    }

    return (<div>
      <Paper zDepth={ 2 } className={ styles.token }>
        { this.renderIsPending() }
        <div className={ styles.title }>{ tla }</div>
        <div className={ styles.name }>"{ name }"</div>

        { this.renderBase(base) }
        { this.renderAddress(address) }
        { this.renderOwner(owner) }

        <div className={ styles['meta-form'] }>
          <SelectField
            floatingLabelText='Choose the meta-data to look-up'
            fullWidth
            value={ this.state.metaKeyIndex }
            onChange={ this.onMetaKeyChange }>

            { this.renderMetaKeyItems() }

          </SelectField>

          <RaisedButton
            label='Lookup'
            icon={ <FindIcon /> }
            primary
            fullWidth
            onTouchTap={ this.onMetaLookup } />
        </div>

        { this.renderMeta(meta) }
        { this.renderAddMeta() }
        { this.renderUnregister() }

        { this.renderMetaPending() }
        { this.renderMetaMined() }
      </Paper>
    </div>);
  }

  renderMetaKeyItems () {
    return metaDataKeys.map((key, index) => (
      <MenuItem
        value={ index }
        key={ index }
        label={ key.label } primaryText={ key.label } />
    ));
  }

  renderBase (base) {
    if (!base || base < 0) return null;
    return (
      <Chip
        value={ base.toString() }
        label='Base' />
    );
  }

  renderAddress (address) {
    if (!address) return null;
    return (
      <Chip
        isAddress
        value={ address }
        label='Address' />
    );
  }

  renderOwner (owner) {
    if (!owner) return null;

    let ownerInfo = this.props.ownerAccountInfo;

    let displayValue = (ownerInfo && ownerInfo.name)
      ? ownerInfo.name
      : owner;

    return (
      <Chip
        isAddress
        displayValue={ displayValue }
        value={ owner }
        label='Owner' />
    );
  }

  renderIsPending () {
    const { isPending } = this.props;

    if (!isPending) return null;

    return (
      <div className={ styles.pending } />
    );
  }

  renderAddMeta () {
    return (
      <AddMeta
        handleAddMeta={ this.props.handleAddMeta }
        isTokenOwner={ this.props.isTokenOwner }
        index={ this.props.index } />
    );
  }

  renderUnregister () {
    if (!this.props.isOwner) return null;

    return (
      <RaisedButton
        className={ styles.unregister }
        label='Unregister'
        icon={ <DeleteIcon /> }
        secondary
        fullWidth
        onTouchTap={ this.onUnregister } />
    );
  }

  renderMeta (meta) {
    if (!meta) return;

    return (<div>
      <p className={ styles['meta-query'] }>
        Meta for key
        <span className={ styles['meta-key'] }>{ meta.query }</span>:
      </p>
      <p className={ styles['meta-value'] }>{ meta.value }</p>
    </div>);
  }

  renderMetaPending () {
    let isMetaPending = this.props.metaPending;
    if (!isMetaPending) return;

    return (<div>
      <p className={ styles['meta-info'] }>
        Meta-Data pending...
      </p>
    </div>);
  }

  renderMetaMined () {
    let isMetaMined = this.props.metaMined;
    if (!isMetaMined) return;

    return (<div>
      <p className={ styles['meta-info'] }>
        Meta-Data saved on the blockchain!
      </p>
    </div>);
  }

  onUnregister = () => {
    let index = this.props.index;
    this.props.handleUnregister(index);
  }

  onMetaLookup = () => {
    let keyIndex = this.state.metaKeyIndex;
    let key = metaDataKeys[keyIndex].value;
    let index = this.props.index;

    this.props.handleMetaLookup(index, key);
  }

  onMetaKeyChange = (event, metaKeyIndex) => {
    this.setState({ metaKeyIndex });
  }
}
