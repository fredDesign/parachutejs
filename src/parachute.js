;(function($){
	
	'use strict'
	
	var Parachute = function () {
		this.options;
		this.$window;
		this.$scrollContainer;
		this.$heightContainer;
		this.$anchorLinks;
		this.windowWidth;
		this.windowHeight;
		this.scrollTop = 0;
		this.currentScrollTop = 0;
		this.triggerArray = [];
		this.triggerArrayLength = 0;
		this.parallaxArr = [];
		this.parallaxArrLength = 0;
	};
	
	Parachute.DEFAULTS = {
		scrollContainer: '#scrollContainer',
		heightContainer: '#heightContainer',
		easingMultiplier: 0.075
	};
	
	Parachute.prototype.init = function () {
		this.$window = $(window);
		this.onResize();
		this.initEvents();
		this.initAnchorLinks();
		this.onEnterFrame();
	};
	
	Parachute.prototype.reload = function () {
		this.onResize();
		this.initAnchorLinks(); // 
	};
	
	Parachute.prototype.initEvents = function () {
		this.$window.resize($.proxy(this.onResize, this));
		this.$window.scroll($.proxy(this.onScroll, this));
	};
	
	Parachute.prototype.initAnchorLinks = function () {
		var _Parachute = this;
		this.checkURLHash();
		this.$anchorLinks = $('a[href^="#"');
		this.$anchorLinks.each(function () {
			var $this = $(this);
			$this.addClass('parachute-anchor-active');
			$this.on('click', function () {
				var selectorName = $this[0].hash.split('#')[1];
				_Parachute.scrollToAnchor(selectorName);
			});
		});
	};
	
	Parachute.prototype.checkURLHash = function () {
		var selectorName = window.location.hash.split('#')[1];
		if (selectorName) { this.scrollToAnchor(selectorName); }
	};
	
	Parachute.prototype.scrollToAnchor = function (selectorName) {
		var pxFromTop;
		var target = $('a[id="' + selectorName + '"]'); // `name` attr not supported in html5
		if(target.length) {
			pxFromTop = target[0].getBoundingClientRect().top;
			setTimeout(function () { $(window).scrollTop(pxFromTop); }, 0);
		}
	};
	
	Parachute.prototype.page = function (options) {
		this.options = $.extend({}, Parachute.DEFAULTS, options);
		this.$scrollContainer = $(this.options.scrollContainer);
		this.$heightContainer = $(this.options.heightContainer);
	};
	
	Parachute.prototype.onResize = function () {
		this.windowHeight = this.$window.height();
		this.windowWidth = this.$window.width();
		this.$heightContainer.css('height', this.$scrollContainer.height());
	};
	
	Parachute.prototype.onScroll = function () {
		this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	};
	
	Parachute.prototype.onEnterFrame = function () {
		requestAnimationFrame($.proxy(this.onEnterFrame, this));
		this.scrollEasing();
		this.triggerAnimations();
		this.parallaxAnimations();
	};
	
	Parachute.prototype.scrollEasing = function () {
		this.currentScrollTop += (this.scrollTop - this.currentScrollTop) * this.options.easingMultiplier;
		if (this.currentScrollTop < 1) { this.currentScrollTop = 0 };
		this.$scrollContainer.css({
			'transform': 'translateY(' + -this.currentScrollTop + 'px) translateZ(0)'
		});
	};
	
	// trigger
	Parachute.prototype.trigger = Parachute.prototype.sequence = function (options) {
		this.triggerArray.push(new this.Trigger(options));
		this.triggerArrayLength++;
	};
	
	Parachute.prototype.triggerAnimations = function () {
		var bool;
		for (var i = 0; i < this.triggerArrayLength; i++) {
			this.triggerInView(i) ? bool = true : bool = false;
			this.triggerArray[i].callback(bool);
		}
	};
	
	Parachute.prototype.triggerInView = function (i) {
		var triggerOffset = this.triggerArray[i].boundingBox.top - this.windowHeight + this.triggerArray[i].offset;
		if (this.scrollTop > triggerOffset) {
			return true;
		}
		return false;
	};
	
	// parallax
	Parachute.prototype.parallax = function (options) {
		var _Parachute = this;
		// make array
		if(!$.isArray(options.element)) {
			options.element = [options.element];
		}
		// loop
		for(var i = 0; i < options.element.length; i++) {
			var $el = $(options.element[i]);
			$el.each(function () {
				_Parachute.parallaxArr.push(new _Parachute.Parallax(this, options));
				_Parachute.parallaxArrLength++;
			});	
		}
	};
	
	Parachute.prototype.parallaxAnimations = function () {
		for (var i = 0; i < this.parallaxArrLength; i++) {
			var elementTopPixelRange = this.parallaxArr[i].boundingBox.top + this.parallaxArr[i].boundingBox.height - this.parallaxArr[i].topTriggerOffset;
			var elementBottomPixedRange = this.parallaxArr[i].boundingBox.top - this.windowHeight;
			var elementRangeDiff = elementTopPixelRange - elementBottomPixedRange;
			var pxMulitplier = this.parallaxArr[i].pxToMove / this.windowHeight;

			// console.log('scrollTop:', this.scrollTop, 'topRange:', elementTopPixelRange, 'bottomRange:', elementBottomPixedRange, 'diff:', elementRangeDiff);

			// @todo cleanup

			// Element is in view
			if( this.scrollTop > elementBottomPixedRange && this.scrollTop < elementTopPixelRange ) {
				this.parallaxArr[i].currentScrollTop += ((( this.scrollTop - elementBottomPixedRange ) * pxMulitplier ) - this.parallaxArr[i].currentScrollTop ) * this.options.easingMultiplier;
				if( this.parallaxArr[i].currentScrollTop < this.parallaxArr[i].pxToMove ) {
					this.parallaxArr[i].currentScrollTop = this.parallaxArr[i].pxToMove;
				}
			}
			
			// Element is below viewport
			if( this.scrollTop < elementBottomPixedRange ) {
				this.parallaxArr[i].currentScrollTop -= this.parallaxArr[i].currentScrollTop * this.options.easingMultiplier;
				if( this.parallaxArr[i].currentScrollTop >= -1 ) {
					this.parallaxArr[i].currentScrollTop = 0;
				}
			}
			
			// Element is above viewport
			if( this.scrollTop > elementTopPixelRange ) {
				this.parallaxArr[i].currentScrollTop += Math.round(this.parallaxArr[i].currentScrollTop * this.options.easingMultiplier);
				if( this.parallaxArr[i].currentScrollTop <= this.parallaxArr[i].pxToMove+1) {
					this.parallaxArr[i].currentScrollTop = this.parallaxArr[i].pxToMove;
				}
			}

			this.parallaxArr[i].$element.css({
				'transform': 'translateY(' + this.parallaxArr[i].currentScrollTop + 'px) translateZ(0)',
				'backface-visibility': 'hidden'
			});
		}
	};
	
	window.Parachute = new Parachute();
	
})(jQuery);