import { get, } from "lodash";
import { SpecificationActionTypes } from "../actions/specification";
import { toastError, toastSuccess } from "../../utils/toastHelper";

const init = {
  loading: true,
  detail: null,
  processing: false,
};

export default function (state = init, action) {
  switch (action.type) {
    case SpecificationActionTypes.GET_LIST:
    case SpecificationActionTypes.FILTER:
      return {
        ...state,
        loading: true,
      };

    case SpecificationActionTypes.GET_LIST_ERROR:
      return {
        ...state,
        loading: false,
      };
    case SpecificationActionTypes.GET_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        total: get(action, "payload.total"),
        list: get(action, "payload.list", []),
      };
    case SpecificationActionTypes.FILTER_SUCCESS:
      return {
        ...state,
        loading: false,
        listSearch: get(action, "payload", []),
      };
    case SpecificationActionTypes.CLEAR_DETAIL:
      return {
        ...state,
        detail: null,
        loadingDetail: true,
      };
    case SpecificationActionTypes.CLEAR_STATE:
      return {
        ...init,
      };
    case SpecificationActionTypes.GET_DETAIL:
      return {
        ...state,
        loadingDetail: true,
        detail: null,
      };
    case SpecificationActionTypes.GET_DETAIL_SUCCESS:
      return {
        ...state,
        loadingDetail: false,
        detail: action.payload,
      };

    case SpecificationActionTypes.GET_DETAIL_ERROR:
      return {
        ...state,
        loadingDetail: false,
        detail: action.payload,
      };

    case SpecificationActionTypes.CREATE:
    case SpecificationActionTypes.UPDATE:
    case SpecificationActionTypes.DELETE:
      return {
        ...state,
        processing: true,
      };
    case SpecificationActionTypes.CREATE_ERROR:
    case SpecificationActionTypes.UPDATE_ERROR:
    case SpecificationActionTypes.DELETE_ERROR:
      var { message } = action.payload;
      toastError(message);
      return {
        ...state,
        processing: false,
      };
    case SpecificationActionTypes.UPDATE_SUCCESS:
      toastSuccess("C???p nh???t th??nh c??ng");
      return {
        ...state,
        processing: true,
      };
    case SpecificationActionTypes.CREATE_SUCCESS:
      toastSuccess("T???o m???i th??nh c??ng");
      return {
        ...state,
        processing: true,
      };
    case SpecificationActionTypes.DELETE_SUCCESS:
      toastSuccess("X??a th??nh c??ng");
      return {
        ...state,
        processing: false,
      };
    default:
      return state;
  }
}
