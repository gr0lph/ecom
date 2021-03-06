import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { QuantityContext } from '../QuantityContext';

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      artist: '',
      album: '',
      year: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePlus = this.handlePlus.bind(this);
    this.handleMinus = this.handleMinus.bind(this);
  }

  componentDidMount() {
    const { params } = this.props;
    this.getSpecificProduct(params.productId);
  }

  async getSpecificProduct(id) {
    try {
      const response = await fetch(`/api/products/${id}`);
      const product = await response.json();
      this.setState({
        product
      }, () => this.getInfo());
    } catch (error) {
      console.error(error.message);
    }
  }

  getInfo() {
    const { product } = this.state;
    this.setState({
      artist: product.name?.split(':')[0],
      album: product.name?.split(':')[1].split('(')[0],
      year: product.name?.split(':')[1].split('(')[1].slice(0, 4)
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handlePlus() {
    this.setState(prev => {
      return {
        quantity: parseInt(prev.quantity + 1)
      };
    });
  }

  handleMinus() {
    this.setState(prev => {
      return {
        quantity: parseInt(prev.quantity - 1)
      };
    });
  }

  render() {
    const { product } = this.state;
    // eslint-disable-next-line no-console
    console.log('Quantity:', quantity);
    const { addToCart, params, cart } = this.props;
    const cartItems = cart.map(cartItem => {
      return (
        <tr key={cartItem.cartItemId}>
          <td><small>{quantity}</small></td>
          <td><small>{cartItem.name}</small></td>
          <td><small>{(cartItem.price / 100).toFixed(2)}</small></td>
          <td><small>{cartItem.quantity * (cartItem.price / 100).toFixed(2)}</small></td>
        </tr>
      );
    });
    // eslint-disable-next-line no-console
    console.log('Cart:', cart);
    if (!product) {
      return <div><strong>Loading...</strong></div>;
    } else if (product) {
      return (
        <React.Fragment>
          <div className="container-fluid px-4">
            <div className="row">
              <Link to="/" className="text-muted">
                <h5 className="back-button mt-4 ml-4" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <i className="fas fa-chevron-left mr-2 py-1"></i>
                  Back to catalog
                </h5>
              </Link>
            </div>
            <div className="row gy-4">
              <main className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 main-detail">
                <h1 className="my-2 ml-4">{this.state.artist}:</h1>
                <h2 className="my-2 ml-4"><em>{this.state.album}</em> ({this.state.year})</h2>
                <h3 className="text-secondary my-4 ml-4">${(product.price / 100).toFixed(2)}</h3>
                <h6 className="mx-4 my-2"><strong>Verdict: </strong>&quot;{product.shortDescription}.&quot;</h6>
                <p className="ml-4 text-justify">{product.longDescription}</p>
              </main>
              <section className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 section-detail pb-2">
                <div className="my-3 ml-4">
                  <img src={product.image} alt={product.name} className="img-fluid" />
                </div>
                <button
                  type="button"
                  name="minus"
                  className="ml-4"
                  onClick={this.handleMinus}>
                    &minus;
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  type="button"
                  name="plus"
                  onClick={this.handlePlus}>
                    +
                </button>
                <button
                  className="btn btn-primary ml-4"
                  type="submit"
                  name="add"
                  onClick={() => {
                    // eslint-disable-next-line no-console
                    console.log('Quantity:', quantity);
                    addToCart({ productId: params.productId, quantity });
                  }}>
                    Add To Cart
                </button>
              </section>
              <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                <aside>
                  <div className="my-2 text-center"><strong><u>Cart Summary</u></strong></div>
                  {cart.length === 0
                    ? <p className="text-center"><em>Your cart is currently empty.</em></p>
                    : <table id="summary-table">
                        <thead>
                          <tr>
                            <td><small><strong><u>Qty.</u></strong></small></td>
                            <td><small><strong><u>Item</u></strong></small></td>
                            <td><small><strong><u>Price</u></strong></small></td>
                            <td><small><strong><u>Cost</u></strong></small></td>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td rowSpan="2"><small><strong>Sub-Total:</strong></small></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>}
                </aside>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default ProductDetails;
