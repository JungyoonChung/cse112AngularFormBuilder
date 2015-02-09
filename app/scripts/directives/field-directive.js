'use strict';

angularApp.directive('fieldDirective', function ($http, $compile) {

        var getTemplateUrl = function(field) {
            var type = field.field_type;
            var templateUrl = '';

            switch(type) {
                case 'textfield':
                    templateUrl = './views/directive-templates/field/textfield.html';
                    break;
                case 'email':
                    templateUrl = './views/directive-templates/field/email.html';
                    break;
                case 'textarea':
                    templateUrl = './views/directive-templates/field/textarea.html';
                    break;
                case 'checkbox':
                    templateUrl = './views/directive-templates/field/checkbox.html';
                    break;
                case 'date':
                    templateUrl = './views/directive-templates/field/date.html';
                    break;
                case 'dropdown':
                    templateUrl = './views/directive-templates/field/dropdown.html';
                    break;
                case 'hidden':
                    templateUrl = './views/directive-templates/field/hidden.html';
                    break;
                case 'password':
                    templateUrl = './views/directive-templates/field/password.html';
                    break;
                case 'signature':
                    templateUrl = './views/directive-templates/field/signature.html';
                    break;
                case 'radio':
                    templateUrl = './views/directive-templates/field/radio.html';
                    break;
            }
            return templateUrl;
        }

        var linker = function(scope, element) {
            // GET template content from path
            var templateUrl = getTemplateUrl(scope.field);
            $http.get(templateUrl).success(function(data) {
                element.html(data);
                $compile(element.contents())(scope);
            });
        }

        return {
            template: '<div>{{field}}</div>',
            restrict: 'E',
            scope: {
                field:'='
            },
            link: linker
        };
  });

sig.directive("signatureDir", ['$document', '$log', '$rootScope', function ($document, $log, $rootScope) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            var ctx = element[0].getContext('2d');

            ctx.canvas.width = window.innerWidth - 30;

            // the last coordinates before the current move
            var lastPt;

            function getOffset(obj) {
                return { left: 15, top: 116 }; //Got a fixed offset
            }

            attrs.$observe("value", function (newValue) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            });

            attrs.$observe("saveVal", function (newValue, dnid) {
                var imagedata = ctx.canvas.toDataURL();
                $rootScope.signatureTemp.push({'dnid':dnid, 'signature':imagedata});
            });

            element.on('touchstart', function (e) {
                e.preventDefault();
                ctx.fillRect(e.touches[0].pageX - getOffset(element).left, e.touches[0].pageY - getOffset(element).top, 2, 2);
                lastPt = { x: e.touches[0].pageX - getOffset(element).left, y: e.touches[0].pageY - getOffset(element).top };
            });
            element.on('touchmove', function (e) {
                e.preventDefault();
                if (lastPt != null) {
                    ctx.beginPath();
                    ctx.moveTo(lastPt.x, lastPt.y);
                    ctx.lineTo(e.touches[0].pageX - getOffset(element).left, e.touches[0].pageY - getOffset(element).top);
                    ctx.stroke();
                }
                lastPt = { x: e.touches[0].pageX - getOffset(element).left, y: e.touches[0].pageY - getOffset(element).top };
            });

            element.on('touchend', function (e) {
                e.preventDefault();
                lastPt = null;
            });
        }
    };
}]);