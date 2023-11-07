/*
 * @Author      : Mr.bin
 * @Date        : 2022-10-15 17:00:42
 * @LastEditTime: 2023-11-07 10:29:28
 * @Description : vuex
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    /* 设备编号 */
    facilityID: '',
    /* 设备是否到期 */
    isfacilityExpire: 0, // （0到期，1未到期）
    /* 设备到期时间 */
    facilityDeadline: '',

    // 当前选择的用户及其信息
    currentUserInfo: {
      userId: '', // 唯一id
      userName: '', // 姓名
      sex: '', // 性别
      height: '', // 身高
      weight: '', // 体重
      birthday: '', // 出生日期
      bearWay: '', // 生育方式（顺产、剖腹产、无）
      postpartumTime: '', // 产后时间（6个月及以内，超过6个月、无）
      remarks: '', // 备注
      lastLoginTime: '' // 最后登录时间
    },

    /* 最大、最小灵活度值 */
    bothFlexibility: {
      maxDepth: null,
      minDepth: null
    },

    /* 训练方案的选项 */
    planSelect: [],

    /* 语音开关 */
    voiceSwitch: true
  },

  mutations: {
    /* 设备编号 */
    SET_FACILITYID(state, facilityID) {
      state.facilityID = facilityID
    },
    /* 设备是否到期 */
    SET_ISFACILITYEXPIRE(state, isfacilityExpire) {
      state.isfacilityExpire = isfacilityExpire
    },
    /* 设备到期时间 */
    SET_FACILITYDEADLINE(state, facilityDeadline) {
      state.facilityDeadline = facilityDeadline
    },

    // 当前选择的用户及其信息
    CHANGE_CURRENTUSERINFO(state, currentUserInfo) {
      state.currentUserInfo = currentUserInfo
    },

    /* 最大、最小灵活度值 */
    SET_BOTHFLEXIBILITY(state, newBothFlexibility) {
      state.bothFlexibility = newBothFlexibility
    },

    /* 训练方案的选项 */
    CHANGE_PLANSELECT(state, planSelect) {
      state.planSelect = planSelect
    },

    /* 语音开关 */
    SET_VOICESWITCH(state, voiceSwitch) {
      state.voiceSwitch = voiceSwitch
    }
  },

  actions: {
    /* 设备编号 */
    setFacilityID({ commit }, facilityID) {
      return new Promise((resolve, reject) => {
        commit('SET_FACILITYID', facilityID)
        resolve()
      })
    },
    /* 设备是否到期 */
    setIsfacilityExpire({ commit }, isfacilityExpire) {
      return new Promise((resolve, reject) => {
        commit('SET_ISFACILITYEXPIRE', isfacilityExpire)
        resolve()
      })
    },
    /* 设备到期时间 */
    setFacilityDeadline({ commit }, facilityDeadline) {
      return new Promise((resolve, reject) => {
        commit('SET_FACILITYDEADLINE', facilityDeadline)
        resolve()
      })
    },

    // 当前选择的用户及其信息
    changeCurrentUserInfo({ commit }, currentUserInfo) {
      return new Promise((resolve, reject) => {
        commit('CHANGE_CURRENTUSERINFO', currentUserInfo)
        resolve()
      })
    },

    /* 最大、最小灵活度值 */
    setBothFlexibility({ commit }, newBothFlexibility) {
      return new Promise((resolve, reject) => {
        commit('SET_BOTHFLEXIBILITY', newBothFlexibility)
        resolve()
      })
    },

    /* 训练方案的选项 */
    changePlanSelect({ commit }, planSelect) {
      return new Promise((resolve, reject) => {
        commit('CHANGE_PLANSELECT', planSelect)
        resolve()
      })
    },

    /* 语音开关 */
    setVoiceSwitch({ commit }, voiceSwitch) {
      return new Promise((resolve, reject) => {
        commit('SET_VOICESWITCH', voiceSwitch)
        resolve()
      })
    }
  }
})
