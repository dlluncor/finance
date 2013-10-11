var angMod = angular.module('myApp0', []);

function SandbarCtrl($scope) {
  $scope.shown = 'none';

  $scope.moreClick = function() {
    if ($scope.shown == 'none') {
      $scope.shown = 'block';
    } else {
      $scope.shown = 'none';
    }
  };
};

angMod.directive('myheader', function() {
  return {
    transclude: true,
    restrict: 'E',
    controller: SandbarCtrl,
    templateUrl: '/assets/html/sandbar.html',
    replace: true
  };
});