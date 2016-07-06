import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import { BootstrapTable } from 'react-bootstrap-table';
import moment from 'moment'

const QueryLog = React.createClass({
  render: function () {
    var data = this.props.queries.map((q) => {
      var q = Object.assign({}, q);
      var since = (q.endDttm) ? q.endDttm : moment();
      var duration = since.valueOf() - q.startDttm.valueOf();
      console.log(duration);
      duration = moment.utc(duration);
      q['duration'] = duration.format('HH:mm:ss.ms');
      return q;
    }).reverse();
    return (
      <BootstrapTable
        condensed={true}
        data={data}>
          <TableHeaderColumn dataField="id" isKey={true} hidden={true}></TableHeaderColumn>
          <TableHeaderColumn dataField="state">state</TableHeaderColumn>
          <TableHeaderColumn dataField="duration">duration</TableHeaderColumn>
          <TableHeaderColumn dataField="sql">sql</TableHeaderColumn>
        </BootstrapTable>
    )
  }
});

function mapStateToProps(state) {
  return {
    queryEditors: state.queryEditors,
    queries: state.queries
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryLog)
