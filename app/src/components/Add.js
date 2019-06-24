import React, { useState } from 'react';

import Input from './Input';
import Button from './Button';
import Select from './Select';
import { FormGroup, FormLabel } from './Form';

const styles = {
  form: {
    width: '600px',
    margin: '0 auto',
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
    title: '',
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
      <FormGroup
        style={styles.form}
        onSubmit={e => {
          e.preventDefault();
          addVideo();
        }}
      >
        <h1 className="form__line">Slice stream</h1>
        <FormLabel style={styles.formLabel} title="Текстовый ID для использования внутри триммера">
          Stream title:
        </FormLabel>
        <Input
            type="text"
            placeholder="PiterJS N"
            value={state.title}
            className="form__control"
            onChange={e => setState({ ...state, title: e.target.value })}
        />
        <FormLabel style={styles.formLabel}>
          Stream URL:
        </FormLabel>
        <Input
            type="url"
            value={state.original}
            className="form__control"
            onChange={e => setState({ ...state, original: e.target.value })}
        />
        <FormLabel style={styles.formLabel}>
          Upscale:
        </FormLabel>
        <Select defaultValue={null} className="form__control" onChange={(e) => setState({ ...state, scale: e.target.value })}>
          <option value={null}>No</option>
          <option value="1920:1080">1080P (1920:1080)</option>
          <option value="2880:1620">4K (2880:1620)</option>
        </Select>
        <FormLabel style={styles.formLabel}>
          Postroll:
        </FormLabel>
        <Input
            type="url"
            value={state.postroll}
            className="form__control"
            onChange={e => setState({ ...state, postroll: e.target.value })}
        />
        <h3 className="form__line">
          Video parts{' '}
          <Button
            size="small"
            onClick={() =>
              setState({
                ...state,
                video: [...state.video, { ...videoTemplate }]
              })
            }
            type="button"
          >
            +
          </Button>
        </h3>
        {state.video.map((v, i) => (
          <div key={i} className="form__line">
            <FormGroup style={styles.form}>
            <h4 className="form__line">Video #{i + 1}</h4>
            <FormLabel style={styles.formLabel}>
              Preroll:
            </FormLabel>
            <Input
                type="url"
                value={state.video[i].preroll}
                className="form__control"
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
            <FormLabel style={styles.formLabel}>
              Video start:
            </FormLabel>
            <Input
                type="text"
                value={state.video[i].start}
                className="form__control"
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
            <FormLabel style={styles.formLabel}>
              Video end:
            </FormLabel>
            <Input
                type="text"
                value={state.video[i].end}
                className="form__control"
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
            <FormLabel style={styles.formLabel}>
              Video title:
            </FormLabel>
            <Input
                type="text"
                value={state.video[i].title}
                className="form__control"
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
            <FormLabel style={styles.formLabel}>
              Description:
            </FormLabel>
            <Input
                tag="textarea"
                rows="10"
                style={{ width: '100%' }}
                defaultValue={state.video[i].description}
                className="form__control"
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
            <FormLabel style={styles.formLabel}>
              Tags:
            </FormLabel>
            <Input
                type="text"
                value={state.video[i].tags}
                className="form__control"
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
            <Button
                className="form__line"
                onClick={() =>
                    setState({
                      ...state,
                      video: [...state.video, { ...videoTemplate }]
                    })
                }
                type="button"
            >Add part</Button>
            </FormGroup>
          </div>
        ))}
        {!state.loading && <Button
            size="large"
            color="primary"
            className="form__line"
        >Slice stream</Button>}
      </FormGroup>
    </div>
  );
};
