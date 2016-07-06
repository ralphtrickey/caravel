import React from 'react'
import { Button, Tab, Tabs } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import SqlEditor from './SqlEditor'
import shortid from 'shortid'

var queryCount = 1;

const QueryEditors = React.createClass({
  getInitialState: function() {
    return {tabkey: 0};
  },
  newQueryEditor: function () {
    queryCount++;
    var dbId = (this.props.workspaceDatabase) ? this.props.workspaceDatabase.id : null;
    var qe = {
      id: shortid.generate(),
      title: `Query ${queryCount}`,
      dbId: dbId,
      autorun: false,
      sql: 'SELECT ...'
    };
    this.props.actions.addQueryEditor(qe);
  },
  handleSelect(key) {
    this.setState({tabkey: key});
  },
  render: function () {
    var running = this.props.queries.filter((q) => { return q.state == 'running' });
    var running = running.map((q) => { return q.sqlEditorId });
    var that = this;
    var editors = this.props.queryEditors.map(function (qe, i) {
      var title = qe.title;
      if (running.includes(qe.id)) {
        title = <div>{qe.title} <div className='circle-running'/></div>;
      }
      var latestQuery = null;
      that.props.queries.forEach((q) => {
        if (q.id == qe.latestQueryId) {
          latestQuery = q;
        }
      });
      return (
        <Tab
          key={qe.id}
          title={title}
          eventKey={i}>
            <SqlEditor
              name={qe.id}
              queryEditor={qe}
              latestQuery={latestQuery}
              callback={that.render.bind(that)}/>
        </Tab>);
    });
    return (
      <Tabs activeKey={this.state.tabkey} onSelect={this.handleSelect}>
        {editors}
        <Tab title="+" eventKey={this.props.queryEditors.length}>
          <Button onClick={this.newQueryEditor}>
            Add Tab
          </Button>
        </Tab>
      </Tabs>
    );
  }
});

function mapStateToProps(state) {
  return {
    queryEditors: state.queryEditors,
    queries: state.queries,
    workspaceDatabase: state.workspaceDatabase
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryEditors)
