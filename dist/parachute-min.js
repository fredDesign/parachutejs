/**
 * parachutejs - inertia scrolling/parallax jquery library
 * @version v0.0.3
 * @link https://github.com/derekborland/parachutejs#readme
 * @license MIT
 */
!function(t){"use strict";var r=function(){this.options,this.$window,this.$scrollContainer,this.$heightContainer,this.$anchorLinks,this.windowWidth,this.windowHeight,this.scrollTop=0,this.currentScrollTop=0,this.triggerArray=[],this.triggerArrayLength=0,this.parallaxArr=[],this.parallaxArrLength=0};r.DEFAULTS={scrollContainer:"#scrollContainer",heightContainer:"#heightContainer",easingMultiplier:.075},r.prototype.init=function(){this.$window=t(window),this.onResize(),this.initEvents(),this.initAnchorLinks(),this.onEnterFrame()},r.prototype.reload=function(){this.onResize(),this.initAnchorLinks()},r.prototype.initEvents=function(){this.$window.resize(t.proxy(this.onResize,this)),this.$window.scroll(t.proxy(this.onScroll,this))},r.prototype.initAnchorLinks=function(){var r=this;this.checkURLHash(),this.$anchorLinks=t('a[href^="#"'),this.$anchorLinks.each(function(){var i=t(this);i.addClass("parachute-anchor-active"),i.on("click",function(){var t=i[0].hash.split("#")[1];r.scrollToAnchor(t)})})},r.prototype.checkURLHash=function(){var t=window.location.hash.split("#")[1];t&&this.scrollToAnchor(t)},r.prototype.scrollToAnchor=function(r){var i,o=t('a[id="'+r+'"]');o.length&&(i=o[0].getBoundingClientRect().top,setTimeout(function(){t(window).scrollTop(i)},0))},r.prototype.page=function(i){this.options=t.extend({},r.DEFAULTS,i),this.$scrollContainer=t(this.options.scrollContainer),this.$heightContainer=t(this.options.heightContainer)},r.prototype.onResize=function(){this.windowHeight=this.$window.height(),this.windowWidth=this.$window.width(),this.$heightContainer.css("height",this.$scrollContainer.height())},r.prototype.onScroll=function(){this.scrollTop=window.pageYOffset||document.documentElement.scrollTop},r.prototype.onEnterFrame=function(){requestAnimationFrame(t.proxy(this.onEnterFrame,this)),this.scrollEasing(),this.triggerAnimations(),this.parallaxAnimations()},r.prototype.scrollEasing=function(){this.currentScrollTop+=(this.scrollTop-this.currentScrollTop)*this.options.easingMultiplier,this.currentScrollTop<1&&(this.currentScrollTop=0),this.$scrollContainer.css({transform:"translateY("+-this.currentScrollTop+"px) translateZ(0)"})},r.prototype.trigger=r.prototype.sequence=function(t){this.triggerArray.push(new this.Trigger(t)),this.triggerArrayLength++},r.prototype.triggerAnimations=function(){for(var t,r=0;r<this.triggerArrayLength;r++)t=!!this.triggerInView(r),this.triggerArray[r].callback(t)},r.prototype.triggerInView=function(t){var r=this.triggerArray[t].boundingBox.top-this.windowHeight+this.triggerArray[t].offset;return this.scrollTop>r},r.prototype.parallax=function(r){var i=this;t.isArray(r.element)||(r.element=[r.element]);for(var o=0;o<r.element.length;o++){var n=t(r.element[o]);n.each(function(){i.parallaxArr.push(new i.Parallax(this,r)),i.parallaxArrLength++})}},r.prototype.parallaxAnimations=function(){for(var t=0;t<this.parallaxArrLength;t++){var r=this.parallaxArr[t].boundingBox.top+this.parallaxArr[t].boundingBox.height-this.parallaxArr[t].topTriggerOffset,i=this.parallaxArr[t].boundingBox.top-this.windowHeight,o=this.parallaxArr[t].pxToMove/this.windowHeight;this.scrollTop>i&&this.scrollTop<r&&(this.parallaxArr[t].currentScrollTop+=((this.scrollTop-i)*o-this.parallaxArr[t].currentScrollTop)*this.options.easingMultiplier,this.parallaxArr[t].currentScrollTop<this.parallaxArr[t].pxToMove&&(this.parallaxArr[t].currentScrollTop=this.parallaxArr[t].pxToMove)),this.scrollTop<i&&(this.parallaxArr[t].currentScrollTop-=this.parallaxArr[t].currentScrollTop*this.options.easingMultiplier,this.parallaxArr[t].currentScrollTop>=-1&&(this.parallaxArr[t].currentScrollTop=0)),this.scrollTop>r&&(this.parallaxArr[t].currentScrollTop+=Math.round(this.parallaxArr[t].currentScrollTop*this.options.easingMultiplier),this.parallaxArr[t].currentScrollTop<=this.parallaxArr[t].pxToMove+1&&(this.parallaxArr[t].currentScrollTop=this.parallaxArr[t].pxToMove)),this.parallaxArr[t].$element.css({transform:"translateY("+this.parallaxArr[t].currentScrollTop+"px) translateZ(0)","backface-visibility":"hidden"})}},window.Parachute=new r}(jQuery),function(t,r){"use strict";function i(r){this.options=t.extend({},i.DEFAULTS,r),this.element=this.options.element,this.$element=t(this.options.element),this.callback=this.options.callback,this.offset=this.options.offset,this.boundingBox=t(this.options.element)[0].getBoundingClientRect()}i.DEFAULTS={offset:300,callback:function(){}},i.prototype.callback=function(t){return this.callback(t)},r.Trigger=i}(jQuery,Parachute),function(t,r){"use strict";function i(r,o){this.options=t.extend({},i.DEFAULTS,o),this.element=r,this.$element=t(r),this.boundingBox=t(r)[0].getBoundingClientRect(),this.topTriggerOffset=this.options.topTriggerOffset,this.currentScrollTop=0,this.pxToMove=this.options.pxToMove}i.DEFAULTS={speed:1,pxToMove:0,topTriggerOffset:400},r.Parallax=i}(jQuery,Parachute);