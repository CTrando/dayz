import React from 'react';
import { render } from 'react-dom';
import moment from './src/moment-range';
import Dayz from './src/dayz';

require('./demo.scss');

let COUNT = 1;

class DayzTestComponent extends React.Component {

    constructor(props) {
        super(props);
        this.addEvent = this.addEvent.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.editComponent = this.editComponent.bind(this);
        this.changeDisplay = this.changeDisplay.bind(this);
        this.onEventResize = this.onEventResize.bind(this);
        const date = moment('2015-09-11');
        this.state = {
            date,
            display: 'week',
            events: new Dayz.EventsCollection([
                {
                    content: '9am - 2pm (resizable)',
                    resizable: { step: 15 },
                    range: moment.range(moment('2019-02-01')
                            .hour(9),
                        moment('2019-02-01')
                            .hour(14)),
                },
                {
                    content: '10am - 2pm (resizable)',
                    resizable: { step: 15 },
                    range: moment.range(moment('2019-02-01')
                            .hour(10),
                        moment('2019-02-01')
                            .hour(14)),
                },
                {
                    content: '10am - 2pm (resizable)',
                    resizable: { step: 15 },
                    range: moment.range(moment('2019-02-01')
                            .hour(10),
                        moment('2019-02-01')
                            .hour(14)),
                },
                {
                    content: '10am - 2pm (resizable)',
                    resizable: { step: 15 },
                    range: moment.range(moment('2019-02-01')
                            .hour(10),
                        moment('2019-02-01')
                            .hour(14)),
                },
                {
                    content: 'test',
                    range: moment.range(moment('2019-01-28')
                            .hour(8),
                        moment('2019-01-28')
                            .hour(9)),
                },
                {
                    content: 'test2',
                    range: moment.range(moment('2019-01-28')
                            .hour(8),
                        moment('2019-01-28')
                            .hour(9)),
                },

                {
                    content: 'test3',
                    range: moment.range(moment('2019-01-28')
                            .hour(15),
                        moment('2019-01-28')
                            .hour(20)),
                },

                {
                    content: 'test',
                    range: moment.range(moment('2019-01-29')
                            .hour(8),
                        moment('2019-01-29')
                            .hour(9)),
                },
                {
                    content: 'test2',
                    range: moment.range(moment('2019-01-29')
                            .hour(8),
                        moment('2019-01-29')
                            .hour(9)),
                },

                {
                    content: '10am - 2pm (resizable)',
                    resizable: { step: 15 },
                    range: moment.range(moment('2019-02-01')
                            .hour(12),
                        moment('2019-02-01')
                            .hour(16)),
                },
                {
                    content: '8am - 8pm (non-resizable)',
                    range: moment.range(moment('2015-09-07')
                            .hour(8),
                        moment('2015-09-07')
                            .hour(21)
                            .minutes(40)),
                },
            ]),
        };
        this.state.events = new Dayz.EventsCollection([
            {
                content: 'test',
                range: moment.range(moment('2019-02-04')
                        .hour(8),
                    moment('2019-02-04')
                        .hour(9)),
            },
            {
                content: 'test2',
                range: moment.range(moment('2019-02-04')
                        .hour(8),
                    moment('2019-02-04')
                        .hour(9)),
            },
            {
                content: 'test3',
                range: moment.range(moment('2019-02-04')
                        .hour(18),
                    moment('2019-02-04')
                        .hour(19)),
            },

            {
                content: 'test3',
                range: moment.range(moment('2019-02-04')
                        .hour(8),
                    moment('2019-02-04')
                        .hour(9)),
            },

        ]);


    }

    changeDisplay(ev) {
        this.setState({ display: ev.target.value });
    }

    onEventClick(ev, event) {
        event.set({ editing: !event.isEditing() });
    }

    onEventResize(ev, event) {
        const start = event.start.format('hh:mma');
        const end = event.end.format('hh:mma');
        event.set({ content: `${start} - ${end} (resizable)` });
    }

    addEvent(ev, date) {
        this.state.events.add({
            content: `Event ${COUNT++}`,
            resizable: true,
            range: moment.range(date.clone(), date.clone()
                .add(1, 'hour')
                .add(45, 'minutes')),
        });
    }

    editComponent(props) {
        const onBlur = function() {
            props.event.set({ editing: false });
        };
        const onChange = function(ev) {
            props.event.set({ content: ev.target.value });
        };
        const onDelete = function() {
            props.event.remove();
        };
        return (
            <div className="edit">
                <input
                    type="text" autoFocus
                    value={props.event.content}
                    onChange={onChange}
                    onBlur={onBlur}
                />
                <button onClick={onDelete}>X</button>
            </div>
        );
    }

    render() {

        return (
            <div className="dayz-test-wrapper">

                <div className="tools">
                    <label>
                        Month: <input type="radio"
                                      name="style" value="month" onChange={this.changeDisplay}
                                      checked={'month' === this.state.display}/>
                    </label><label>
                    Week: <input type="radio"
                                 name="style" value="week" onChange={this.changeDisplay}
                                 checked={'week' === this.state.display}/>
                </label><label>
                    Day: <input type="radio"
                                name="style" value="day" onChange={this.changeDisplay}
                                checked={'day' === this.state.display}/>
                </label>
                </div>

                <Dayz {...this.state}
                      date={moment()}
                      displayHours={[8, 22]}
                      onEventResize={this.onEventResize}
                      editComponent={this.editComponent}
                      onDayDoubleClick={this.addEvent}
                >
                </Dayz>
            </div>
        );
    }

}


const
    div = document.createElement('div');
document
    .body
    .appendChild(div);

render(React

        .createElement(DayzTestComponent, {})

    ,
    div
)
;
