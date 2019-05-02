import React, { useState, useEffect } from 'react';

const getData = id =>
  fetch(`/api/logs/${id}`, {
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

export default ({
  match: {
    params: { id }
  }
}) => {
  const [data, setData] = useState({});
  const [checked, setChecked] = useState([]);

  const update = () =>
    getData(id)
      .then(d => {
        if (d) {
          d.tags = d.log
            .map(v => v.step)
            .filter((value, index, self) => {
              return self.indexOf(value) === index;
            });
          setData(d);
        }
      })
      .catch(err => {
        console.log(err);
      });

  useEffect(() => {
    update();
    // eslint-disable-next-line
  }, [id]);
  return (
    <div>
      <h2>
        Log for: {data && data.video && data.video.original}{' '}
        <button onClick={() => update()} style={{ fontSize: '18px' }}>
          ♻︎
        </button>
      </h2>
      <ul>
        {data &&
          data.video &&
          data.video.video &&
          data.video.video.map(v => (
            <li key={v._id}>
              {v.title} {v.start}/{v.end}
            </li>
          ))}
      </ul>
      <div style={{ display: 'flex', flexDirection: 'row', padding: 16 }}>
        <div
          style={{
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            marginRight: '10px'
          }}
        >
          {data &&
            data.tags &&
            data.tags.map(v => (
              <label style={{ marginBottom: '10px' }} key={v}>
                <input
                  type="checkbox"
                  checked={checked.includes(v)}
                  onChange={() => {
                    if (checked.includes(v)) {
                      setChecked(checked.filter(vv => !(vv === v)));
                    } else {
                      setChecked([...checked, v]);
                    }
                  }}
                />
                {v}
              </label>
            ))}
        </div>
        <pre
          style={{
            width: 'calc(100% - 210px)',
            display: 'flex',
            flexDirection: 'column',
            marginTop: 0
          }}
        >
          {data &&
            data.log &&
            data.log
              .filter(v => checked.includes(v.step))
              .map((v, i) => (
                <div key={`${v.step}-${i}`} id={`L${i + 1}`}>
                  {i + 1}. {v.time} {v.str}
                </div>
              ))}
        </pre>
      </div>
    </div>
  );
};
