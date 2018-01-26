import Root from '../containers/Root';
import TeamDetailContainer from '../containers/TeamDetailContainer';
import AdminGamesListContainer from '../containers/AdminGamesListContainer';
import AdminRoot from '../components/AdminRoot';
import AdminGamesContainer from '../containers/AdminGamesListContainer';
import AdminGameDetailContainer from '../containers/AdminGameDetailContainer';


interface RouteDefinition {
  sequence: number;
  exact: boolean;
  path: string;
  component: React.ComponentClass<{}>;
}

interface Routes {
  [propName: string]: RouteDefinition;
}

const routes: Routes = {
  root: {
    sequence: 1,
    component: Root,
    exact: true,
    path: '/'
  },
  admin: {
    sequence:2,
    component: AdminRoot,
    exact: true,
    path: '/admin'
  },
  team: {
    sequence: 5,
    component: TeamDetailContainer,
    path: '/team-detail/:slug',
    exact: false
  }
};

export default routes;