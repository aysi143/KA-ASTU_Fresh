App.factory('bgService', function($rootScope, $ocLazyLoad) {

	var factory = {};

	factory.backgrounds = backgroundStyles;

	factory.getBgSettings = function() {
		chrome.storage.sync.get('background', function(data) {

			var bgSettings = {},
				currentBgIndex = 0;

			if (!data.background) {
				bgSettings = {
					'changeMode': 'random',
					'order': [0, 1],
					'nextLoading': Date.now(),
					'unlocked': false
				}
				currentBgIndex = 0;
			} else {
				bgSettings = data.background;
				currentBgIndex = data.background.order[0];
			}

			if ( bgSettings.nextLoading <= Date.now() || !bgSettings.nextLoading ) {

				bgSettings.order.splice(0,1);

				if (bgSettings.order.length == 0) {
					bgSettings.order = factory.createNewBgOrder(bgSettings);
				}

				bgSettings.bg = factory.backgrounds[ bgSettings.order[0] ];

				factory.saveBgSettings( bgSettings, currentBgIndex );
			} else {
				bgSettings.bg = factory.backgrounds[currentBgIndex];
			}

			if (bgSettings.bg.indexOf('anim') != -1) {
				factory.loadJS(bgSettings.bg);
			}

			$rootScope.background = bgSettings;

		});
	}

	factory.saveBgSettings = function(bgSettings, currentBgIndex) {
		if (currentBgIndex == undefined) {
			bgSettings.order = factory.createNewBgOrder(bgSettings);
			var selectedBgIndex = factory.backgrounds.indexOf(bgSettings.bg);
			bgSettings.order.splice(selectedBgIndex, 1);
			bgSettings.order.unshift(selectedBgIndex);
		}
		bgSettings.nextLoading = factory.getNextLoadingTime(bgSettings.changeMode);
		chrome.storage.sync.set({
			'background': bgSettings
		});
	}

	factory.getNextLoadingTime = function(changeMode) {

		var now = new Date(),
			nextLoading;

		switch ( changeMode ) {
			case 'never':
				nextLoading = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate() );
				break;
			case 'everyday':
				nextLoading = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
				break;
			case 'everyhour':
				nextLoading = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()+1);
				break;
			case 'random':
				nextLoading = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
				break;
		}

	 	return nextLoading.getTime();
	}

	factory.createNewBgOrder = function(bgSettings){

		var bgOrder = [],
			max = 6;

		for (var i=0; i<max; i++) {
			bgOrder.push(i);
		}

		shuffle(bgOrder);

		return bgOrder;
	}

	factory.loadJS = function(animationName) {
		var jsFiles = [];
		switch (animationName) {
			case 'anim_01':
				jsFiles = [
					'js/animations/three.js',
					'js/animations/OrbitControls.js',
					'js/animations/MarchingCubes.js',
					'js/animations/anim_01.js'
				];
				break;
			case 'anim_02':
				jsFiles = [
					'js/animations/three.js',
					'js/animations/anim_02.js'
				];
				break;
			case 'anim_03':
				jsFiles = [
					'js/animations/lottie2.js',
					'js/animations/anim_03.js'
				];
				break;
			case 'anim_04':
				jsFiles = [
					'js/animations/anim_04.js'
				];
				break;
			case 'anim_05':
				jsFiles = [
					'js/animations/lottie2.js',
					'js/animations/anim_05.js'
				];
				break;
			case 'anim_07':
				jsFiles = [
					'js/animations/TweenMax.js',
					'js/animations/anim_07.js'
				];
				break;
		}
		$ocLazyLoad.load(jsFiles, { serie: true }).then(function() { });
	}

	return factory;

});
