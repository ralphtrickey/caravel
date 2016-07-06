import React, { PropTypes } from 'react'
import { Alert, Button, ButtonGroup } from 'react-bootstrap'
import Link from './Link'
import TableOverlay from './TableOverlay'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import shortid from 'shortid'

// CSS
import 'react-select/dist/react-select.css';

const TableWorkspaceElement = React.createClass({
  selectStar: function () {
    var cols = "";
    var that = this;
    this.props.table.columns.forEach(function (col, i) {
      cols += col.name;
      if (i < that.props.table.columns.length - 1) {
        cols += ', ';
      }
    });
    var sql = `SELECT ${cols}\nFROM ${this.props.table.name}`;
    var qe = {
      id: shortid.generate(),
      title: this.props.table.name,
      dbId: this.props.table.dbId,
      autorun: true,
      sql
    };
    this.props.actions.addQueryEditor(qe);
  },
  render: function () {
    var metadata = null;
    if (!this.props.table.expanded) {
      var buttonToggle = (
        <Link
            href="#"
            onClick={this.props.actions.expandTable.bind(this, this.props.table)}
            tooltip="Collapse the table's structure information">
          <i className="fa fa-minus"/> {this.props.table.name}
        </Link>
      );
      metadata = this.props.table.columns.map((col) => {
        return (
          <div
              className="clearfix"
              style={{'margin-left': '10px', 'border-bottom': 'solid 1px #DDD'}}>
            <span className="pull-left">{col.name}</span>
            <span className="pull-right">{col.type}</span>
          </div>
        );
      });
      metadata = (
        <div style={{ 'margin-bottom': '5px' }}>{metadata}</div>
      );
    } else {
      var buttonToggle = (
        <Link
            href="#"
            onClick={this.props.actions.collapseTable.bind(this, this.props.table)}
            tooltip="Expand the table's structure information">
          <i className="fa fa-plus"/> {this.props.table.name}
        </Link>
      );
    }
    return (
      <div className="ws-el">
        {buttonToggle}
        <ButtonGroup className="ws-el-controls pull-right">
          <Link
              className="fa fa-info-circle"
              onClick={this.props.actions.showTablePopup.bind(this, this.props.table)}
              tooltip="Show table structure in popup"
              href="#"
          />
          <Link
              className="fa fa-play"
              onClick={this.selectStar}
              tooltip="Run query in a new tab"
              href="#"
          />
          <Link
              className="fa fa-trash"
              onClick={this.props.actions.removeTable.bind(this, this.props.table)}
              tooltip="Remove from workspace"
              href="#"
          />
        </ButtonGroup>
        {metadata}
      </div>
    )
  }
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}
export default connect(null, mapDispatchToProps)(TableWorkspaceElement)

