import { adminInitRoutes, constantRoutes } from '@/router'
import { getMenu } from '@/api/user'
import Layout from '@/layout'
import { loadView } from '@/utils/index'

/**
 * 根据后台返回的菜单数据组装路由
 */
export function asyncGetRoutes(asyncMenus) {
  const res = []
  for (let menu of asyncMenus) {
    if (menu.pid == 0 && menu.children == null) {
      let rootMenu = {
        path: menu.path,
        component: Layout,
        children: [{
          path: "index",
          component: loadView(menu.component),
          hidden: menu.hidden,
          meta: menu.meta
        }]
      }
      res.push(rootMenu)
    } else {
      let tmp = {
        path: menu.path,
        meta: menu.meta,
        hidden: menu.hidden,
      }
      if (menu.pid == 0) {
        tmp.component = Layout
      } else {
        tmp.component = loadView(menu.component)
      }
      if (menu.children != null && menu.children.length >= 0) {
        tmp.alwaysShow = true
        tmp.children = asyncGetRoutes(menu.children)
      }
      res.push(tmp)
    }
  }
  return res
}

const state = {
  routes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return getMenu(roles).then(response => {
      let accessedRoutes
      let { data } = response
      //如果是系统初始化搭建时，超级管理员没配置菜单，就给默认菜单
      if (roles.includes('admin') && (!data || data.size <= 0)) {
        accessedRoutes = adminInitRoutes
      } else {
        accessedRoutes = asyncGetRoutes(data)
      }
      console.log(accessedRoutes)
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', accessedRoutes)
      return Promise.resolve(accessedRoutes);
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
