import Vue from 'vue'

const state = {
  tasks: []
}

const mutations = {
  ADD(state, task) {
    Vue.set(state.tasks, state.tasks.length, task)
  }
}

const actions = {
  addTask({ commit }, task) {
    // do something async
    commit('ADD', task)
  }
}

export default {
  state,
  mutations,
  actions
}
