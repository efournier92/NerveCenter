'use strict';(function(){angular.module('nerveCenter').service('auth',auth);auth.$inject=['$http','$window'];function auth($http,$window){var saveToken=function saveToken(token){$window.localStorage['mean-token']=token};var getToken=function getToken(){return $window.localStorage['mean-token']};var isLoggedIn=function isLoggedIn(){var token=getToken();var payload;if(token){payload=token.split('.')[1];payload=$window.atob(payload);payload=JSON.parse(payload);return payload.exp>Date.now()/1000}else{return false}};var currentUser=function currentUser(){if(isLoggedIn()){var token=getToken();var payload=token.split('.')[1];payload=$window.atob(payload);payload=JSON.parse(payload);return{id:payload._id,email:payload.email,widgets:payload.widgets}}};register=function register(user){return $http.post('/api/register',user).success(function(data){})};login=function login(user){return $http.post('/api/login',user).success(function(data){saveToken(data.token)})};logout=function logout(){$window.localStorage.removeItem('mean-token')};return{currentUser:currentUser,saveToken:saveToken,getToken:getToken,isLoggedIn:isLoggedIn,register:register,login:login,logout:logout}}})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dGgvYXV0aC5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJzZXJ2aWNlIiwiYXV0aCIsIiRpbmplY3QiLCIkaHR0cCIsIiR3aW5kb3ciLCJzYXZlVG9rZW4iLCJ0b2tlbiIsImxvY2FsU3RvcmFnZSIsImdldFRva2VuIiwiaXNMb2dnZWRJbiIsInBheWxvYWQiLCJzcGxpdCIsImF0b2IiLCJKU09OIiwicGFyc2UiLCJleHAiLCJEYXRlIiwibm93IiwiY3VycmVudFVzZXIiLCJpZCIsIl9pZCIsImVtYWlsIiwid2lkZ2V0cyIsInJlZ2lzdGVyIiwidXNlciIsInBvc3QiLCJzdWNjZXNzIiwiZGF0YSIsImxvZ2luIiwibG9nb3V0IiwicmVtb3ZlSXRlbSJdLCJtYXBwaW5ncyI6ImFBQUEsQ0FBQyxVQUFZLENBRVhBLFFBQ0dDLE1BREhELENBQ1UsYUFEVkEsRUFFR0UsT0FGSEYsQ0FFVyxNQUZYQSxDQUVtQkcsSUFGbkJILEVBSUFHLEtBQUtDLE9BQUxELENBQWUsQ0FBQyxPQUFELENBQVUsU0FBVixDQUFmQSxDQUNBLFFBQVNBLEtBQVQsQ0FBY0UsS0FBZCxDQUFxQkMsT0FBckIsQ0FBOEIsQ0FFNUIsR0FBSUMsV0FBWSxRQUFaQSxVQUFZLENBQVNDLEtBQVQsQ0FBZ0IsQ0FDOUJGLFFBQVFHLFlBQVJILENBQXFCLFlBQXJCQSxFQUFxQ0UsS0FEdkMsQ0FBQSxDQUlBLEdBQUlFLFVBQVcsUUFBWEEsU0FBVyxFQUFZLENBQ3pCLE1BQU9KLFNBQVFHLFlBQVJILENBQXFCLFlBQXJCQSxDQURULENBQUEsQ0FJQSxHQUFJSyxZQUFhLFFBQWJBLFdBQWEsRUFBWSxDQUMzQixHQUFJSCxPQUFRRSxVQUFaLENBQ0EsR0FBSUUsUUFBSixDQUVBLEdBQUdKLEtBQUgsQ0FBUyxDQUNQSSxRQUFVSixNQUFNSyxLQUFOTCxDQUFZLEdBQVpBLEVBQWlCLENBQWpCQSxDQUFWSSxDQUNBQSxRQUFVTixRQUFRUSxJQUFSUixDQUFhTSxPQUFiTixDQUFWTSxDQUNBQSxRQUFVRyxLQUFLQyxLQUFMRCxDQUFXSCxPQUFYRyxDQUFWSCxDQUVBLE1BQU9BLFNBQVFLLEdBQVJMLENBQWNNLEtBQUtDLEdBQUxELEdBQWEsSUFMcEMsQ0FBQSxJQU1PLENBQ0wsTUFBTyxNQUNSLENBWkgsQ0FBQSxDQWVBLEdBQUlFLGFBQWMsUUFBZEEsWUFBYyxFQUFZLENBQzVCLEdBQUdULFlBQUgsQ0FBZ0IsQ0FDZCxHQUFJSCxPQUFRRSxVQUFaLENBQ0EsR0FBSUUsU0FBVUosTUFBTUssS0FBTkwsQ0FBWSxHQUFaQSxFQUFpQixDQUFqQkEsQ0FBZCxDQUNBSSxRQUFVTixRQUFRUSxJQUFSUixDQUFhTSxPQUFiTixDQUFWTSxDQUNBQSxRQUFVRyxLQUFLQyxLQUFMRCxDQUFXSCxPQUFYRyxDQUFWSCxDQUNBLE1BQU8sQ0FDTFMsR0FBS1QsUUFBUVUsR0FEUixDQUVMQyxNQUFRWCxRQUFRVyxLQUZYLENBR0xDLFFBQVVaLFFBQVFZLE9BSGIsQ0FLUixDQVhILENBQUEsQ0FjQUMsU0FBVyxrQkFBU0MsSUFBVCxDQUFlLENBQ3hCLE1BQU9yQixPQUFNc0IsSUFBTnRCLENBQVcsZUFBWEEsQ0FBNEJxQixJQUE1QnJCLEVBQWtDdUIsT0FBbEN2QixDQUEwQyxTQUFTd0IsSUFBVCxDQUFjLENBQXhELENBQUF4QixDQURULENBQUFvQixDQUtBSyxNQUFRLGVBQVNKLElBQVQsQ0FBZSxDQUNyQixNQUFPckIsT0FBTXNCLElBQU50QixDQUFXLFlBQVhBLENBQXlCcUIsSUFBekJyQixFQUErQnVCLE9BQS9CdkIsQ0FBdUMsU0FBU3dCLElBQVQsQ0FBZSxDQUMzRHRCLFVBQVVzQixLQUFLckIsS0FBZkQsQ0FESyxDQUFBRixDQURULENBQUF5QixDQU1BQyxPQUFTLGlCQUFZLENBQ25CekIsUUFBUUcsWUFBUkgsQ0FBcUIwQixVQUFyQjFCLENBQWdDLFlBQWhDQSxDQURGLENBQUF5QixDQUlBLE1BQU8sQ0FDTFgsWUFBY0EsV0FEVCxDQUVMYixVQUFZQSxTQUZQLENBR0xHLFNBQVdBLFFBSE4sQ0FJTEMsV0FBYUEsVUFKUixDQUtMYyxTQUFXQSxRQUxOLENBTUxLLE1BQVFBLEtBTkgsQ0FPTEMsT0FBU0EsTUFQSixDQVNSLENBdEVILENBQUEiLCJmaWxlIjoiYXV0aC9hdXRoLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCduZXJ2ZUNlbnRlcicpXG4gICAgLnNlcnZpY2UoJ2F1dGgnLCBhdXRoKTtcblxuICBhdXRoLiRpbmplY3QgPSBbJyRodHRwJywgJyR3aW5kb3cnXTtcbiAgZnVuY3Rpb24gYXV0aCgkaHR0cCwgJHdpbmRvdykge1xuXG4gICAgdmFyIHNhdmVUb2tlbiA9IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVsnbWVhbi10b2tlbiddID0gdG9rZW47XG4gICAgfTtcblxuICAgIHZhciBnZXRUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZVsnbWVhbi10b2tlbiddO1xuICAgIH07XG5cbiAgICB2YXIgaXNMb2dnZWRJbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0b2tlbiA9IGdldFRva2VuKCk7XG4gICAgICB2YXIgcGF5bG9hZDtcblxuICAgICAgaWYodG9rZW4pe1xuICAgICAgICBwYXlsb2FkID0gdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgcGF5bG9hZCA9ICR3aW5kb3cuYXRvYihwYXlsb2FkKTtcbiAgICAgICAgcGF5bG9hZCA9IEpTT04ucGFyc2UocGF5bG9hZCk7XG5cbiAgICAgICAgcmV0dXJuIHBheWxvYWQuZXhwID4gRGF0ZS5ub3coKSAvIDEwMDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBjdXJyZW50VXNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmKGlzTG9nZ2VkSW4oKSl7XG4gICAgICAgIHZhciB0b2tlbiA9IGdldFRva2VuKCk7XG4gICAgICAgIHZhciBwYXlsb2FkID0gdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgcGF5bG9hZCA9ICR3aW5kb3cuYXRvYihwYXlsb2FkKTtcbiAgICAgICAgcGF5bG9hZCA9IEpTT04ucGFyc2UocGF5bG9hZCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQgOiBwYXlsb2FkLl9pZCxcbiAgICAgICAgICBlbWFpbCA6IHBheWxvYWQuZW1haWwsXG4gICAgICAgICAgd2lkZ2V0cyA6IHBheWxvYWQud2lkZ2V0c1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWdpc3RlciA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3JlZ2lzdGVyJywgdXNlcikuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBsb2dpbiA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2xvZ2luJywgdXNlcikuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHNhdmVUb2tlbihkYXRhLnRva2VuKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBsb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdtZWFuLXRva2VuJyk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50VXNlciA6IGN1cnJlbnRVc2VyLFxuICAgICAgc2F2ZVRva2VuIDogc2F2ZVRva2VuLFxuICAgICAgZ2V0VG9rZW4gOiBnZXRUb2tlbixcbiAgICAgIGlzTG9nZ2VkSW4gOiBpc0xvZ2dlZEluLFxuICAgICAgcmVnaXN0ZXIgOiByZWdpc3RlcixcbiAgICAgIGxvZ2luIDogbG9naW4sXG4gICAgICBsb2dvdXQgOiBsb2dvdXRcbiAgICB9O1xuICB9XG5cbn0pKCk7XG5cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
