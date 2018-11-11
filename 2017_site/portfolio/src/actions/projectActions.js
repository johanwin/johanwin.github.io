import * as types from './actionTypes';
import mockAPI from '../api/mockAPI';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';

export function loadProjectsSuccess(projects) {
    return { type: types.LOAD_PROJECTS_SUCCESS, projects};
}

export function loadProjects() {
    return function(dispatch) {
      dispatch(beginAjaxCall());
      return mockAPI.getAllProjects().then(projects => {
        dispatch(loadProjectsSuccess(projects));
      }).catch(error => {
        dispatch(ajaxCallError(error));
        throw(error);
      });
    };
  }