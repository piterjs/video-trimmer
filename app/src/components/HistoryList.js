import React, { useState, useEffect } from 'react';

export default () => {
  const [data, setData] = useState([]);
  const getData = () =>
    fetch('/api/list', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(resp => {
        return resp.json();
      })
      .then(resp => {
        setData(resp.data);
        setTimeout(() => getData(), 5000);
      })
      .catch(err => {
        console.log(err);
      });

  useEffect(getData, []);
  return (
    <div>
      <h2>History</h2>
      <ul>
        {data.map(v => (
          <li key={v._id}>
            {v.original} - status: {v.status}, created: {v.created}, updated:{' '}
            {v.updated}
            <br />
            Videos:
            <ol>
              {v.video.map(v => (
                <li key={v._id}>
                  {v.title} {v.start}/{v.end}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </div>
  );
};
