import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const REFRESH_TIME = 5000;

const getData = id =>
  fetch(`/api/video/${id}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(resp => {
      return resp.json();
    })
    .then(resp => {
      return resp.data;
    });

let interval = null;

export default ({
  match: {
    params: { id }
  }
}) => {
  const [data, setData] = useState({});

  const restartTrimming = () =>
    fetch(`/api/video/${id}/restart`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(() => update())
      .catch(console.error);

  const update = () =>
    getData(id)
      .then(d => {
        if (d) {
          setData(d);
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
  }, [id]);
  return (
    <div>
      <h2>{data.title || 'View trimming'}</h2>
      Stream:{' '}
      {data && data.original && (
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={data && data.original}
        >
          {data && data.original}
        </a>
      )}
      <br />
      {data &&
        data.builds &&
        data.builds.filter(v => v.status === 'error').length ===
          data.builds.length && (
          <button onClick={() => restartTrimming()}>Restart trimming</button>
        )}
      <ul>
        {data &&
          data.video &&
          data.video.map(v => (
            <li key={v._id}>
              {v.title} {v.start}/{v.end}
            </li>
          ))}
      </ul>
      <h3>Builds</h3>
      <ul>
        {data &&
          data.builds &&
          data.builds.map((v, i) => (
            <li key={v._id}>
              <Link to={`/history/${id}/${v._id}`}>#{i + 1}</Link> status:{' '}
              {v.status} created: {v.created}, updated: {v.updated}
            </li>
          ))}
      </ul>
    </div>
  );
};
