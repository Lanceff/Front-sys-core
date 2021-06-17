import { adminInitRoutes, constantRoutes } from '@/router'
import { getMenu } from '@/api/user'

/**
 * 根据后台返回的菜单数据组装路由
 */
export function asyncGetRoutes(asyncMenus) {
  const res = []
  asyncMenus.forEach(menu => {
    let tmp = {
      path: menu.url,
      name: '',
      meta: {
        title: menu.name,
        icon: menu.icon || ''
      }
    }
    if (menu.children != null && menu.children.length >= 0) {
      tmp.children = asyncGetRoutes(menu.children)
    }
    res.push(tmp)

  });
  console.log(res)
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      getMenu(roles).then(response => {
        console.log(response)
        let { data } = response
        //如果是系统初始化搭建时，超级管理员没配置菜单，就给默认菜单
        if (roles.includes('admin') && (!data || data.size <= 0)) {
          accessedRoutes = adminInitRoutes
        } else {
          accessedRoutes = asyncGetRoutes(data)
        }
         // 404 page must be placed at the end !!!
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      }).catch(error => {
        reject(error)
      })
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
