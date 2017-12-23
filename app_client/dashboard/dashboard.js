'use strict';

import gridster from 'angular-gridster';
import apiData from './common/services/apiData.service';
import { dashboardCtrl } from './dashboard/dashboard.controller';

const dashboard = angular.module('nerveCenter.dashboard', 
  ['$scope', '$http', '$location', '$uibModal', '$log',
   '$document', '$filter', '$window', apiData, auth]);

dashboard.controller('dashboardCtrl', dashboardCtrl);

export { dashboard };

