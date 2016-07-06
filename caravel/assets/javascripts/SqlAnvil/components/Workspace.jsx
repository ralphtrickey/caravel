import React, { PropTypes } from 'react'
import { Alert, Button, ButtonGroup } from 'react-bootstrap'
import Link from './Link'
import TableOverlay from './TableOverlay'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import TableWorkspaceElement from './TableWorkspaceElement'
import shortid from 'shortid'
import Select from 'react-select'

// CSS
import 'react-select/dist/react-select.css';


const Workspace = React.createClass({
  getInitialState: function() {
    return {
      tableName: null,
      tableOptions: [],
      tableLoading: false,
    };
  },
  getTableOptions: function(input, callback) {
    var that = this;
    $.get('/tableasync/api/read', function (data) {
      var options = [];
      for (var i=0; i<data.pks.length; i++) {
        options.push({ value: data.pks[i], label: data.result[i].table_name });
      }
      callback(null, {
        options: options,
        cache: false
      });
    });
  },
  changeDb: function (dbId) {
    this.setState({ tableLoading: true });
    var that = this;
    var url = '/databaseasync/api/read?id=' + dbId;
    $.get(url, function (data) {
      var tables = data.result[0].all_table_names;
      var options = [];
      for (var i=0; i<tables.length; i++) {
        options.push({ value: tables[i], label: tables[i] });
      }
      that.setState({ tableOptions: options });
      that.setState({ tableLoading: false });
      that.props.actions.setWorkspaceDb(data.result[0]);
    });
    this.render();
  },
  changeTable: function (tableOpt) {
    var tableName = tableOpt.value;
    this.setState({ tableName: tableName });
    var that = this;
    var url = `/caravel/table/${this.props.workspaceDatabase.id}/${tableName}`;
    $.get(url, function (data) {
      var options = [];
      that.props.actions.addTable({
        id: shortid.generate(),
        dbId: that.props.workspaceDatabase.id,
        name: data.name,
        columns: data.columns,
        expanded: true,
        showPopup: false
      });
      that.render();
    });
    this.render();
  },
  componentDidMount: function () {
    this.fetchDatabaseOptions();
  },
  fetchDatabaseOptions: function(input, callback) {
    this.setState({ databaseLoading: true });
    var that = this;
    var url = '/databaseasync/api/read';
    $.get(url, function (data) {
      var options = data.result.map((db) => {
        return { value: db.id, label: db.database_name };
      });
      that.setState({ databaseOptions: options });
      that.setState({ databaseLoading: false });
      that.render();
    });
    this.render();
  },
  render: function () {
    var tableElems = (
      <Alert bsStyle="info">
        To add a table to your workspace, pick one from the dropdown above.
      </Alert>);
    if (this.props.tables.length > 0) {
      tableElems = this.props.tables.map(function (table) {
        return <TableWorkspaceElement key={table.id} table={table}/>;
      });
    }

    var tableOverlayElems = [];
    var i = 0;
    this.props.tables.forEach(function (table) {
      if (table.showPopup) {
        tableOverlayElems.push(
          <TableOverlay
            key={table.name}
            table={table}
            defaultPosition={{ x: i*100, y: i*50 }}/>
        );
        i++;
      }
    });

    if (this.props.workspaceQueries.length > 0) {
      var queryElements = this.props.workspaceQueries.map((q) => {
        return(
          <div className="ws-el">
            <a href="#">{q.title}</a>
          </div>
        );
      });
    } else {
      var queryElements = (
        <Alert bsStyle="info">
          Use the save button on the SQL editor to add a query to your
          workspace
        </Alert>
      );
    }

    return (
      <div className="panel panel-default Workspace">
        {tableOverlayElems}
        <div className="panel-heading">
          Workspace
        </div>
        <div className="panel-body">
          <div>
            <Select
              name="select-db"
              placeholder="[Database]"
              options={this.state.databaseOptions}
              value={(this.props.workspaceDatabase) ? this.props.workspaceDatabase.id : null}
              onChange={this.changeDb}
              autosize={false}
            />
            <div>
              <Select
                disabled={(!this.props.workspaceDatabase === null)}
                ref="selectTable"
                name="select-table"
                isLoading={this.state.tableLoading}
                placeholder="[Table / View]"
                className="p-t-10"
                value={this.state.tableName}
                onChange={this.changeTable}
                options={this.state.tableOptions}/>
            </div>
            <hr/>

            <h6>Tables / Views</h6>
            <div>
              {tableElems}
            </div>
            <hr/>

            <h6>Queries</h6>
            <div>
              {queryElements}
            </div>
            <hr/>

          </div>
        </div>
      </div>
    )
  }
});

function mapStateToProps(state) {
  return {
    tables: state.tables,
    workspaceDatabase: state.workspaceDatabase,
    workspaceQueries: state.workspaceQueries,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Workspace)
