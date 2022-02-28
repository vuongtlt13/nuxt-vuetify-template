interface AppState {
  overlay: boolean
}


// state
export const state: () => AppState = () => ({
  overlay: false,
})

// getters
export const getters = {
  overlay: (state: AppState) => state.overlay,
}

// mutations
export const mutations = {
  SET_OVERLAY (state: AppState, value: boolean) {
    state.overlay = value
  }
}

// actions
export const actions = {
  setOverlay ({ commit }: any, value: boolean) {
    commit('SET_OVERLAY', value)
  }
}
