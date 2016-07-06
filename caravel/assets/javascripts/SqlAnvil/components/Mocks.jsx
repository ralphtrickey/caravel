import React from 'react';
import { BootstrapTable } from 'react-bootstrap-table';


const ResultSet = React.createClass({
  render: function () {
    return (
      <BootstrapTable
        condensed={true}
        data={[
            {id: 1, 'State': 'New York', 'Description': 'this is some text', 'Tag': 'new'},
            {id: 2, 'State': 'New Mexico', 'Description': 'lorem ipsum', 'Tag': 'old'},
            {id: 3, 'State': 'Colorado',
             'Description': 'new description that shouldn\'t match filter',
             'Tag': 'old'},
            {id: 4, 'State': 'Alaska', 'Description': 'bacon', 'Tag': 'renewed'},
            {id: 5, 'State': 'New York', 'Description': 'this is some text', 'Tag': 'new'},
            {id: 6, 'State': 'New Mexico', 'Description': 'lorem ipsum', 'Tag': 'old'},
            {id: 7, 'State': 'Colorado',
             'Description': 'new description that shouldn\'t match filter',
             'Tag': 'old'},
            {id: 8, 'State': 'Alaska', 'Description': 'bacon', 'Tag': 'renewed'},
        ]}>
        <TableHeaderColumn dataField="id" isKey={true}>id</TableHeaderColumn>
        <TableHeaderColumn dataField="State">State</TableHeaderColumn>
        <TableHeaderColumn dataField="Description">Description</TableHeaderColumn>
        <TableHeaderColumn dataField="Tag">Tag</TableHeaderColumn>
      </BootstrapTable>
    )
  }
});

export { ResultSet } 
