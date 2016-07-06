import React from 'react';
import Draggable from 'react-draggable';
import { BoostrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

const TableMetadata = React.createClass({
  render() {
    return (
      <BootstrapTable
        condensed={true}
        data={this.props.table.columns}>
        <TableHeaderColumn dataField="id" isKey={true} hidden={true}>
          id
        </TableHeaderColumn>
        <TableHeaderColumn dataField="name">Name</TableHeaderColumn>
        <TableHeaderColumn dataField="type">Type</TableHeaderColumn>
      </BootstrapTable>
    );
  }
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(TableMetadata)
