

// import ClaimDetail from './client/ClaimDetail.js';
// import ClaimPickList from './client/ClaimPickList.js';
// import ClaimsPage from './client/ClaimsPage.js';
// import ClaimTable from './client/ClaimTable.js';
// import { insertClaim, removeClaimById, updateClaim } from './lib/methods.js';

import ClaimsPage from './client/ClaimsPage';
import ClaimTable from './client/ClaimTable';
import {ClaimTable as ClaimsTable} from './client/ClaimTable';
import ClaimDetail from './client/ClaimDetail';
import ClaimCard from './client/ClaimCard';

import { Claim, Claims, ClaimSchema } from './lib/Claims';

var DynamicRoutes = [{
  'name': 'ClaimPage',
  'path': '/patients',
  'component': ClaimsPage,
  'requireAuth': true
}];

// var DynamicRoutes = [];

var SidebarElements = [{
  'primaryText': 'Claims',
  'to': '/patients',
  'href': '/patients'
}];

export { 
  SidebarElements, 
  DynamicRoutes, 

  ClaimsPage,
  ClaimTable,
  ClaimsTable,
  ClaimDetail,
  ClaimCard,

  Claim,
  Claims,
  ClaimSchema
};


