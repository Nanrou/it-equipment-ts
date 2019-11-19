const state = {
  permissionWrite: 0b000001,
  permissionHigher: 0b000010,
  permissionMaintenance: 0b000100,
  permissionMaintenanceHigher: 0b001000,
  permissionSuper: 0b010000,
  permissionSupreme: 0b100000
};

const actions = {};

const mutations = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
