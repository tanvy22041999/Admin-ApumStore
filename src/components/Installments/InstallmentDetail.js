import React, { Component } from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CImg, CDataTable, CBadge } from '@coreui/react';
import { connect } from "react-redux";
// @Actions
import InstallmentActions from "../../redux/actions/installment";
import UserActions from "../../redux/actions/user";
import ProductsActions from "../../redux/actions/products";
// @Functions
import {INITIAL_IMAGE} from '../../constants';
import installmentData from '../../utils/installment.json'

const fields = ['month', 'due_date', 'payable', 'status']

class InstallmentDetail extends Component {
  constructor(props){
    super(props);
    const { installment, userInfo } = props;
    this.state = {
      id: installment ? installment.id : '',
      startedAt: installment ? (installment.startedAt ? installment.startedAt.slice(0,10) : '') : new Date().toISOString().slice(0, 10),
      endedAt: installment && installment.endedAt ? installment.endedAt.slice(0,10) : '',
      period: installment ? installment.period : '',
      interest_rate: installment ? installment.interest_rate : '',
      prepay: installment ? installment.prepay : 0,
      product: installment ? installment.product : '',
      status: installment ? installment.status : -1,
      staff: installment && installment.staff ? installment.staff : {
        id: userInfo.id,
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        image: userInfo.image
      },
      user: installment ? installment.user : '',
      detail: installment && installment.detail ? installment.detail : [],
      debt: installment ? installment.debt : 0,
      // Search
      keywordUser: '',
      keywordProduct: '',
      selectedColor: 0,
      // Payment
      money: 0,
    }
  }
  onChange = (event) =>{
    var target=event.target;
    var name=target.name;
    var value=target.value;
    const { product, startedAt, period } = this.state;
    if(name === "period"){
      var interest_rate = 0;
      var _startedAt = new Date(startedAt);
      installmentData.installments.map(item => {
        if(value === item.month_sum.toString()) interest_rate = item.percent;
      })
      this.setState({
        interest_rate,
        endedAt: new Date(_startedAt.setMonth(_startedAt.getMonth() + parseInt(value))).toISOString().slice(0, 10)
      })
    }
    if(name === "startedAt"){
      var _startedAt = new Date(value);
      this.setState({
        endedAt: new Date(_startedAt.setMonth(_startedAt.getMonth() + parseInt(period))).toISOString().slice(0, 10)
      })
    }
    if(name === "selectedColor"){
      value = JSON.parse(value);
      this.setState({ product: {
        id: product.id,
        color: {
          id: value.id,
          name_vn: value.name_vn
        },
        product_price: value.price
      } })
    }
    else {
      this.setState({
        [name]: value
      })
    }
  }

  handleFilter = (event) => {
    const { onFilterUser, onFilterProduct } = this.props;
		var target=event.target;
    var name=target.name;
    var value=target.value;
    this.setState({
      [name]:  value
    })
    if(name === "keywordUser") onFilterUser(value);
    else onFilterProduct(value);
	}

  onSubmit = () =>{
    const { id, startedAt, period, interest_rate, prepay, product, status, staff, user, money } = this.state;
    const {onUpdate, onCreate, queryParams} = this.props;
    var data = {
      startedAt,
      period,
      interest_rate,
      prepay,
      product: {
        id: product.id.id,
        color: product.color.id,
        product_price: product.product_price
      },
      status,
      staff: staff.id,
      user: user.id,
      money
    }
    if (id) {
      onUpdate(id, data, queryParams);
    }
    else {
      // 4. Create data
      onCreate(data, queryParams);
    }
  }

  handleChangeComplete = (color) => {
    this.setState({ code: color.hex });
  };

  setStatus = (status) => {
    switch(status){
      case -1:
        return <CBadge color="danger" className="float-right">Q??a h???n</CBadge>
      case 0:
        return <CBadge color="warning" className="float-right">Ch??a t???i h???n</CBadge>
      case 1:
        return <CBadge color="success" className="float-right">Ho??n t???t</CBadge>
      default:
        return <CBadge color="warning" className="float-right">Ch??a t???i h???n</CBadge>
    }
  }

