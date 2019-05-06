import React from 'react';

import { ReactComponent as ReloadIcon } from '../assets/icons/reload.svg';
import { ReactComponent as FullScreenIcon } from '../assets/icons/fullscreen.svg';
import { ReactComponent as ExitFullScreenIcon } from '../assets/icons/exit_fullscreen.svg';
import { ReactComponent as WaitingIcon } from '../assets/icons/clock.svg';
import { ReactComponent as WIPIcon } from '../assets/icons/wip.svg';
import { ReactComponent as FinishIcon } from '../assets/icons/check.svg';
import { ReactComponent as ErrorIcon } from '../assets/icons/close.svg';

import './viewlog.css';

const REFRESH_TIME = 2000;

const StatusIcon = ({ status }) => {
  if (status === 'waiting') {
    return <WaitingIcon width="24" height="24" />;
  } else if (status === 'in-progress') {
    return <WIPIcon width="24" height="24" />;
  } else if (status === 'error') {
    return <ErrorIcon width="24" height="24" />;
  }
  return <FinishIcon width="24" height="24" />;
};

export default class ViewLog extends React.Component {
  state = {
    build: {},
    steps: null,
    log: {},
    step: 'download-stream',
    live: false,
    fullScreen: false
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
          const log = data.log;
          delete data.log;
          this.setState({
            ...this.state,
            ...data,
            log: { 'download-stream': log }
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getLog() {
    const {
      match: {
        params: { build_id }
      }
    } = this.props;

    const { build, log, step } = this.state;

    let offset = 0;
    if (step in log) {
      offset = log[step].length;
    }

    return fetch(`/api/build/${build_id}/log?offset=${offset}&step=${step}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        const ns = {
          build: { ...build, ...data.build },
          steps: data.steps,
          log: {
            ...log,
            [step]:
              step in log && log[step].length > 0
                ? log[step].concat(data.log)
                : data.log
          }
        };
        this.setState(ns);
      });
  }

  liveUpdate() {
    window.clearInterval(this.interval);
    const { live } = this.state;
    if (!live) {
      this.interval = window.setInterval(() => this.liveUpdate(), REFRESH_TIME);
      return;
    }
    this.getLog()
      .then(() => {
        this.interval = window.setInterval(
          () => this.liveUpdate(),
          REFRESH_TIME
        );
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const {
      build = { video: null },
      steps,
      log,
      step,
      live,
      fullScreen
    } = this.state;
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
          <div className="logbox-left">
            {steps &&
              steps.map(v => (
                <div className="logbox-filter" key={v.name}>
                  <div className="logbox-filter-header">
                    {v.i >= 0 ? video.video[v.i].title : v.name}
                  </div>
                  {v.keys.map(s => (
                    <label
                      key={s.key}
                      onClick={e => {
                        this.setState({ step: s.key }, () => this.getLog());
                      }}
                      className={
                        s.key === step ? 'logbox-filter__selected' : ''
                      }
                    >
                      <StatusIcon status={s.state} /> {s.key}
                    </label>
                  ))}
                </div>
              ))}
          </div>
          <div
            className={[
              'logbox-log',
              fullScreen ? 'logbox-log-fullscreen' : ''
            ].join(' ')}
          >
            <div className="logbox-log-header">
              <div className="logbox-log-header-title">{step}</div>
              <div className="logbox-log-header-actions">
                <button onClick={() => this.getLog()}>
                  <ReloadIcon width="20" height="20" />
                </button>
                <button
                  onClick={() => this.setState({ fullScreen: !fullScreen })}
                >
                  {fullScreen ? (
                    <ExitFullScreenIcon width="20" height="20" />
                  ) : (
                    <FullScreenIcon width="20" height="20" />
                  )}
                </button>
              </div>
            </div>
            <table>
              <tbody>
                {step in log &&
                  log[step].map((v, i) => (
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
