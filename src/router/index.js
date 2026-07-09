import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import PairView from '../views/PairView.vue';
import TermsView from '../views/TermsView.vue';
import PrivacyView from '../views/PrivacyView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/pair',
    name: 'Pair',
    component: PairView
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsView
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router;
