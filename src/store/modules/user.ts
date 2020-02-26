import router from "../../router";
import { SET_LOGIN, SET_LOGOUT, LOCAL_TOKEN } from "../constTypes";

const state = {
  isLogin: false, // 登陆状态
  name: "", // 真名
  role: -1, // 角色
  department: "", // 所属部门
  isGlobal: false, //部门是否属于global
  phone: "", // 电话
  email: "" // 邮箱
};

const mutations = {
  [SET_LOGIN.split("/")[1]](state: any, data: any) {
    Object.assign(state, data);
  },
  [SET_LOGOUT.split("/")[1]](state: any) {
    state.isLogin = false;
    state.role = -1;
    state.name = "";
    state.department = "";
    state.isGlobal = false;
    state.phone = "";
    state.email = "";
    window.localStorage.removeItem(LOCAL_TOKEN);
    for (let _key of window.$cookies.keys()) {
      window.$cookies.remove(_key);
    }
    router.push("/login").then(() => {});
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
