(function() {

  angular
    .module('nerveCenter')
    .service('getWidgets', getWidgets);

  function getWidgets(ngResource, globalsService) {
    var widgetsResource = ngResource("/api/widget", {},
      {
        "put": {"method": "PUT", "params": {"action": "Put"} }
      });
    return configResource;
  };

})();

