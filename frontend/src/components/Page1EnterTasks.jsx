import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class Page1EnterTasks extends Component {
    state = {
        tasks: []
    };

    newTask = () => {
        return {isRaw: true, text: '', uid: this.newUid()};
    };

    componentDidMount() {
        this.restoreTasks();
    }

    onTaskTextChange = (event) => {
        const text = event.target.value;
        const uid = event.target.id;
        this.setState({tasks: this.state.tasks.map(e => e.uid === uid ? {...e, text} : e)})
    };

    onTaskKeyPress = (event) => {
        const uid = event.target.id;
        if (event.key === 'Enter') {
            const tasks = this.state.tasks.map(e => e.uid === uid ? this.parseTask(e) : e);
            if (tasks.filter(t => t.valid === false).length === 0) {
                let t = this.newTask();
                tasks.push(t);
                setTimeout(() => {
                    document.getElementById(t.uid).focus();
                }, 100);
            }
            this.setState({tasks});
            this.rememberTasks(tasks);
        }
    };

    changeDurationValue = (uid, event) => {
        const value = event.target.value | 0;
        let tasks = this.state.tasks.map(e => e.uid === uid ? {...e, duration: {...e.duration, value}} : e);
        this.setState({tasks});
        this.rememberTasks(tasks);
    };

    changeDurationUnit = (uid, event) => {
        const unit = event.target.value;
        let tasks = this.state.tasks.map(e => e.uid === uid ? {...e, duration: {...e.duration, unit}} : e);
        this.setState({tasks});
        this.rememberTasks(tasks);
    };

    changeTimeHour = (uid, event) => {
        const hour = event.target.value | 0;
        let tasks = this.state.tasks.map(e => e.uid === uid ? {...e, time: {...e.time, hour}} : e);
        this.setState({tasks});
        this.rememberTasks(tasks);
    };

    changeTimeAmpm = (uid, event) => {
        const ampm = event.target.value;
        let tasks = this.state.tasks.map(e => e.uid === uid ? {...e, time: {...e.time, ampm}} : e);
        this.setState({tasks});
        this.rememberTasks(tasks);
    };

    rememberTasks = (tasks) => {
        tasks = tasks.filter(t => !t.isRaw);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    restoreTasks = () => {
        let tasksStr = localStorage.getItem('tasks');
        let tasks = [];
        if (tasksStr) {
            tasks = JSON.parse(tasksStr);
        }
        tasks.push(this.newTask());
        this.setState({tasks});
    };

    parseTask = (task) => {

        const text = task.text;

        // ACTION for DURATION (at|around) TIME
        // ACTION for DURATION
        // ACTION (at|around) TIME
        // ACTION

        let location, action, duration, time;

        const FOR = /\s+for\s+/i;
        const AT = /\s+at\s+/i;

        if (FOR.test(text)) {
            let parts = text.split(FOR);
            action = this.parseAction(parts[0]);
            let rest = parts[1];
            if (AT.test(rest)) {
                let parts = text.split(AT);
                duration = this.parseDuration(parts[0]);
                time = this.parseTime(parts[1])
            } else {
                duration = this.parseDuration(rest);
                time = this.parseTime();
            }
        } else if (AT.test(text)) {
            let parts = text.split(AT);
            action = this.parseAction(parts[0]);
            duration = this.parseDuration();
            time = this.parseTime(parts[1]);
        } else {
            action = this.parseAction(text);
            duration = this.parseDuration();
            time = this.parseTime();
        }

        location = this.parseLocation(action);

        if (!location)
            return {...task, valid: false};

        return {...task, valid: true, isRaw: false, action, location, duration, time};
    };

    parseAction = (v) => {
        // go to dentist
        // visit coffee shop
        return v;
    };

    parseLocation = (v) => {
        return v.replace(/^go to\s+/i, '')
            .replace(/^visit\s+/i, '');
    };

    parseDuration = (v) => {
        if (!v)
            return {value: 1, unit: 'hr'};

        v = v.trim();

        let match;

        if (match = /(\d+)\s*(hr?|hours?)/i.exec(v))
            return {value: match[1], unit: 'hr'};

        if (match = /(\d+)\s*(min|m|minutes?)/i.exec(v))
            return {value: match[1], unit: 'min'};

        return {value: 0, unit: '?'};
    };

    parseTime = (v) => {
        if (!v)
            return {hour: -1};

        v = v.trim();

        let match;

        if (/morning/i.exec(v))
            return {hour: 9, ampm: 'am'};

        if (/evening/i.exec(v))
            return {hour: 6, ampm: 'pm'};

        if (match = /(\d+)\s*(am|pm)/i.exec(v))
            return {hour: match[1], ampm: match[2]};

        return {hour: 0};
    };

    removeTask = (uid) => {
        let tasks = this.state.tasks.filter(e => e.uid !== uid);
        this.setState({tasks});
        this.rememberTasks(tasks);
    };

    render() {
        return (
            <div>
                <h2>Today's activities</h2>

                <div className={'task-list'}>
                    {this.state.tasks.map((t, index) =>
                        <div key={t.uid} className={'task-item'}>
                            {index + 1}.
                            {t.isRaw ?
                                <input type={'text'}
                                       className={t.valid === false ? 'invalid' : ''}
                                       placeholder={'Enter your task'}
                                       id={t.uid}
                                       value={t.text}
                                       onChange={this.onTaskTextChange}
                                       onKeyPress={this.onTaskKeyPress}
                                />
                                :
                                <div style={{display: 'inline-block'}}>
                                    <div className={'parsed-element'}>
                                        <span className={'parsed-element-name'}>LOCATION</span>
                                        {' '}<b>{t.location[0].toUpperCase() + t.location.substring(1)}</b>
                                    </div>
                                    <div className={'parsed-element'}>
                                        <span className={'parsed-element-name'}>DURATION</span>
                                        {' '}
                                        {/*<input type={'text'}
                                               style={{width: 30}}
                                               value={t.duration.value}
                                               onChange={this.changeDurationValue.bind(this, t.uid)}/>
                                        <select value={t.duration.unit}
                                                onChange={this.changeDurationUnit.bind(this, t.uid)}>
                                            <option value={'hr'}>hour(s)</option>
                                            <option value={'min'}>minute(s)</option>
                                        </select>*/}
                                        <b>{t.duration.value} {t.duration.unit}</b>
                                    </div>
                                    <div className={'parsed-element'}>
                                        <span className={'parsed-element-name'}>TIME</span>
                                        {' '}
                                        {/*<select value={t.time.hour}
                                                onChange={this.changeTimeHour.bind(this, t.uid)}>
                                            <option value={-1}>ANY</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                            <option value={6}>6</option>
                                            <option value={7}>7</option>
                                            <option value={8}>8</option>
                                            <option value={9}>9</option>
                                            <option value={10}>10</option>
                                            <option value={11}>11</option>
                                            <option value={12}>12</option>
                                        </select>
                                        {t.time.hour > 0
                                        &&
                                        <select value={t.time.ampm}
                                                onChange={this.changeTimeAmpm.bind(this, t.uid)}>
                                            <option value={'am'}>AM</option>
                                            <option value={'pm'}>PM</option>
                                        </select>
                                        }*/}
                                        <b>
                                            {t.time.hour === -1 ? 'ANY' : t.time.hour}
                                            {' '}
                                            {t.time.hour > 0 && t.time.ampm.toUpperCase()}
                                        </b>
                                    </div>
                                </div>
                            }
                            {
                                !t.isRaw &&
                                <FontAwesomeIcon icon={"trash-alt"}
                                                 style={{cursor: 'pointer', marginLeft: 20, color: '#aaa'}}
                                                 onClick={this.removeTask.bind(this, t.uid)}/>
                            }
                        </div>)
                    }
                </div>


                <br/>
                <Link to={'/page2'}>Next</Link>
            </div>
        );
    }

    newUid() {
        const uuid = () => {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };
        return '' + new Date().getTime() + '-' + uuid().replace(/-/g, '');
    }
}

export default Page1EnterTasks;