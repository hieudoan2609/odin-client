import React, { Component } from 'react';

class OrderBook extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card px-4 py-4">
            <div className="title">My open orders</div>

            <div className="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th />
                    <th scope="col">Price</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Total</th>
                    <th scope="col">Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="icon">
                      <span className="buy" />
                    </td>
                    <td>0.001</td>
                    <td>69</td>
                    <td>6969</td>
                    <td>2017-11-02 11:28:49</td>
                    <td>
                      <span className="action">Cancel</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="icon">
                      <span className="sell" />
                    </td>
                    <td>0.001</td>
                    <td>69</td>
                    <td>6969</td>
                    <td>2017-11-02 11:28:49</td>
                    <td>
                      <span className="action">Cancel</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="icon">
                      <span className="sell" />
                    </td>
                    <td>0.001</td>
                    <td>69</td>
                    <td>6969</td>
                    <td>2017-11-02 11:28:49</td>
                    <td>
                      <span className="action">Cancel</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="icon">
                      <span className="sell" />
                    </td>
                    <td>0.001</td>
                    <td>69</td>
                    <td>6969</td>
                    <td>2017-11-02 11:28:49</td>
                    <td>
                      <span className="action">Cancel</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="icon">
                      <span className="sell" />
                    </td>
                    <td>0.001</td>
                    <td>69</td>
                    <td>6969</td>
                    <td>2017-11-02 11:28:49</td>
                    <td>
                      <span className="action">Cancel</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="icon">
                      <span className="buy" />
                    </td>
                    <td>0.001</td>
                    <td>69</td>
                    <td>6969</td>
                    <td>2017-11-02 11:28:49</td>
                    <td>
                      <span className="action">Cancel</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="icon">
                      <span className="buy" />
                    </td>
                    <td>0.001</td>
                    <td>69</td>
                    <td>6969</td>
                    <td>2017-11-02 11:28:49</td>
                    <td>
                      <span className="action">Cancel</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="icon">
                      <span className="sell" />
                    </td>
                    <td>0.001</td>
                    <td>69</td>
                    <td>6969</td>
                    <td>2017-11-02 11:28:49</td>
                    <td>
                      <span className="action">Cancel</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="icon">
                      <span className="sell" />
                    </td>
                    <td>0.001</td>
                    <td>69</td>
                    <td>6969</td>
                    <td>2017-11-02 11:28:49</td>
                    <td>
                      <span className="action">Cancel</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="icon">
                      <span className="buy" />
                    </td>
                    <td>0.001</td>
                    <td>69</td>
                    <td>6969</td>
                    <td>2017-11-02 11:28:49</td>
                    <td>
                      <span className="action">Cancel</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderBook;
