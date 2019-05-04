import React from 'react';

import './viewlog.css';

const REFRESH_TIME = 2000;

export default class ViewLog extends React.Component {
  state = {
    data: { build: null, steps: null, log: null },
    step: 'all',
    live: false
  };

  interval = null;

  componentDidMount() {
    this.getData();
    this.interval = window.setInterval(() => this.liveUpdate(), REFRESH_TIME);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  getData() {
    const {
      match: {
        params: { build_id }
      }
    } = this.props;
    fetch(`/api/build/${build_id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        if (data) {
          this.setState({ ...this.state, ...data });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getLastLog() {
    const {
      match: {
        params: { build_id }
      }
    } = this.props;

    const { log } = this.state;

    return fetch(`/api/build/${build_id}/log?offset=${log.length}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(resp => {
      return resp.json();
    });
  }

  liveUpdate() {
    window.clearInterval(this.interval);
    const { build, steps, log, live } = this.state;
    if (!live) {
      this.interval = window.setInterval(() => this.liveUpdate(), REFRESH_TIME);
      return;
    }
    this.getLastLog()
      .then(data => {
        const newSt = [...steps, ...data.steps].filter(
          (v, i, self) => self.indexOf(v) === i
        );
        this.setState(
          {
            build: { ...build, ...data.build },
            steps: newSt.length > steps.length ? newSt : steps,
            log: data.log.length > 0 ? log.concat(data.log) : log
          },
          () => {
            this.interval = window.setInterval(
              () => this.liveUpdate(),
              REFRESH_TIME
            );
          }
        );
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const { build = { video: null }, steps, log, step, live } = this.state;
    const { video } = build;
    return (
      <div>
        <h2 style={{ marginBottom: 5 }}>Build: {build && build._id}</h2>
        <strong>Status:</strong> {build && build.status}
        <br />
        <strong>Stream:</strong>{' '}
        {video && (
          <a rel="noopener noreferrer" target="_blank" href={video.original}>
            {video.original}
          </a>
        )}
        <br />
        <strong>Videos:</strong>
        <ul>
          {video &&
            video.video &&
            video.video.map(v => (
              <li key={v._id}>
                {v.title} {v.start}/{v.end}
              </li>
            ))}
        </ul>
        <label>
          <strong>Live update</strong>{' '}
          <input
            type="checkbox"
            onChange={() => this.setState({ live: !live })}
          />
        </label>
        <h4>Log:</h4>
        <div className="logbox">
          <div className="logbox-filter">
            <label>
              <input
                type="radio"
                name="filter"
                value="all"
                checked={step === 'all'}
                onChange={e => this.setState({ step: e.target.value })}
              />
              all
            </label>
            {steps &&
              steps.map(v => (
                <label key={v}>
                  <input
                    type="radio"
                    name="filter"
                    value={v}
                    onChange={e => this.setState({ step: e.target.value })}
                  />
                  {v}
                </label>
              ))}
          </div>
          <div className="logbox-log">
            <table>
              <tbody>
                {log &&
                  log
                    .filter(v => step === 'all' || v.step === step)
                    .map((v, i) => (
                      <tr key={`${v.step}-${i}`}>
                        <td className="pos">{i + 1}</td>
                        <td className="text">{v.str}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
