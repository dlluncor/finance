function TodoCtrl($scope) {
  $scope.todos = [
    {name: 'Learn angular', completed: false},
  ];
  $scope.remaining = function() {
    var count = 0;
    $scope.todos.forEach(function(todo) {
      if (!todo.completed) {
      	count++;
      }
    });
    return count;
  };
  $scope.addTodo = function() {
    var text = $scope.todoText;
    $scope.todos.push({
      name: text,
      completed: false
    });
  };
};