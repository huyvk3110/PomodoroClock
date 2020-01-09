import "./index.css";
import React from "react";
import ReactDOM from "react-dom";

const TIME_STATE = {
    BREAK: 'break',
    SESSION: 'session',
}

const TIME_STATUS = {
    PLAY: 'PLAY',
    PAUSE: 'PAUSE',
    WAIT: 'WAIT',
}

const DEFAULT = {
    breakTime: 5,
    sessionTime: 25,
    count: 25 * 60 * 1000,
    state: TIME_STATE.SESSION,
    status: TIME_STATUS.PAUSE
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = DEFAULT;

        this.onClickDecreaseBreak = this.onClickDecreaseBreak.bind(this);
        this.onClickIncreaseBreak = this.onClickIncreaseBreak.bind(this);
        this.onClickDecreaseSession = this.onClickDecreaseSession.bind(this);
        this.onClickIncreaseSession = this.onClickIncreaseSession.bind(this);
        this.onClickPlay = this.onClickPlay.bind(this);
        this.onClickReset = this.onClickReset.bind(this);
    }

    componentDidMount() {
        setInterval(() => {
            if (!this || !this.state) return;
            if (this.state.status === TIME_STATUS.PLAY) {
                //Play sound
                if (this.state.count - 1000 < 0) {
                    const beep = document.getElementById('beep');
                    beep.play();
                    beep.onended = () => {
                        this.setState(state => ({
                            state: state.state === TIME_STATE.BREAK ? TIME_STATE.SESSION : TIME_STATE.BREAK,
                            count: state[`${state.state === TIME_STATE.BREAK ? TIME_STATE.SESSION : TIME_STATE.BREAK}Time`] * 60 * 1000,
                            status: TIME_STATUS.PLAY
                        }))
                    };
                }
                //Set state
                this.setState(state => ({
                    count: state.count - 1000 >= 0 ? state.count - 1000 : 0,
                    status: state.count - 1000 >= 0 ? TIME_STATUS.PLAY : TIME_STATUS.WAIT
                }))
            }
        }, 1000);
    }

    onClickDecreaseBreak() {
        this.setState(state => ({
            breakTime: state.breakTime - 1 > 0 ? state.breakTime - 1 : state.breakTime,
            status: TIME_STATUS.PAUSE
        }))
    }

    onClickIncreaseBreak() {
        this.setState(state => ({
            breakTime: state.breakTime + 1 <= 60 ? state.breakTime + 1 : state.breakTime,
            status: TIME_STATUS.PAUSE
        }))
    }

    onClickDecreaseSession() {
        const sessionTime = this.state.sessionTime - 1 > 0 ? this.state.sessionTime - 1 : this.state.sessionTime;
        this.setState({
            sessionTime,
            count: sessionTime * 60 * 1000,
            status: TIME_STATUS.PAUSE
        })
    }

    onClickIncreaseSession() {
        const sessionTime = this.state.sessionTime + 1 <= 60 ? this.state.sessionTime + 1 : this.state.sessionTime;
        this.setState({
            sessionTime,
            count: sessionTime * 60 * 1000,
            status: TIME_STATUS.PAUSE
        })
    }

    onClickPlay() {
        if (this.state.status === TIME_STATUS.WAIT) return;
        this.setState(state => ({
            status: state.status === TIME_STATUS.PLAY ? TIME_STATUS.PAUSE : TIME_STATUS.PLAY,
        }))
    }

    onClickReset() {
        if (this.state.status === TIME_STATUS.WAIT) return;
        this.setState(DEFAULT);
    }

    render() {
        const { breakTime, sessionTime, state, count, status } = this.state;

        function pad(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }

        console.log(this.state);

        return (
            <div id="clock">
                <p id="title">Pomodoro Clock</p>
                <div id="lay-control">
                    <span id="lay-break" className="card">
                        <div id="break-label" className="card-title">Break Length</div>
                        <div className="control card-content">
                            <button className="btn" id="break-decrement" onClick={this.onClickDecreaseBreak}><i className="fa fa-arrow-down fa-2x"></i></button>
                            <p>{breakTime}</p>
                            <button className="btn" id="break-increment" onClick={this.onClickIncreaseBreak}><i className="fa fa-arrow-up fa-2x"></i></button>
                        </div>
                    </span>
                    <span id="lay-session" className="card">
                        <div id="session-label" className="card-title">Session Length</div>
                        <div className="control card-content">
                            <button className="btn" id="session-decrement" onClick={this.onClickDecreaseSession}><i className="fa fa-arrow-down fa-2x"></i></button>
                            <p>{sessionTime}</p>
                            <button className="btn" id="session-increment" onClick={this.onClickIncreaseSession}><i className="fa fa-arrow-up fa-2x"></i></button>
                        </div>
                    </span>
                </div>
                <div id="lay-time" className="card">
                    <p id="timer-label" className="card-title">{state === TIME_STATE.BREAK ? 'BREAK' : 'SESSION'}</p>
                    <div className="card-content">
                        <p id="time" style={{ color: Math.floor((count / 1000) / 60) < 1 ? 'red' : 'white' }}>{`${pad(Math.floor(((count / 1000) / 60)), 2)}:${pad(((count / 1000) % 60), 2)}`}</p>
                    </div>
                </div>
                <div id="lay-button">
                    <button className="btn" id="start_stop" onClick={this.onClickPlay}><i className={`fa ${status === TIME_STATUS.PAUSE ? 'fa-play' : 'fa-pause'} fa-2x`}></i></button>
                    <button className="btn" id="reset" onClick={this.onClickReset}><i className="fa fa-refresh fa-2x"></i></button>
                </div>
                <audio id="beep" preload="auto" src="https://goo.gl/65cBl1"></audio>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));