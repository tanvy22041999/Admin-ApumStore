import React, { Component } from "react";
import "./product.css";
import { connect } from "react-redux";
// @Functions
import {INITIAL_IMAGE} from '../../constants';
import changeToSlug from "../../utils/ChangeToSlug";
import { toastError } from "../../utils/toastHelper";
// @ComponentS
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import Images from "./Images";
import Group from "./Group";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// @Actions
import ProductsActions from "../../redux/actions/products";
import ColorActions from "../../redux/actions/color";
import CategoryActions from "../../redux/actions/categories";
import GroupActions from "../../redux/actions/group";

const animatedComponents = makeAnimated();

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    const { product, listCategories, listBrands } = props;
    this.state = {
      // @Product Info
      id: product ? product.id : "",
      name: product ? product.name : "",
      pathseo: product ? product.pathseo : "",
      warrently: product ? product.warrently : "",
      circumstance: product ? product.circumstance : "",
      included: product ? product.included : "",
      category: product ? product.category.id : listCategories[0].id,
      brand: product ? product.brand.id : listBrands[0].id,
      bigimage: product ? product.bigimage : "",
      weight: product ? product.weight : 0,
      height: product ? product.height : 0,
      width: product ? product.width : 0,
      length: product ? product.length : 0,
      image: product ? (product.image ? product.image : []) : [],
      modal: false,
      // @Product Color
      colors: product ? product.colors : [],
      nameColor: "",
      amountColor: 0,
      priceColor: 0,
      realPriceColor: 0,
      colorEditing: "none",
      btnStatus: "Th??m m??u",
      onEditing: false,
      indexColor: -1,
      imageID: 0,
      imageColor: INITIAL_IMAGE,
      previewColorImage: "",
      selectedColorImage: "",
      // @Product Group
      group: product ? product.group : null,
      keyword: "",
      _modal: false,
      // @Product Description
      description: product && product.description ? EditorState.createWithContent(convertFromRaw(JSON.parse(product.description))) : EditorState.createEmpty(),
      // @Product Image
      previewSource: "",
      selectedFile: "",
      // @Product list images
      previewList: [],
      selectedList: [],
      // @Product Specifition
      specifications: product
      ? this.setValue(
          product,
          listCategories[
            listCategories.findIndex((i) => i.id === product.category.id)
          ]
        )
      : this.setValue(product, listCategories[0]),
    };
  }
/* eslint-disable */
  setValue = (product, categoryDetail) => {
    var specifications = [];
    if (product) {
      //Tr?????ng h???p s???a
      if (product.specifications.length !== 0) {
        categoryDetail.specifications.map((item) => {
          specifications.push({
            id: item.id,
            name: item.name,
            value: "",
            selections: item.selections
          });
          product.specifications.map((i) => {
            specifications.map((obj) =>
              obj.id === i.id ? Object.assign(obj, { value: i.value }) : obj
            );
          });
        });
      } else {
        //m???ng specification=[]
        categoryDetail.specifications.map((item) => {
          specifications.push({
            id: item.id,
            name: item.name,
            value: "",
            selections: item.selections
          });
        });
      }
    } else {
      //Tr?????ng h???p th??m
      categoryDetail.specifications.map((item) => {
        specifications.push({
          id: item.id,
          name: item.name,
          value: "",
          selections: item.selections
        });
      });
    }
    return specifications;
  };
