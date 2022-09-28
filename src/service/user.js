import { AREA_LIST, FIELDS_SHOW } from "./api";
import http, { cache } from "./http";

export const getAreaList = (params = {}) => {
  return http.get(AREA_LIST, {
    params,
    CACHE_API: true,
  });
};
export const getFieldsShow = (params = {}) => {
  return http.post(FIELDS_SHOW, params, { CACHE_API: true });
};

export default {
  getAreaList,
  getFieldsShow,
};
