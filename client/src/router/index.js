import Vue from 'vue'
import VueRouter from 'vue-router'

import guards from './guards'

Vue.use(VueRouter)

import { Dashboard, Login, NotFound } from '../pages'
import { List as EmployeeList } from '../pages/employee'
import { List as ClientList } from '../pages/client'
import { List as TeamList, Detail as TeamDetail } from '../pages/team'
import {
  List as ProjectList,
  Detail as ProjectDetail,
  Board as ProjectBoard,
} from '../pages/project'
import { List as AdminList } from '../pages/admin'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requireGuest: true,
    },
  },
  {
    path: '/employee',
    name: 'Employee',
    component: EmployeeList,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/client',
    name: 'Client',
    component: ClientList,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/team',
    name: 'Team',
    component: TeamList,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/team/:id',
    name: 'Team Detail',
    component: TeamDetail,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/project',
    name: 'Project',
    component: ProjectList,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/project/:id',
    name: 'Project Detail',
    component: ProjectDetail,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/project/:id/board/:board_id',
    name: 'Project Board',
    component: ProjectBoard,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminList,
    meta: {
      requireAuth: true,
      requireAdmin: true,
    },
  },
  {
    path: '*',
    name: 'Not Found',
    component: NotFound,
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

for (const guard of Object.values(guards)) {
  router.beforeEach(guard)
}

export default router
