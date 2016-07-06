import React from 'react'
import { Button, ButtonGroup, Label } from 'react-bootstrap';

import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/chrome';
import 'brace/ext/language_tools';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import moment from 'moment';
import shortid from 'shortid';
import Select from 'react-select';
import ButtonWithTooltip from './ButtonWithTooltip';
import ResultSet from './ResultSet';


// CSS
import 'react-select/dist/react-select.css';

const SqlEditor = React.createClass({
  getInitialState: function() {
    return {
      sql: this.props.queryEditor.sql,
      autorun: this.props.queryEditor.autorun,
      databaseOptions: [],
      databaseLoading: true,
    };
  },
  componentDidMount: function () {
    this.fetchDatabaseOptions();
    if (this.state.autorun) {
      this.setState({ autorun: false });
      this.props.actions.queryEditorSetAutorun(this.props.queryEditor, false);
      this.startQuery();
    }
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
  stopwatch: function () {
    if (this.props.latestQuery) {
      var duration = moment().valueOf() - this.props.latestQuery.startDttm.valueOf();
      duration = moment.utc(duration);
      this.setState({ clockStr: duration.format('HH:mm:ss') });
      this.render();
    }
  },
  startQuery: function () {
    var query = {
      id: shortid.generate(),
      sqlEditorId: this.props.queryEditor.id,
      sql: this.state.sql,
      state: 'running',
      dbId: this.props.queryEditor.dbId,
      startDttm: moment()
    };
    var url = "/caravel/sql_json/"
    var data = {
      sql: this.state.sql,
      database_id: this.props.queryEditor.dbId,
      json: true
    };
    this.props.actions.startQuery(query);
    $.post(url, data, (results) => {
      clearInterval(this.timer);
      this.props.actions.querySuccess(query, results);
      this.render();
    }, "json").fail((x) => {
      clearInterval(this.timer);
      var msg = JSON.parse(x.responseText).msg;
      this.props.actions.queryFailed(query, msg);
    });
    this.timer = setInterval(this.stopwatch, 500);
    this.render();
  },
  stopQuery: function () {
    this.props.actions.stopQuery(this.props.latestQuery);
    clearInterval(this.timer);
  },
  changeDb: function (db) {
    this.props.actions.queryEditorSetDb(this.props.queryEditor, db.value);
    this.render();
  },
  textChange: function (text) {
    this.setState({ sql: text });
  },
  renameTab: function () {
    var newTitle = prompt("Enter a new title for the tab");
    this.props.actions.queryEditorSetTitle(this.props.queryEditor, newTitle);
  },
  addWorkspaceQuery: function () {
    this.props.actions.addWorkspaceQuery({
      id: shortid.generate(),
      sql: this.state.sql,
      title: this.props.queryEditor.title,
    });
  },
  render: function () {
    this.props.callback();
    var body = (<div/>);
    if (this.props.latestQuery) {
      if (this.props.latestQuery.state == 'running') {
        var results = <img className="loading" src="/static/assets/images/loading.gif"/>;
      }
      else if (this.props.latestQuery.state == 'failed') {
        var results = <div className="alert alert-danger">{this.props.latestQuery.msg}</div>;
      }
      else if (this.props.latestQuery.state == 'success') {
        var results = <ResultSet resultset={this.props.latestQuery.results} />
      }
    }
    else {
      var results = <div className="alert alert-info">Run a query to display results here</div>
    }
    body = (
      <div>
        <AceEditor
          mode="sql"
          name={this.props.name}
          theme="chrome"
          minLines={5}
          maxLines={30}
          onChange={this.textChange}
          height="200px"
          width="100%"
          editorProps={{$blockScrolling: true}}
          enableBasicAutocompletion={true}
          value={this.state.sql}/>
        {results}
      </div>
    );
    var runButton = (
      <Button onClick={this.startQuery} disabled={!(this.props.queryEditor.dbId)}>
        <i className="fa fa-play"/> Run
      </Button>
    );
    if (this.props.latestQuery && this.props.latestQuery.state == 'running') {
      runButton = (
      <Button onClick={this.stopQuery}>
        <a className="fa fa-stop"/> Stop
      </Button>);
    }
    var timerSpan = null;
    if (this.props.latestQuery && this.props.latestQuery.state == 'running') {
      timerSpan= (
        <span className="label label-info">
          {this.state.clockStr}
        </span>
      );
    }
    var rightButtons = (
      <ButtonGroup style={{display: 'inline'}}>
        <ButtonWithTooltip
            tooltip="CREATE TABLE AS ...">
          <i className="fa fa-archive"/>
        </ButtonWithTooltip>
        <ButtonWithTooltip
            onClick={this.renameTab}
            tooltip="Rename this tab">
            <i className="fa fa-edit"/>
        </ButtonWithTooltip>
        <ButtonWithTooltip
            tooltip="Save this query in your workspace"
            onClick={this.addWorkspaceQuery}>
          <i className="fa fa-save"/>
        </ButtonWithTooltip>
        <ButtonWithTooltip
          tooltip="Close this tab"
          onClick={this.props.actions.removeQueryEditor.bind(this, this.props.queryEditor)}>
            <i className="fa fa-close"/>
        </ButtonWithTooltip>
      </ButtonGroup>
    );
    return (
      <div className="SqlEditor">
        <div>
          <div>
            <div className="clearfix header">
              <div className="pull-left">
                <ButtonGroup>
                  {runButton}
                </ButtonGroup>
                {timerSpan}
              </div>
              <div className="pull-right">
                {rightButtons}
                <div style={{display: 'inline-block'}}>
                  <Select
                    name="select-db"
                    placeholder="[Database]"
                    options={this.state.databaseOptions}
                    value={this.props.queryEditor.dbId}
                    autosize={false}
                    onChange={this.changeDb}
                  />
                </div>
              </div>
            </div>
          </div>
          {body}
        </div>
      </div>
    )
  }
});

function mapStateToProps(state) {
  return {
    queries: state.queries
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SqlEditor)
