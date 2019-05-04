import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const REFRESH_TIME = 5000;

const getData = () =>
  fetch('/api/list', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(resp => {
    return resp.json();
  });

let interval = null;

export default () => {
  const [data, setData] = useState([]);

  const update = () =>
    getData()
      .then(resp => {
        if (resp.data) {
          setData(resp.data);
        }
        window.clearInterval(interval);
        interval = window.setInterval(() => update(), REFRESH_TIME);
      })
      .catch(err => {
        console.log(err);
        window.clearInterval(interval);
        interval = window.setInterval(() => update(), REFRESH_TIME);
      });

  useEffect(() => {
    update();
    return () => {
      window.clearInterval(interval);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2>History</h2>
      <ul
        style={{
          listStyle: 'none',
          paddingLeft: 0
        }}
      >
        {data.map(v => (
          <li
            style={{
              borderBottom: '1px solid #000',
              marginBottom: '5px',
              paddingBottom: '5px'
            }}
            key={v._id}
          >
            <strong>
              <Link to={`/history/${v._id}`}>{v.title}</Link>
            </strong>
            <br />
            <strong>Stream:</strong>{' '}
            <a rel="noopener noreferrer" target="_blank" href={v.original}>
              {v.original}
            </a>
            <br />
            <strong>Created:</strong> {v.created}
            <br />
            <strong>Last updated:</strong> {v.updated}
            <br />
            <strong>last build:</strong>{' '}
            <Link to={`/history/${v._id}/${v.builds[v.builds.length - 1]._id}`}>
              #{v.builds.length}
            </Link>{' '}
            <strong>status:</strong> {v.builds[v.builds.length - 1].status}
            <br />
            <strong>Videos:</strong>
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
