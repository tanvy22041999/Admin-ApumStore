import React, { Component } from 'react';
import { connect } from "react-redux";
// @Components
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
// @Actions
import OrderActions from "../../redux/actions/order";

class OrderDetail extends Component {
  constructor(props){
    super(props);
    const {order} = props;
    this.state = {
      id: order ? order.id : '',
      totalPrice: order ? order.totalPrice: '',
      createTimeStamp: order ? order.createTimeStamp: '',
      paymentMethod: order ? order.paymentMethod: '',
      status: order ? order.status: '',
      confirmed: order ? order.confirmed: '',
      paid: order ? order.paid: '',
      orderList: order ? order.orderList : [],
      shippingAddress: order ? order.shippingAddress: '',
      shippingPhonenumber: order ? order.shippingPhonenumber: '',
      email: order ? order.email: '',
    }
  }

  onChange = (event) =>{
    var target=event.target;
    var name=target.name;
    var value=target.value;
    this.setState({
        [name]:  value
    })
  }

  onSubmit = () =>{
    const {id, confirmed, status} = this.state;
    const {onUpdate, queryParams} = this.props;
    var data={confirmed, status};
    onUpdate(id, data, queryParams);
  
  }

	render() {
    const {totalPrice, orderList, createTimeStamp, status, paymentMethod, confirmed, paid, shippingPhonenumber, shippingAddress, email} = this.state;
    const { large, onClose, order} = this.props;
    return (
			<CModal show={large} onClose={() => onClose(!large)} size="lg">
				<CModalHeader closeButton>
        <CModalTitle>{order ? "Sửa thông tin sản phẩm" : "Thêm sản phẩm mới"}</CModalTitle>
				</CModalHeader>
				<CModalBody>
					<div className="row">
						<div className="col-12 col-lg-6">
							<form>
                <div className="form-group">
                  <label>Ngày tạo:</label>
                  <input type="text" className="form-control" name="createTimeStamp" value={Date(createTimeStamp)} disabled/>
                </div>
                <div className="form-group">
                  <label>Tổng hóa đơn: (VND)</label>
                  <input type="number" className="form-control" name="totalPrice" value={totalPrice} disabled/>
                </div>
                <div className="form-group">
                  <label>Tình trạng hàng:</label>
                  <select
                    className="form-control"
                    name="status"
                    value={status}
                    onChange={this.onChange}
                    disabled={confirmed ? false : true}
                  >
                    <option value={-2}>Chọn tình trạng</option>
                    <option value={-1}>Chưa giao hàng</option>
                    <option value={0}>Đang giao hàng</option>
                    <option value={1}>Đã giao hàng</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phương thức thanh toán:</label>
                  <div className="row">
                    <div className="col-12">
                      <input type="text" className="form-control" name="paymentMethod" value={ paymentMethod === "local" ? `COD (Tiền mặt)` : 'Paypal'} disabled/>
                    </div>
                  </div>
                </div>
                {paymentMethod==="local"
                ? <>
                <div className="form-group">
                  <label>Tình trạng đơn:</label>
                  <div className="row">
                    <div className="col-9">
                      <input type="text" className="form-control" name="confirmed" value={ confirmed===true ? `Đã xác nhận` : `Chưa xác nhận`} disabled/>
                    </div>
                    {confirmed===false
                    ? <div className="col-3">
                      <button type="button" className="btn btn-success" onClick={() => this.setState({confirmed: true, status: -1})}>Confirm</button>
                    </div>
                    : <div className="col-3">
                      <button type="button" className="btn btn-warning" onClick={() => this.setState({confirmed: false, status: -1})}>Undo</button>
                    </div>}
                  </div>
                </div>
                </>
                : <>
                <div className="form-group">
                  <label>Tình trạng thanh toán:</label>
                  <div className="row">
                    <div className="col-12">
                      <input type="text" className="form-control" name="paid" value={ paid===true ? 'Đã thanh toán' : 'Chưa thanh toán'} disabled/>
                    </div>
                  </div>
                </div>
                </>}
							</form>
						</div>
            <div className="col-12 col-lg-6">
							<form>
                <div className="form-group">
                  <label>Số điện thoại người nhận:</label>
                  <input type="number" className="form-control" name="shippingPhonenumber" value={shippingPhonenumber} disabled/>
                </div>
                <div className="form-group">
                  <label>Địa chỉ người nhận:</label>
                  <input type="text" className="form-control" name="shippingAddress" value={shippingAddress} disabled/>
                </div>
                <div className="form-group">
                  <label>Email người nhận:</label>
                  <input type="email" className="form-control" name="email" value={email} disabled/>
                </div>
								<div className="form-group">
									<label>Chi tiết đơn hàng</label>
                  <div className="form-group">
                  {orderList.map((item, index) =>{
                  return (
                  <div className="card my-1" key={index}>
                    <div className="row no-gutters">
                        <div className="col-sm-3">
                          <img className="card-img" src={item.image ? item.image.publicUrl : "http://www.pha.gov.pk/img/img-02.jpg"} alt={item.name} />
                        </div>
                        <div className="col-sm-5 align-self-center">
                          <p className="text-dark m-0">{item.name}</p>
                        </div>
                        <div className="col-sm-4 align-self-center">
                          <p className="m-0">{item.price} VND x {item.quantity}</p>
                        </div>
                    </div>
                  </div>
                  )
                })
                }
              </div>
								</div>

							</form>
						</div>
					</div>
				</CModalBody>
				<CModalFooter>
					<CButton color="primary" onClick={() => this.onSubmit(!large)}>
						Save
					</CButton>{' '}
					<CButton color="secondary" onClick={() => onClose(!large)}>
						Cancel
					</CButton>
				</CModalFooter>
			</CModal>
		);
	}
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdate: (id, data, params) =>{
      dispatch(OrderActions.onUpdate(id, data, params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
