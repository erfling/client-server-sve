import Root from '../containers/Root';
import TeamDetailContainer from '../containers/TeamDetailContainer';
import AdminGamesListContainer from '../containers/AdminGamesListContainer';
import AdminGamesContainer from '../containers/AdminGamesListContainer';


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
  adminGames:{
    sequence:2,
    component: AdminGamesContainer,
    exact: true,
    path: '/admin-games'
  },
  team: {
    sequence: 3,
    component: TeamDetailContainer,
    path: '/team-detail/:slug',
    exact: false
  }
};

export default routes;