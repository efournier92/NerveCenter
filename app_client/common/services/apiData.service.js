const apiData = angular.module('nerveCenter').service('apiData', apiDataService);
apiData.$inject = ['$http', 'auth'];
export { apiData };

function apiDataService($http, auth) {
  const getProfile = () => {
    return $http.get('/api/user', {
      headers: {
        Authorization: 'Bearer '+ auth.getToken()
      }
    });
  };

  const updateWidgets = (data) => {
    return $http.put('/api/user', data, {
      headers: {
        Authorization: 'Bearer '+ auth.getToken()
      }
    });
  };

  const getIcons = (data) => {
    return $http.get('/api/ico', data, {
      headers: {
        Authorization: 'Bearer '+ auth.getToken()
      }
    });
  };

  const getDefaultGrid = (data) => {
    return $http.get('/api/defaultgrid', data, {
      headers: {
        Authorization: 'Bearer '+ auth.getToken()
      }
    });
  };

  return {
    getProfile : getProfile,
    updateWidgets: updateWidgets,
    getIcons: getIcons,
    getDefaultGrid: getDefaultGrid
  };

}

