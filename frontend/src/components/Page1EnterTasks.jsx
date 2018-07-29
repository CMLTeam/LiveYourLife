import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Page1EnterTasks extends Component {
    state = {
        tasks: [
            {isRaw: true, text: '', uid: this.newUid()}
        ]
    };

    onTaskTextChange = (event) => {
        const text = event.target.value;
        const uid = event.target.id;
        this.setState({tasks: this.state.tasks.map(e => e.uid === uid ? {...e, text} : e)})
    };

    onTaskKeyPress = (event) => {
        const uid = event.target.id;
        if (event.key === 'Enter') {
            const tasks = this.state.tasks.map(e => e.uid === uid ? this.parseTask(e) : e);
            let uid1 = this.newUid();
            tasks.push({isRaw: true, text: '', uid: uid1});
            setTimeout(() => {
                document.getElementById(uid1).focus();
            }, 100);
            this.setState({tasks})
        }
    };

    parseTask = (task) => {

        const text = task.text;

        // ACTION for DURATION (at|around) TIME
        // ACTION for DURATION
        // ACTION (at|around) TIME
        // ACTION

        let action, duration, time;

        const FOR = /\s+for\s+/i;
        const AT = /\s+at\s+/i;

        if (!FOR.test(text)) {
            action = this.parseAction(text);
        } else {
            let parts = text.split(FOR);
            action = this.parseAction(parts[0]);
            let rest = parts[1];
            if (AT.test(rest)) {
                let parts = text.split(AT);
                duration = this.parseDuration(parts[0]);
                time = this.parseLocation(parts[1])
            } else {
                duration = this.parseDuration(rest);
            }
        }

        return {...task, isRaw: false, action, duration, time};
    };

    parseAction = (v) => {
        // go to dentist
        // visit coffee shop
        return v;
    };

    parseDuration = (v) => {
        return v;
    };

    parseLocation = (v) => {
        return v;
    };

    removeTask = (uid) => {
        this.setState({tasks: this.state.tasks.filter(e => e.uid !== uid)})
    };

    render() {
        return (
            <div>
                Enter Tasks

                <div id={'task-list'}>
                    {this.state.tasks.map((t, index) =>
                        <div key={t.uid} className={'task-item'}>
                            {index + 1}.
                            {t.isRaw ?
                                <input type={'text'}
                                       placeholder={'Enter your task'}
                                       id={t.uid}
                                       value={t.text}
                                       onChange={this.onTaskTextChange}
                                       onKeyPress={this.onTaskKeyPress}
                                />
                                :
                                <div style={{ display: 'inline-block' }}>
                                    <div className={'parsed-element'}>
                                        <span className={'parsed-element-name'}>ACTION</span>
                                        {' '}{t.action}
                                    </div>
                                    <div className={'parsed-element'}>
                                        <span className={'parsed-element-name'}>DURATION</span>
                                        {' '}{t.duration}
                                    </div>
                                    <div className={'parsed-element'}>
                                        <span className={'parsed-element-name'}>TIME</span>
                                        {' '}{t.time}
                                    </div>
                                </div>
                            }
                            <button type={'button'} onClick={this.removeTask.bind(this, t.uid)}>x</button>
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