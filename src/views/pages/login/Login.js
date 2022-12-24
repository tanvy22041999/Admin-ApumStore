import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { connect } from "react-redux";
import { compose } from "redux";
// @Actions
import AuthorizationActions from '../../../redux/actions/auth'


class Login extends Component {
  constructor(props) {
		super(props);
		this.state = {
			phonenumber: '',
			password: '',
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

  onLogin = () =>{
		const { phonenumber, password} = this.state;
		const {onLogin} = this.props;
		const data = {phonenumber, password};
		if(data){
			onLogin(data);
		}
  }

  UNSAFE_componentWillReceiveProps(props){
		const {loggedIn,history} = props;
		if(loggedIn && loggedIn===true){
			history.push('/');
		}
	}

  render(){
    const {phonenumber, password} = this.state;
    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="8">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>Login</h1>
                      <p className="text-muted">Đăng nhập vào tài khoản quản trị của bạn</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" placeholder="số điện thoại" name="phonenumber" value={phonenumber} onChange={this.onChange} />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="password" placeholder="mật khẩu" name="password" value={password} onChange={this.onChange} />
                      </CInputGroup>
                      <CRow>
                        <CCol xs="6">
                          <CButton type="button" color="primary" className="px-4" onClick={()=> this.onLogin()}>Đăng nhập</CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>Đăng nhập</h2>
                      <p>Trang để quản trị</p>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
		loggedIn: state.auth.loggedIn
  };
};

const mapDispatchToProps =(dispatch)=> {
	return {
		onLogin : (data) =>{
			dispatch(AuthorizationActions.onLogin(data))
		},
	}
};

const withConnect = connect(mapStateToProps, mapDispatchToProps)
export default compose(
  withConnect,
  withRouter
)(Login)
