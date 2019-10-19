import Home from '../pages/home';
import Products from '../pages/product/list';
import ProductDetails from '../pages/product/details';
import Profile from '../pages/profile';
import Login from '../pages/login';
import SignUp from '../pages/sign-up';

const configsNeedAuth = [
  { path: '/home', component: Home, exact: true },
  { path: '/products', component: Products, exact: true },
  { path: '/products/:id', component: ProductDetails, exact: true },
  { path: '/profile', component: Profile, exact: true }
];

const configsNoAuth = [
  { path: '/login', component: Login, exact: true },
  { path: '/signup', component: SignUp, exact: true }
];

export { configsNeedAuth, configsNoAuth };
