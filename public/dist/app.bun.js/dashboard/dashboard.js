'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.dashboard=undefined;var _angularGridster=require('angular-gridster');var _angularGridster2=_interopRequireDefault(_angularGridster);var _apiData=require('./common/services/apiData.service');var _apiData2=_interopRequireDefault(_apiData);var _dashboard=require('./dashboard/dashboard.controller');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var dashboard=angular.module('nerveCenter.dashboard',['$scope','$http','$location','$uibModal','$log','$document','$filter','$window',_apiData2.default,auth]);dashboard.controller('dashboardCtrl',_dashboard.dashboardCtrl);exports.dashboard=dashboard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhc2hib2FyZC9kYXNoYm9hcmQuanMiXSwibmFtZXMiOlsiZGFzaGJvYXJkIiwiYW5ndWxhciIsIm1vZHVsZSIsImFwaURhdGEiLCJhdXRoIiwiY29udHJvbGxlciIsImRhc2hib2FyZEN0cmwiXSwibWFwcGluZ3MiOiJBQUFBLGEscUZBRUEsaUQsK0RBQ0EsMEQsK0NBQ0EsMkQsa0ZBRUEsR0FBTUEsV0FBWUMsUUFBUUMsTUFBUkQsQ0FBZSx1QkFBZkEsQ0FDaEIsQ0FBQyxRQUFELENBQVcsT0FBWCxDQUFvQixXQUFwQixDQUFpQyxXQUFqQyxDQUE4QyxNQUE5QyxDQUNDLFdBREQsQ0FDYyxTQURkLENBQ3lCLFNBRHpCLENBQ29DRSxpQkFEcEMsQ0FDNkNDLElBRDdDLENBRGdCSCxDQUFsQixDQUlBRCxVQUFVSyxVQUFWTCxDQUFxQixlQUFyQkEsQ0FBc0NNLHdCQUF0Q04sRSxRQUVTQSxTLENBQUFBLFMiLCJmaWxlIjoiZGFzaGJvYXJkL2Rhc2hib2FyZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGdyaWRzdGVyIGZyb20gJ2FuZ3VsYXItZ3JpZHN0ZXInO1xuaW1wb3J0IGFwaURhdGEgZnJvbSAnLi9jb21tb24vc2VydmljZXMvYXBpRGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IGRhc2hib2FyZEN0cmwgfSBmcm9tICcuL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29udHJvbGxlcic7XG5cbmNvbnN0IGRhc2hib2FyZCA9IGFuZ3VsYXIubW9kdWxlKCduZXJ2ZUNlbnRlci5kYXNoYm9hcmQnLCBcbiAgWyckc2NvcGUnLCAnJGh0dHAnLCAnJGxvY2F0aW9uJywgJyR1aWJNb2RhbCcsICckbG9nJyxcbiAgICckZG9jdW1lbnQnLCAnJGZpbHRlcicsICckd2luZG93JywgYXBpRGF0YSwgYXV0aF0pO1xuXG5kYXNoYm9hcmQuY29udHJvbGxlcignZGFzaGJvYXJkQ3RybCcsIGRhc2hib2FyZEN0cmwpO1xuXG5leHBvcnQgeyBkYXNoYm9hcmQgfTtcblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9