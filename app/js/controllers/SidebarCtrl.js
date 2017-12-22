angular.module('app.sidebar')
	.controller('SidebarController', function($rootScope, $scope, $state, SidebarLoader, Utils) {

		activate();

		function activate() {
			var collapseList = [];
			var watchOff1 = $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal) {
				if (newVal === false && oldVal === true) {
					closeAllBut(-1);
				}
			});
			SidebarLoader.getMenu(sidebarReady);

			function sidebarReady(items) {
				$scope.menuItems = items.data;
			}
			$scope.getMenuItemPropClasses = function(item) {
				return (item.heading ? 'nav-heading' : '') +
					(isActive(item) ? ' active' : '');
			};
			$scope.addCollapse = function($index, item) {
				collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
			};
			$scope.isCollapse = function($index) {
				return (collapseList[$index]);
			};
			$scope.toggleCollapse = function($index, isParentItem) {
				if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) return true;
				if (angular.isDefined(collapseList[$index])) {
					if (!$scope.lastEventFromChild) {
						collapseList[$index] = !collapseList[$index];
						closeAllBut($index);
					}
				} else if (isParentItem) {
					closeAllBut(-1);
				}
				$scope.lastEventFromChild = isChild($index);
				return true;
			};

			function isActive(item) {
				if (!item) return;
				if (!item.sref || item.sref === '#') {
					var foundActive = false;
					angular.forEach(item.submenu, function(value) {
						if (isActive(value)) foundActive = true;
					});
					return foundActive;
				} else
					return $state.is(item.sref) || $state.includes(item.sref);
			}

			function closeAllBut(index) {
				index += '';
				for (var i in collapseList) {
					if (index < 0 || index.indexOf(i) < 0)
						collapseList[i] = true;
				}
			}

			function isChild($index) {
				return (typeof $index === 'string') && !($index.indexOf('-') < 0);
			}

			$scope.$on('$destroy', function() {
				watchOff1();
			});

		} // activate
	});
