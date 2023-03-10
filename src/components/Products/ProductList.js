import React, { Component }  from 'react'
import { connect } from "react-redux";
import qs from "query-string";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

// @Components
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CButton,
  CRow,
} from '@coreui/react'
import ProductDetail from './ProductDetail'
import Pagination from "react-js-pagination";

// @Actions
import ProductsActions from "../../redux/actions/products";
import BrandActions from "../../redux/actions/brands";
import CategoryActions from "../../redux/actions/categories";
import SpecificationActions from "../../redux/actions/specification";

// @Function
import getFilterParams from "../../utils/getFilterParams";
import {INITIAL_IMAGE} from '../../constants';
const fields = ['name','image','brand', { key: 'actions', _style: { width: '30%'} }]

class ProductList extends Component {
  constructor(props) {
    super(props);
    const {location} = props;
    const filter = getFilterParams(location.search);
    this.state = {
      large: false,
      keyword: filter.keyword ===null ? "" : filter.keyword,
      min_p: filter.min_p ===null ? "" : filter.min_p,
      max_p: filter.max_p ===null ? "" : filter.max_p,
      active: filter.active ===null ? "" : filter.active,
      queryParams: {},
      filter: {
        limit: 10,
        page: 0,
        active: 1
      },
    }
  }
  UNSAFE_componentWillMount() {
    const { onGetList, onGetListBrand, location, onClearState, onGetListCategory } = this.props;
    const { filter } = this.state;
    onClearState();
    onGetListCategory({limit : 20});
    onGetListBrand({limit : 20});
    const filters = getFilterParams(location.search);
    var params = {
      ...filter,
      ...filters
    };
    this.setState({queryParams: params})
    onGetList(params);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      const filters = getFilterParams(this.props.location.search);
      const { filter } = this.state;
      var params = {
        ...filter,
        ...filters
      };
      this.setState({queryParams: params})
      this.props.onGetList(params);
    }
  }

  handleChangeFilter = (event) => {
    var target=event.target;
    var name=target.name;
    var value=target.value;
    this.handleUpdateFilter({ [name]:  value, page: 0});
  }

  // Change distance price
  distancePrice = (e) => {
    const {min_p, max_p} = this.state;
    this.handleUpdateFilter({ min_p, max_p});
  }

  onChange = (event) =>{
    var target=event.target;
    var name=target.name;
    var value=target.value;
    this.setState({
      [name]:  value
    })
  }

  // Chuy???n router (th??m v??o params)
  handleUpdateFilter = (data) => {
    const {location, history} = this.props;
    const {pathname, search} = location;
    let queryParams = getFilterParams(search);
    queryParams = {
      ...queryParams,
      ...data,
    };
    history.push(`${pathname}?${qs.stringify(queryParams)}`);
  };

  destroyFilter = () => {
    const {location, history} = this.props;
    const {pathname} = location;
    var queryParams = {
      active: 1,
      keyword: "",
      max_p: '',
      min_p: '',
      page: 0,
      sort_n: '',
      sort_p: ''
    }
    history.push(`${pathname}?${qs.stringify(queryParams)}`)
    this.setState({
      keyword: "",
      min_p: "",
      max_p: "",
    })
  }

  handleRedirect = (id, pathname) =>{
    const { history } = this.props;
    history.push(`${pathname}?product=${id}`);
  }

  // ph??n trang
  handlePageChange(pageNumber) {
    this.handleUpdateFilter({ page: pageNumber-1 });
  }

  // Button search
  searchKeyWorld = () => {
    const {keyword} = this.state;
    this.handleUpdateFilter({ keyword, page: 0});
  }

  pressKeyWord = (event) => {
    if(event.key === 'Enter') this.searchKeyWorld();
  }

  setLarge = (large) => {
    this.setState({
      large
    })
  }

  onUpdate = (large, item) =>{
    const { onGetDetail } = this.props;
    this.setState({
      large
    })
    if(item){onGetDetail(item)}
  }

  onClose = (large) =>{
    const { onClearDetail } = this.props;
    this.setState({
      large
    })
    onClearDetail();
  }
  onSubmit = (id, request, active) => {
    confirmAlert({
      title: 'Th??ng b??o',
      message: `B???n c?? th???c s??? mu???n ${request} product n??y?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => {request === "x??a" ? this.onDelete(id) : this.onActivate(id, active)}
        },
        {
          label: 'No'
        }
      ]
    });
  };
  onDelete = (id)=>{
    const {queryParams} = this.state
    const {onDelete} = this.props;
    onDelete(id, queryParams);
  }

  onActivate = (id, active)=>{
    const {queryParams} = this.state
    const {onActivate, onDeactivate} = this.props;
    if(active){
      onDeactivate(id, queryParams);
    }
    else{
      onActivate(id, queryParams)
    }
  }

  render () {
    const { large, keyword, min_p, max_p, queryParams } = this.state;
    const { listProducts, productDetail, listCategories, listBrands, onClearDetail, total, location } = this.props;
    var filter = getFilterParams(location.search);
    return (
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                <h5 className="float-left my-2">Danh s??ch s???n ph???m</h5>
                <div className="input-group mb-3">
                  <input type="text" className="form-control" value={keyword} name="keyword" placeholder="Nh???p t??n s???n ph???m"
                  onChange={this.onChange} onKeyPress={this.pressKeyWord}/>
                  <div className="input-group-append">
                    <button className="btn btn-primary" onClick={() => this.searchKeyWorld()} type="submit">T??m ki???m</button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 col-md-3">
                    <div className="card bg-danger">
                      <div className="p-2">
                        <b className="text-white">S???p x???p theo t??n</b>
                        <select className="form-control mt-2" value={filter.sort_n} name="sort_n" onChange={this.handleChangeFilter}>
                          <option key={-1} value="0">Ch???n ki???u s???p x???p</option>
                          <option value="1">T??n s???n ph???m t??? A - Z</option>
                          <option value="-1">T??n s???n ph???m t??? Z - A</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="card bg-warning">
                      <div className="p-2">
                        <b className="text-white">S???p x???p theo gi??</b>
                        <select className="form-control mt-2" value={filter.sort_p} name="sort_p" onChange={this.handleChangeFilter}>
                          <option key={-1} value="0">Ch???n ki???u s???p x???p</option>
                          <option value="1">G??a t??? th???p t???i cao</option>
                          <option value="-1">G??a t??? cao xu???ng th???p</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="card bg-success">
                      <div className="p-2">
                        <b className="text-white">Duy???t theo kho???ng gi??</b>
                        <div className="row input-group mx-auto mt-2">
                          <input type="number" value={min_p} name="min_p" step={100000} min={0} onChange={this.onChange} placeholder="T???" className="form-control w-40"></input>
                          <input type="number" value={max_p} name="max_p" step={100000} min={100000} onChange={this.onChange} placeholder="?????n" className="form-control w-40"></input>
                          <div className="input-group-append">
                            <button onClick={() => this.distancePrice()} className="btn btn-primary"><i className="fa fa-search"></i></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="card bg-primary">
                      <div className="p-2">
                        <b className="text-white">Duy???t tr???ng th??i k??ch ho???t</b>
                        <select className="form-control mt-2" value={filter.active ? filter.active : this.state.filter.active} name="active" onChange={this.handleChangeFilter}>
                          <option key={-1} value="0">Ch???n ki???u tr???ng th??i</option>
                          <option value="1">Hi???n th??? tr??n trang b??n h??ng</option>
                          <option value="-1">???n tr??n trang b??n h??ng</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <p className="float-left py-1 font-italic">C?? t???t c??? {total} k???t qu??? t??m ki???m</p>
                    <CButton
                      className="ml-2 float-left"
                      onClick={()=> this.destroyFilter()}
                      color="info"
                    > <i className="fa fa-eraser mr-1"></i>
                      X??a t???t c??? b??? l???c
                    </CButton>
                    <CButton
                      onClick={() => this.setLarge(!large)}
                      className="float-right"
                      color="success"
                    > Th??m s???n ph???m
                    </CButton>
                  </div>
                </div>

              </CCardHeader>

              {listBrands && listCategories && <CCardBody>
                <CDataTable
                  items={listProducts}
                  fields={fields}
                  hover
                  striped
                  bordered
                  scopedSlots = {{
                    'image':
                    (item) => (
                      <td>
                        <img src={ item.bigimage ? item.bigimage.publicUrl : INITIAL_IMAGE } style={{height:'10vh'}} alt={item.name} />
                      </td>
                    ),
                    'brand': (item) => (
                      <td><img src={item.brand && item.brand.image ? item.brand.image.publicUrl: INITIAL_IMAGE} style={{height:'10vh'}} alt={item.name}></img></td>
                    ),
                    'actions':
                    (item)=>(
                      <td>
                        <CButton
                          onClick={() => this.handleRedirect(item.id, '/users/review-manage')}
                          className="mr-1 mb-1 mb-xl-0"
                          color="primary"
                        >
                          B??nh lu???n
                        </CButton>
                        <CButton
                          onClick={() => this.onSubmit(item.id, "?????i tr???ng th??i", item.active)}
                          className={item.active ? "mr-1 mb-1 mb-xl-0 bg-purple" : "mr-1 mb-1 mb-xl-0 bg-orange"}
                        >
                          {item.active ? "Deactivate" : "Activate"}
                        </CButton>
                        <CButton
                          onClick={() => this.onUpdate(!large, item.id)}
                          className="mr-1 mb-1 mb-xl-0"
                          color="warning"
                        >
                          S???a
                        </CButton>
                        <CButton
                          onClick={() => this.onSubmit(item.id, "x??a", null)}
                          className="mr-1"
                          color="danger"
                        >
                          X??a
                        </CButton>
                      </td>)
                  }}
                />
                {(productDetail && large) && <ProductDetail large={large} product={productDetail} onClose={this.onClose} queryParams={queryParams}
                listCategories={listCategories} listBrands={listBrands} onClearDetail={onClearDetail}/>}

                {(!productDetail && large) && <ProductDetail large={large} onClose={this.onClose} queryParams={queryParams}
                listCategories={listCategories} listBrands={listBrands} onClearDetail={onClearDetail}/>}
              </CCardBody>}
              <div className="row justify-content-center">
              {total && <Pagination
                  activePage={filter.page ? parseInt(filter.page)+1 : 1}
                  itemsCountPerPage={this.state.filter.limit}
                  totalItemsCount={total}
                  pageRangeDisplayed={2}
                  linkClass="page-link"
                  itemClass="page-item"
                  prevPageText="Previous"
                  nextPageText="Next"
                  hideFirstLastPages={true}
                  onChange={this.handlePageChange.bind(this)}
                />}
              </div>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listProducts: state.products.list,
    productDetail: state.products.detail,
    listBrands: state.brands.list,
    listCategories: state.categories.list,
    total: state.products.total,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGetList: (params) => {
      dispatch(ProductsActions.onGetList(params))
    },
    onGetDetail: (id) => {
      dispatch(ProductsActions.onGetDetail(id))
    },
    onGetListBrand: (params) => {
      dispatch(BrandActions.onGetList(params))
    },
    onActivate: (id, params) => {
      dispatch(ProductsActions.onActivate({id, params}));
    },
    onDeactivate: (id, params) => {
      dispatch(ProductsActions.onDeactivate({id, params}));
    },
    onGetListCategory: (params) => {
      dispatch(CategoryActions.onGetList(params))
    },
    onClearState: () =>{
      dispatch(ProductsActions.onClearState())
    },
    onClearDetail: () =>{
      dispatch(ProductsActions.onClearDetail())
    },
    onDelete: (id, params) =>{
      dispatch(ProductsActions.onDelete({id, params}))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)
