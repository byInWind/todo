angular.module('todoApp', [])
  .directive('autoFocus', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        scope.$watch('item.isEditing', function (newValue) {

          if (newValue) {

            $timeout(function () {
              element[0].focus();
            }, 0)

          }

        })

      }
    }
  }])
  .controller('toCtrl', ['$scope', function ($scope) {
    $scope.tasklist = [];
    getData();
    function getData() {
      if (localStorage.getItem('tasklist')) {
        $scope.tasklist = angular.fromJson(localStorage.getItem('tasklist'))
      }
    }

    /*
     添加任务
     1.获取用户输入的内容
     2.判断用户是否敲击了回车
     3.准备一个任务列表
     4.将用户输入的内容添加到任务列表中
     5.利用ng-repeat指令将任务渲染到页面中
     */

    $scope.addTask = function (e) {
      //13 敲击了回车
      if (e.keyCode == 13) {
        if ($scope.task) {
          $scope.tasklist.push({
            name: $scope.task,
            isCompleted: false,
            isEditing: false
          })

        }
        $scope.task = ""
      }
    }
    /*
     更改任务状态
     1.如何更改样式
     2.需要一个数据代表任务状态

     删除任务
     1.为删除按钮添加点击事件
     2.找到要删除的任务
     3.删除
     */
    $scope.destroy = function (task) {
      $scope.tasklist.splice($scope.tasklist.indexOf(task), 1)
    }
    /*
     计算未完成任务的数量
     1.循环任务列表
     2.判断当前任务是否是未完成的
     3.累加
     4.返回数据
     只要页面中的数据(任何数据)发生变化的时候,angularjs就会重新渲染模板
     */

    $scope.unCompletedTasks = function () {
      var num = 0;
      angular.forEach($scope.tasklist, function (item, index) {
        if (!item.isCompleted) {
          num++
        }
      })
      return num;

    }
    /*
     任务筛选
     1.给ng-repeat指令添加filter过滤器
     2.为过滤器提供过滤条件
     3.为筛选按钮添加点击事件
     4.更改筛选条件
     */
    $scope.condition = '';
    $scope.isSelected = 'all';
    $scope.filterTask = function (task) {
      //console.log(task)
      switch (task) {
        case 'all':
          $scope.isSelected = task;
          $scope.condition = '';
          break;
        case 'active':
          $scope.isSelected = task;
          $scope.condition = false;
          break;
        case 'completed':
          $scope.isSelected = task;
          $scope.condition = true;
          break;
      }
    }

    // 清空已完成
    //1.给清空已完成按钮添加点击事件
    //2.循环数据
    //3.判断当前任务是否是已完成的
    //4.删除   angular.forEach
    $scope.clear = function () {
      for (var i = 0; i < $scope.tasklist.length; i++) {
        if ($scope.tasklist[i].isCompleted) {
          $scope.tasklist.splice(i, 1);
          i--;
        }
      }
    }
    //控制删除按钮显示隐藏
    $scope.ctrlShow = function () {
      for (var i = 0; i < $scope.tasklist.length; i++) {
        if ($scope.tasklist[i].isCompleted) {
          return true;
        }
      }
    }
    //全选全不选
    $scope.changeStatus = function () {
      for (var i = 0; i < $scope.tasklist.length; i++) {
        $scope.tasklist[i].isCompleted = $scope.status;
      }
    }
    $scope.updateStatus = function () {
      for (var i = 0; i < $scope.tasklist.length; i++) {
        if (!$scope.tasklist[i].isCompleted) {
          $scope.status = false;
        } else {
          $scope.status = true;
        }
      }
    }
    //双击修改任务名称
    $scope.edit = function (item) {
      angular.forEach($scope.tasklist, function (item) {
        item.isEditing = false
      })
      item.isEditing = true
    }
    //失去焦点时  先要获取焦点，，讲师闪啊闪的|
    $scope.cancelModify = function (item) {
      item.isEditing = false;
    }
    //深度监听，true  否则e监听不到数组
    $scope.$watch('tasklist', function () {
      localStorage.setItem('tasklist', angular.toJson($scope.tasklist))
    },true)
  }])