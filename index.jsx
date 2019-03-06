

import ClaimsPage from './client/ClaimsPage';
import ClaimsTable from './client/ClaimsTable';
import ClaimDetail from './client/ClaimDetail';

import { Claim, Claims, ClaimSchema } from './lib/Claims';

var DynamicRoutes = [{
  'name': 'ClaimPage',
  'path': '/claims',
  'component': ClaimsPage,
  'requireAuth': true
}];

var AdminSidebarElements = [{
  'primaryText': 'Claims',
  'to': '/claims',
  'href': '/claims'
}];

export { 
  AdminSidebarElements, 
  DynamicRoutes, 

  ClaimsPage,
  ClaimsTable,
  ClaimDetail,

  Claim,
  Claims,
  ClaimSchema
};


