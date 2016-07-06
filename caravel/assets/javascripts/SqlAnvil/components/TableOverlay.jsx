import React from 'react';
import Draggable from 'react-draggable';
import { BoostrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import TableMetadata from './TableMetadata';

const TableOverlay = React.createClass({
  render() {
    return (
    <Draggable
      defaultPosition={this.props.defaultPosition}
      position={null}
      handle=".handle"
      zIndex={500}>
      <div className="window panel panel-default">
        <div className="panel-heading handle">
          <strong>{this.props.table.name}</strong>
          <div className="pull-right">
            <a
                onClick={this.props.actions.hideTablePopup.bind(this, this.props.table)}
                href="#">
              <i className="fa fa-close"/>
            </a>
          </div>
        </div>
        <div className="panel-body nopadding">
          <TableMetadata table={this.props.table}/>
        </div>
      </div>
    </Draggable>);
  }
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(TableOverlay)
