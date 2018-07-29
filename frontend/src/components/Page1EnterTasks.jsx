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
            this.setState({tasks: this.state.tasks.map(e => e.uid === uid ? {...e, isRaw: false} : e)})
        }
    };

    render() {
        return (
            <div>
                Enter Tasks

                <div id={'task-list'}>
                    {this.state.tasks.map(t =>
                        <div key={t.uid} className={'task-item'}>
                            {t.isRaw ?
                                <input type={'text'}
                                       placeholder={'Enter your task'}
                                       id={t.uid}
                                       value={t.text}
                                       onChange={this.onTaskTextChange}
                                       onKeyPress={this.onTaskKeyPress}
                                />
                                :
                                <spa>Parsed: {t.text}</spa>
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