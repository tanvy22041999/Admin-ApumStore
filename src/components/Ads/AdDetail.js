import React, { Component } from 'react';
import * as moment from 'moment'
import {
  CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
} from '@coreui/react';
import { connect } from "react-redux";
import '../Products/product.css'
// @Actions
import AdActions from "../../redux/actions/ad";
// @Functions
import {INITIAL_IMAGE} from '../../constants';

class AdDetail extends Component {
  constructor(props){
    super(props);
    const {ad} = props;
    this.state = {
      id: ad ? ad.id : '',
      name: ad && ad.name ? ad.name : '',
      image: ad ? ad.image: '',
      content: ad && ad.content ? ad.content : '',
      link: ad && ad.link ? ad.link: '',
      startedAt: ad && ad.startedAt ? this.toIsoString(new Date(ad.startedAt)) : "",
      endedAt: ad && ad.endedAt ? this.toIsoString(new Date(ad.endedAt)) : "",
      previewSource: '',
      selectedFile: '',
    }
  }

  toIsoString = (date) => {
    var pad = function(num) {
      var norm = Math.floor(Math.abs(num));
      return (norm < 10 ? '0' : '') + norm;
    };

    return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds())
  }

  onChange = (event) =>{
    var target=event.target;
    var name=target.name;
    var value=target.value;
    this.setState({
      [name]: value
    })
  }

  onSubmit = (e) =>{
    const {id, name, content, link, selectedFile, startedAt, endedAt} = this.state;
    const {onUpdate, onCreate, queryParams} = this.props;
    // e.preventDefault();

    let formatStartAt = moment(new Date(startedAt)).format('yyyy-MM-DD HH:mm:ss')
    let formatEndAt = moment(new Date(endedAt)).format('yyyy-MM-DD HH:mm:ss')
  
    var formData = new FormData();
    formData.append("name",name);
    formData.append("content",content);
    formData.append("link",link);
    formData.append("startedAt",formatStartAt);
    formData.append("endedAt",formatEndAt);
    formData.append("image",selectedFile);
    if (id) {
      onUpdate(id, formData, queryParams);
    }
    else {
      // 4. Create data
      onCreate(formData, queryParams);
    }

  }
  handleFileInputChange = (e) => {
    const file = e.target.files[0];
    // 1. Hi???n th??? ???nh v???a th??m
    this.previewFile(file);
    this.setState({
      selectedFile: file,
    })
  }

  previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({
        previewSource: reader.result
      })
    };
  };

	render() {
    const { name, image, previewSource, content, link,  startedAt, endedAt } = this.state;
    const { large, onClose, ad} = this.props;
    return (
			<CModal show={large} onClose={() => onClose(!large)} size="lg">
				<CModalHeader closeButton>
        <CModalTitle>{ad? "S???a th??ng tin qu???ng c??o" : "Th??m qu???ng c??o m???i"} </CModalTitle>
				</CModalHeader>
				<CModalBody>
        <div className="row">
          <div className="col-12">
            <div className="form-group">
                <label>???nh qu???ng c??o:</label>
                {image ? <div className="form-group img-thumbnail3" style={{"height":"300px"}}>
                {
                  previewSource ? (
                    <img src={previewSource} className="w-100" alt=""/>
                  )
                  : <img src={image.publicUrl || INITIAL_IMAGE} style={{ border: '1px solid', width: '100%' }} alt=""/>
                }
                <div className="file btn btn-lg btn-primary">
                  Change Photo
                  <input type="file" name="image" id="fileInput"
                  onChange={this.handleFileInputChange} style={{width: '100%'}}/>
                </div>
              </div>
              : <div className="form-group img-thumbnail3" style={{"height":"300px"}}>
                {
                  previewSource ? (
                    <img src={previewSource} className="w-100" alt=""/>
                  )
                  : <img src={INITIAL_IMAGE} alt="" style={{ border: '1px solid', width: '100%' }}></img>
                }
                <div className="file btn btn-lg btn-primary">
                  Change Photo
                  <input type="file" name="image" id="fileInput"
                    onChange={this.handleFileInputChange} style={{width: '100%'}}/>
                </div>
              </div>}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="form-group">
              <label>T??n qu???ng c??o:</label>
              <input type="text" className="form-control" name="name" value={name} onChange={this.onChange}/>
            </div>
            <div className="form-group">
              <label>N???i dung qu???ng c??o:</label>
              <input type="text" className="form-control" name="content" value={content} onChange={this.onChange}/>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="form-group">
              <label>Link:</label>
              <input type="text" className="form-control" name="link" value={link} onChange={this.onChange}/>
            </div>
            <div className="form-group">
              <label>Ng??y b???t ?????u:</label>
              <input type="datetime-local" className="form-control" name="startedAt" value={ startedAt} onChange={this.onChange}></input>
            </div>
            <div className="form-group">
              <label>Ng??y k???t th??c</label>
              <input type="datetime-local" className="form-control" name="endedAt" value={ endedAt} onChange={this.onChange}></input>
            </div>
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
    onCreate: (data, params) =>{
      dispatch(AdActions.onCreate(data, params))
    },
    onUpdate: (id, data, params) =>{
      dispatch(AdActions.onUpdate(id, data, params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdDetail);
