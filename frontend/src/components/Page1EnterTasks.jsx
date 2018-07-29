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
            const tasks = this.state.tasks.map(e => e.uid === uid ? {...e, isRaw: false} : e);
            let uid1 = this.newUid();
            tasks.push({isRaw: true, text: '', uid: uid1});
            setTimeout(() => {
                document.getElementById(uid1).focus();
            }, 100);
            this.setState({tasks})
        }
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
                                <span>Parsed: {t.text}</span>
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