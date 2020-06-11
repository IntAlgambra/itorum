import React from 'react';

import './Guest.scss'

export default class Guest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: {},
            loaded: false,
            selectedWeek: null
        }
        this.renderSelectOptions = this.renderSelectOptions.bind(this)
        this.renderOrdersList = this.renderOrdersList.bind(this);
        this.onSelectWeek = this.onSelectWeek.bind(this)
    }

    onSelectWeek(e) {
        console.log(e)
        this.setState({
            selectedWeek: e.target.value,
        })
    }

    renderSelectOptions() {
        return (
            Object.keys(this.state.orders).map((item) => {
                return (
                    <option value={item} key={item}>{item}</option>
                )
            })
        )
    }

    renderOrdersList() {
        const days = this.state.orders[this.state.selectedWeek]
        console.log('debug:')
        console.log(this.state.orders)
        console.log(this.state.selectedWeek)
        console.log(days)
        return (
            Object.keys(days).map((day) => {
                const date = day;
                const customers = days[day].reduce((acc, value) => {
                    return acc + `${value.customer}; `
                }, '');
                const price = days[day].reduce((acc, value) => {
                    return acc + value.price
                }, 0)
                return (
                    <li className='guest__orders-row card' key={day}>
                        <p className="guest__date">{date}</p>
                        <p className='guest__customers'>{customers}</p>
                        <p className="guest__price">{price}</p>
                    </li>
                )
            })
        )
    }

    async componentDidMount() {
        const response = await fetch('/api/orders_info');
        if (response.status === 200) {
            const orders = await response.json();
            const selectedWeek = Object.keys(orders)[0]
            this.setState({
                orders,
                loaded: true,
                selectedWeek
            })
            console.log(this.state)
        } else {
            console.log('error')
        }
    }


    render() {

        const loader = () => {(
            <h1>Loading...</h1>
        )}

        return (
            <div className="guest">
                <div className="guest__container">
                    <div className="guest__week-select">
                        <label htmlFor="guest-week-select">Select week</label>
                        <select value={this.state.selectedWeek} onChange={this.onSelectWeek} id="guest-week-select">
                            {this.renderSelectOptions()}
                        </select>
                    </div>
                    <ul className="guest__orders-list">
                        <li className='guest__orders-row card'>
                            <p className="guest__date">Date</p>
                            <p className='guest__customers'>Customers</p>
                            <p className="guest__price">Price</p>
                        </li>
                        {this.state.loaded ? this.renderOrdersList() : loader()}
                    </ul>
                </div>
            </div>
        )
    }
}