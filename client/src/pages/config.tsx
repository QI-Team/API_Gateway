import * as React from 'react';
import { Table, Input, Button } from 'antd';

function Config() {
  const [ key, setKey ] = React.useState('');
  const [ value, setValue ] = React.useState('');

  function handleChange(e, field) {
    console.log('filed', field, e.target.value);
    field === 'key' ? setKey(e.target.value) : setValue(e.target.value);
  }
  async function handleSubmit() {
    console.log('value', key, value, `${process.env.FETCH_URI}/`);
    let res = await fetch('http://localhost:8889/record', {
      method: 'POST',
      body: JSON.stringify({
        key,
        value,
      }),
    }).then(res => res.json());

    console.log('res: ', res);
  }

  return <>
    <div className="container">
      <div className="edit">
        <Input type='text' value = {key} onChange={e => handleChange(e, 'key')} /><br />
        <Input type='text' value = {value} onChange={e => handleChange(e, 'value')} /><br />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <div className="data">
        <Table
          dataSource={[]}
        ></Table>
      </div>
    </div>
    <style>
      {`
        .container {
          width: 90%;
          height: auto;
          margin: auto;
        }

        .edit {

        }
      `}
    </style>
  </>
}

export default Config;