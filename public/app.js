var app = angular.module("App", [])
    .controller("appController", function($scope, $http) {
        $scope.test = "111";

        $scope.data = {
            today:[],
            my: [],
            intl: []
        };

        $scope.loading = false;

        $scope.update = function () {

            $http.get("/getToday").then( function (res) {
                $scope.data.today = res.data;
            });


            $http.get("/getIntl").then( function (res) {
                $scope.data.intl = res.data;
            });


            $http.get("/getMy").then( function (res) {
                $scope.data.my = res.data;
            });

        };


        $scope.fetch = function() {
            $scope.loading = true;
            $http.get("/fetch").then(function () {
                console.log("done");
                $scope.update();
                $scope.loading = false;
            });
        };

        $scope.update();
    });