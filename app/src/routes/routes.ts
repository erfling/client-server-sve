import Root from '../containers/Root';
import TeamDetailContainer from '../containers/TeamDetailContainer';

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
  team: {
    sequence: 2,
    component: TeamDetailContainer,
    path: '/team-detail/:slug',
    exact: false
  }
};

export default routes;