import React from 'react'
import Cookies from 'js-cookie';

import './AddOrderForm.scss'

class AddOrderForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classes: '',
            customers: this.props.customers,
            customer: Object.keys(this.props.customers)[0],
            price: '',
            isFormValid: null
        }
        this.onChangeCustomer = this.onChangeCustomer.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this)
        this.onAddOrder = this.onAddOrder.bind(this);
    }

    onChangeCustomer(e) {
        this.setState({
            customer: e.target.value
        })
    }

    onChangePrice(e) {
        const newValue = e.target.value;
        let validation = null
        if (newValue === parseInt(newValue).toString()) {
            validation = true
        } else {
            validation = false
        }
        this.setState({
            price: e.target.value,
            isFormValid: validation
        })
    }

    async onAddOrder(e) {
        e.preventDefault()
        if (this.state.isFormValid) {
            const csrf = Cookies.get('csrftoken');
            const response = await fetch('api/orders', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "X-CSRFToken": csrf
                },
                body: JSON.stringify({
                    customer: this.state.customer,
                    price: this.state.price
                })
            });
            this.setState({
                price: ''
            })
        }
    }

    render() {

        let priceInputClass = this.state.isFormValid === false ? 'error' : ''

        const selectCustomerBlock = () => {
            return (
                <div className="add-order__input">
                    <label htmlFor="customer-select-add">Choose customer:</label>
                    <select id="customer-select-add"
                        value={this.state.customer}
                        onChange={this.onChangeCustomer}
                        >
                        {Object.keys(this.state.customers).map((id) => {
                            return (
                                <option value={id} key={id}>
                                    {this.state.customers[id].email}
                                </option>
                            )
                        })}
                    </select>
                </div>
            )
        };

        return (
            <form className={this.props.classes + ' add-order card'}>
                <h3>Enter order information:</h3>
                {selectCustomerBlock()}
                <div className="add-order__input">
                    <label htmlFor="input-price">Enter price:</label>
                    <input type="text"
                        id="input-price"
                        placeholder='enter price'
                        className={priceInputClass}
                        value={this.state.price}
                        onChange={this.onChangePrice}
                        />
                </div>
                <button type='submit' className='button primary' onClick={this.onAddOrder}>
                    Add order
                </button>
            </form>
        )
    }
}

export default AddOrderForm;