	render() {
    const {
      id, startedAt, endedAt, period, interest_rate, prepay, product, status, staff, user, detail, debt,
      keywordUser, keywordProduct, selectedColor, money
    } = this.state;
    const { large, onClose, installment, listSearchUser, listSearchProduct } = this.props;
    return (
			<CModal show={large} onClose={() => onClose(!large)} size="lg" closeOnBackdrop={false}>
				<CModalHeader closeButton>
        <CModalTitle>{installment ? "S???a th??ng tin phi???u tr??? g??p" : "Th??m phi???u tr??? g??p"}</CModalTitle>
				</CModalHeader>
				<CModalBody>
        <div className="row">
						<div className="col-12 col-lg-6">
              {id && <div className="form-group">
                <label>M?? phi???u:</label>
                <input type="text" className="form-control" name="id" value={id} disabled readOnly/>
              </div>}
              <div className="form-group">
                <label>T??nh tr???ng tr??? g??p:</label>
                <select
                  className="form-control"
                  name="status"
                  value={status}
                  onChange={this.onChange}
                >
                  <option value={-2}>Ch???n t??nh tr???ng</option>
                  <option value={-1}>Ch??a duy???t</option>
                  <option value={0}>Ch??a ho??n t???t</option>
                  <option value={1}>???? ho??n t???t</option>
                </select>
              </div>
              <div className="form-group">
                <label>Kh??ch h??ng:</label>
                {user === "" ? <div className="position-relative">
                  <input className="form-control" name="keywordUser" value={keywordUser} onChange={this.handleFilter}
                  placeholder="T??m kh??ch h??ng (nh???p s??? ??i???n tho???i)"></input>
                  <div className="card mb-0 w-100 position-absolute" style={{ zIndex: 1 }}>
                    {listSearchUser && keywordUser && listSearchUser.map((user, index) =>{
                      return (
                        <div key={index}>
                          <div className="row">
                            <div className="col-12 form-inline" onClick={()=>this.setState({user, keywordUser: ""})}>
                              <div className="c-avatar">
                                <CImg
                                  src={user.image ? user.image.publicUrl : INITIAL_IMAGE}
                                  className="c-avatar-img"
                                  alt={user.id}
                                />
                              </div>
                              <p className="mb-0 ml-3">{user.firstname} {user.lastname}</p>
                            </div>
                          </div>
                          <div className="border-bottom"></div>
                        </div>
                      )
                    })}
                  </div>
                </div> :
                <div className="form-inline rounded border">
                  <div className="c-avatar">
                    <CImg
                      src={user.image ? user.image.publicUrl : INITIAL_IMAGE}
                      className="c-avatar-img"
                      alt={user.id}
                    />
                  </div>
                  <p className="mb-0 ml-3">{user.firstname} {user.lastname}</p>
                  {!id && <div className="ml-auto mr-2">
                    <button type="button" className="close rounded-circle bg-light px-1" onClick={()=>this.setState({user: ""})}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>}
                </div>}
              </div>
              <div className="form-group">
                <label>S???n ph???m tr??? g??p:</label>
                {product ? <div className="rounded border">
                  <div className="row">
                    <div className="col-3">
                      <img className="w-100" src={product.id.bigimage ? product.id.bigimage.publicUrl : INITIAL_IMAGE} alt={product.id.name}></img>
                    </div>
                    <div className="col-8 align-self-center">
                      <p className="font-weight-bold mb-0">{product.id.name}</p>
                      {product.color.name_vn
                      ? <><p className="font-italic mb-0">M??u {product.color.name_vn}</p>
                      <p className="mb-0">{product.product_price} VND</p></>
                      : <select className="form-control" value={selectedColor} name="selectedColor"
                      onChange={this.onChange}>
                        <option value={0}>Ch???n m??u</option>
                        {product.color.map((item, index) => {
                        return (
                        <option key={index} value={JSON.stringify(item)}>{item.name_vn}</option>
                        )
                      })}</select>}
                    </div>
                    {!id && <div className="col-1 align-self-center">
                      <button type="button" className="close rounded-circle bg-light px-1" onClick={()=>this.setState({product: ""})}>
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>}
                  </div>
                </div>
                : <div className="position-relative">
                <input className="form-control" name="keywordProduct" value={keywordProduct} onChange={this.handleFilter} placeholder="T??m s???n ph???m"></input>
                <div className="card mb-0 w-100 position-absolute" style={{ zIndex: 1 }}>
                  {listSearchProduct && keywordProduct && listSearchProduct.map((product, index) =>{
                    return (
                      <div key={index}>
                        <div className="row" onClick={()=>this.setState(
                          {
                            product: {
                              id: {
                                id: product.id,
                                name: product.name,
                                bigimage: product.bigimage
                              },
                              color: product.colors
                            },
                            keywordProduct: ""
                          })
                          }>
                          <div className="col-3">
                            <img className="w-100" src={product.bigimage ? product.bigimage.publicUrl : INITIAL_IMAGE} alt={product.name}></img>
                          </div>
                          <div className="col-9 align-self-center">
                            <p className="font-weight-bold mb-0">{product.name}</p>
                          </div>
                        </div>
                        <div className="border-bottom"></div>
                      </div>
                    )
                  })}
                </div>
              </div>}
              </div>
              <div className="form-group">
                <label>K??? h???n: (th??ng)</label>
                <select
                  className="form-control"
                  name="period"
                  value={period}
                  onChange={this.onChange}
                  disabled={id ? true : false}
                >
                  <option value={0}>Ch???n k??? h???n</option>
                  {installmentData && installmentData.installments.map((item, index) => {
                    return (
                      <option key={index} value={item.month_sum}>{item.month_sum} th??ng</option>
                    )
                  })}
                </select>
              </div>
              <div className="form-group">
                <label>L??i xu???t: (% / n??m)</label>
                <input type="text" className="form-control" name="interest_rate" value={interest_rate} disabled readOnly/>
              </div>
              <div className="form-group">
                <label>Tr??? tr?????c: (VND)</label>
                <input type="text" className="form-control" name="prepay" value={prepay} onChange={this.onChange} disabled={id ? true : false}/>
              </div>
              <div className="form-group">
                <label>Nh??n vi??n:</label>
                <div className="form-inline rounded border">
                  <div className="c-avatar">
                    <CImg
                      src={staff.image ? staff.image.publicUrl : INITIAL_IMAGE}
                      className="c-avatar-img"
                      alt={staff.id}
                    />
                  </div>
                  <p className="mb-0 ml-3">{staff.firstname} {staff.lastname}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="form-group">
                <label>Ng??y l???p phi???u:</label>
                <input type="date" className="form-control" name="startedAt" value={startedAt} onChange={this.onChange}></input>
              </div>
              <div className="form-group">
                <label>Ng??y ????o h???n:</label>
                <input type="date" className="form-control" name="endedAt" value={endedAt} disabled readOnly></input>
              </div>
              <div className="form-group">
                <label>L???ch s??? tr??? g??p:</label>
                {detail && <CDataTable
                items={detail}
                fields={fields}
                striped
                itemsPerPage={5}
                pagination
                scopedSlots = {{
                  'due_date': (item) => (
                  <td>{new Date(item.due_date).toLocaleDateString("vn-VN")}</td>
                  ),
                  'status': (item) => (
                    <td>{this.setStatus(item.status)}</td>
                  )
                }}
              />}
              </div>
              <div className="form-group">
                <label>S??? ti???n c??n n???: (VND)</label>
                <input type="text" className="form-control" name="debt" value={debt} disabled readOnly/>
              </div>
              {id && <div className="form-group">
                <label>Nh???p s??? ti???n kh??ch tr???: (VND)</label>
                <input type="text" className="form-control" name="money" value={money} onChange={this.onChange} disabled={status === -1 ? true : false}/>
              </div>}
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
    userInfo: state.auth.detail,
    listSearchUser: state.user.listSearch,
    listSearchProduct: state.products.listSearch,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFilterUser : (keyword) =>{
      dispatch(UserActions.onFilter(keyword))
    },
    onFilterProduct : (keyword) =>{
      dispatch(ProductsActions.onFilter(keyword))
    },
    onCreate: (data, params) =>{
      dispatch(InstallmentActions.onCreate(data, params))
    },
    onUpdate: (id, data, params) =>{
      dispatch(InstallmentActions.onUpdate(id, data, params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InstallmentDetail);
