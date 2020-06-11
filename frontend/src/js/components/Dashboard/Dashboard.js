import React from 'react'
import {connect} from 'react-redux'

import {logOut} from '../../store/actions'

import {Base64} from 'js-base64';
import Cookies from 'js-cookie';

import AddOrderForm from '../AddOrderForm/AddOrderForm';

import './Dashboard.scss'

const mapStateToProps = (state) => ({
    login: state.login,
    password: state.password
})

const mapDispatchToProps = (dispatch) => ({
    logOut: () => dispatch(logOut())
})

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            customers: {},
            orders: {},
            loaded: false,
            orderPerPage: 5,
            currentPage: 1,
            currentCustomer: null,
            csrf: '',
            addOrderFormVisible: false,
            addFormHeight: 0,
            contentWasInitiallyTranslated: false
        }
        this.onNextHandler = this.onNextHandler.bind(this);
        this.onPrevHandler = this.onPrevHandler.bind(this);
        this.onChangeCurrentCustomer = this.onChangeCurrentCustomer.bind(this);
        this.onDeleteOrder = this.onDeleteOrder.bind(this);
        this.onAddOrderHandler = this.onAddOrderHandler.bind(this);
        this.onLogOut = this.onLogOut.bind(this);
    }

    async componentDidMount() {
        const authString = `${this.props.login}:${this.props.password}`;
        const authStringBase64 = Base64.encode(authString);
        const responce = await fetch('api/orders', {
            headers: {
                'Authorization': `Basic ${authStringBase64}`
            }
        });
        const data = await responce.json();
        if (responce.status === 200) {
            this.setState({
                ...this.state,
                orders: data,
            })
        }
        const customersResponce = await fetch('api/customers', {
            headers: {
                'Authorization': `Basic ${authStringBase64}`
            }
        });
        const customersData = await customersResponce.json();
        const csrf = Cookies.get('csrftoken');
        if (customersResponce.status == 200) {
            this.setState({
                customers: customersData,
                currentCustomer: customersData[Object.keys(customersData)[0]].email,
                loaded: true,
                csrf,
            })
        }
        const addOrderForm = document.querySelector('.dashboard__order-form');
        if (addOrderForm) {
            this.setState({
                addFormHeight: addOrderForm.clientHeight
            })
        }
    }

    onNextHandler() {
        const pages = Math.ceil(Object.keys(this.state.orders).filter((id) => {
            return this.state.orders[id].customer === this.state.currentCustomer;
        }).length / this.state.orderPerPage);

        if (this.state.currentPage < pages) {
            this.setState({
                currentPage: this.state.currentPage += 1
            })
        }
    }

    onPrevHandler() {
        if (this.state.currentPage > 1) {
            this.setState({
                currentPage: this.state.currentPage -= 1
            })
        }
    }

    onChangeCurrentCustomer(e) {
        this.setState({
            currentCustomer: e.target.value
        })
    }

    onAddOrderHandler() {
        this.setState({
            addOrderFormVisible: !this.state.addOrderFormVisible,
            contentWasInitiallyTranslated: true
        })
    }

    async onDeleteOrder(id) {
        const response = await fetch('/api/orders', {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                "X-CSRFToken": this.state.csrf
            },
            body: JSON.stringify({
                id
            })
        })
        if (response.status === 204) {
            const orders = {...this.state.orders}
            delete orders[id]
            this.setState({
                orders
            })
        } else {
            console.log('some error occured')
        }
    }

    async onLogOut() {
        const response = await fetch('api/log_out');
        if (response.status === 200) {
            this.props.logOut()
            sessionStorage.setItem('is_authorized', 'false')
        } else {
            console.log('error');
        }
    }

    renderOrder(order) {
        return (
            <div className="order card" key={order.id}>
                <p>order id: {order.id}</p>
                <p>date: {order.date}</p>
                <p>price: {order.price}</p>
                <p>customer: {order.customer}</p>
                <button onClick={() => {this.onDeleteOrder(order.id)}} type='button' className='button error'>Delete order</button>
            </div>
        )
    }

    render() {
        const contentStyle = {
            transform: (this.state.addOrderFormVisible)
                ? 'translateY(0)'
                : `translateY(-${this.state.addFormHeight + 30}px)`,
            transition: this.state.contentWasInitiallyTranslated
                ? 'all 0.5s ease-in'
                : 'none'
        }
        const loader = (
            <h1>Loading...</h1>
        )
        const orders = () => {
            const start = (this.state.currentPage - 1) * this.state.orderPerPage;
            const end = start + this.state.orderPerPage;
            console.log(start, end)
            const shownOrders = Object.keys(this.state.orders).filter((id) => {
                return this.state.orders[id].customer === this.state.currentCustomer;
            }).slice(start, end)
            return (
                <div className="dashboard__orders">
                    {shownOrders.map((id) => {
                        return this.renderOrder(this.state.orders[id])
                    })}
                </div>
            )
        };

        const selectCustomerBlock = () => {
            return (
                <div className="dashboard__select-customer">
                    <label htmlFor="customer-select-show">Choose customer:</label>
                    <select id="customer-select-show"
                        value={this.state.currentCustomer}
                        onChange={this.onChangeCurrentCustomer}
                        >
                        {Object.keys(this.state.customers).map((id) => {
                            return (
                                <option value={this.state.customers[id].email} key={id}>
                                    {this.state.customers[id].email}
                                </option>
                            )
                        })}
                    </select>
                </div>
            )
        };

        const contentToLoad = () => {
            return (
                <div style={contentStyle} className='dashboard__content'>
                    <AddOrderForm classes='dashboard__order-form' customers={this.state.customers}></AddOrderForm>
                    {selectCustomerBlock()}
                    {orders()}
                    <div className="dashboard__pagination">
                        <button className='button primary' onClick={this.onPrevHandler} type='button'>
                            Назад
                        </button>
                        <p>{
                            `page ${this.state.currentPage} of ${
                                Math.ceil(Object.keys(this.state.orders).filter((id) => {
                                    return this.state.orders[id].customer === this.state.currentCustomer;
                                }).length / this.state.orderPerPage)
                            }`
                            }</p>
                        <button className='button primary' onClick={this.onNextHandler} type='button'>
                            Вперед
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <div className='dashboard'>
                <div className="dashboard__controls">
                    <button onClick={this.onLogOut} type='button' className='button dark'>log out</button>
                    <button onClick={this.onAddOrderHandler} type='button' className='button primary'>
                        {this.state.addOrderFormVisible ? 'cancel' : 'add order'}
                    </button>
                </div>
                {this.state.loaded ? contentToLoad() : loader}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)