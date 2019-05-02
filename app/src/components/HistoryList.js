import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const getData = () =>
  fetch('/api/list', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(resp => {
    return resp.json();
  });

export default () => {
  const [data, setData] = useState([]);

  const update = () =>
    getData()
      .then(resp => {
        if (resp.data) {
          setData(resp.data);
        }
      })
      .catch(err => {
        console.log(err);
      });

  useEffect(() => {
    update();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2>
        History{' '}
        <button onClick={() => update()} style={{ fontSize: '18px' }}>
          ♻︎
        </button>
      </h2>
      <ul>
        {data.map(v => (
          <li key={v._id}>
            <Link to={`/history/${v._id}`}>{v.original}</Link> - status:{' '}
            {v.status}, created: {v.created}, updated: {v.updated}
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