/* eslint-disable */
  componentDidMount() {
    const { onGetListColor } = this.props;
    onGetListColor();
  }

  onChange = (event) => {
    var target = event.target;
    var name = target.name;
    var value = target.value;
    this.setState({
      [name]: value,
    });
  };

  deletePhoto = (id) => {
    const { image } = this.state;
    // V??? tr?? trong m???ng c?? image c???n x??a
    var deleteIndex = image.indexOf(image.find((img) => img.id === id));
    // T???o m???ng m???i kh??ng c?? ph???n t??? mu???n x??a
    image.splice(deleteIndex, 1);
    this.setState({
      image,
    });
  };

  deletePreview = (item) => {
    const { previewList, selectedList } = this.state;
    // V??? tr?? trong m???ng c?? image c???n x??a
    var deleteIndex = previewList.indexOf(
      previewList.find((img) => img === item)
    );
    // T???o m???ng m???i kh??ng c?? ph???n t??? mu???n x??a
    previewList.splice(deleteIndex, 1);
    selectedList.splice(deleteIndex, 1);
    this.setState({
      previewList, selectedList
    });
  };

  handleFileInputChange = (e) => {
    var {name} = e.target;
    const file = e.target.files[0];
    // 1. Hi???n th??? ???nh v???a th??m
    this.previewFile(file, name);
    if(name === "previewSource"){
      this.setState({
        selectedFile: file,
      });
    }
  };
  handleListInputChange = (e) => {
    const file = e.target.files[0];
    const { selectedList } = this.state;
    // 1. Hi???n th??? ???nh v???a th??m
    this.previewList(file);
    selectedList.push(file);
    this.setState({
      selectedList,
    });
  };

  // H??m x??? l?? file - set hi???n th??? ???nh m???i th??m v??o state previewSource
  previewFile = (file, name) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({
        [name]: reader.result,
      });
    };
  };
  // H??m x??? l?? file - set hi???n th??? ???nh m???i th??m v??o state previewSource
  previewList = (file) => {
    const reader = new FileReader();
    const { previewList } = this.state;
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      previewList.push(reader.result);
      this.setState({
        previewList,
      });
    };
  };

  onSelect = (event) => {
    var target = event.target;
    var name = target.name;
    var id = target.value;
    const { onGetDetailCategory } = this.props;
    this.setState({
      [name]: id,
    });
    onGetDetailCategory(id);
  };

  onChangeDetail = (event) => {
    var target = event.target;
    var name = target.name;
    var value = target.value;
    this.setState((prevState) => ({
      specifications: prevState.specifications.map((obj) =>
        obj.id === name ? Object.assign(obj, { value }) : obj
      ),
    }));
  };

  onChangeDetailSelect = (value, action) => {
    var _value = []
    value.map(item => {
      _value.push(item.value)
    })
    this.setState((prevState) => ({
      specifications: prevState.specifications.map((obj) =>
        obj.id === action.name ? Object.assign(obj, { value: JSON.stringify(_value) }) : obj
      ),
    }));
    console.log(value, action.name)
  };

  onAddColor = (value) => {
    if (value === "none") {
      this.setState({
        colorEditing: "inline-flex",
        btnStatus: "H???y",
        onEditing: false,
      });
    } else {  //Click button H???y
      this.setState({
        // G??n gi?? tr??? button
        colorEditing: "none",
        btnStatus: "Th??m m??u",
        // G??n gi?? tr??? fields
        nameColor: "",
        amountColor: 0,
        priceColor: 0,
        realPriceColor: 0,
        onEditing: false,
        imageColor: INITIAL_IMAGE,
        // Tr??? preview v??? m???c ?????nh
        previewColorImage: "",
        selectedColor: "",
      });
    }
  };

  onEditColor = (item) => {
    const { colors } = this.state;
    this.setState({
      // G??n gi?? tr??? button
      colorEditing: "inline-flex",
      btnStatus: "H???y",
      // G??n gi?? tr??? fields
      nameColor: item.id,
      amountColor: item.amount ? item.amount : 0,
      priceColor: item.price ? item.price : 0,
      realPriceColor: item.realPrice ? item.realPrice : 0,
      onEditing: true,
      imageID: item.image,
      imageColor: item.imageLink ? item.imageLink :  INITIAL_IMAGE,
      indexColor: colors.indexOf(item),
      // Tr??? preview v??? m???c ?????nh
      previewColorImage: "",
      selectedColor: "",
    });
  };

  onDeleteColor = (item) => {
    const { colors } = this.state;
    colors.splice(colors.indexOf(item), 1);
    this.setState({
      colors,
    });
  };

  onSaveColor() {
    const {nameColor,
      priceColor,
      realPriceColor,
      amountColor,
      onEditing,
      indexColor,
      colors,
      imageID,
      imageColor,
      selectedColorImage,
      previewColorImage
    } = this.state;
    const { listColor } = this.props;
    if(!nameColor){
      toastError("Ch???n m??u tr?????c khi l??u");
    }
    else{
      if (onEditing === false) {
        // TH th??m m??u
        if (colors.find((obj) => obj.id === nameColor)) {
          toastError("M??u n??y ???? t???n t???i");
        } else {
          colors.push({
            id: nameColor,
            nameVn: listColor.find((obj) => obj.id === nameColor).nameVn,
            amount: amountColor,
            price: priceColor,
            realPrice: realPriceColor,
            image: selectedColorImage,
            imageLink: previewColorImage
          });
        }
      } else {
        // TH s???a m??u
        for (let i = 0; i < colors.length; i++) {
          colors[indexColor] = {
            id: nameColor,
            nameVn: listColor.find((obj) => obj.id === nameColor).nameVn,
            amount: amountColor,
            price: priceColor,
            realPrice: realPriceColor,
            image: selectedColorImage ? selectedColorImage : imageID,
            imageLink: previewColorImage ? previewColorImage : imageColor
          };
        }
      }
    }
    this.setState({
      colors,
      // G??n gi?? tr??? button
      colorEditing: "none",
      btnStatus: "Th??m m??u",
      // G??n gi?? tr??? fields
      nameColor: "",
      amountColor: 0,
      priceColor: 0,
      realPriceColor: 0,
      onEditing: false,
      imageColor: INITIAL_IMAGE,
    });
  }

  componentDidUpdate(props) {
    const { product, categoryDetail, listCategories } = this.props;
    if (categoryDetail !== props.categoryDetail && categoryDetail) {
      // categoryDetail thay doi
      if (product && categoryDetail.id === product.category.id) {
        // truong hop sua
        if (product.specifications.length > 0) {
          this.setState({
            specifications: this.setValue(
              product,
              listCategories[
                listCategories.findIndex((i) => i.id === product.category.id)
              ]
            ),
          });
        } else {
          this.setState({
            specifications: this.setValue(product, categoryDetail),
          });
        }
      } else {
        // truong hop them moi
        this.setState({
          specifications: this.setValue(product, categoryDetail),
        });
      }
    }
  }

  onSubmitImage = async () => {
    const { selectedFile, selectedList, id } = this.state;
    // @Condition cloudinary l?? FormData()
    // @X??? l?? ???nh tr?????c khi l??u
    // N???u c?? import thumbnail m???i th??
    if (selectedFile && selectedList.length !== 0) {
      var formData1 = new FormData();
      formData1.append("image", selectedFile);
      await this.setState({
        bigimage: formData1,
      });
      var formData2 = new FormData();
      for (var i = 0; i < selectedList.length; i++) {
        formData2.append("image", selectedList[i]);
      }
      this.onCallback(id, formData2);
    } else if (selectedFile) {
      // 1. L??u cloudinary
      /* eslint-disable */
      var formData1 = new FormData();
      formData1.append("image", selectedFile);
      await this.setState({
        bigimage: formData1,
      });
      /* eslint-disable */
      this.onCallback(id);
    } else if (selectedList.length !== 0) {
      // 1. L??u cloudinary
      // eslint-disable-next-line
      var formData2 = new FormData();
      for (i = 0; i < selectedList.length; i++) {
        formData2.append("image", selectedList[i]);
      }
      this.onCallback(id, formData2);
    } else {
      this.onCallback(id, null);
    }
  };

  onCallback = (id, formData) => {
    const { onCreate, onUpdateImage, queryParams } = this.props;
    const {
      name,
      price,
      amount,
      warrently,
      circumstance,
      included,
      category,
      brand,
      bigimage,
      weight,
      height,
      width,
      length,
      image,
      pathseo,
      specifications,
      colors,
      description,
      group
    } = this.state;
    if (id) {
      // eslint-disable-next-line
      var data = {
        name,
        price,
        amount,
        warrently,
        circumstance,
        included,
        category,
        brand,
        bigimage,
        weight,
        height,
        width,
        length,
        image,
        pathseo,
        specifications,
        colors,
        group: group && group.id ? group.id : group,
        description: JSON.stringify(
          convertToRaw(description.getCurrentContent())
        ),
        desc_text: description.getCurrentContent().getPlainText('\u0001')
      };
      onUpdateImage(id, data, formData, queryParams);
    } else {
      // 4. Create data
      // eslint-disable-next-line
      var data = {
        name,
        price,
        amount,
        warrently,
        circumstance,
        included,
        category,
        brand,
        bigimage,
        weight,
        height,
        width,
        length,
        pathseo,
        image,
        specifications,
        colors,
        group: group && group.id ? group.id : group,
        description: JSON.stringify(
          convertToRaw(description.getCurrentContent())
        ),
        desc_text: description.getCurrentContent().getPlainText('\u0001')
      };
      onCreate(data, formData, queryParams);
    }
  };

  onCloseModal = (name, value) =>{
    this.setState({
      [name] : value
    })
  }

  onEditGroup = () =>{
    const {onGetDetailGroup} = this.props;
    const {group} = this.state;
    onGetDetailGroup(group.id)
    this.onCloseModal("_modal", true)
  }

  setImage = (item) =>{
    this.setState({
      previewColorImage: item.publicUrl,
      selectedColorImage: item.id,
      modal: false
    })
  }

  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.imgur.com/3/image');
        xhr.setRequestHeader('Authorization', 'Client-ID 034eb58605b7a76');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }

  handleFilter = (event) => {
    const { keyword } = this.state;
    const { onFilter } = this.props;
		var target=event.target;
    var name=target.name;
    var value=target.value;
    this.setState({
      [name]:  value
    })
    onFilter(keyword);
	}

  setSelections = (selections) => {
    const custom = selections.map(({
      name: label,
      id: value,
      ...rest
    }) => ({
      label,
      value,
      ...rest
    }));
    return custom;
  }

  setSelector = (selection, value) => {
    const _value = JSON.parse(value)
    var selector = []
    for(let i=0; i<selection.length; i++){
      for(let j=0; j<_value.length; j++){
        if(selection[i].id===_value[j]){
          selector.push({
            label: selection[i].name,
            value: selection[i].id
          })
        }
      }
    }
    return selector
  }

  render() {
    const {
      name,
      pathseo,
      warrently,
      circumstance,
      included,
      category,
      brand,
      bigimage,
      weight,
      height,
      width,
      length,
      image,
      modal,
      previewSource,
      previewList,
      specifications,
      colors,
      nameColor,
      priceColor,
      realPriceColor,
      amountColor,
      colorEditing,
      btnStatus,
      imageColor,
      previewColorImage,
      group,
      _modal,
      keyword,
      description
    } = this.state;
    const {
      large,
      onClose,
      listCategories,
      listBrands,
      listColor,
      product,
      listSearch,
      groupDetail
    } = this.props;
    return (
      <CModal show={large} onClose={() => onClose(!large)} size="xl" closeOnBackdrop={false}>
        <CModalHeader closeButton>
          <CModalTitle>
            {product ? "S???a th??ng tin s???n ph???m" : "Th??m s???n ph???m m???i"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="row">
                <div className="col-12 col-lg-6" style={{"height": "570px", "overflow": "scroll"}}>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>T??n s???n ph???m:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={name}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Slug:</label>
                    {name ? (
                      <input
                        type="text"
                        className="form-control"
                        name="pathseo"
                        value={pathseo ? pathseo : changeToSlug(name)}
                        onChange={this.onChange}
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="pathseo"
                        value={pathseo}
                        onChange={this.onChange}
                      />
                    )}
                  </div>
                </div>
                <div className="col-6">
                {bigimage ? (
                <div className="form-group img-thumbnail3">
                  {previewSource ? (
                    <img src={previewSource} className="border rounded w-100" alt="" />
                  ) : (
                    <img
                      src={bigimage.publicUrl}
                      className="border rounded w-100"
                      alt=""
                    />
                  )}
                  <div className="file btn btn-lg btn-primary">
                    Change Photo
                    <input
                      type="file"
                      name="previewSource"
                      onChange={this.handleFileInputChange}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="form-group img-thumbnail3">
                  {previewSource ? (
                    <img src={previewSource} className="border rounded w-100" alt="" />
                  ) : (
                    <img
                      src={INITIAL_IMAGE}
                      alt=""
                      className="border rounded w-100"
                    ></img>
                  )}
                  <div className="file btn btn-lg btn-primary">
                    Change Photo
                    <input
                      type="file"
                      name="previewSource"
                      onChange={this.handleFileInputChange}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              )}
              </div>
              </div>
              <div className="form-group">
                <label>B???o h??nh:</label>
                <textarea
                  type="text" rows="3"
                  className="form-control"
                  name="warrently"
                  value={warrently}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label>T??nh tr???ng:</label>
                <input
                  type="text"
                  className="form-control"
                  name="circumstance"
                  value={circumstance}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label>H???p bao g???m:</label>
                <input
                  type="text"
                  className="form-control"
                  name="included"
                  value={included}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label>Lo???i s???n ph???m:</label>
                <select
                  className="form-control"
                  required="required"
                  name="category"
                  value={category}
                  onChange={this.onSelect}
                >
                  {listCategories.map((category, index) => {
                    return (
                      <option key={index} value={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group">
                <label>T??n th????ng hi???u:</label>
                <select
                  className="form-control"
                  required="required"
                  name="brand"
                  value={brand}
                  onChange={this.onChange}
                >
                  {listBrands.map((brand, index) => {
                    return (
                      <option key={index} value={brand.id}>
                        {brand.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group">
                <label>Nh??m s???n ph???m li??n quan:</label>
                <div className="float-right">
                  <button type="button" className="btn btn-primary" onClick={()=> this.onCloseModal("_modal", true)}>Th??m nh??m</button>
                </div>
              </div>
              <div className="form-group">
                <div className="position-relative">
                  <input className="form-control" name="keyword" value={keyword} onChange={this.handleFilter} placeholder="T??m nh??m c?? s???n"></input>
                  <div className="card mb-0 w-100 position-absolute" style={{ zIndex: 1}}>
                    {listSearch && keyword && listSearch.map((group, index) =>{
                      return (
                        <div key={index}>
                          <div className="row">
                            <div className="col-12" onClick={()=>this.setState({group, keyword: ""})}>
                              <p className="my-1 mx-2">{group.name}</p>
                            </div>
                          </div>
                          <div className="border-bottom"></div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {group && <div className="input-group">
                  <input
                    disabled
                    type="string"
                    className="form-control"
                    name="group"
                    value={group.name}
                    onChange={this.onChange}
                  />
                  <div className="input-group-append" style={{zIndex:0}}>
                    <button className="btn btn-warning" type="button" onClick={this.onEditGroup}>S???a</button>
                  </div>
                </div>}
              </div>
            </div>
                <div className="col-12 col-lg-6">
                  <div className="row">
                    <div className="col-12">
                      <label className="float-left">Danh s??ch m??u:</label>
                      <div className="float-right">
                        <button
                          className="btn btn-success mr-2"
                          style={{ display: colorEditing }}
                          onClick={() => this.onSaveColor()}
                          type="button"
                        >
                          L??u
                        </button>
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => this.onAddColor(colorEditing)}
                        >
                          {btnStatus}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    className="row"
                    style={{ display: colorEditing }}
                  >
                    <div className="col-5">
                      <div className="img-thumbnail2">
                        {previewColorImage
                          ? <img src={previewColorImage}
                            className="border rounded w-100"
                            alt=""></img>
                          : <img
                            src={imageColor}
                            className="border rounded w-100"
                            alt=""
                          ></img>
                        }
                        <div className="btn btn-lg btn-primary img-des">
                          Choose Photo
                          <input
                            type="button"
                            name="previewColorImage"
                            className="w-100 h-100"
                            onClick={() => this.onCloseModal("modal", true)}
                          />
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text">S??? l?????ng</span>
                        </div>
                        <input
                          className="form-control"
                          placeholder="Nh???p s??? l?????ng"
                          type="number"
                          name="amountColor"
                          value={amountColor}
                          onChange={this.onChange}
                          min="0"
                        ></input>
                      </div>

                    </div>
                    <div className="col-7">
                      <select
                        className="form-control my-1"
                        required="required"
                        name="nameColor"
                        value={nameColor}
                        onChange={this.onChange}
                      >
                        <option value={-1}>Ch???n m??u</option>
                        {listColor && listColor.map((color, index) => {
                          return (
                            <option key={index} value={color.id}>
                              {color.nameVn}
                            </option>
                          );
                        })}
                      </select>
                      <label>Gi?? ???? gi???m:</label>
                      <div className="input-group mb-0">
                        <input
                          className="form-control"
                          placeholder="Nh???p gi?? s???n ph???m"
                          type="number"
                          name="priceColor"
                          value={priceColor}
                          onChange={this.onChange}
                          min="0"
                        ></input>
                        <div className="input-group-append">
                          <span className="input-group-text">VND</span>
                        </div>
                      </div>
                      <label>Gi?? ch??a gi???m:</label>
                      <div className="input-group mb-0">
                        <input
                          className="form-control"
                          placeholder="Nh???p gi?? s???n ph???m"
                          type="number"
                          name="realPriceColor"
                          value={realPriceColor}
                          onChange={this.onChange}
                          min="0"
                        ></input>
                        <div className="input-group-append">
                          <span className="input-group-text">VND</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {colors.map((item, index) => {
                    return (
                      <div className="row" key={index}>
                        <div className="col-3">
                          <img
                            src={item.imageLink ? item.imageLink: INITIAL_IMAGE}
                            alt={item.nameVn}
                            className="border rounded w-100"
                          />
                        </div>
                        <div className="col-5">
                          <p className="font-weight-bold my-0">
                            {item.nameVn}
                          </p>
                          <p className="font-italic my-0">
                            {item.price} VND
                          </p>
                          <p className="my-0">
                            S??? l?????ng {item.amount}
                          </p>
                        </div>
                        <div className="col-4">
                          <button
                            className="btn btn-warning d-inline-block float-right m-1"
                            type="button"
                            onClick={() => this.onEditColor(item)}
                          >
                            <i className="fa fa-highlighter"></i>
                          </button>
                          <button
                            className="btn btn-danger d-inline-block float-right m-1"
                            type="button"
                            onClick={() => this.onDeleteColor(item)}
                          >
                            <i className="fa fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                    <div className="form-group mt-1">
                      <div className="row">
                        {image &&
                          image.map((item, index) => {
                            return (
                              <div className="col-3" key={index}>
                                <div className=" img-thumbnail2">
                                  <img
                                    src={item.publicUrl}
                                    className="border rounded w-100"
                                    alt=""
                                  ></img>
                                  <div className="btn btn-lg btn-primary img-des">
                                    Delete Photo
                                    <input
                                      type="button"
                                      name="image"
                                      className="w-100 h-100"
                                      onClick={() => this.deletePhoto(item.id)}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        {previewList[0] && (
                          <>
                            {previewList.map((item, index) => {
                              return (
                                <div className="col-3" key={index}>
                                  <div className="img-thumbnail2">
                                    <img src={item} alt="" className="border rounded w-100" />
                                    <div className="btn btn-lg btn-primary img-des">
                                      Delete Photo
                                      <input
                                        type="button"
                                        name="image"
                                        className="w-100 h-100"
                                        onClick={() => this.deletePreview(item)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        )}
                        <div className="col-3">
                          <div className=" img-thumbnail2">
                            <img
                              src={INITIAL_IMAGE}
                              alt=""
                              className="border rounded w-100"
                            ></img>
                            <div className="btn btn-lg btn-primary img-des">
                              Add Photo
                              <input
                                type="file"
                                onChange={this.handleListInputChange}
                                className="w-100 h-100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  <div className="card text-white mb-3">
                    <div className="card-header bg-primary">
                      Th??ng tin v???n chuy???n
                    </div>
                    <div className="card-body text-dark">
                      <div className="row">
                        <div className="col-6">
                          <div className="form-group">
                            <label>Kh???i l?????ng: (gram)</label>
                            <input
                              type="number"
                              className="form-control"
                              name="weight"
                              value={weight}
                              onChange={this.onChange}
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label>Chi???u cao: (cm)</label>
                            <input
                              type="number"
                              className="form-control"
                              name="height"
                              value={height}
                              onChange={this.onChange}
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label>Chi???u r???ng: (cm)</label>
                            <input
                              type="number"
                              className="form-control"
                              name="width"
                              value={width}
                              onChange={this.onChange}
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label>Chi???u d??i: (cm)</label>
                            <input
                              type="number"
                              className="form-control"
                              name="length"
                              value={length}
                              onChange={this.onChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
              <Editor
                editorState={description}
                wrapperClassName="desc-wrapper"
                editorClassName="desc-editor"
                onEditorStateChange={(description) => this.setState({description})}
                toolbar={{
                  image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
              />
            </div>
              </div>
            </div>

            <div className="col-12 col-lg-4" >
              <div className="card text-white mb-3">
                <div className="card-header bg-primary">
                  Chi ti???t s???n ph???m
                </div>
                <div className="card-body text-dark" style={{"height": "1060px", "overflow": "scroll"}}>
                  {specifications.map((item, index) => {
                    return (
                      <div className="form-group" key={index} className="my-1">
                        <label key={index + 1} className="my-0">
                          {item.name}
                        </label>
                        {item.selections.length > 0 ?
                        <Select
                          options={this.setSelections(item.selections)}
                          value = {item.value ? this.setSelector(item.selections, item.value) : []}
                          onChange={this.onChangeDetailSelect}
                          name={item.id}
                          isMulti
                          components={animatedComponents}
                        />
                        : <input
                          key={item.id}
                          type="text"
                          className="form-control"
                          name={item.id}
                          defaultValue={item.value}
                          onChange={this.onChangeDetail}
                        />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
          {modal && image && <Images modal={modal} onCloseModal={this.onCloseModal} image={image} setImage={this.setImage}/>}
          {_modal && groupDetail && <Group modal={_modal} onCloseModal={this.onCloseModal} group={groupDetail}/>}
          {_modal && !groupDetail && <Group modal={_modal} onCloseModal={this.onCloseModal}/>}
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => this.onSubmitImage(!large)}>
            L??u
          </CButton>{" "}
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
    productDetail: state.products.detail,
    listColor: state.color.list,
    categoryDetail: state.categories.detail,
    listSearch: state.group.listSearch,
    groupDetail: state.group.detail
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreate: (data, formData, params) => {
      dispatch(ProductsActions.onCreate({ data, formData, params }));
    },
    onUpdateImage: (id, data, formData, params) => {
      dispatch(ProductsActions.onUpdateImage({ id, data, formData, params }));
    },
    onGetListColor: () => {
      dispatch(ColorActions.onGetList());
    },
    onGetDetailCategory: (id) => {
      dispatch(CategoryActions.onGetDetail(id))
    },
    onFilter : (keyword) =>{
      dispatch(GroupActions.onFilter(keyword))
    },
    onGetDetailGroup: (id) => {
      dispatch(GroupActions.onGetDetail(id))
    },

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
