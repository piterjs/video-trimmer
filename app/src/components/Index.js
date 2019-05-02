import React, { useState } from 'react';

const styles = {
  form: {
    width: '400px',
    margin: '40px auto',
    display: 'flex',
    flexDirection: 'column'
  },
  formLabel: {
    marginBottom: '10px'
  }
};

const videoTemplate = {
  preroll: '',
  start: '00:00:00',
  end: '00:00:00',
  title: '',
  description: `PiterJS #
Speaker - Subject
Слайды: https://fs.piterjs.org/events/

https://piterjs.org
https://vk.com/piterjs
https://twitter.com/gopiterjs
`,
  tags: 'piterjs, javascript, meetup'
};

export default () => {
  const [state, setState] = useState({
    loading: false,
    original: '',
    scale: null,
    postroll: 'https://minio.piterjs.org/piterjs/videos/postroll.mp4',
    video: [{ ...videoTemplate }]
  });
  const addVideo = () => {
    setState({ ...state, loading: true });
    const data = { ...state };
    delete data.loading;
    fetch('/api/add', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        console.log(data);
        setState({ ...state, loading: false });
      })
      .catch(err => {
        setState({ ...state, loading: false });
        console.log(err);
      });
  };
  return (
    <div>
      <h2>Add new video</h2>
      <form
        style={styles.form}
        onSubmit={e => {
          e.preventDefault();
          addVideo();
        }}
      >
        <label style={styles.formLabel}>
          Stream:
          <input
            style={{ width: '100%' }}
            value={state.original}
            onChange={e => setState({ ...state, original: e.target.value })}
          />
        </label>
        <label style={styles.formLabel}>
          Scale:
          <select defaultValue={null} onChange={(e) => setState({ ...state, scale: e.target.value })}>
            <option value={null}>No</option>
            <option value="1920:1080">1080P</option>
            <option value="2880:1620">4K</option>
          </select>
        </label>
        <label style={styles.formLabel}>
          Postroll:
          <input
            style={{ width: '100%' }}
            value={state.postroll}
            onChange={e => setState({ ...state, postroll: e.target.value })}
          />
        </label>
        <h3>
          Videos{' '}
          <button
            onClick={() =>
              setState({
                ...state,
                video: [...state.video, { ...videoTemplate }]
              })
            }
            type="button"
          >
            +
          </button>
        </h3>
        {state.video.map((v, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
            <h4>Video #{i + 1}</h4>
            <label style={styles.formLabel}>
              Preroll:
              <input
                style={{ width: '100%' }}
                value={state.video[i].preroll}
                onChange={e =>
                  setState({
                    ...state,
                    video: state.video.map((v, ii) => {
                      if (ii === i) {
                        v.preroll = e.target.value;
                      }
                      return v;
                    })
                  })
                }
              />
            </label>
            <label style={styles.formLabel}>
              Video start:
              <input
                value={state.video[i].start}
                onChange={e =>
                  setState({
                    ...state,
                    video: state.video.map((v, ii) => {
                      if (ii === i) {
                        v.start = e.target.value;
                      }
                      return v;
                    })
                  })
                }
              />
            </label>
            <label style={styles.formLabel}>
              Video end:
              <input
                value={state.video[i].end}
                onChange={e =>
                  setState({
                    ...state,
                    video: state.video.map((v, ii) => {
                      if (ii === i) {
                        v.end = e.target.value;
                      }
                      return v;
                    })
                  })
                }
              />
            </label>

            <label style={styles.formLabel}>
              Title:
              <input
                style={{ width: '100%' }}
                value={state.video[i].title}
                onChange={e =>
                  setState({
                    ...state,
                    video: state.video.map((v, ii) => {
                      if (ii === i) {
                        v.title = e.target.value;
                      }
                      return v;
                    })
                  })
                }
              />
            </label>
            <label style={styles.formLabel}>
              Description:
              <br />
              <textarea
                rows="15"
                style={{ width: '100%' }}
                defaultValue={state.video[i].description}
                onChange={e =>
                  setState({
                    ...state,
                    video: state.video.map((v, ii) => {
                      if (ii === i) {
                        v.description = e.target.value;
                      }
                      return v;
                    })
                  })
                }
              />
            </label>
            <label style={styles.formLabel}>
              Tags:
              <input
                style={{ width: '100%' }}
                value={state.video[i].tags}
                onChange={e =>
                  setState({
                    ...state,
                    video: state.video.map((v, ii) => {
                      if (ii === i) {
                        v.tags = e.target.value;
                      }
                      return v;
                    })
                  })
                }
              />
            </label>
          </div>
        ))}
        {!state.loading && <button>Add</button>}
      </form>
    </div>
  );
};
