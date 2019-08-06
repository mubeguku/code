(function($) {
    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
    }
    function _extends() {
        _extends = Object.assign || function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
        return _extends.apply(this, arguments);
    }
    function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        subClass.__proto__ = superClass;
    }
    var Util = function ($$$1) {
        /**
         * ------------------------------------------------------------------------
         * Private TransitionEnd Helpers
         * ------------------------------------------------------------------------
         */
        var transition = false;
        var MAX_UID = 1000000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)
        function toType(obj) {
            return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        }
        function getSpecialTransitionEndEvent() {
            return {
                bindType: transition.end,
                delegateType: transition.end,
                handle: function handle(event) {
                    if ($$$1(event.target).is(this)) {
                        return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
                    }
                    return undefined; // eslint-disable-line no-undefined
                }
            };
        }
        function transitionEndTest() {
            if (typeof window !== 'undefined' && window.QUnit) {
                return false;
            }
            return {
                end: 'transitionend'
            };
        }
        function transitionEndEmulator(duration) {
            var _this = this;
            var called = false;
            $$$1(this).one(Util.TRANSITION_END, function () {
                called = true;
            });
            setTimeout(function () {
                if (!called) {
                    Util.triggerTransitionEnd(_this);
                }
            }, duration);
            return this;
        }
        function setTransitionEndSupport() {
            transition = transitionEndTest();
            $$$1.fn.emulateTransitionEnd = transitionEndEmulator;
            if (Util.supportsTransitionEnd()) {
                $$$1.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
            }
        }
        function escapeId(selector) {
            // We escape IDs in case of special selectors (selector = '#myId:something')
            // $.escapeSelector does not exist in jQuery < 3
            selector = typeof $$$1.escapeSelector === 'function' ? $$$1.escapeSelector(selector).substr(1) : selector.replace(/(:|\.|\[|\]|,|=|@)/g, '\\$1');
            return selector;
        }
        /**
         * --------------------------------------------------------------------------
         * Public Util Api
         * --------------------------------------------------------------------------
         */
        var Util = {
            TRANSITION_END: 'bsTransitionEnd',
            getUID: function getUID(prefix) {
                do {
                    // eslint-disable-next-line no-bitwise
                    prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
                } while (document.getElementById(prefix));
                return prefix;
            },
            getSelectorFromElement: function getSelectorFromElement(element) {
                var selector = element.getAttribute('data-target');
                if (!selector || selector === '#') {
                    selector = element.getAttribute('href') || '';
                } // If it's an ID
                if (selector.charAt(0) === '#') {
                    selector = escapeId(selector);
                }
                try {
                    var $selector = $$$1(document).find(selector);
                    return $selector.length > 0 ? selector : null;
                } catch (err) {
                    return null;
                }
            },
            reflow: function reflow(element) {
                return element.offsetHeight;
            },
            triggerTransitionEnd: function triggerTransitionEnd(element) {
                $$$1(element).trigger(transition.end);
            },
            supportsTransitionEnd: function supportsTransitionEnd() {
                return Boolean(transition);
            },
            isElement: function isElement(obj) {
                return (obj[0] || obj).nodeType;
            },
            typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
                for (var property in configTypes) {
                    if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
                        var expectedTypes = configTypes[property];
                        var value = config[property];
                        var valueType = value && Util.isElement(value) ? 'element' : toType(value);
                        if (!new RegExp(expectedTypes).test(valueType)) {
                            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
                        }
                    }
                }
            }
        };
        setTransitionEndSupport();
        return Util;
    }($);
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v4.0.0): collapse.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * --------------------------------------------------------------------------
     */
    var Collapse = function ($$$1) {
        /**
         * ------------------------------------------------------------------------
         * Constants
         * ------------------------------------------------------------------------
         */
        var NAME = 'collapse';
        var VERSION = '4.0.0';
        var DATA_KEY = 'bs.collapse';
        var EVENT_KEY = "." + DATA_KEY;
        var DATA_API_KEY = '.data-api';
        var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
        var TRANSITION_DURATION = 600;
        var Default = {
            toggle: true,
            parent: ''
        };
        var DefaultType = {
            toggle: 'boolean',
            parent: '(string|element)'
        };
        var Event = {
            SHOW: "show" + EVENT_KEY,
            SHOWN: "shown" + EVENT_KEY,
            HIDE: "hide" + EVENT_KEY,
            HIDDEN: "hidden" + EVENT_KEY,
            CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
        };
        var ClassName = {
            SHOW: 'show',
            COLLAPSE: 'collapse',
            COLLAPSING: 'collapsing',
            COLLAPSED: 'collapsed'
        };
        var Dimension = {
            WIDTH: 'width',
            HEIGHT: 'height'
        };
        var Selector = {
            ACTIVES: '.show, .collapsing',
            DATA_TOGGLE: '[data-toggle="collapse"]'
            /**
             * ------------------------------------------------------------------------
             * Class Definition
             * ------------------------------------------------------------------------
             */
        };
        var Collapse =
            /*#__PURE__*/
            function () {
                function Collapse(element, config) {
                    this._isTransitioning = false;
                    this._element = element;
                    this._config = this._getConfig(config);
                    this._triggerArray = $$$1.makeArray($$$1("[data-toggle=\"collapse\"][href=\"#" + element.id + "\"]," + ("[data-toggle=\"collapse\"][data-target=\"#" + element.id + "\"]")));
                    var tabToggles = $$$1(Selector.DATA_TOGGLE);
                    for (var i = 0; i < tabToggles.length; i++) {
                        var elem = tabToggles[i];
                        var selector = Util.getSelectorFromElement(elem);
                        if (selector !== null && $$$1(selector).filter(element).length > 0) {
                            this._selector = selector;
                            this._triggerArray.push(elem);
                        }
                    }
                    this._parent = this._config.parent ? this._getParent() : null;
                    if (!this._config.parent) {
                        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
                    }
                    if (this._config.toggle) {
                        this.toggle();
                    }
                } // Getters
                var _proto = Collapse.prototype;
                // Public
                _proto.toggle = function toggle() {
                    if ($$$1(this._element).hasClass(ClassName.SHOW)) {
                        this.hide();
                    } else {
                        this.show();
                    }
                };
                _proto.show = function show() {
                    var _this = this;
                    if (this._isTransitioning || $$$1(this._element).hasClass(ClassName.SHOW)) {
                        return;
                    }
                    var actives;
                    var activesData;
                    if (this._parent) {
                        actives = $$$1.makeArray($$$1(this._parent).find(Selector.ACTIVES).filter("[data-parent=\"" + this._config.parent + "\"]"));
                        if (actives.length === 0) {
                            actives = null;
                        }
                    }
                    if (actives) {
                        activesData = $$$1(actives).not(this._selector).data(DATA_KEY);
                        if (activesData && activesData._isTransitioning) {
                            return;
                        }
                    }
                    var startEvent = $$$1.Event(Event.SHOW);
                    $$$1(this._element).trigger(startEvent);
                    if (startEvent.isDefaultPrevented()) {
                        return;
                    }
                    if (actives) {
                        Collapse._jQueryInterface.call($$$1(actives).not(this._selector), 'hide');
                        if (!activesData) {
                            $$$1(actives).data(DATA_KEY, null);
                        }
                    }
                    var dimension = this._getDimension();
                    $$$1(this._element).removeClass(ClassName.COLLAPSE).addClass(ClassName.COLLAPSING);
                    this._element.style[dimension] = 0;
                    if (this._triggerArray.length > 0) {
                        $$$1(this._triggerArray).removeClass(ClassName.COLLAPSED).attr('aria-expanded', true);
                    }
                    this.setTransitioning(true);
                    var complete = function complete() {
                        $$$1(_this._element).removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE).addClass(ClassName.SHOW);
                        _this._element.style[dimension] = '';
                        _this.setTransitioning(false);
                        $$$1(_this._element).trigger(Event.SHOWN);
                    };
                    if (!Util.supportsTransitionEnd()) {
                        complete();
                        return;
                    }
                    var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
                    var scrollSize = "scroll" + capitalizedDimension;
                    $$$1(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
                    this._element.style[dimension] = this._element[scrollSize] + "px";
                };
                _proto.hide = function hide() {
                    var _this2 = this;
                    if (this._isTransitioning || !$$$1(this._element).hasClass(ClassName.SHOW)) {
                        return;
                    }
                    var startEvent = $$$1.Event(Event.HIDE);
                    $$$1(this._element).trigger(startEvent);
                    if (startEvent.isDefaultPrevented()) {
                        return;
                    }
                    var dimension = this._getDimension();
                    this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + "px";
                    Util.reflow(this._element);
                    $$$1(this._element).addClass(ClassName.COLLAPSING).removeClass(ClassName.COLLAPSE).removeClass(ClassName.SHOW);
                    if (this._triggerArray.length > 0) {
                        for (var i = 0; i < this._triggerArray.length; i++) {
                            var trigger = this._triggerArray[i];
                            var selector = Util.getSelectorFromElement(trigger);
                            if (selector !== null) {
                                var $elem = $$$1(selector);
                                if (!$elem.hasClass(ClassName.SHOW)) {
                                    $$$1(trigger).addClass(ClassName.COLLAPSED).attr('aria-expanded', false);
                                }
                            }
                        }
                    }
                    this.setTransitioning(true);
                    var complete = function complete() {
                        _this2.setTransitioning(false);
                        $$$1(_this2._element).removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE).trigger(Event.HIDDEN);
                    };
                    this._element.style[dimension] = '';
                    if (!Util.supportsTransitionEnd()) {
                        complete();
                        return;
                    }
                    $$$1(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
                };
                _proto.setTransitioning = function setTransitioning(isTransitioning) {
                    this._isTransitioning = isTransitioning;
                };
                _proto.dispose = function dispose() {
                    $$$1.removeData(this._element, DATA_KEY);
                    this._config = null;
                    this._parent = null;
                    this._element = null;
                    this._triggerArray = null;
                    this._isTransitioning = null;
                }; // Private
                _proto._getConfig = function _getConfig(config) {
                    config = _extends({}, Default, config);
                    config.toggle = Boolean(config.toggle); // Coerce string values
                    Util.typeCheckConfig(NAME, config, DefaultType);
                    return config;
                };
                _proto._getDimension = function _getDimension() {
                    var hasWidth = $$$1(this._element).hasClass(Dimension.WIDTH);
                    return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
                };
                _proto._getParent = function _getParent() {
                    var _this3 = this;
                    var parent = null;
                    if (Util.isElement(this._config.parent)) {
                        parent = this._config.parent; // It's a jQuery object
                        if (typeof this._config.parent.jquery !== 'undefined') {
                            parent = this._config.parent[0];
                        }
                    } else {
                        parent = $$$1(this._config.parent)[0];
                    }
                    var selector = "[data-toggle=\"collapse\"][data-parent=\"" + this._config.parent + "\"]";
                    $$$1(parent).find(selector).each(function (i, element) {
                        _this3._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
                    });
                    return parent;
                };
                _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(element, triggerArray) {
                    if (element) {
                        var isOpen = $$$1(element).hasClass(ClassName.SHOW);
                        if (triggerArray.length > 0) {
                            $$$1(triggerArray).toggleClass(ClassName.COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
                        }
                    }
                }; // Static
                Collapse._getTargetFromElement = function _getTargetFromElement(element) {
                    var selector = Util.getSelectorFromElement(element);
                    return selector ? $$$1(selector)[0] : null;
                };
                Collapse._jQueryInterface = function _jQueryInterface(config) {
                    return this.each(function () {
                        var $this = $$$1(this);
                        var data = $this.data(DATA_KEY);
                        var _config = _extends({}, Default, $this.data(), typeof config === 'object' && config);
                        if (!data && _config.toggle && /show|hide/.test(config)) {
                            _config.toggle = false;
                        }
                        if (!data) {
                            data = new Collapse(this, _config);
                            $this.data(DATA_KEY, data);
                        }
                        if (typeof config === 'string') {
                            if (typeof data[config] === 'undefined') {
                                throw new TypeError("No method named \"" + config + "\"");
                            }
                            data[config]();
                        }
                    });
                };
                _createClass(Collapse, null, [{
                    key: "VERSION",
                    get: function get() {
                        return VERSION;
                    }
                }, {
                    key: "Default",
                    get: function get() {
                        return Default;
                    }
                }]);
                return Collapse;
            }();
        /**
         * ------------------------------------------------------------------------
         * Data Api implementation
         * ------------------------------------------------------------------------
         */
        $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
            // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
            if (event.currentTarget.tagName === 'A') {
                event.preventDefault();
            }
            var $trigger = $$$1(this);
            var selector = Util.getSelectorFromElement(this);
            $$$1(selector).each(function () {
                var $target = $$$1(this);
                var data = $target.data(DATA_KEY);
                var config = data ? 'toggle' : $trigger.data();
                Collapse._jQueryInterface.call($target, config);
            });
        });
        /**
         * ------------------------------------------------------------------------
         * jQuery
         * ------------------------------------------------------------------------
         */
        $$$1.fn[NAME] = Collapse._jQueryInterface;
        $$$1.fn[NAME].Constructor = Collapse;
        $$$1.fn[NAME].noConflict = function () {
            $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
            return Collapse._jQueryInterface;
        };
        return Collapse;
    }($);

    var bestNoiseCancelling =
        '<br><a data-toggle="collapse" class="collapsed" href="#collapseNoise_Cancelling_vs_Noise_Isolation_-_Is_Noise_Cancelling_Better" id="Noise_Cancelling_vs_Noise_Isolation_-_Is_Noise_Cancelling_Better-"><span id="Noise_Cancelling_vs_Noise_Isolation_ndash_Is_Noise_Cancelling_Better">Noise Cancelling vs Noise Isolation – Is Noise Cancelling Better?</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseNoise_Cancelling_vs_Noise_Isolation_-_Is_Noise_Cancelling_Better">\n' +
        '   <p>There is a lot of misconception about noise cancelling and noise isolation. Here we’ll explain the difference.</p>\n' +
        '   <p><strong>Noise Cancelling</strong></p>\n' +
        '   <p>Noise cancelling also known as <a href="https://en.wikipedia.org/wiki/Active_noise_control">active noise cancellation</a> is a powered system that requires a microphone and a battery to function.</p>\n' +
        '   <p>The microphone picks up the surrounding noise and sends the opposite frequency to the headphones to negate the unwanted noise.</p>\n' +
        '   <p>This works nicely for constant, low frequency sounds like the constant engine noise.</p>\n' +
        '   <p>When active noise cancelation is on it feels like you’re in a quieter place, but it does not cancel out all ambient noise.</p>\n' +
        '   <p>The sound of human voices, loud music, and every other, non-constant frequencies aren’t cancelled out and you’ll still hear them.</p>\n' +
        '   <p>Usually, the combination of active noise cancellation and passive noise isolation offers the best results.</p>\n' +
        '   <p><strong>Noise Isolation</strong></p>\n' +
        '   <p>Passive noise isolation is a more basic concept, but very effective nonetheless. It uses no batteries or microphone, just simple noise blocking by isolation.</p>\n' +
        '   <p>For over-ear headphones the use of tight-fitting ear pads plays a crucial role in blocking out all external noise. For in-ear monitors, using double or triple flanged ear tips usually gives the best results.</p>\n' +
        '   <p>You can <a href="https://headphonesaddict.com/best-noise-isolating-earbuds/">find great noise isolating earbuds here</a>.</p>\n' +
        '   <p>Good noise isolating headphones will block up to 37 dB of noise which means, complete isolation from normal conversation volume, especially once you play some music.</p>\n' +
        '   <p>Passive noise isolation blocks all outside sounds, from neighbors to loud kids. This makes them very useful when you just want to have some peace and quiet and not be bothered by the outside world.</p>\n' +
        '   <p>On the other hand, complete sound isolation can be dangerous in public places, like walking on the street when it’s good to know what is going on around you.</p>\n' +
        '</div>\n' +
        '<a data-toggle="collapse" class="collapsed" href="#collapseWhat_are_the_Benefits_of_Noise_Cancelling_Headphones" id="What_are_the_Benefits_of_Noise_Cancelling_Headphones-"><span id="What_are_the_Benefits_of_Noise_Cancelling_Headphones">What are the Benefits of Noise Cancelling Headphones?</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseWhat_are_the_Benefits_of_Noise_Cancelling_Headphones">\n' +
        '   <p>Noise cancelling headphones will get rid of most background noise with their special electronics. It’s most effective against lower sounds (like airplane noise, traffic, etc.) and less effective against higher frequency sounds (like human voices and birds chirping).</p>\n' +
        '   <p><a href="https://electronics.howstuffworks.com/gadgets/audio-music/noise-canceling-headphone3.htm" rel="noopener">How noise cancelling works</a>?</p>\n' +
        '   <p>Once you press the button to activate noise cancelling, part of the background sounds will just disappear, making the illusion of a quieter environment. It’s really surprising the first time you experience it.</p>\n' +
        '   <p>Noise-canceling headphones are the best for traveling since travelling is often loud.</p>\n' +
        '</div>\n' +
        '<a data-toggle="collapse" class="collapsed" href="#collapseCan_Noise_Cancelling_Headphones_Hurt_Your_Ears" id="Can_Noise_Cancelling_Headphones_Hurt_Your_Ears-"><span id="Can_Noise_Cancelling_Headphones_Hurt_Your_Ears">Can Noise Cancelling Headphones Hurt Your Ears?</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseCan_Noise_Cancelling_Headphones_Hurt_Your_Ears">\n' +
        '   <p>Because noise cancellation technology doesn’t emit any kind of radiation or any other kind of harmful effects, it’s perfectly safe to use NC headphones. The technology is quite basic once you understand it. It cancels out ambient noise in a perfectly harmless way.</p>\n' +
        '</div>\n' +
        '<a data-toggle="collapse" class="collapsed" href="#collapseCan_You_Sleep_with_Noise_Cancelling_Headphones" id="Can_You_Sleep_with_Noise_Cancelling_Headphones-"><span id="Can_You_Sleep_with_Noise_Cancelling_Headphones">Can You Sleep with Noise Cancelling Headphones?</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseCan_You_Sleep_with_Noise_Cancelling_Headphones">\n' +
        '   <p><img class="size-full wp-image-3480 alignnone" title="sleeping with headphones" src="https://headphonesaddict.com/wp-content/uploads/2015/09/sleeping-with-headphones.jpg" alt="sleeping with headphones" width="960" height="560" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/09/sleeping-with-headphones.jpg 960w, https://headphonesaddict.com/wp-content/uploads/2015/09/sleeping-with-headphones-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/09/sleeping-with-headphones-768x448.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2015/09/sleeping-with-headphones-500x292.jpg 500w" sizes="(max-width: 960px) 100vw, 960px"></p>\n' +
        '   <p>Yes, you can but only if they are comfortable for you.</p>\n' +
        '   <p>Smaller noise cancellation earbuds are better for sleeping since they’re more comfortable but that’s not always the case. Additionally, if you move around a lot during sleep you might damage your headphones. For some people just getting regular ear plugs works equally well.</p>\n' +
        '</div>\n' +
        '<a data-toggle="collapse" class="collapsed" href="#collapseWhat_Does_Active_Noise_Cancelling_Up_to_95-_Actually_Mean-_-or_up_to_28dB" id="What_Does_Active_Noise_Cancelling_Up_to_95-_Actually_Mean-_-or_up_to_28dB-"><span id="What_Does_Active_Noise_Cancelling_Up_to_95_Actually_Mean_or_up_to_28dB">What Does Active Noise Cancelling Up to 95% Actually Mean? (or up to 28dB)</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseWhat_Does_Active_Noise_Cancelling_Up_to_95-_Actually_Mean-_-or_up_to_28dB">\n' +
        '   <p>Here’s an interesting fact.</p>\n' +
        '   <p>All ANC (active noise cancelling) ratings represent a measurement at best possible conditions.</p>\n' +
        '   <p>Usually, the effectiveness of noise cancelling is measured at specific, low frequency and lower volume conditions, since this is where ANC is most effective.</p>\n' +
        '   <p>It doesn’t mean active noise cancelling headphones with 95% rated effectiveness will cancel out 95% of background noise. They will cancel various frequencies at different levels.</p>\n' +
        '   <p>Take the ANC ratings with a grain of salt as these don’t represent the exact behavior and effectiveness of the noise cancelling technology.</p>\n' +
        '</div>\n' +
        '<a data-toggle="collapse" class="collapsed" href="#collapseWhat_Are_Your_Favorite_Noise_Cancelling_Earbuds" id="What_Are_Your_Favorite_Noise_Cancelling_Earbuds-"><span id="What_Are_Your_Favorite_Noise_Cancelling_Earbuds">What Are Your Favorite Noise Cancelling Earbuds?</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseWhat_Are_Your_Favorite_Noise_Cancelling_Earbuds">\n' +
        '   <p>If you have great active noise cancelling earbuds that you want the world to know about and we haven’t reviewed them on this page, please let us know.</p>\n' +
        '   <p>You can either contact us through the website or just leave a comment below.</p>\n' +
        '   <p>Tell us why you think your favorite model is better so we can compare them to other NC models.</p>\n' +
        '   <p>To get future updates, like the page on social media or subscribe to get updates.</p>\n' +
        '</div>\n' +
        '<h2 id="Best_Noise_Cancelling_Earbuds_Reviewed_1"><span id="Best_Noise_Cancelling_Earbuds_Reviewed">Best Noise Cancelling Earbuds Reviewed</span></h2>\n' +
        '<h3 id="best_overall-_Bose_QuietComfort_20"><span id="best_overall_Bose_QuietComfort_20">best overall: <a href="https://www.amazon.com/dp/B00X9KVVQK/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB00X9KVVQK%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Bose QuietComfort 20</a></span></h3>\n' +
        '<p><img class="wp-image-1110 size-full alignnone" title="Bose QuietComfort 20 - Best Noise Cancelling Earbuds" src="https://headphonesaddict.com/wp-content/uploads/2015/09/Bose-QuietComfort-20.jpg" alt="black Bose QuietComfort 20 earbuds" width="250" height="250" srcset="https://headphonesaddict.com/wp-content/uploads/2015/09/Bose-QuietComfort-20.jpg 250w, https://headphonesaddict.com/wp-content/uploads/2015/09/Bose-QuietComfort-20-150x150.jpg 150w, https://headphonesaddict.com/wp-content/uploads/2015/09/Bose-QuietComfort-20-30x30.jpg 30w, https://headphonesaddict.com/wp-content/uploads/2015/09/Bose-QuietComfort-20-45x45.jpg 45w" sizes="(max-width: 250px) 100vw, 250px"></p>\n' +
        '<p><em>Bose QuietComfort 20 are the best noise cancelling earbuds, bar none, on the market right now.</em></p>\n' +
        '<p><strong>PROS</strong></p>\n' +
        '<ul>\n' +
        '   <li>Best in class noise cancelling technology</li>\n' +
        '   <li>Very comfortable with stable fit</li>\n' +
        '   <li>Good build quality that’s going to last</li>\n' +
        '   <li>Perfect earbuds for travelers</li>\n' +
        '   <li>Sound quality comparable with the best ANC headphones</li>\n' +
        '</ul>\n' +
        '<p><strong>CONS</strong></p>\n' +
        '<ul>\n' +
        '   <li>Pricey</li>\n' +
        '   <li>With ANC off, sound quality takes a dive</li>\n' +
        '</ul>\n' +
        '<p>Some might not like Bose products, but when it comes to sound cancelling, they are the best in business.</p>\n' +
        '<p>It’s a fact<a href="https://en.wikipedia.org/wiki/Amar_Bose"> Amar Bose</a> and his company first offered noise-cancelling headphones to the public.</p>\n' +
        '<p>With QC 20 not only do you get the best active noise cancellation, but also very comfortable, durable and good sounding earbuds, all in one package.</p>\n' +
        '<p><strong>Noise Cancellation</strong></p>\n' +
        '<p>If you want to magically delete the background noise and just enjoy the music while still hearing higher pitched sound, <a href="https://www.bose.com/">Bose</a> QuietComfort 20 are the best audio equipment for this job.</p>\n' +
        '<p><strong>With the combination of good passive noise isolation and best in class, active noise cancelling, you won’t find better earbuds.</strong></p>\n' +
        '<p>It seems noise cancelling works better even for higher frequencies than with competitive ANC (active noise cancelling) headphones. They are so good, these earbuds won’t just remove the humming sound of plane engines, but also parts of street traffic, human conversation and bird chirping.</p>\n' +
        '<p>They don’t completely cancel these sounds, but do it better than any other earbud model out there.</p>\n' +
        '<p>Additionally, these have a special feature called, Aware mode, which lowers the level of noise cancelling for cases when you need to hear the people around you. It works nicely and it’s as simple as pressing a button.</p>\n' +
        '<p>Click on a button to activate it, and click again to deactivate, it works like magic.</p>\n' +
        '<p>The battery needed for noise cancellation is unfortunately not replaceable, but has about 16 hours of battery life (USB charging), which is quite good. Since it’s a lithium-ion battery it is good for about 500 full charges, after which the capacity will start to diminish.</p>\n' +
        '<p><img class="wp-image-1111 size-full alignnone" title="Travelers\' Choice - TripAdvisor Award 2015 for Bose QC 20" src="https://headphonesaddict.com/wp-content/uploads/2015/09/TripAdvisor-Award-Bose-QC-20.jpg" alt="TripAdvisor Award Bose QC 20" width="180" height="180" srcset="https://headphonesaddict.com/wp-content/uploads/2015/09/TripAdvisor-Award-Bose-QC-20.jpg 180w, https://headphonesaddict.com/wp-content/uploads/2015/09/TripAdvisor-Award-Bose-QC-20-150x150.jpg 150w, https://headphonesaddict.com/wp-content/uploads/2015/09/TripAdvisor-Award-Bose-QC-20-30x30.jpg 30w, https://headphonesaddict.com/wp-content/uploads/2015/09/TripAdvisor-Award-Bose-QC-20-45x45.jpg 45w" sizes="(max-width: 180px) 100vw, 180px"></p>\n' +
        '<p>If you’re a heavy user, like 10 hours per day on average, you can expect a good year and a half of use out of them.</p>\n' +
        '<p><strong>Bose QuietComfort 20 got the Travelers’ Choice Award 2015 for being the best noise-canceling earbuds.</strong></p>\n' +
        '<p><strong>Durability</strong></p>\n' +
        '<p><em>Build quality is good, even if earbuds are made of plastics.</em></p>\n' +
        '<p>The silicone ear tips are well made and provide a tight fit. Cables are protected by a nice amount of rubber and there seem to be no major weak points in the design.</p>\n' +
        '<p><strong>Comfort</strong></p>\n' +
        '<p><em>Because of their lightweight design and quality silicone ear tips, Bose QuietComfort 20 are very comfortable.</em></p>\n' +
        '<p>In the package you get 3 different sizes of ear tips, small, medium and large that will fit in most people’s ears. The ear tips seem shorter and from the looks of it, don’t promise a lot in terms of passive noise isolation and stability of the fit…</p>\n' +
        '<p>…but they do a very nice job. With the combination of “wings” that you attach to your ears, the fit is very stable and comfortable at the same time. They aren’t the most comfortable earbuds in the world, but pretty close.</p>\n' +
        '<p>Passive noise isolation is quite good as well, especially once you find the proper size of ear tips.</p>\n' +
        '<p><strong>Features</strong></p>\n' +
        '<p>The microphone is positioned on the cable and works like intended, you can comfortably make calls without interruptions.</p>\n' +
        '<p>The controls are conveniently placed and you’ll get used to them very quickly. You can control; play/pause, next/previous song and ANC on/off, plus the button for Aware mode (just make sure to buy the right OS model – iOS or Android).</p>\n' +
        '<p>There are also older, cheaper Bose models that have equally good noise isolation if you don’t want to pay the full price.</p>\n' +
        '<blockquote>\n' +
        '   <p>Want headphones for swimming? <a href="https://headphonesaddict.com/best-waterproof-ipod-mp3-players/">Click here to find top waterproof iPods</a>.</p>\n' +
        '</blockquote>\n' +
        '<p><strong>Sound</strong></p>\n' +
        '<p><em>Sound quality is very good for noise-cancelling headphones, but obviously, can’t compare to regular, audiophile models.</em></p>\n' +
        '<p>It seems the sound is better when noise cancelling is on, compared to when it’s offline. The mids are usually more recessed in the latter case so it makes sense to always use ANC (active noise cancelling) mode if possible.</p>\n' +
        '<p>Generally, the sound is still very “Bose-like”. With emphasized bass and treble slightly overshadowing mids. Yet the sound seems more balanced than with previous models, these have better mid-range than any noise cancelling Bose earbuds before.</p>\n' +
        '<p>There isn’t much soundstage, like with most earbuds, and there is also that slightly hearable hiss that noise cancelling technology produces. In the end, sound reduction more than makes up for it, so it’s not really such a big deal.</p>\n' +
        '<p>If you value awesome noise cancellation before sound quality (awesome for frequent travelers), you’ll love these, even if the price is a bit steep. You get what you pay for.</p>\n' +
        '<p><strong><em>In the end, if you want the best possible noise cancelling technology packed in a small, comfortable earbud design that produces good sound quality, Bose QuietComfort 20 are the earbuds for you.</em></strong></p>\n' +
        '<div class="addict-button addict-button-1"><a href="https://www.amazon.com/dp/B00X9KVVQK/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB00X9KVVQK%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Check on Amazon</a></div>\n' +
        '<style>.addict-button-1 > a { background-color: #1583dc;\n' +
        '   color: #fff;\n' +
        '   font-family: Yantramanav, sans-serif;;\n' +
        '   font-size: 19px;\n' +
        '   font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_Top_Noise_Cancelling_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_wireless-_Sony_WI-1000X"><span id="best_wireless_Sony_WI-1000X">best wireless: <a href="https://www.amazon.com/dp/B074KBHW66/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB074KBHW66%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Sony WI-1000X</a></span></h3>\n' +
        '<h3 id=""></h3>\n' +
        '<p><img class="size-full wp-image-2761 alignnone" title="Sony WI-1000X" src="https://headphonesaddict.com/wp-content/uploads/2018/06/Sony-WI-1000X.jpg" alt="Sony WI-1000X" width="750" height="440" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2018/06/Sony-WI-1000X.jpg 750w, https://headphonesaddict.com/wp-content/uploads/2018/06/Sony-WI-1000X-300x176.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2018/06/Sony-WI-1000X-500x293.jpg 500w" sizes="(max-width: 750px) 100vw, 750px"></p>\n' +
        '<p><em>Sony WI-1000X are the best wireless noise cancelling earbuds you can get today.</em></p>\n' +
        '<p><strong>Active noise-cancelling:</strong> Yes<br><strong>Battery life: </strong>Up to 10 hours<br><strong>Neckband-design:</strong> Yes<br><strong>Connection:</strong> Wireless, Bluetooth 4.1</p>\n' +
        '<p><strong>Why Should You Buy These?</strong></p>\n' +
        '<p>If you want the best wireless noise cancelling earbuds, these are your top choice.</p>\n' +
        '<p>Because of their premium neckband design, you will look good no matter where you go. They sit nicely around your neck and pack a solid 10-hour built-in battery (with ANC on). It’s plenty of power for small earphones but obviously can’t compare to over-ear headphones.</p>\n' +
        '<p>Nonetheless, these Sony buds are the closest thing to premium noise canceling earbuds you can get today.</p>\n' +
        '<p>The active noise cancellation can compare to the best in the category and has extra features like “ambient mode” and Sony’s Headphones Connect app for control over settings.</p>\n' +
        '<p>This makes them perfect for office use or work commute. Plus, they’re super portable for flying when space saved in the baggage counts.</p>\n' +
        '<p>Anyway, you can connect them to any Bluetooth device or use them as wired (with the added cable). Add full <a href="https://assistant.google.com/" target="_blank" rel="noopener noreferrer">Google Assistant</a> and Alexa support, and you can understand why these are considered the best wireless choice for many.</p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>While the buds are ergonomically shaped, they aren’t as comfortable as alternatives (like Bose QC30). You might feel a bit of an itch after a couple hours. And, due to neckband, they aren’t suitable for sports (as they move around a lot).</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>The sound these Sony buds produce is excellent considering they are wireless and active noise cancelling. They support Bluetooth codecs like <a href="https://www.sony.net/Products/LDAC/" target="_blank" rel="noopener noreferrer">LDAC</a> and <a href="http://www.aptx.com/" target="_blank" rel="noopener noreferrer">aptX</a> for best wireless sound quality.</p>\n' +
        '<p>You get a balanced sound signature but can play with the app to change the audio to your liking.</p>\n' +
        '<p><strong>All in all, the Sony WI-1000X are the best wireless earbuds with noise cancelling you can get today with plenty of latest technology and features.</strong></p>\n' +
        '<div class="addict-button addict-button-2"><a href="https://www.amazon.com/dp/B074KBHW66/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB074KBHW66%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Check on Amazon</a></div>\n' +
        '<style>.addict-button-2 > a { background-color: #1583dc;\n' +
        '   color: #fff;\n' +
        '   font-family: Yantramanav, sans-serif;;\n' +
        '   font-size: 19px;\n' +
        '   font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_Top_Noise_Cancelling_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="wireless_alternative-_Bose_QuietControl_30"><span id="wireless_alternative_Bose_QuietControl_30">wireless alternative: <a href="https://www.amazon.com/dp/B01HETFQA8/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB01HETFQA8%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Bose QuietControl 30</a></span></h3>\n' +
        '<p><img class="size-full wp-image-1934 alignnone" title="Bose QuietControl 30" src="https://headphonesaddict.com/wp-content/uploads/2015/09/Bose-QuietControl-30.jpg" alt="Bose QuietControl 30" width="480" height="316" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/09/Bose-QuietControl-30.jpg 480w, https://headphonesaddict.com/wp-content/uploads/2015/09/Bose-QuietControl-30-300x198.jpg 300w" sizes="(max-width: 480px) 100vw, 480px"></p>\n' +
        '<p><em>Bose is known for delivering great sound and best-in-class active noise canceling performance. While not as good as QC20, we think these are the best wireless noise cancelling earbuds right now. </em></p>\n' +
        '<p><strong>PROS</strong></p>\n' +
        '<ul>\n' +
        '   <li>Premium sound quality</li>\n' +
        '   <li>Good ANC performance</li>\n' +
        '   <li>Very comfortable</li>\n' +
        '   <li>Wireless Bluetooth connectivity</li>\n' +
        '</ul>\n' +
        '<p><strong>CONS</strong></p>\n' +
        '<ul>\n' +
        '   <li>Talkback microphone is low quality</li>\n' +
        '   <li>ANC may be slightly lower than other Bose products</li>\n' +
        '   <li>Build-quality issues</li>\n' +
        '</ul>\n' +
        '<p>The QuietControl 30 wireless earbuds are very close to earning their place on top, but a few small features may not work for some. Read further for more details.</p>\n' +
        '<p><strong>Noise Cancelling</strong></p>\n' +
        '<p>The Bose QuietControl 30 may not be the most advanced set of active noise cancelling headphones, but they certainly outperform many other ANC earbuds.</p>\n' +
        '<p>The noise cancelling circuit is housed in a lightweight neckband with dual microphones.</p>\n' +
        '<p>Bose’s Connect mobile app allows you to select various levels of noise cancellation so you can fine-tune the performance to your environment.</p>\n' +
        '<p>While the performance of the ANC technology is better than many other noise cancelling earbud brands, users of other Bose ANC products (like the QC35 or QC25 headphones) may feel that the cancellation isn’t quite as good.</p>\n' +
        '<p>To be fair, the QuietControl 30 uses a little bit different type of ANC technology than some of the other Bose products. It works rather well for its intended use.</p>\n' +
        '<p>Overall, lower frequencies are cancelled quite effectively. Some higher frequency noises and strong impulse sounds aren’t cancelled as well.</p>\n' +
        '<p>The noise cancelling mode can work without being connected to a Bluetooth device.</p>\n' +
        '<p><strong>Durability</strong></p>\n' +
        '<p>Everything from the packaging to the product construction is high quality (it only seems).</p>\n' +
        '<p>The neckband that houses the electronics is flexible but not flimsy.</p>\n' +
        '<p>Strain relief for the cables seems adequate for everyday use. Everything looks good the first time you take them in your hands but there are unusually many reports of bad build-quality.</p>\n' +
        '<p>It appears a lot of people experience some kind of durability issues after a couple of months. Durability is hard to determine after the first couple of weeks. So keep in mind you might have the same problems.</p>\n' +
        '<p>Other than that the biggest drawback and quality concern with the QuietControl 30 is the poor talkback built-in mic. This may be caused by some interference with the <a href="https://en.wikipedia.org/wiki/Active_noise_control" rel="noopener noreferrer">ANC circuitry</a>.</p>\n' +
        '<p>If you plan to use these earbuds for talking on the phone, you might want to explore other options. Other than that, this is a good quality product that works for most people though its durability isn’t the best.</p>\n' +
        '<p><strong>Comfort</strong></p>\n' +
        '<p>This is a category were Bose excels. The StayHear+ QC silicone eartips are extremely comfortable and great for long wearing sessions.</p>\n' +
        '<p>There are three different sizes of QC eartips included and they are easy to remove, clean and replace.</p>\n' +
        '<p>The lightweight neckband sits around the back and sides of the neck, is fairly comfortable and works for various wardrobe choices, hiding under a collar if needed.</p>\n' +
        '<p>You can certainly use the Bose QuietControl 30 earbuds for working out, but the neckband may slide around too much and be unsuitable for some activities.</p>\n' +
        '<p><strong>Features</strong></p>\n' +
        '<p>Besides the wireless neckband receiver and attached earbuds, you’ll also receive a charging cable, three eartip sizes, and a nice zippered carrying pouch.</p>\n' +
        '<p>Bluetooth range is effective for 30-50’ and is pretty easy to pair with most devices.</p>\n' +
        '<p>There is no support for a wired audio connection, so that means you can’t use these earbuds to listen to the audio distributed on airplanes.</p>\n' +
        '<p>A 10-hour battery life can be achieved with less than a 3-hour charge, but the earbuds cannot be used while charging.</p>\n' +
        '<p>One really handy feature is the ability to connect the QuietControl 30 earbuds to the Bose Connect mobile app.</p>\n' +
        '<p>This app allows you to dial in the level of noise cancelling you want, as well as save any other custom audio presets for your device.</p>\n' +
        '<p><strong>Sound</strong></p>\n' +
        '<p>Bose delivers crystal clear audio with these earbuds. It isn’t too bass-heavy like some earbuds can be.</p>\n' +
        '<p>The noise cancelling circuit is quiet and doesn’t generate a lot of noticeable self-noise that cheaper ANC products tend to do.</p>\n' +
        '<p>Volume handling is respectable and doesn’t break up at higher levels. The frequency response sounds even and balanced across varied listening levels.</p>\n' +
        '<p>You won’t have to push these earbuds deep into your ear to get a good seal for great sound. The QC eartips hold the lightweight housing in place perfectly.</p>\n' +
        '<p>The Bose QuietControl 30 carries a premium price for a premium product. The ANC technology isn’t perfect, but the overall sound and quality still delivers good value.</p>\n' +
        '<p><strong>If you’re tired of constantly replacing cheap Bluetooth noise cancelling earbuds that aren’t fun to listen to, an upgrade to the QuietControl 30 should be in your future.</strong></p>\n' +
        '<div class="addict-button addict-button-3"><a href="https://www.amazon.com/dp/B01HETFQA8/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB01HETFQA8%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Check on Amazon</a></div>\n' +
        '<style>.addict-button-3 > a { background-color: #1583dc;\n' +
        '   color: #fff;\n' +
        '   font-family: Yantramanav, sans-serif;;\n' +
        '   font-size: 19px;\n' +
        '   font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_Top_Noise_Cancelling_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="wired_alternative-_B-O_Beoplay_E4"><span id="wired_alternative_BO_Beoplay_E4">wired alternative: <a href="https://www.amazon.com/dp/B0719RCW4P/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB0719RCW4P%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">B&amp;O Beoplay E4</a></span></h3>\n' +
        '<p><img class="size-full wp-image-2552 alignnone" title="B&amp;O Beoplay E4" src="https://headphonesaddict.com/wp-content/uploads/2015/09/BO-Beoplay-E4.jpg" alt="B&amp;O Beoplay E4" width="600" height="351" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/09/BO-Beoplay-E4.jpg 600w, https://headphonesaddict.com/wp-content/uploads/2015/09/BO-Beoplay-E4-300x176.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/09/BO-Beoplay-E4-500x293.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></p>\n' +
        '<p><em>One of the best wired noise cancelling earbuds.</em></p>\n' +
        '<p>If you’re looking for high-quality in-ear earphones with noise-cancelling and great sound quality B &amp; O Beoplay E4 are one of the best choices you can make. Though these cost more money than most and still don’t offer wireless Bluetooth connectivity, everything else is top notch.</p>\n' +
        '<p>The small ergonomic, aluminum earbuds offer a good and comfortable fit. Though they aren’t as comfortable as Bose and might be uncomfortable for people with shallow ear canals. The 4 sizes of silicone ear tips are combined with 1 pair of Comply foam ear tips which really improve the comfort. Just keep in mind foam tips needs more frequent replacement.</p>\n' +
        '<p>Active noise cancelation is comparable to Bose’s. It’s even slightly better at canceling out human conversation but not as good at lower sounds like the hum of the airplane. Nonetheless, it’s very effective and justifies the premium price. The battery holds for about 20 hours of noise canceling on a full charge. The connection is wired via a 3.5mm AUX jack.</p>\n' +
        '<p>The “transparency mode” is a type of aware mode which leaks in sound so you can talk to people when needed. It needs some time getting used to but does the job.</p>\n' +
        '<p>In addition, the design looks and feels premium. Build-quality is great and you can expect many years of service from these. Among the accessories, you also get a flight adapter and a carrying pouch.</p>\n' +
        '<p>The microphone works well for calls except in extremely windy situations. In-line buttons are straightforward to use and easy to learn. It will become your second nature in no time.</p>\n' +
        '<p>In the end, the sound quality is their biggest advantage. The sound signature is more balanced than with Bose and offers a quality reproduction of all ranges. There might be a bit of an emphasis on mid-bass but you won’t notice unless you’re a hardcore audiophile.</p>\n' +
        '<p>Furthermore, the soundstage is very good. The instrument separation is noticeably better than with other noise-cancelling earphones. Treble offers high details and clarity. Another good point is that ANC doesn’t change the sound quality when turned on.</p>\n' +
        '<p>In conclusion, Beoplay E4 are definitely one of the best NC in-ear headphones right now as long as you’re willing to pay a premium price and are looking for a wired connection.</p>\n' +
        '<div class="addict-button addict-button-4"><a href="https://www.amazon.com/dp/B0719RCW4P/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB0719RCW4P%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Check on Amazon</a></div>\n' +
        '<style>.addict-button-4 > a { background-color: #1583dc;\n' +
        '   color: #fff;\n' +
        '   font-family: Yantramanav, sans-serif;;\n' +
        '   font-size: 19px;\n' +
        '   font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_Top_Noise_Cancelling_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_under_-100-_Phiaton_BT_120_NC"><span id="best_under_100_Phiaton_BT_120_NC">best under $100: <a href="https://www.amazon.com/dp/B07HGKHSR3/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07HGKHSR3%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1"><strong>Phiaton BT 120 NC</strong></a></span></h3>\n' +
        '<p><img class="wp-image-3477 alignnone" title="Phiaton BT 120 NC" src="https://headphonesaddict.com/wp-content/uploads/2015/09/Phiaton-BT-120-NC.jpg" alt="Phiaton BT 120 NC" width="600" height="350" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/09/Phiaton-BT-120-NC.jpg 960w, https://headphonesaddict.com/wp-content/uploads/2015/09/Phiaton-BT-120-NC-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/09/Phiaton-BT-120-NC-768x448.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2015/09/Phiaton-BT-120-NC-500x292.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></p>\n' +
        '<p><em>Phiaton Curve BT 120 NC are the best noise cancelling earbuds under $100.</em></p>\n' +
        '<p><a href="https://headphonesaddict.com/phiaton-curve-bt-120-nc-review/">Read the full Phiaton Curve BT 120 NC review</a>.</p>\n' +
        '<p><strong>Active noise-cancelling:</strong> Yes<br><strong>Battery life: </strong>Up to 8.5 hours<br><strong>Neckband-design:</strong> Yes<br><strong>Connection:</strong> Wireless, Bluetooth 4.2</p>\n' +
        '<p><strong>Why Should You Buy These?</strong></p>\n' +
        '<p>If you’re looking for affordable noise canceling earbuds under 100 dollars and you travel daily, check these in-ears.</p>\n' +
        '<p>The first thing that catches your eye is their simple yet sleek design. They are light and comfy. Small earbuds allow you to enjoy them for a long time. And, there is an in-line remote to control your music. They are IPX4 sweat resistant, so you can use them for workouts and wear them in the rain.</p>\n' +
        '<p>The battery can last up to 8.5 hours (4.5h with ANC on). The active noise cancelling is average. It removes most of the background noise but isn’t as effective as more expensive earphones.</p>\n' +
        '<p>Nonetheless, for the price, these <a href="https://headphonesaddict.com/category/bluetooth-headphones/">Bluetooth</a> buds are pretty good and come from a reputable brand (<a href="http://www.phiaton.com/" target="_blank" rel="noopener noreferrer">Phiaton</a>).</p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>Control buttons are harder to distinguish, making awkward control common. Especially if you’re running and need to change the song or volume quickly. Battery could be better, and ANC can’t compare to Bose.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>Overall, their sound signature is balanced. Bass is punchy, and it gives you the right amount of motivation if you’re using them in the gym, but don’t expect sonic fidelity. Audio quality almost stays the same with noise cancellation turned on, it’s less of a difference compared to alternatives.</p>\n' +
        '<p><strong>In the end, <a href="https://headphonesaddict.com/phiaton-curve-bt-120-nc-review/">Phiaton BT 120 NC</a> are the best noise cancelling earbuds under 100 dollars you can get today. They provide satisfactory ANC, great comfort, and enjoyable sound.</strong></p>\n' +
        '<div class="addict-button addict-button-5"><a href="https://www.amazon.com/dp/B07HGKHSR3/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07HGKHSR3%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Check on Amazon</a></div>\n' +
        '<style>.addict-button-5 > a { background-color: #1583dc;\n' +
        '   color: #fff;\n' +
        '   font-family: Yantramanav, sans-serif;;\n' +
        '   font-size: 19px;\n' +
        '   font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_Top_Noise_Cancelling_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_for_Lightning-_1MORE_E1004_Dual_ANC_Earbuds"><span id="best_for_Lightning_1MORE_E1004_Dual_ANC_Earbuds">best for Lightning: <a href="https://www.amazon.com/dp/B07418R81X/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07418R81X%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">1MORE E1004 Dual ANC Earbuds</a></span></h3>\n' +
        '<p><img class="size-full wp-image-2550 alignnone" title="1MORE E1004" src="https://headphonesaddict.com/wp-content/uploads/2015/09/1MORE-E1004.jpg" alt="1MORE E1004" width="600" height="350" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/09/1MORE-E1004.jpg 600w, https://headphonesaddict.com/wp-content/uploads/2015/09/1MORE-E1004-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/09/1MORE-E1004-500x292.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></p>\n' +
        '<p><em>The best noise cancelling earbuds for Apple Lightning devices.</em></p>\n' +
        '<p>The first thing you’ll notice about 1MORE E1004 is premium packaging. It looks and feels better than with most premium products. But the reason you should get these is their sound quality. More on this below.</p>\n' +
        '<p>For iPhone users, these are the best noise cancelling in-ear headphones you can get. The connector works with all Apple devices supporting LightningTM connector. No need for adapters.</p>\n' +
        '<p>The active noise cancellation is good. It can’t really compare to Bose but it’s above average nonetheless. The battery is not required because active noise cancelling is run on the phone or tablet.</p>\n' +
        '<p><strong>Note:</strong> <a href="https://headphonesaddict.com/best-kids-headphones/">What are the most durable headphones for kids?</a></p>\n' +
        '<p>Build-quality stays true to the premium look. The beautiful metal casing and quality materials make a good impression. Unless you ear your earbuds for breakfast these will last a long time. The fit and comfort are good too. While they aren’t best suited for sports you could use them for that as well.</p>\n' +
        '<p>With the in-line remote and microphone, you can make calls and control your music without accessing your phone.</p>\n' +
        '<p>The audio quality is their biggest advantage. With great balanced sound signature, you’re getting detailed and rich highs that really come out. The mids and bass aren’t bad either though bassheads will want more.</p>\n' +
        '<p>If you have one of the newer iPhones and want high-quality noise-cancelling earbuds with a lightning connector, your best pick are 1MORE E1004 earphones.</p>\n' +
        '<div class="addict-button addict-button-6"><a href="https://www.amazon.com/dp/B07418R81X/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07418R81X%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Check on Amazon</a></div>\n' +
        '<style>.addict-button-6 > a { background-color: #1583dc;\n' +
        '   color: #fff;\n' +
        '   font-family: Yantramanav, sans-serif;;\n' +
        '   font-size: 19px;\n' +
        '   font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_Top_Noise_Cancelling_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="value_for_money-_Linner_NC50_Wireless"><span id="value_for_money_Linner_NC50_Wireless">value for money: <a href="https://www.amazon.com/dp/B07DXQ7Y3F/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07DXQ7Y3F%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Linner NC50 Wireless</a></span></h3>\n' +
        '<h5><img class="wp-image-2416 size-full alignnone" title="Linner NC50 Noise Cancelling Earbuds" src="https://headphonesaddict.com/wp-content/uploads/2017/12/Linner-NC50-Noise-Cancelling-Earbuds.jpg" alt="Linner NC50 Noise Cancelling Earbuds" width="600" height="400" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2017/12/Linner-NC50-Noise-Cancelling-Earbuds.jpg 600w, https://headphonesaddict.com/wp-content/uploads/2017/12/Linner-NC50-Noise-Cancelling-Earbuds-300x200.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2017/12/Linner-NC50-Noise-Cancelling-Earbuds-500x333.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></h5>\n' +
        '<p><em>Great value-for-money noise cancelling earbuds.</em><strong><br></strong></p>\n' +
        '<p><a href="https://headphonesaddict.com/linner-nc50-review-noise-cancelling-earbuds/">Read the full Linner NC50 review.</a></p>\n' +
        '<p>If you’re looking for a great value for money in noise cancelling in-ear headphones with strong bass look no further.</p>\n' +
        '<p>Linner NC50 earbuds have above-average noise cancellation, maybe not as good as Bose but very effective, especially considering the price.</p>\n' +
        '<p>Take them on the plane, turn on the ANC, play some music and you’ll forget you’re flying on a plane. Since they’re smaller than over-ear headphones this makes them more portable.</p>\n' +
        '<p>Bluetooth connectivity is stable and works well. You also get a good battery life of 9 hours on full charge.</p>\n' +
        '<p>The comfort doesn’t disappoint either. The behind-the-neck fit is comfy since these are lightweight and stick in the ears well.</p>\n' +
        '<p>With IPX4 water protection rating, you can use them in rain or even for sports without worry.</p>\n' +
        '<p>The sound has a strong emphasis on bass which makes these great for all bassheads out there.</p>\n' +
        '<p><strong>All in all, <a href="https://headphonesaddict.com/linner-nc50-review-noise-cancelling-earbuds/">Linner NC50</a> are made even sweeter with the price of around $60 which is very affordable for noise cancelling earphones.</strong></p>\n' +
        '<div class="addict-button addict-button-7"><a href="https://www.amazon.com/dp/B07DXQ7Y3F/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07DXQ7Y3F%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Check on Amazon</a></div>\n' +
        '<style>.addict-button-7 > a { background-color: #1583dc;\n' +
        '   color: #fff;\n' +
        '   font-family: Yantramanav, sans-serif;;\n' +
        '   font-size: 19px;\n' +
        '   font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_Top_Noise_Cancelling_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="wireless_alternative-_Cowin_HE8D"><span id="wireless_alternative_Cowin_HE8D">wireless alternative: <a href="https://www.amazon.com/dp/B074M4VBLC/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB074M4VBLC%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Cowin HE8D</a></span></h3>\n' +
        '<p><img class="size-full wp-image-2551 alignnone" title="Cowin HE8D" src="https://headphonesaddict.com/wp-content/uploads/2015/09/Cowin-HE8D.jpg" alt="Cowin HE8D" width="600" height="350" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/09/Cowin-HE8D.jpg 600w, https://headphonesaddict.com/wp-content/uploads/2015/09/Cowin-HE8D-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/09/Cowin-HE8D-500x292.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></p>\n' +
        '<p><em>Great pair of noise-cancelling earphones under $100.</em></p>\n' +
        '<p>Cowinn HE8D are another great value noise-cancelling earphones. With the price under $100 you get a lot of features and technology.</p>\n' +
        '<p>The package includes a nice, hard carrying case which makes taking these with you much easier.</p>\n' +
        '<p>The ear buds themselves are light and fit into the ear canal rather nicely. They aren’t as comfortable as Bose but close.</p>\n' +
        '<p>The 3 pairs of silicone ear tips provide good noise isolation and with the added active noise cancellation you’ll barely hear any ambient noise. ANC supposedly cancels up to 28dB of noise though this varies depending on circumstances. This rating is valid in “best possible scenario” and does not apply in every case. Nonetheless, noise-cancellation is noticeably effective but not as good as our Bose’s top pick.</p>\n' +
        '<p>Furthermore, the build quality is good. IPX4 rating makes them sweat-proof and can even survive a good splash. They feel solid in hands and don’t seem to have any major weak points. The only concern with all “unknown-brand” models is the quality of their battery life. It holds the power for about 9 to 10 hours but since batteries deteriorate with time it’s hard to say how well this one holds. The battery charges with some fancy magnetic technology which is always nice for some bragging rights.</p>\n' +
        '<p>Bluetooth has the standard 33ft (10m) range without interruptions. The in-line microphone has good voice quality for making calls. The in-line remote buttons aren’t the best but do their job well.</p>\n' +
        '<p>The overall sound signature is slightly bass emphasized. This is geared towards the general audience who prefers slightly more bass. The treble and mids are pretty good as well. Sibilance only comes out at unhealthy high volumes and there’s almost no cable noise.</p>\n' +
        '<p>Overall, Cowin HE8D NC earbuds offer one of the best affordable and functional noise-cancelling earbuds.</p>\n' +
        '<div class="addict-button addict-button-8"><a href="https://www.amazon.com/dp/B074M4VBLC/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB074M4VBLC%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Check on Amazon</a></div>\n' +
        '<style>.addict-button-8 > a { background-color: #1583dc;\n' +
        '   color: #fff;\n' +
        '   font-family: Yantramanav, sans-serif;;\n' +
        '   font-size: 19px;\n' +
        '   font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_Top_Noise_Cancelling_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_for_Xperia-_Sony_MDR-NC31EM_-only_for_Sony-"><span id="best_for_Xperia_Sony_MDR-NC31EM_only_for_Sony">best for Xperia: <a href="https://www.amazon.com/dp/B00HX9AJ5M/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB00HX9AJ5M%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Sony MDR-NC31EM (only for Sony)</a></span></h3>\n' +
        '<p><img class="wp-image-1130 size-full alignnone" title="Sony MDR NC31EM for Sony Xperia Devices" src="https://headphonesaddict.com/wp-content/uploads/2015/09/Sony-MDR-NC31EM.jpg" alt="Sony MDR NC31EM black earbuds for Sony Xperia" width="250" height="204" srcset="https://headphonesaddict.com/wp-content/uploads/2015/09/Sony-MDR-NC31EM.jpg 250w, https://headphonesaddict.com/wp-content/uploads/2015/09/Sony-MDR-NC31EM-30x24.jpg 30w" sizes="(max-width: 250px) 100vw, 250px"></p>\n' +
        '<p><strong>Before the review, you have to know that Sony MDR-NC31E are only compatible with Sony devices that support noise-cancelling technology (Xperia smartphones and tablets).</strong></p>\n' +
        '<p><strong>PROS</strong></p>\n' +
        '<ul>\n' +
        '   <li>Noise cancelling works better than average</li>\n' +
        '   <li>No “box” attached to the cables since NC is processed by connected device</li>\n' +
        '   <li>Needs no battery</li>\n' +
        '   <li>Affordable</li>\n' +
        '   <li>Unique design</li>\n' +
        '   <li>Decent to good sound quality with NC on</li>\n' +
        '</ul>\n' +
        '<p><strong>CONS</strong></p>\n' +
        '<ul>\n' +
        '   <li>Only work with Sony Xperia devices (crucial)</li>\n' +
        '   <li>Should make them more useful for non-Sony devices</li>\n' +
        '</ul>\n' +
        '<p>You can also use these with any device supporting 5 pole 3.5mm output, but noise cancelling won’t work because it needs the on-board noise circuitry that only Sony devices have.</p>\n' +
        '<p>If you’re not using one of these Sony devices, it would be better to look at some other noise cancelling in-ear earbuds.</p>\n' +
        '<p>On the other hand, with an Xperia device, these earbuds work very well.</p>\n' +
        '<p><strong>Noise Cancellation</strong></p>\n' +
        '<p><em>According to Sony, these have up to 98% of noise cancelling.</em></p>\n' +
        '<p>This is more than any other competitive models, though we still think Bose QuietComfort 20 have a clear advantage in this regard.</p>\n' +
        '<p>With a good seal you should get a much cleaner and quieter sound, generally, noise cancelling in NC31EM works better than average (just with compatible Xperia devices).</p>\n' +
        '<p>The great thing about Sony MDR NC31E is that they have no additional “box” with the noise cancelling circuitry like other ANC (active noise cancelling) headphones.</p>\n' +
        '<p>This makes them more portable as you don’t have to worry about where to put the box, which is more of a nuisance than anything else.</p>\n' +
        '<p>Everything is taken care of by your connected Sony device, including all the controls. Turning NC on or off takes just a few taps.</p>\n' +
        '<p>They also give you the option of adjusting the noise cancelling depending on where you are, you have the option of flight mode, bus mode and office mode. These work well, but only use them when appropriate.</p>\n' +
        '<p>Additionally, you don’t have to worry about the battery life, as these have none. Just plug-in and play.</p>\n' +
        '<p><strong>Durability</strong></p>\n' +
        '<p>The earbuds are made out of plastic with decent, rubberized, uneven length cable that is prone to tangling (left side is shorted than right side). The build quality is good, like most Sony products, but nothing special.</p>\n' +
        '<p>You have to understand these are “lower-end” noise canceling earbuds that cost under $100 so you can’t expect top-notch durability.</p>\n' +
        '<p>If you plan on using these occasionally, for traveling like most people, then durability won’t be an issue. Just don’t expect to use them for very long if you make these your main, everyday use, earbuds. Check <a href="https://headphonesaddict.com/the-most-durable-earbuds/">the most durable earbud models</a>.</p>\n' +
        '<p><strong>Comfort</strong></p>\n' +
        '<p>When it comes to the fit and comfort Sony MDR NC31E aren’t bad either. The changeable ear tips play a crucial role in comfort. You can easily replace them with foam Comply tips if you want better comfort.</p>\n' +
        '<p>They are comfortable enough for in-ear monitors, but can’t exactly compare to the most comfortable IEM models.</p>\n' +
        '<p><strong>Features</strong></p>\n' +
        '<p>The noise cancelling works because the microphones are built-in the earbuds themselves and the actual noise cancelling wave producing is handled by the connected Xperia device.</p>\n' +
        '<p>There are no earbuds like these on the market right now and if you use Sony devices you can’t go wrong with these.</p>\n' +
        '<p><strong>Sound</strong></p>\n' +
        '<p><em>The sound quality is pretty good.</em> It’s more of a balanced sound, definitely not bass heavy. It’s what you would expect from $50 earbuds.</p>\n' +
        '<p>Can’t compare to audiophile headphones and at the same time produce better sound than most $20 earbuds.</p>\n' +
        '<p>You shouldn’t expect over the top sound quality since these are noise cancelling headphones after all, but it’s good enough to enjoy some music during a plane flight.</p>\n' +
        '<p><strong><em>All in all, if you’re looking for affordable, noise cancelling earbuds and use Sony Xperia devices, the MDR-NC31E are a very good choice.</em></strong></p>\n' +
        '<div class="addict-button addict-button-9"><a href="https://www.amazon.com/dp/B00HX9AJ5M/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB00HX9AJ5M%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Check on Amazon</a></div>\n' +
        '<style>.addict-button-9 > a { background-color: #1583dc;\n' +
        '   color: #fff;\n' +
        '   font-family: Yantramanav, sans-serif;;\n' +
        '   font-size: 19px;\n' +
        '   font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_Top_Noise_Cancelling_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_budget-_TaoTronics_Noise_Cancelling_Earbuds_-TT-EP002-"><span id="best_budget_TaoTronics_Noise_Cancelling_Earbuds_TT-EP002">best budget: <a href="https://www.amazon.com/dp/B07FM1L5HJ/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07FM1L5HJ%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">TaoTronics Noise Cancelling Earbuds (TT-EP002)</a></span></h3>\n' +
        '<p><img class="wp-image-2299 size-full alignnone" title="TaoTronics Noise Cancelling Earbuds" src="https://headphonesaddict.com/wp-content/uploads/2015/09/TaoTronics-Noise-Cancelling-Earbuds.jpg" alt="TaoTronics Noise Cancelling Earbuds" width="450" height="300" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/09/TaoTronics-Noise-Cancelling-Earbuds.jpg 450w, https://headphonesaddict.com/wp-content/uploads/2015/09/TaoTronics-Noise-Cancelling-Earbuds-300x200.jpg 300w" sizes="(max-width: 450px) 100vw, 450px"></p>\n' +
        '<p><em>The best cheap noise cancelling earbuds.</em></p>\n' +
        '<p><a href="https://headphonesaddict.com/taotronics-tt-ep002-noise-cancelling-earbuds-review/">Read the full TaoTronics TT-EP002 review.</a></p>\n' +
        '<p>For a budget option of active noise-canceling earbuds these are the best. Now keep in mind these are very cheap compared to other NC earbuds so don’t compare them. You won’t get the same NC technology.</p>\n' +
        '<p><strong>PROS</strong></p>\n' +
        '<ul>\n' +
        '   <li>Very cheap price</li>\n' +
        '   <li>Quite comfortable and durable design</li>\n' +
        '   <li>Effective noise cancellation for the price</li>\n' +
        '   <li>Great value for money overall</li>\n' +
        '</ul>\n' +
        '<p><strong>CONS</strong></p>\n' +
        '<ul>\n' +
        '   <li>Can’t compare to higher-end models</li>\n' +
        '</ul>\n' +
        '<p><iframe src="https://www.youtube-nocookie.com/embed/tkKlbcOQ_-k" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p>\n' +
        '<p><strong>What’s in the box?</strong></p>\n' +
        '<ul>\n' +
        '   <li>TaoTronics noise cancelling wired earbuds (model:TT-EP002)</li>\n' +
        '   <li>3 pairs of silicone eartips</li>\n' +
        '   <li>2 pairs of ear hooks</li>\n' +
        '   <li>Short Micro-USB charging cable</li>\n' +
        '   <li>Airline adapter</li>\n' +
        '   <li>Soft carrying pouch</li>\n' +
        '   <li>User manual</li>\n' +
        '</ul>\n' +
        '<p><img class="alignnone wp-image-2300 size-full" title="TaoTronics Noise Cancelling Earbuds Unboxed" src="https://headphonesaddict.com/wp-content/uploads/2015/09/TaoTronics-Noise-Cancelling-Earbuds-Unboxed.jpg" alt="TaoTronics Noise Cancelling Earbuds Unboxed" width="450" height="450" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/09/TaoTronics-Noise-Cancelling-Earbuds-Unboxed.jpg 450w, https://headphonesaddict.com/wp-content/uploads/2015/09/TaoTronics-Noise-Cancelling-Earbuds-Unboxed-150x150.jpg 150w, https://headphonesaddict.com/wp-content/uploads/2015/09/TaoTronics-Noise-Cancelling-Earbuds-Unboxed-300x300.jpg 300w" sizes="(max-width: 450px) 100vw, 450px"></p>\n' +
        '<p><strong>Noise Cancellation</strong></p>\n' +
        '<p>The noise cancellation circuitry is installed in a small box which your <a href="https://headphonesaddict.com/category/earbuds/">earbuds</a> connect to. On the box are all the switches which control ANC.</p>\n' +
        '<p>How effective is it?</p>\n' +
        '<p>Well for the price it’s quite good, but don’t expect to compare them to higher-end NC earbuds. Bose is still much better and the difference is paid in price.</p>\n' +
        '<p>Nonetheless for such a cheap price these canceling earbuds perform rather well. You will get a noticeable reduction in outside noise, especially the lower ranges.</p>\n' +
        '<p>TaoTronics reports up to 25dB noise reduction but we all know this greatly depends at what frequencies this is measured. For the price, it does what it promises.</p>\n' +
        '<p>Since noise cancelling is very useful for airplane travel you also get an airplane adapter as an accessory.</p>\n' +
        '<p>The battery holds about 15 hours of playtime per full charge. This depends on the mode used and volume you listen to but most users will get about 15h out of it.</p>\n' +
        '<p>With “monitoring mode” you can control how much external noise gets let through which might be useful for hearing a flight attendant or other people around when needed.</p>\n' +
        '<p><strong>Durability</strong></p>\n' +
        '<p>Build-quality isn’t bad either. The casing is made out of aluminum and quality plastics. The weak points have some strain relief but the cable is rather average. Plain rubbery cables with an I 3.5mm plug at the end.</p>\n' +
        '<p>These noise cancelling TaoTronics earbuds aren’t made for sports, they’re not sweat-proof so don’t use them for sports.</p>\n' +
        '<p>For runners, here are <a href="https://headphonesaddict.com/best-headphones-for-running/">best earbuds for running</a> in case you want more sports-oriented IEMs.</p>\n' +
        '<p><strong>Comfort</strong></p>\n' +
        '<p>Comfort is pretty good as well. While these are a bit heavier in-ear earbuds since they have noise cancelling you’ll get used to them quickly. The NC box isn’t too heavy and you’ll soon forget it’s there.</p>\n' +
        '<p>The silicone eartips offer average comfort which means you can wear them for hours on end without irritation.&nbsp; But Bose earbuds still have an advantage over them.</p>\n' +
        '<p>For improved comfort replace the original eartips with foam premium ones.</p>\n' +
        '<p><strong>Features</strong></p>\n' +
        '<p>Together with noise cancelling these earbuds offer making and accepting calls as well. There’s an inline microphone and remote control for volume, song selection, play/pause and accepting/rejecting calls.</p>\n' +
        '<p>The noise cancelling buttons are all on the NC box and not on the remote.</p>\n' +
        '<p>Carrying pouch is very soft so it doesn’t offer a lot of protection but it’s better than nothing.</p>\n' +
        '<p>The in-line microphone also has noise cancelling so your calls are slightly clearer though you won’t notice a big difference.</p>\n' +
        '<p><strong>Sound</strong></p>\n' +
        '<p>When it comes to sound quality it’s what you’d expect from a cheap NC model.</p>\n' +
        '<p>It’s nothing special but more than good enough to justify the price.</p>\n' +
        '<p>Since noise reduction is the main feature of these earbuds sound was less focused on.</p>\n' +
        '<p>The general public might like the slightly bass emphasized sound. You can find the <a href="https://headphonesaddict.com/best-bass-earbuds/">best basshead earbuds here</a>.</p>\n' +
        '<p>For an audiophile though, these aren’t really comparable since none of the ranges come close to the audiophile standard. The highs aren’t clear and detailed enough, mids are hidden and bass is muddy would be a short summary of an expert.</p>\n' +
        '<p>Nonetheless, these are much better than your standard airplane earbuds you get for free. As long as you don’t expect sonic fidelity, (and you shouldn’t since these are so cheap) you will be more than satisfied with the sound as well.</p>\n' +
        '<p>Understand these are cheap and you’ll be very happy with them.</p>\n' +
        '<p><strong>Overall, if you’re looking for a cheap way to get rid of noise with ANC in a small package, these TaoTronics earbuds are the best budget pick right now.</strong></p>\n' +
        '<div class="addict-button addict-button-10"><a href="https://www.amazon.com/dp/B07FM1L5HJ/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07FM1L5HJ%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Check on Amazon</a></div>\n' +
        '<style>.addict-button-10 > a { background-color: #1583dc;\n' +
        '   color: #fff;\n' +
        '   font-family: Yantramanav, sans-serif;;\n' +
        '   font-size: 19px;\n' +
        '   font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_Top_Noise_Cancelling_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<p><a href="https://headphonesaddict.com/about-us/" rel="noopener">How we do reviews?</a></p>\n' +
        '<p>&nbsp;</p>\n' +
        '<p><strong>More cheap headphone guides:<br></strong></p>\n' +
        '<ul>\n' +
        '   <li>You can find <a href="https://headphonesaddict.com/best-earbuds-for-the-money/" rel="noopener noreferrer">great cheap earbuds here</a>.</li>\n' +
        '   <li>Or <a href="https://headphonesaddict.com/best-cheap-headphones/" rel="noopener noreferrer">cheap over-ear &amp; on-ear headphones</a>.</li>\n' +
        '</ul>\n' +
        '<hr>\n' +
        '<p><em>Disclosure: We might receive affiliate compensation if you purchase products via links on this page. This is how we purchase headphones for new reviews and keep the site adds-free. In spite of that we do our best to tell the truth about every product and don’t favor any one brand or model.</em></p>';
    var bestForMoney =
        '<br><a data-toggle="collapse" class="collapsed" href="#collapseHow_to_Find_Good_Inexpensive_Earbuds" id="How_to_Find_Good_Inexpensive_Earbuds-"><span id="How_to_Find_Good_Inexpensive_Earbuds">How to Find Good Inexpensive Earbuds?</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseHow_to_Find_Good_Inexpensive_Earbuds">\n' +
        '    <p>There are many cheap in-ear headphones to choose from looking just at prices.</p>\n' +
        '    <p>But when it comes to sound quality, the differences are significant.</p>\n' +
        '    <p>Yes, earbuds at $5 a pop are dirt cheap. But don’t get too excited just yet, you need to understand what you get at this low price.</p>\n' +
        '    <p>Many times it’s wise to spend $10 or $20 more and get a pair of earbuds that will last you longer while play high-quality audio comparable with much more expensive models.</p>\n' +
        '    <p><em>It pays to do a little research a get a cheap pair of earbuds that are recommended by experts. You’re sure to get more value out of it.</em></p>\n' +
        '    <p><strong>Audio Quality</strong></p>\n' +
        '    <p>Most of the cheaper varieties don’t produce the kind of bass and audio quality that you are looking for, but some do.</p>\n' +
        '    <p>You can get a great pair of <a href="https://headphonesaddict.com/category/earbuds/">earbuds</a> with high-quality audio for very little money if you pick the right model.</p>\n' +
        '    <p>Getting balanced, clean sound with the right amount of bass in affordable earbuds is uncommon, but not impossible.</p>\n' +
        '    <p>All of the models shown here are known for better than expected sound quality, so you can be sure you won’t be disappointed.</p>\n' +
        '    <p><strong>Single Driver or Multiple Drivers</strong></p>\n' +
        '    <p>A <a href="http://www.innerfidelity.com/content/how-headphone-dynamic-drivers-work" rel="noopener noreferrer">single driver</a> earbud can give you the range you are looking for, which is a normal range of 20 hertz to 20k hertz. Single driver earbuds do have their limitations, but even multiple driver earbuds don’t automatically guarantee a perfect listening experience.</p>\n' +
        '    <p>Poorly designed earbuds with multiple drivers have been known to give you a jarring performance due to irregularities in frequency response. So a pair of cheaper single driver earbuds can in many cases be better than some multiple driver earbuds.</p>\n' +
        '    <p><strong>Comfort </strong></p>\n' +
        '    <p>When it comes to the comfort of IEMs the most critical thing are eartips, ear pads or ear plugs as they are also called.</p>\n' +
        '    <p>Fortunately, you can get different sized ear tips that fit all models. This way you can adjust the comfort level for your ear shape.</p>\n' +
        '    <p>Additional ear tips are cheap but can make all the difference in comfort and noise isolation. If you’re half serious about in-ear headphones, get new ear plugs as well. You can make great noise-isolating earphones out of any average earbuds by changing ear tips.</p>\n' +
        '    <p><strong>Durability </strong></p>\n' +
        '    <p>They have to be robust enough to withstand your everyday routine. Cheap price doesn’t have to mean low-quality materials.</p>\n' +
        '    <p>You can get <a href="https://headphonesaddict.com/the-most-durable-earbuds/" rel="noopener noreferrer">durable earbuds</a> for little money too. If you are looking for earbuds for a specific purpose, <a href="https://headphonesaddict.com/best-headphones-for-running/" rel="noopener noreferrer">like headphones for running</a>, you’ll have to shelve out more money.</p>\n' +
        '    <p>Generally, cheap earbuds are made generically. Not necessarily fragile, but you naturally cannot expect them to be as durable as an expensive pair of headphones.</p>\n' +
        '    <p>Keep in mind, with proper care any earbuds should last you years.</p>\n' +
        '    <p><strong>Noise Isolation </strong></p>\n' +
        '    <p>The cheapest headphones don’t have active noise isolation, but passive noise isolation can do a pretty good job as well.</p>\n' +
        '    <p>Just like with <a href="https://headphonesaddict.com/headphone-wireless-technology/">wireless technology</a>, active noise isolation costs money. This way, if you’re looking for top inexpensive earbuds don’t look for active noise cancellation.</p>\n' +
        '    <blockquote>\n' +
        '        <p><a href="https://headphonesaddict.com/the-best-noise-canceling-bluetooth-headphones/">Top noise-cancelling headphones guide</a>.</p>\n' +
        '    </blockquote>\n' +
        '    <p>For <a href="https://headphonesaddict.com/best-noise-isolating-earbuds/" rel="noopener noreferrer">best noise isolation</a> on a budget, look for various sized rubber tips available on the market that can greatly improve the comfort and isolation of your earbuds. There are many different sizes to choose from and don’t cost a lot of money. (+improve the comfort)</p>\n' +
        '    <p><strong>Value for Money</strong></p>\n' +
        '    <p><img class="size-full wp-image-179 alignleft" title="value-for-money sticker" src="https://headphonesaddict.com/wp-content/uploads/2015/01/value-for-money-sticker.jpg" alt="value-for-money sticker" width="174" height="83" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/value-for-money-sticker.jpg 174w, https://headphonesaddict.com/wp-content/uploads/2015/01/value-for-money-sticker-30x14.jpg 30w" sizes="(max-width: 174px) 100vw, 174px">There is a vast array of brands competing for your attention in the price range of $10 to $50. With a bit of research you can find a great pair of in-ear headphones that will serve you well for a very long time.</p>\n' +
        '    <p>Usually, less known brands and models tend to provide the biggest value. Because small companies want to get their brand out, they offer their products for less money to gain market share.</p>\n' +
        '    <p>This is a great plus for you, the consumer.</p>\n' +
        '    <p>For a broader range of <a href="https://headphonesaddict.com/best-bass-earbuds/">bass earbuds, click here</a> or check <a href="https://headphonesaddict.com/best-bluetooth-headphones-working-out/" rel="noopener noreferrer">top workout headphones</a>.</p>\n' +
        '</div>\n' +
        '<a data-toggle="collapse" class="collapsed" href="#collapseShould_You_Buy_Wired_or_Wireless_Earbuds" id="Should_You_Buy_Wired_or_Wireless_Earbuds-"><span id="Should_You_Buy_Wired_or_Wireless_Earbuds">Should You Buy Wired or Wireless Earbuds?</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseShould_You_Buy_Wired_or_Wireless_Earbuds">\n' +
        '    <p>If you’re looking for cheap wireless earbuds, you should expect to pay quite a bit more than for wired models (with 3.5mm headphone jack).</p>\n' +
        '    <p><a href="https://headphonesaddict.com/category/bluetooth-headphones/" rel="noopener noreferrer">Wireless</a> technology is still more expensive than wires, and that adds to the price.</p>\n' +
        '    <blockquote>\n' +
        '        <p>For $50 or less you’re choosing from the cheapest of the cheap Bluetooth earbuds.</p>\n' +
        '    </blockquote>\n' +
        '    <p>Thankfully, the prices of wireless earphones are dropping, but you still need to pay around $30 and don’t expect decent wireless buds under $10 (because you won’t find them).</p>\n' +
        '    <p>Also, you’ll have a hard time finding true wireless earbuds for $20 or $30; they tend to cost substantially more.</p>\n' +
        '    <p>In this guide, we’ve focused mostly on cheap wired earbuds under $50 or less. This ensures you get the best sound quality without having to pay for wireless technology.</p>\n' +
        '    <p><strong>But if you want Bluetooth earbuds check the guides below:</strong></p>\n' +
        '    <ul>\n' +
        '        <li><a href="https://headphonesaddict.com/best-bluetooth-earbuds-under-50/">Best Bluetooth earbuds under $50</a></li>\n' +
        '        <li><a href="https://headphonesaddict.com/best-wireless-earbuds-under-30/">Best Bluetooth earbuds under $30</a></li>\n' +
        '        <li>And for headphones, <a href="https://headphonesaddict.com/best-bluetooth-headphones-under-50/">best Bluetooth headphones under $50</a></li>\n' +
        '    </ul>\n' +
        '</div>\n' +
        '<a data-toggle="collapse" class="collapsed" href="#collapseWhat_You_Need_to_Know_About_the_Prices_1" id="What_You_Need_to_Know_About_the_Prices_1"><span id="What_You_Need_to_Know_About_the_Prices">What You Need to Know About the Prices</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseWhat_You_Need_to_Know_About_the_Prices_1">\n' +
        '    <p>Many times the manufacturers (and stores) change the prices. They can fluctuate from day to day or sometimes even in one day.</p>\n' +
        '    <p>Because of this, some of the earbud’s prices might not fit exactly in “Under $20” or Under “$10” categories, but we do our best to keep it updated regularly. So don’t hold us accountable if we miss the price mark for a couple of dollars.</p>\n' +
        '    <p>Thank you for checking our guide. Hopefully, it was useful.</p>\n' +
        '    <p><strong>We’d like to improve it further, please let us know what we can do better.</strong></p>\n' +
        '    <p>Tell us what you think or what we forgot to mention in the comments below.</p>\n' +
        '    <p>Don’t forget to share and like the site for future updates.</p>\n' +
        '</div>\n' +
        '<h2 id="Best_Earbuds_Under_-50"><span id="Best_Earbuds_Under_50">Best Earbuds Under $50</span></h2>\n' +
        '<p>The best earbuds/in-ear headphones in the price range of $30 – $50.</p>\n' +
        '<h3 id="best_overall-_SoundMAGIC_E10"><span id="best_overall_SoundMAGIC_E10">best overall: <a href="https://www.amazon.com/dp/B005HP3OB0/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB005HP3OB0%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">SoundMAGIC E10</a></span></h3>\n' +
        '<p><img class="alignnone wp-image-2519 size-full" title="SoundMAGIC E10" src="https://headphonesaddict.com/wp-content/uploads/2015/01/SoundMAGIC-E10.jpg" alt="SoundMAGIC E10" width="600" height="350" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/SoundMAGIC-E10.jpg 600w, https://headphonesaddict.com/wp-content/uploads/2015/01/SoundMAGIC-E10-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/SoundMAGIC-E10-500x292.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></p>\n' +
        '<h4>The overall best earbuds under $50.</h4>\n' +
        '<p><em>The balance of quality build, comfortable wear, nice design and very balanced high sound quality with the right amount of bass, makes this #1 choice for best cheap earbuds.</em></p>\n' +
        '<p>At the moment there is no other budget model of earbuds on the market that you could say is superior to the SoundMAGIC E10.</p>\n' +
        '<p>Sure, we all have our preferences in sound tones, bass levels, design, and brands, but the significant majority of reviewers and experts can’t all be wrong.</p>\n' +
        '<p>This is a very popular budget model for a reason.</p>\n' +
        '<p><strong>PROS</strong></p>\n' +
        '<ul>\n' +
        '    <li>Great balanced sound, audiophile standard</li>\n' +
        '    <li>“Clean mid bass expert”</li>\n' +
        '    <li>Durable and stylish metal casing with premium feel</li>\n' +
        '    <li>Awesome value for money</li>\n' +
        '</ul>\n' +
        '<p><strong>CONS</strong></p>\n' +
        '<ul>\n' +
        '    <li>Not suitable for bass heads</li>\n' +
        '</ul>\n' +
        '<p><img class="size-full wp-image-2520 alignnone" title="SoundMAGIC E10 unboxed" src="https://headphonesaddict.com/wp-content/uploads/2015/01/SoundMAGIC-E10-unboxed.jpg" alt="SoundMAGIC E10 unboxed" width="600" height="350" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/SoundMAGIC-E10-unboxed.jpg 600w, https://headphonesaddict.com/wp-content/uploads/2015/01/SoundMAGIC-E10-unboxed-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/SoundMAGIC-E10-unboxed-500x292.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></p>\n' +
        '<p><strong>Fit (Isolation)</strong></p>\n' +
        '<p>Getting a proper fit is the same as with any other in-ear monitors, you have to find the right ear tips and position that suits you. SoundMAGIC E10 are easy to fit.</p>\n' +
        '<p>Sound isolation is pretty good as well. You can enjoy listening to music without outside noise while still hearing what is going on around you. This is important if you plan to use them on the street.</p>\n' +
        '<p><strong>Comfort</strong></p>\n' +
        '<p>These are very comfortable, and if you have small ears, you can replace the original ear tips with smaller softer ones for maximum comfort.</p>\n' +
        '<p>Because the casing is so light wearing them for hours is not a problem, get the right fit, and you’re good to go.</p>\n' +
        '<p><strong>Durability</strong></p>\n' +
        '<p>Immediately you can spot the metal casing which makes these in-ear earphones look premium and durable at the same time. This is not some cheap, low-quality metal either.</p>\n' +
        '<p>It feels and looks premium, like if you’d pay $100 for it.</p>\n' +
        '<p><strong>Controls</strong></p>\n' +
        '<p>There are no in-line controls of any kind, just the regular wires.</p>\n' +
        '<p><img class="alignright wp-image-855 size-full" title="WhatHi-Fi Awards SoundMAGIC E10" src="https://headphonesaddict.com/wp-content/uploads/2015/01/whathifi-awards-soundmagic-e10.png" alt="WhatHi-Fi Awards SoundMAGIC E10" width="212" height="150" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/whathifi-awards-soundmagic-e10.png 212w, https://headphonesaddict.com/wp-content/uploads/2015/01/whathifi-awards-soundmagic-e10-30x21.png 30w" sizes="(max-width: 212px) 100vw, 212px"></p>\n' +
        '<p><em>Did we mention the SoundMAGIC E10 were chosen as best budget earbuds on the market by What Hi-Fi magazine?</em></p>\n' +
        '<blockquote>\n' +
        '    <p><a href="https://headphonesaddict.com/best-noise-isolating-earbuds/" rel="noopener noreferrer">Go here for top noise isolating earbuds.</a></p>\n' +
        '</blockquote>\n' +
        '<p><strong>Sound</strong></p>\n' +
        '<p>The thing these earphones really excel at is sound quality.</p>\n' +
        '<p>The perfect balance of clean high pitched, medium and low bass sounds make these one of the best sounding cheap earbuds ever made.</p>\n' +
        '<p>Don’t expect emphasized deep bass, as these really focus on balanced sound.</p>\n' +
        '<p>The bass tones are prominent and clear, but not throbbing as some people like it. (bass-heads)</p>\n' +
        '<p>These IEMs are perfect for listening to all types of music, but especially the genres in which clean, balanced sound comes alive.</p>\n' +
        '<p><strong>The perfect balance of sound with great pitch and midbass packed inside the durable and stylish metal casing for a budget price.</strong> If this sounds good to you, get them while they’re still available (at the price tag from $30 to $40 for the mic &amp; remote model).</p>\n' +
        '<div class="addict-button addict-button-1"><a href="https://www.amazon.com/dp/B005HP3OB0/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB005HP3OB0%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-1 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="runner-up-_Tin_Audio_T2"><span id="runner-up_Tin_Audio_T2">runner-up: <a href="https://www.amazon.com/dp/B07DL2FPBL/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07DL2FPBL%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Tin Audio T2</a></span></h3>\n' +
        '<p><img class="alignnone wp-image-3568" title="Linsoul Tin Audio T2" src="https://headphonesaddict.com/wp-content/uploads/2015/01/Linsoul-Tin-Audio-T2.jpg" alt="Linsoul Tin Audio T2" width="650" height="380" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/Linsoul-Tin-Audio-T2.jpg 960w, https://headphonesaddict.com/wp-content/uploads/2015/01/Linsoul-Tin-Audio-T2-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/Linsoul-Tin-Audio-T2-768x449.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2015/01/Linsoul-Tin-Audio-T2-500x292.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></p>\n' +
        '<h4>Tin Audio T2 are a great pair of double dynamic driver earbuds you can get under $50.</h4>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Noise-cancelling:</strong> No<br><strong>Connection:</strong> Wired, 3.5mm<br><strong>Microphone:</strong> No</p>\n' +
        '<p><strong>Why Should You Buy These?</strong></p>\n' +
        '<p>If you’re looking for earbuds with high comfort, good durability, and lovely sound, read on.</p>\n' +
        '<p>The first thing you notice is their interesting cable. It looks like fabric, and it’s detachable, so you can always replace it.</p>\n' +
        '<p>They are lightweight, comfortable and will last a long time because they are well-built from metal.</p>\n' +
        '<p>Also, you get a pair of memory foam ear tips that provide stability (enough even for running) and excellent noise isolation.</p>\n' +
        '<p><iframe src="https://www.youtube-nocookie.com/embed/GpmreIK-ypk" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>No in-line control or microphone.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>The sound is somewhat balanced. The double dynamic drivers produce consistent bass that goes well with slightly emphasized mids and treble. The bass isn’t overpowering, so this makes them great for critical listening. Overall, the audio is much better than you’d expect from 50 bucks. They’re perfect for every music genre.</p>\n' +
        '<p><strong>Tin Audio T2 are a great choice if you want to maximize your money (under $50) featuring detachable cables, sturdy design, comfortable fit, and audiophile-like sound (for the price).</strong></p>\n' +
        '<div class="addict-button addict-button-2"><a href="https://www.amazon.com/dp/B07DL2FPBL/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07DL2FPBL%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-2 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="Sennheiser_CX_300_II_Precision_Enhanced_Bass_1"><span id="Sennheiser_CX_300_II_Precision_Enhanced_Bass"><a href="https://www.amazon.com/dp/B001EZYMF4/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB001EZYMF4%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Sennheiser CX 300 II Precision Enhanced Bass</a></span></h3>\n' +
        '<p><img class="alignnone wp-image-2522 size-full" title="Sennheiser CX 300 II" src="https://headphonesaddict.com/wp-content/uploads/2015/01/Sennheiser-CX-300-II.jpg" alt="Sennheiser CX 300 II" width="600" height="350" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/Sennheiser-CX-300-II.jpg 600w, https://headphonesaddict.com/wp-content/uploads/2015/01/Sennheiser-CX-300-II-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/Sennheiser-CX-300-II-500x292.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></p>\n' +
        '<p><strong>If you like thumping bass, you’re going to like the Sennheiser CX300 II.</strong></p>\n' +
        '<p>Sennheiser CX300 II are great value-for-money earbuds with powerful, bass-driven sound which makes them one of the best budget IEMs for bass oriented users. The price tag is further reduced right now due to discontinuation. Get them while you can.</p>\n' +
        '<p>Made by <a href="http://www.sennheiser.com/" target="_blank" rel="noopener noreferrer">Sennheiser,</a> a known German brand that provides great quality headphones in all price ranges.</p>\n' +
        '<p><strong>PROS</strong></p>\n' +
        '<ul>\n' +
        '    <li>Quality, punchy bass</li>\n' +
        '    <li>Suitable for bassheads</li>\n' +
        '    <li>Sennheiser (high quality, German brand)</li>\n' +
        '    <li>Good price</li>\n' +
        '    <li>Durable design that lasts</li>\n' +
        '</ul>\n' +
        '<p><strong>CONS</strong></p>\n' +
        '<ul>\n' +
        '    <li>Lacks balance and detail in sound (because of overpowering, deep bass)</li>\n' +
        '</ul>\n' +
        '<p><strong>Fit (Isolation)</strong></p>\n' +
        '<p>They fit nicely and stay in ears in most situations. Some use these for sports as well.</p>\n' +
        '<p>A standard selection of different sizes of ear tips allows you to customize the fit to your liking.</p>\n' +
        '<p>Noise isolation is pretty average and depends on the ear tips that you use. For best isolation get some triple flange tips as they tend to offer the best results.</p>\n' +
        '<p><a href="https://headphonesaddict.com/noise-cancelling-noise-isolating-headphones/">How is it different from noise cancellation?</a></p>\n' +
        '<p><strong>Comfort</strong></p>\n' +
        '<p>Earbuds are made out of plastics, so they are lightweight and once you put them on you’ll soon get used to their low weight. They are nothing special, just like other standard in-ear monitors, good but not great.</p>\n' +
        '<p><strong>Durability</strong></p>\n' +
        '<p>The build quality is really high. The small, compact build makes these earbuds very durable.</p>\n' +
        '<p>The wires are very easy to untangle and can survive quite a lot of punishment.</p>\n' +
        '<p><strong>Controls</strong></p>\n' +
        '<p>No controls or microphone, just regular wires.</p>\n' +
        '<p>But you do get a cute little pouch to offer a little bit of protection when you’re carrying them around in your backpack.</p>\n' +
        '<p><a href="https://headphonesaddict.com/best-bass-earbuds/" rel="noopener noreferrer">Looking for best bass earbuds? Click here.</a></p>\n' +
        '<p><strong>Sound</strong></p>\n' +
        '<p>The sound is very bass heavy.</p>\n' +
        '<p>People looking for a balanced sound will say this is a bad thing, but if you <a href="https://headphonesaddict.com/15-best-on-over-ear-bass-headphones/">like more bass</a> in your music, these should be your pick.</p>\n' +
        '<p>The CX 300 II Precision Enhanced Bass are producing almost too strong bass, it is noticeably enhanced and overpowers other ranges.</p>\n' +
        '<p>This means it is tough to hear the details of the music, and generally, these don’t have the clearest or the most precise highs and mids as the bass is so strong.</p>\n' +
        '<p><strong>The CX 300 II is one of the cheaper Sennheiser models, but are still a glowing example of high-quality audio, good noise isolation, comfortable fit and durability all packed in one affordable package.</strong></p>\n' +
        '<p><em>Overall, these are by our opinion best budget earbuds for bassheads right now.</em></p>\n' +
        '<div class="addict-button addict-button-3"><a href="https://www.amazon.com/dp/B001EZYMF4/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB001EZYMF4%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-3 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_wireless_under_-50-_Anker_Soundcore_Spirit_Pro"><span id="best_wireless_under_50_Anker_Soundcore_Spirit_Pro">best wireless under $50: <a href="https://www.amazon.com/dp/B07BMV5T2N/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07BMV5T2N%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Anker Soundcore Spirit Pro</a></span></h3>\n' +
        '<p><img class="size-full wp-image-3050 alignnone" title="Anker Soundcore Spirit Pro" src="https://headphonesaddict.com/wp-content/uploads/2018/10/Anker-Soundcore-Spirit-Pro.jpg" alt="Anker Soundcore Spirit Pro" width="650" height="380" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2018/10/Anker-Soundcore-Spirit-Pro.jpg 650w, https://headphonesaddict.com/wp-content/uploads/2018/10/Anker-Soundcore-Spirit-Pro-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2018/10/Anker-Soundcore-Spirit-Pro-500x292.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></p>\n' +
        '<h4>Anker Soundcore Spirit Pro are the best wireless earbuds under $50.</h4>\n' +
        '<p><a href="https://headphonesaddict.com/best-bluetooth-earbuds-under-50/">Find more Bluetooth earbuds under $50</a>.</p>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Noise-cancelling:</strong> No<br><strong>Connection:</strong> Wireless, Bluetooth 5.0<br><strong>Microphone:</strong> Yes, in-line</p>\n' +
        '<p><strong>Why Should You Buy These?</strong></p>\n' +
        '<p>In case you want to go wireless on a budget these Anker waterproof earbuds make the best choice.</p>\n' +
        '<p>The ear-wings help secure them in your ears, but their fit doesn’t put too much pressure on the ear canal. That’s why you can wear them without discomfort for hours.</p>\n' +
        '<p>Also, they are IPX8 waterproof. It means you can wash them under water or even drop them in the sink without damage (but can’t use for swimming because of Bluetooth).</p>\n' +
        '<p>Moreover, there’s an in-line microphone and remote control. You can change tracks and take calls with ease.</p>\n' +
        '<p>On top of that, they have great battery life. Up to 10 hours is enough to get you through a few days without charging.</p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>Some people find the cable too short and thus annoying when it rubs behind a head.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>The sound they produce is slightly bassy. When you get an airtight fit, they put out a lot of deep bass though it can’t compare to high-end models. Considering the price, it’s good audio quality that’s a bit weak on clarity (plus they support <a href="https://www.aptx.com/" target="_blank" rel="noopener noreferrer">aptX codec</a>).</p>\n' +
        '<p><strong>With a reliable connection, good battery life and comfort, Anker Soundcore Spirit Pro are one of the top choices for cheap wireless earbuds for sports.</strong></p>\n' +
        '<div class="addict-button addict-button-4"><a href="https://www.amazon.com/dp/B07BMV5T2N/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07BMV5T2N%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-4 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<blockquote>\n' +
        '    <p><strong>Note:</strong> <a href="https://headphonesaddict.com/best-earbuds-under-50/">Find other top earbuds under $50</a>.</p>\n' +
        '</blockquote>\n' +
        '<hr>\n' +
        '<h2 id="Best_Earbuds_under_-30"><span id="Best_Earbuds_under_30">Best Earbuds under $30</span></h2>\n' +
        '<p>The top earphones in the price range of $20 – $30.</p>\n' +
        '<h3 id="best_under_-30-_Symphonized_NRG_3-0_"><span id="best_under_30_Symphonized_NRG_30">best under $30: <a href="https://www.amazon.com/dp/B01D3QZB2Y/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB01D3QZB2Y%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Symphonized NRG 3.0 </a></span></h3>\n' +
        '<p><img class="size-full wp-image-2524 alignnone" title="Symphonized NRG 3.0" src="https://headphonesaddict.com/wp-content/uploads/2015/01/Symphonized-NRG-3.0.jpg" alt="Symphonized NRG 3.0" width="600" height="350" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/Symphonized-NRG-3.0.jpg 600w, https://headphonesaddict.com/wp-content/uploads/2015/01/Symphonized-NRG-3.0-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/Symphonized-NRG-3.0-500x292.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></p>\n' +
        '<h4><strong>In our opinion, these are the #1 choice and the best cheap earbuds under $30 right now.<br></strong></h4>\n' +
        '<p>Made by a company called <a href="http://www.symphonizedaudio.com/" rel="noopener noreferrer">Symphonized</a> which is relatively unknown, but has gotten a lot of attention with this IEM (in-ear monitor) model.</p>\n' +
        '<p><strong>These are made out of real wood which makes them really stand out in its design.</strong></p>\n' +
        '<p>Wood also has excellent acoustics, since they are used for speakers, why not earbuds? If you want to stand out with this vintage design while saving money, these are your best choice.</p>\n' +
        '<p><strong>PROS</strong></p>\n' +
        '<ul>\n' +
        '    <li>Great sound quality, balanced, detailed, slightly warmer</li>\n' +
        '    <li>Made out of real wood</li>\n' +
        '    <li>Durable and comfortable to wear</li>\n' +
        '    <li>Gold plated jack (usually a sign of more expensive headphones)</li>\n' +
        '    <li>Innovative design for affordable earbuds</li>\n' +
        '</ul>\n' +
        '<p><strong>CONS</strong></p>\n' +
        '<ul>\n' +
        '    <li>Some people don’t like the way wood changes the sound</li>\n' +
        '</ul>\n' +
        '<p><strong>Fit (Isolation)</strong></p>\n' +
        '<p>You get 6 different pairs of ear tips which should be enough to pick one that suits your needs. The tighter the fit, the better the noise isolation which is slightly above average if you choose the right tips.</p>\n' +
        '<p><strong>Comfort</strong></p>\n' +
        '<p>These are very comfortable. Wood is a light material and combined with quality ear tips you get very comfortable earbuds. In a couple of days after first using them, your ears will get accustomed, and you’ll forget you’re wearing them.</p>\n' +
        '<p><strong>Durability</strong></p>\n' +
        '<p>Durability doesn’t suffer because of wood. In fact, it’s quite sturdy and makes for <a href="https://headphonesaddict.com/the-most-durable-earbuds/">durable earbuds</a> that you can’t break just like that. Well just like with any earbuds, if you sit on them they’re likely to break, also make sure to keep them away from water.</p>\n' +
        '<p><strong>Controls</strong></p>\n' +
        '<p>The Symphonized NRG 3.0 earbuds have an in-line microphone which works for making calls, but also for using to control the device with Voice Control. Voice controls works well in environments without much background noise.</p>\n' +
        '<p>The carrying pouch is formed to fit with the wooden design but doesn’t offer the best physical protection.</p>\n' +
        '<p><strong>Sound</strong></p>\n' +
        '<p>At under $30 sound quality doesn’t disappoint.</p>\n' +
        '<p>Detail-rich and slightly warmer tones will make you fall in love with your music. These earbuds with mic especially excel at mid-range tones.</p>\n' +
        '<p>The <a href="https://en.wikipedia.org/wiki/Tonewood">wooden structure</a> noticeably adds to the quality of bass and produces a rich and slightly warmer sound.</p>\n' +
        '<p><strong>The audio can compare to some of the more expensive headphones, and you wouldn’t know you’re listening to below $30 earbuds.</strong></p>\n' +
        '<p>With gold plated audio jack and silicone ear tips these <a href="https://headphonesaddict.com/best-noise-isolating-earbuds" rel="noopener noreferrer">earbuds produce good passive noise isolation</a> to enjoy these everywhere you go.</p>\n' +
        '<blockquote>\n' +
        '    <p>Interested in <a href="https://headphonesaddict.com/best-gaming-headset-gaming-headphones/" rel="noopener noreferrer">top gaming headsets?</a></p>\n' +
        '</blockquote>\n' +
        '<p>If you are looking at that extra feature that allows you to walk and talk, then this one is for you.</p>\n' +
        '<p>One small issue is microphonics; if you rub against the wires you’ll hear the sound in your earbuds, this happens with all nylon/cloth type wires.</p>\n' +
        '<p><strong>With its built-in microphone, compatibility with all smartphones, an affordable price, great looks, and sound quality too good for this price, Symphonized NRG is a terrific bargain.</strong></p>\n' +
        '<div class="addict-button addict-button-5"><a href="https://www.amazon.com/dp/B01D3QZB2Y/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB01D3QZB2Y%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-5 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_wireless_under_-30-_Anker_Soundbuds_Slim-"><span id="best_wireless_under_30_Anker_Soundbuds_Slim">best wireless under $30: <a href="https://www.amazon.com/dp/B0756T7R5T/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB0756T7R5T%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Anker Soundbuds Slim+</a></span></h3>\n' +
        '<p title="null" data-popupalt-original-title="null"><img class="size-full wp-image-2574 alignnone" title="Anker SoundBuds Slim+" src="https://headphonesaddict.com/wp-content/uploads/2015/02/Anker-SoundBuds-Slim.jpg" alt="Anker SoundBuds Slim+" width="600" height="350" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/02/Anker-SoundBuds-Slim.jpg 600w, https://headphonesaddict.com/wp-content/uploads/2015/02/Anker-SoundBuds-Slim-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/02/Anker-SoundBuds-Slim-500x292.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></p>\n' +
        '<h4>Anker Soundbuds Slim+ are the best wireless earbuds under $30.</h4>\n' +
        '<p><a href="https://headphonesaddict.com/best-wireless-earbuds-under-30/">Check other top wireless earbuds under $30.</a></p>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Noise-cancelling:</strong> No<br><strong>Connection:</strong> Wireless, Bluetooth 4.1<br><strong>Microphone: </strong>Yes, in-line</p>\n' +
        '<p><strong>Why Should You Buy These?</strong></p>\n' +
        '<p>It’s another pair of Anker wireless earbuds for a dirt-cheap price (under $30) that doesn’t disappoint.</p>\n' +
        '<p>30 dollars isn’t a lot of money, but you get quite a few features for it.</p>\n' +
        '<p>Soft silicone ear tips provide a stable fit and high comfort. Anker has figured out how to make comfy earphones.</p>\n' +
        '<p>You also get an in-line remote with three buttons to manage your music, and the microphone to make calls on the go (but not in loud places).</p>\n' +
        '<p>Their battery lasts up to 7 hours, which is ok for the price range. And, the Bluetooth connection is stable with little interruption. No signal is lost when moving or running. Plus, they are sweatproof (<a href="https://headphonesaddict.com/best-bluetooth-headphones-working-out/">perfect for working out</a>).</p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>The worst thing about them is that they produce really strong bass, which some might find overwhelming.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>Their sound signature mostly consists of loud punchy emphasized bass. Bassheads will love their sound, but others probably not so much. Music like rap and house sounds amazing with these.</p>\n' +
        '<p><strong>Anker Soundbuds Slim+ are Bluetooth earbuds for people that like to do sports. Their stable fit and punchy bass make a good fit for an everyday workout but less for critical listening.</strong></p>\n' +
        '<div class="addict-button addict-button-6"><a href="https://www.amazon.com/dp/B0756T7R5T/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB0756T7R5T%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-6 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_bass-_Sony_MDR_XB50AP"><span id="best_bass_Sony_MDR_XB50AP">best bass: <a href="https://amzn.to/2EhZlpS" rel="noopener" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Famzn.to%2F2EhZlpS&amp;dtb=1">Sony MDR XB50AP</a></span></h3>\n' +
        '<h3 id=""><img class="wp-image-2505 alignnone" title="Sony MDR XB50AP - best bass workout headphones" src="https://headphonesaddict.com/wp-content/uploads/2018/02/Sony-MDR-XB50AP.jpg" alt="Sony MDR XB50AP - best bass workout headphones" width="600" height="350" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2018/02/Sony-MDR-XB50AP.jpg 900w, https://headphonesaddict.com/wp-content/uploads/2018/02/Sony-MDR-XB50AP-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2018/02/Sony-MDR-XB50AP-768x448.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2018/02/Sony-MDR-XB50AP-500x292.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></h3>\n' +
        '<h4>Best cheap bass earbuds, bar none (priced under $30).</h4>\n' +
        '<p>Price: MSRP: $49.99</p>\n' +
        '<p>If you like bass and want one of the best cheap earphones you need to get Sony MDR-XB50AP (<a href="https://headphonesaddict.com/sony-mdr-xb50ap-extra-bass-review/">full review here</a>).</p>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Noise-cancelling:</strong> No<br><strong>Connection:</strong> Wired, 3.5mm<br><strong>Microphone:</strong> Yes, in-line</p>\n' +
        '<p>These widely popular IEMs (in-ear monitors) are offering insane value (used to cost $50). You can easily compare them with earbuds for $50 or even $100.</p>\n' +
        '<p><strong>Good for:</strong> everybody who likes good bass.</p>\n' +
        '<p><strong>Not for:</strong> those who prefer balanced/flat sound.</p>\n' +
        '<p><strong>Why Should You Buy These?</strong></p>\n' +
        '<p>The ergonomic design makes them very comfortable and easy to fit any ears. The earphones aren’t big or bulky and fit in the ear canal with ease.</p>\n' +
        '<p>Noise isolation is above average as well, helping you focus on your music. Just make sure to pick the right size of eartips.</p>\n' +
        '<p>Since these are still Sony, they are well-built. Good materials, strain relief, and flat Y-type cable with a slider are all part of the package.</p>\n' +
        '<p>In-line remote with multi-function button and microphone perform well. Not the greatest but since this is just cherry on top you can’t complain.</p>\n' +
        '<p><strong>The Bad</strong></p>\n' +
        '<p>Overpowering bass is not for critical listening. Only 1 button on the remote control.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>Sound quality is where Sony MDR-XB50AP really shine. The bass is very strong and still retains a lot of detail with a nice punch. For bassheads, this is a must-have. Treble and mids don’t disappoint either. Sibilance is not an issue, and there’s no cable noise.</p>\n' +
        '<p>Without a doubt, MDR-XB50AP are the best bass earbuds under $30 right now.</p>\n' +
        '<p>The <a href="https://headphonesaddict.com/sony-mdr-xb50ap-extra-bass-review/">Sony MDR-XB50AP full review</a>.</p>\n' +
        '<div class="addict-button addict-button-7"><a href="https://amzn.to/2EhZlpS" target="_blank" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Famzn.to%2F2EhZlpS&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-7 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="MEE_Audio_M6B_1"><span id="MEE_Audio_M6B"><a href="https://www.amazon.com/dp/B07MTRCD9R/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07MTRCD9R%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">MEE Audio M6B</a></span></h3>\n' +
        '<p><strong><img class="alignnone wp-image-3569" title="MEE Audio M6B" src="https://headphonesaddict.com/wp-content/uploads/2015/01/MEE-Audio-M6B.jpg" alt="MEE Audio M6B" width="650" height="379" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/MEE-Audio-M6B.jpg 960w, https://headphonesaddict.com/wp-content/uploads/2015/01/MEE-Audio-M6B-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/MEE-Audio-M6B-768x448.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2015/01/MEE-Audio-M6B-500x292.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></strong></p>\n' +
        '<h4>MEE Audio M6B are a great alternative for budget wireless in-ears under $30.</h4>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Noise-cancelling:</strong> No<br><strong>Connection:</strong> Wireless, Bluetooth 4.2<br><strong>Microphone:</strong> Yes, in-line</p>\n' +
        '<p><strong>Why Should You Buy These?</strong></p>\n' +
        '<p>If you want a good pair of wireless earbuds for the absolute lowest price, then you should take a look at these.</p>\n' +
        '<p>Behind-the-ear fit and flexible wires provide a comfy and stable fit. You can run, jump or do any other sports activity.</p>\n' +
        '<p>The lightweight design makes them comfortable to wear for hours. And, the addition of sweat-resistance prepares them for heavy workouts.</p>\n' +
        '<p>An in-line remote control and microphone help manage your music and calls. Also, you get up to 7 hours of playback time via Bluetooth. You might expect less considering the price.</p>\n' +
        '<p><em>More: <a href="https://headphonesaddict.com/best-bluetooth-headphones/">Looking at Bluetooth headphones</a>?</em></p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>While they’re sweatproof, their durability isn’t the best. It’s probably related to their price.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>Even though you’re only paying 30 bucks, they sound decent. If you are not an audiophile, you’ll probably be satisfied with their sound. Most cheap wireless earbuds sound worse but keep in mind these aren’t mean for critical listening either.</p>\n' +
        '<p><strong>MEE Audio M6B are suitable for everyday use or workouts. These are the Bluetooth earbuds that work but aren’t fantastic at anything but their cheap price.</strong></p>\n' +
        '<div class="addict-button addict-button-8"><a href="https://www.amazon.com/dp/B07MTRCD9R/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07MTRCD9R%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-8 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="House_of_Marley_Smile_Jamaica_1"><span id="House_of_Marley_Smile_Jamaica"><a href="https://www.amazon.com/dp/B01DKGP5U0/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB01DKGP5U0%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1"><strong>House of Marley Smile Jamaica</strong></a></span></h3>\n' +
        '<p><strong><img class="wp-image-3570 alignnone" src="https://headphonesaddict.com/wp-content/uploads/2015/01/House-of-Marley-Smile.jpg" alt="House of Marley Smile" width="650" height="379" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/House-of-Marley-Smile.jpg 960w, https://headphonesaddict.com/wp-content/uploads/2015/01/House-of-Marley-Smile-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/House-of-Marley-Smile-768x448.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2015/01/House-of-Marley-Smile-500x292.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></strong></p>\n' +
        '<h4>House of Marley Smile Jamaica are cool-looking budget in-ears made of wood.</h4>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Noise-cancelling:</strong> No<br><strong>Connection:</strong> Wired, 3.5mm<br><strong>Microphone:</strong> Yes, in-line</p>\n' +
        '<p><strong>Why Should You Buy These?</strong></p>\n' +
        '<p>Do you want cool, sustainable and cheap earbuds that sound good? Then the House of Marley Smile Jamaica are the best choice for you.</p>\n' +
        '<p>Although they are cheap, their design isn’t. Wooden structure makes them look premium and feel lightweight. You can wear them for hours and almost forget you’re wearing earphones.</p>\n' +
        '<p>Also, they provide fantastic noise isolation with in-line remote control and microphone.</p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>Their durability isn’t the best. Wood looks beautiful but can break easily if you don’t treat them right.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>The sound has slightly enhanced bass that’s common for House of Marley. It’s perfect for all bass-intensive music. But if you don’t expect impeccable balance, you’ll be happy with the audio.</p>\n' +
        '<p><strong>House of Marley Smile Jamaica are cheap earbuds with a premium wooden design that offers fantastic comfort and enjoyable “bassy” audio quality. One of the coolest cheap buds.</strong></p>\n' +
        '<div class="addict-button addict-button-9"><a href="https://www.amazon.com/dp/B01DKGP5U0/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB01DKGP5U0%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-9 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="Brainwavz_Delta_1"><span id="Brainwavz_Delta"><a href="https://www.amazon.com/dp/B00L2459ZO/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB00L2459ZO%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Brainwavz Delta</a></span></h3>\n' +
        '<p><img class="size-full wp-image-2523 alignnone" title="Brainwavz Delta" src="https://headphonesaddict.com/wp-content/uploads/2015/01/Brainwavz-Delta.jpg" alt="Brainwavz Delta" width="600" height="350" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/Brainwavz-Delta.jpg 600w, https://headphonesaddict.com/wp-content/uploads/2015/01/Brainwavz-Delta-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/Brainwavz-Delta-500x292.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></p>\n' +
        '<p>Brainwavz Delta almost fit in the <a href="https://headphonesaddict.com/best-earbuds-under-20/">category of under $20</a> as they are priced slightly above $20. If you’re lucky, you might find them below that price in a special offer or at certain holidays where discount prices are common.</p>\n' +
        '<p>You will be surprised how much value you get from under $30 IEMs (in-ear monitors).</p>\n' +
        '<p><strong>PROS</strong></p>\n' +
        '<ul>\n' +
        '    <li>Clean, balanced sound comparable with $50+ models</li>\n' +
        '    <li>Durable design that’s going to last</li>\n' +
        '    <li>Perfect “throw away” earbuds</li>\n' +
        '</ul>\n' +
        '<p><strong>CONS</strong></p>\n' +
        '<ul>\n' +
        '    <li>For this price you can’t expect more value</li>\n' +
        '</ul>\n' +
        '<p><strong>Fit (Isolation)</strong></p>\n' +
        '<p>They fit very well for most people, and the quality selection of ear tips helps with that.</p>\n' +
        '<p>In the package, you receive 4 sets of silicone ear tips of different sizes and a set of Comply foam S400 tips which is a nice addition to the whole package. You don’t need to buy any other ear tips to get the most out of Delta’s. We recommend using Comply tips for best performance.</p>\n' +
        '<p>Noise isolation is about an average of what you can expect from IEMs, for better isolation get a pair of triple flange premium tips.</p>\n' +
        '<p><strong>Comfort</strong></p>\n' +
        '<p>Once you find the right ear tips for your ears, Delta become very comfortable IEMs to wear anywhere you go. The good thing is they don’t have any problems with microphonics which means you can wear them any way you like without affecting the <a href="https://headphonesaddict.com/sound-quality/">sound quality</a>.</p>\n' +
        '<p>These earbuds with mic might not be the lightest you’ll ever wear, but comfort doesn’t suffer because of it.</p>\n' +
        '<p><strong>Durability</strong></p>\n' +
        '<p>The build quality is better than expected if you didn’t know they were under $30 you’d think they were priced somewhere between $75 and $100.</p>\n' +
        '<p>The quality <a href="https://en.wikipedia.org/wiki/Aluminium" target="_blank" rel="noopener noreferrer">aluminum</a> casing makes them look and feel sturdy while maintaining that “premium” metal look.</p>\n' +
        '<p>The cord is very durable as well, thick and rubberized with additional reinforcement of the plug in the adapter; this is something most earbuds lack at this price range.</p>\n' +
        '<blockquote>\n' +
        '    <p>Looking for <a href="https://headphonesaddict.com/best-noise-cancelling-earbuds/">best noise cancelling earbuds</a>?</p>\n' +
        '</blockquote>\n' +
        '<p><strong>Controls</strong></p>\n' +
        '<p>There are 2 different models. One for iOS device and one for Android devices. Make sure to pick the right model according to the type of devices you’re using. You get in-line remote and microphone by which you can control the play/pause, volume, songs and make hands-free calls. That’s a nice feature for such affordable earbuds.</p>\n' +
        '<p><strong>Sound</strong></p>\n' +
        '<p>The most significant advantage of Brainwavz Delta’s is sound quality.</p>\n' +
        '<p>In this range, no other in-ears get close to the clean, balanced sound of Delta’s you’d expect from earbuds 3 times the price.</p>\n' +
        '<p>Highs and mids are slightly emphasized while still being able to reproduce clean bass. The bass is not very prominent, but at least it’s not the low quality “boomy” bass so prevalent at this price.</p>\n' +
        '<p><strong>Soundstage is also amazingly good for this price, creating an open, spacious sound.</strong></p>\n' +
        '<p>Being so cheap you can carry them around with you without fear of losing or damaging them, making them perfect budget earbuds that can also be enjoyed for quality sound.</p>\n' +
        '<p><em>All in all, you’re getting very balanced, clean sound quality that will even satisfy an audiophile, packaged in stylish aluminum casing with a durable cord for slightly over $20. This is a sure fit for one of the best value for money earbuds today.</em></p>\n' +
        '<div class="addict-button addict-button-10"><a href="https://www.amazon.com/dp/B00L2459ZO/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB00L2459ZO%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-10 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<blockquote>\n' +
        '    <p><strong>Note:</strong> <a href="https://headphonesaddict.com/best-earbuds-under-30/">Learn about more earbuds under 30 dollars</a>.</p>\n' +
        '</blockquote>\n' +
        '<hr>\n' +
        '<h2 id="Best_Earbuds_under_-20"><span id="Best_Earbuds_under_20">Best Earbuds under $20</span></h2>\n' +
        '<p>Going even cheaper… The top in-ear monitors you can get in the price range of $10-$20.</p>\n' +
        '<h3 id="best_under_-20-_KZ_ZST"><span id="best_under_20_KZ_ZST">best under $20: <a href="https://www.amazon.com/dp/B01N3U9SJG/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB01N3U9SJG%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">KZ ZST</a></span></h3>\n' +
        '<p><img class="size-full wp-image-2513 alignnone" title="KZ ZST -best earbuds under $20" src="https://headphonesaddict.com/wp-content/uploads/2015/01/KZ-ZST.jpg" alt="KZ ZST -best earbuds under $20" width="600" height="357" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/KZ-ZST.jpg 600w, https://headphonesaddict.com/wp-content/uploads/2015/01/KZ-ZST-300x179.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/KZ-ZST-500x298.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></p>\n' +
        '<h4>Top pick under $20. The best sound quality in earbuds under $20.</h4>\n' +
        '<p>KZ ZST are easily the best earbuds under $20 because the sound quality is out of this world (for the price).</p>\n' +
        '<p><a href="https://headphonesaddict.com/kz-zst-review/">Read the full review</a>.</p>\n' +
        '<p>If you tried a lot of different cheap earbuds yourself, you’d still be surprised how good these are.</p>\n' +
        '<p><strong>Good for:</strong> those who appreciate good sound quality</p>\n' +
        '<p><strong>Not for:</strong> people who want perfectly flat sound or overpowering bass</p>\n' +
        '<p>While the fit and comfort aren’t amazing out of the box (because of the silicone eartips) if you get Comply foam tips you’ll vastly improve the comfort. With changing to foam eartips, you’ll improve the sound quality and noise isolation too. You don’t have to get Comply tips, but it does help.</p>\n' +
        '<p>Noise isolation is above average out of the box. Ambient noise is well isolated so you can enjoy your music in peace.</p>\n' +
        '<p>Build quality is good. KZ ZST aren’t made like a tank but feel decently made. The fact that cables are detachable is a big plus. Though the ear buds themselves aren’t super sturdy, be a bit careful, and you’ll get a lot of value out of them.</p>\n' +
        '<p>The version with the microphone and remote has one multi-function button that’s very easy to use once you remember how it works. Voice quality is fine, not great but not bad either.</p>\n' +
        '<p>There is also a version without the mic and remote for a little less money if you can find it.</p>\n' +
        '<p><iframe src="https://www.youtube-nocookie.com/embed/KHsbIXU_UrQ" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p>\n' +
        '<p>By far the biggest advantage is their audio quality. These sound amazing for the price of under $20 and can easily compete with in-ear earphones in the $50-$100 range.</p>\n' +
        '<p>The sound signature is slightly V-shaped with a slight emphasis on bass and treble. KZ ZST are very accurate and detailed, so you have to use them with high-quality music recordings otherwise you’ll hear the distortion and lack of quality.</p>\n' +
        '<p>To get the most out of them, get an amplifier or good MP3 player to hear all the details. Smartphones are fine but don’t extract the best <a href="https://headphonesaddict.com/sound-quality/">sound quality</a> possible. There’s no sibilance or distortion which is quite amazing for under $20 earbuds.</p>\n' +
        '<p>The best earbuds under $20 are hands down, KZ ZST right now. Don’t miss out on them.</p>\n' +
        '<p><a href="https://headphonesaddict.com/kz-zst-review/">The full KZ ZST review</a>.</p>\n' +
        '<div class="addict-button addict-button-11"><a href="https://www.amazon.com/dp/B01N3U9SJG/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB01N3U9SJG%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-11 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_sports-_MEE_Audio_M6"><span id="best_sports_MEE_Audio_M6">best sports: <a href="https://www.amazon.com/dp/B0038W0K2K/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB0038W0K2K%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">MEE Audio M6</a></span></h3>\n' +
        '<h4><img class="size-full wp-image-3017 alignnone" title="MEE Audio M6 black workout eabruds" src="https://headphonesaddict.com/wp-content/uploads/2018/10/MEE-Audio-M6.jpg" alt="MEE Audio M6 black workout eabruds" width="650" height="379" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2018/10/MEE-Audio-M6.jpg 650w, https://headphonesaddict.com/wp-content/uploads/2018/10/MEE-Audio-M6-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2018/10/MEE-Audio-M6-500x292.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></h4>\n' +
        '<h4>Best cheap earbuds for working out (under $20).</h4>\n' +
        '<p>MEE Audio M6 are great sports in-ear headphones for little money.</p>\n' +
        '<p><strong>Real bang for the buck.</strong></p>\n' +
        '<p><em>There is a newer, updated model M7P which is still a good choice, but it has a considerably higher price of around $40. For under $20, the M6 model is still better.</em></p>\n' +
        '<p><strong>PROS</strong></p>\n' +
        '<ul>\n' +
        '    <li>High sound quality with slightly warmer touch and prominent bass</li>\n' +
        '    <li>Noise isolation helps the clear sound to come alive</li>\n' +
        '    <li>Durable, comfortable “ear hook” design</li>\n' +
        '    <li>Water resistant, great for sports</li>\n' +
        '    <li>Great value for money which makes them very popular</li>\n' +
        '</ul>\n' +
        '<p><strong>CONS</strong></p>\n' +
        '<ul>\n' +
        '    <li>“Ear hook” design might be a problem for some</li>\n' +
        '</ul>\n' +
        '<p><strong>Fit (Isolation)</strong></p>\n' +
        '<p>Their memory wire makes them very secure in your ears while still being comfortable, this is ideal for any sports activity where it’s important they stay in position.</p>\n' +
        '<p>Additionally, you get 6 different <a href="https://www.amazon.com/s/?_encoding=UTF8&amp;camp=1789&amp;creative=390957&amp;field-keywords=ear%20tips&amp;linkCode=ur2&amp;sprefix=ear%20t%2Celectronics&amp;tag=bluetoothheadphones02-20&amp;url=search-alias%3Delectronics&amp;linkId=MWIKJVMUF4EZVVCU" rel="noopener noreferrer" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fs%2F%3F_encoding%3DUTF8%26camp%3D1789%26creative%3D390957%26field-keywords%3Dear%2520tips%26linkCode%3Dur2%26sprefix%3Dear%2520t%252Celectronics%26tag%3Dbluetoothheadphones02-20%26url%3Dsearch-alias%253Delectronics%26linkId%3DMWIKJVMUF4EZVVCU&amp;dtb=1">ear tips</a> to fit your ear lobe perfectly. Their in-ear design provides good noise isolation, so you’re able to enjoy a rich sound and enhanced bass wherever you go.</p>\n' +
        '<p>Keep in mind that you need to test a few ear tips before you find a stable, snug fit.</p>\n' +
        '<p><strong>Comfort</strong></p>\n' +
        '<p>Picking the right ear tips also plays a significant role in comfort. If you don’t have the proper ear tips on, they might feel “weird” to you, at least until you get used to them.</p>\n' +
        '<p>In general, with right ear tips and proper position, these are comfortable enough to workout with. The memory wires tend to rub against the skin behind your ears, but you get used it. For workouts, you’ll have a hard time finding stable earbuds with perfect comfort.</p>\n' +
        '<p><strong>Durability</strong></p>\n' +
        '<p>The wires are super durable because of their “memory” design with metal protection. Once you position them the right way, you’ll hear a big difference in sound quality.</p>\n' +
        '<p>They are also sweat-proof and water-resistant for cases when you get caught by rain in the middle of your run. For <a href="https://headphonesaddict.com/best-underwater-bluetooth-headphones/" rel="noopener noreferrer">best underwater headphones, click here.</a></p>\n' +
        '<p>Overall, they are very durable and able to withstand a lot of punishment.</p>\n' +
        '<p><strong>Controls</strong></p>\n' +
        '<p>There are 2 models available, The M6 model without remote/mic and the M6P model with in-line remote and microphone. If you make calls during your workouts get the M6P, but keep in mind they cost slightly over $20 most of the time.</p>\n' +
        '<p>The carrying bag is nice and sturdy, perfect for frequent gym goers. This way you’ll keep your earbuds safe for a long time.</p>\n' +
        '<p><strong>Sound</strong></p>\n' +
        '<p>When it comes to sound, it’s very smooth, warm and detailed with prominent bass response.</p>\n' +
        '<p>Low bass tones are probably the strongest point of these IEMs, prominent, punchy bass that won’t leave you feeling cold. Mids are also very clean and rich while high pitched sounds are slightly lacking in detail and clearness.</p>\n' +
        '<p>In the end, you get warm, fun earbuds that sound great for the money.</p>\n' +
        '<p>These same earbuds are also recommended as one of <a href="https://headphonesaddict.com/best-bluetooth-headphones-working-out/" rel="noopener noreferrer">the best earbuds for working out</a>.</p>\n' +
        '<p><strong>Their overall ability to withstand moisture, fit securely in your ears and provide good noise isolation and audio quality that’s fun to listen to for less than $20 makes them the best value sports earbuds right now.</strong></p>\n' +
        '<div class="addict-button addict-button-12"><a href="https://www.amazon.com/dp/B0038W0K2K/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB0038W0K2K%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-12 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="bass_under_-20-_Betron_YSM1000"><span id="bass_under_20_Betron_YSM1000">bass under $20: <a href="https://www.amazon.com/dp/B00S2P0M1C/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB00S2P0M1C%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Betron YSM1000</a></span></h3>\n' +
        '<p><img class="size-full wp-image-2515 alignnone" title="Betron YSM1000" src="https://headphonesaddict.com/wp-content/uploads/2015/01/Betron-YSM1000.jpg" alt="Betron YSM1000" width="600" height="357" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/Betron-YSM1000.jpg 600w, https://headphonesaddict.com/wp-content/uploads/2015/01/Betron-YSM1000-300x179.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/Betron-YSM1000-500x298.jpg 500w" sizes="(max-width: 600px) 100vw, 600px"></p>\n' +
        '<h4>Best bass earbuds under $20 are the Betron YSM1000.</h4>\n' +
        '<p><a href="https://headphonesaddict.com/betron-ysm1000-review/">The Betron YSM1000 full review</a>.</p>\n' +
        '<p>If you’re looking for some bass-heavy earbuds on the budget, you have to check out the Betron YMS1000.</p>\n' +
        '<p><strong>Good for:</strong> bassheads and bass lovers</p>\n' +
        '<p><strong>Not for:</strong> audiophiles or those who prefer balanced sound</p>\n' +
        '<p>The fit and comfort are good even though the metal earphones aren’t the smallest or lightest. They stick out of the ears a bit. Passive noise isolation is above average with the right eartips, and you’ll easily remove the ambient sound around you.</p>\n' +
        '<p>Moreover, for the cheap price you pay, these are built rather well. The earbuds themselves don’t seem to have any weak points. Rubbery wires seem durable, and all the strain relief is solid.</p>\n' +
        '<p>Betron YMS1000 also come with an in-line remote and microphone. But the sound makes everything better.</p>\n' +
        '<p>They have powerful bass, overpowering on many occasions which is great for bassheads and all other bass lovers. Of course, this overwhelms other ranges, so mids and treble aren’t so detailed. There’s also some sibilance at higher volumes, but if you’re a basshead, you won’t mind.</p>\n' +
        '<p><a href="https://headphonesaddict.com/betron-ysm1000-review/">Read Betron YSM1000 full review</a>.</p>\n' +
        '<p>In the end, Betron YMS1000 are one of the best cheap earbuds for bassheads.</p>\n' +
        '<div class="addict-button addict-button-13"><a href="https://www.amazon.com/dp/B00S2P0M1C/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB00S2P0M1C%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-13 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<blockquote>\n' +
        '    <p><strong>Note:</strong> <a href="https://headphonesaddict.com/best-earbuds-under-20/">Check the best earbuds under $20 guide</a>.</p>\n' +
        '</blockquote>\n' +
        '<hr>' +
        '<h2 id="Best_Earbuds_Under_-10"><span id="Best_Earbuds_Under_10">Best Earbuds Under $10</span></h2>\n' +
        '<p>Last but not least, dirt-cheap earbuds under $10 for absolute cheapskates.</p>\n' +
        '<h3 id="best_under_-10-_Panasonic_RPHJE120K"><span id="best_under_10_Panasonic_RPHJE120K">best under $10: <a href="https://amzn.to/2sccM5W" rel="noopener noreferrer" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Famzn.to%2F2sccM5W&amp;dtb=1">Panasonic RPHJE120K</a></span></h3>\n' +
        '<p><img class="size-full wp-image-2529 alignnone" title="Panasonic RPHJE120" src="https://headphonesaddict.com/wp-content/uploads/2015/01/Panasonic-RPHJE120.jpg" alt="Panasonic RPHJE120" width="500" height="375" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/Panasonic-RPHJE120.jpg 500w, https://headphonesaddict.com/wp-content/uploads/2015/01/Panasonic-RPHJE120-300x225.jpg 300w" sizes="(max-width: 500px) 100vw, 500px"></p>\n' +
        '<h4>The top pick for in-ear headphones under $10 is the popular Panasonic RPHJE120K.</h4>\n' +
        '<p>Price: Under $10</p>\n' +
        '<p>You won’t believe the price of these beauties. At below $10, you can’t ask for a better deal.</p>\n' +
        '<p><em>It is the ideal balance of audio quality, built quality and durability for little money.</em></p>\n' +
        '<p><strong>No wonder they are so popular, as of currently, these earbuds are number #1 sellers on Amazon.</strong></p>\n' +
        '<p>This alone tells a lot about the value you’re getting.</p>\n' +
        '<p><strong>PROS</strong></p>\n' +
        '<ul>\n' +
        '    <li>Best dirt cheap “I don’t care if they break” earbuds</li>\n' +
        '    <li>Good comfort, stay in ears</li>\n' +
        '    <li>Good bass with balanced mid tones</li>\n' +
        '    <li>A little bit of everything</li>\n' +
        '</ul>\n' +
        '<p><strong>CONS</strong></p>\n' +
        '<ul>\n' +
        '    <li>For this money, you can’t ask for more</li>\n' +
        '</ul>\n' +
        '<p><strong>Fit (Isolation)</strong></p>\n' +
        '<p>Because they are so light they don’t pull down when in the ears, find proper ear tips and you won’t notice them for the most time.</p>\n' +
        '<p>Noise isolation is about average, nothing special, but still much better than with many over-ear headphones.</p>\n' +
        '<p><strong>Comfort</strong></p>\n' +
        '<p>They are very comfortable and rather good at staying in position.</p>\n' +
        '<p>The comfort is quite good, feels light and doesn’t bother the ears. You can easily wear them for hours without any discomfort. 3 soft ear tip pairs make your choices for best comfort even easier.</p>\n' +
        '<p><strong>Durability</strong></p>\n' +
        '<p>When it comes to build quality, it shows they are cheap. The plastic casing and some rather flimsy wires don’t promise much in terms of durability.</p>\n' +
        '<p>The materials are really basic, but this is what you get for the low price.</p>\n' +
        '<p><strong>Controls</strong></p>\n' +
        '<p>You are paying below $10 for a pair of earbuds, don’t expect any special features like a remote or microphone because you won’t find them.</p>\n' +
        '<p><strong>Sound</strong></p>\n' +
        '<p>Sound-wise these have quite a good bass. Probably the only strength of these is better than average bass at the price. The mid tones are clean and balanced, while highs aren’t particularly good.</p>\n' +
        '<p>Overall you’re still getting superb sound quality for the price that is somewhat balanced and doesn’t have any significant flaws.</p>\n' +
        '<p>While these are not <a href="https://headphonesaddict.com/category/sports-headphones/" rel="noopener noreferrer">sports earbuds</a>, you can still use them like ones.</p>\n' +
        '<p>These <a href="https://www.panasonic.com" rel="noopener noreferrer">Panasonic</a> earbuds are nothing special compared to many others on the market, but when considering the price, these are the optimal balance of everything a pair of earbuds is supposed to be.</p>\n' +
        '<p><strong>If you’re looking for dirt cheap yet good earbuds, these are the best under $10 IEMs on the market right now.</strong></p>\n' +
        '<div class="addict-button addict-button-14"><a href="https://amzn.to/2sccM5W" target="_blank" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Famzn.to%2F2sccM5W&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-14 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="bass_under_-10-_KZ_ATE"><span id="bass_under_10_KZ_ATE">bass under $10: <a href="https://www.amazon.com/dp/B00Y0F6IBG/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB00Y0F6IBG%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">KZ ATE</a></span></h3>\n' +
        '<p><img class="size-full wp-image-3026 alignnone" title="KZ ATE in-ear monitors" src="https://headphonesaddict.com/wp-content/uploads/2018/10/KZ-ATE.jpg" alt="KZ ATE in-ear monitors" width="650" height="380" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2018/10/KZ-ATE.jpg 650w, https://headphonesaddict.com/wp-content/uploads/2018/10/KZ-ATE-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2018/10/KZ-ATE-500x292.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></p>\n' +
        '<h4>Best bass earbuds under $10 (around 10 bucks).</h4>\n' +
        '<p><a href="https://headphonesaddict.com/kz-ate-review/">KZ ATE full review</a>.</p>\n' +
        '<p><strong>Should You Buy These?</strong></p>\n' +
        '<p>If you want to listen to quality and strong bass, while doing your everyday tasks, read on.</p>\n' +
        '<p><strong>The Good</strong></p>\n' +
        '<p>Their main advantage is their punchy bass that will make you happy. For a low-end price, you’re getting a lot of “thump” per dollar. Foam tips create the best seal as they emphasize lows and remove the noise around you.</p>\n' +
        '<p>You can get a model with an in-line microphone and remote control that work both on iPhones and Androids. It costs a couple of dollars above 10 but pretty close on the money.</p>\n' +
        '<p>The microphone is quite good to use in any calmer environments. These are made entirely out of plastic. But they still have better durability than most budget headphones. <a href="https://headphonesaddict.com/the-most-durable-earbuds/">If you want more durable earbuds, check these.</a></p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>The first thing that can bother you is their unusual over the ear fit. Also, these are not the most comfortable to wear. Their cables can produce a little noise while hitting against your clothes. If you use them in the gym, be careful. They are not sweat- or waterproof.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>Audiophiles love these headphones. Their sound is unquestionably bass-emphasized. But even though the bass is loud and punchy, other ranges still come out clear and detailed. Because of their big bass signature, they are suitable for heavier music genres, like heavy metal or rap. Listening to more calm music is enjoyable too, because of their overall rich sound. <a href="https://headphonesaddict.com/best-bass-earbuds/">Other top-rated bass earbuds</a>.</p>\n' +
        '<p><strong>The Verdict</strong></p>\n' +
        '<p>For the best bang for your buck (literally) get the KZ ATE, which produce massive bass for the price of slightly above 10 dollars. <a href="https://headphonesaddict.com/kz-ate-review/">KZ ATE full review</a>.</p>\n' +
        '<div class="addict-button addict-button-15"><a href="https://www.amazon.com/dp/B00Y0F6IBG/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB00Y0F6IBG%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-15 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_15_Best_Cheap_Earbuds">Back to top</a></p>\n' +
        '<blockquote>\n' +
        '    <p><strong>Note:</strong> Looking for more dirt-cheap buds? <a href="https://headphonesaddict.com/best-earbuds-under-10/">All under $10 here</a>.</p>\n' +
        '</blockquote>\n' +
        '<hr>\n' +
        '<p><a href="https://headphonesaddict.com/about-us/">How we do reviews?</a></p>\n' +
        '<p>&nbsp;</p>\n' +
        '<hr>\n' +
        '<p><em>Disclosure: We might receive affiliate compensation if you purchase products via links on this page. This is how we purchase headphones for new reviews and keep the site adds-free. In spite of that, we do our best to tell the truth about every product and don’t favor any one brand or model.</em></p>';
    var bestUnderwaterBluetooth =
        '<br><a data-toggle="collapse" class="collapsed" href="#collapseWhat-s_an_IP_Rating-_Water_Protection_IPX_Rating_Explained" id="What-s_an_IP_Rating-_Water_Protection_IPX_Rating_Explained"><span id="Whatrsquos_an_IP_Rating_Water_Protection_IPX_Rating_Explained">What’s an IP Rating? Water Protection IPX Rating Explained</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseWhat-s_an_IP_Rating-_Water_Protection_IPX_Rating_Explained">\n' +
        '    <p>What exactly do IP66, IP67, IPX7 actually mean?</p>\n' +
        '    <p>These are water protection ratings which consist of <a href="http://www.engineeringtoolbox.com/ip-ingress-protection-d_452.html" target="_blank" rel="noopener noreferrer">IP (ingress protection)</a> following by two numbers. The first one represents the level of protection from dust from 0-6 and the second one represents protection from water on a 0-8 scale.</p>\n' +
        '    <p>If IPX is used, this means the device is protected from water only and doesn’t feature dust protection. X replaces the dust protection rating. The same combination can be made for dust only protection, like IP6X.</p>\n' +
        '    <p>In short,</p>\n' +
        '    <ul>\n' +
        '        <li>IPX0 means no protection</li>\n' +
        '        <li>IPX1 means protection from dripping water</li>\n' +
        '        <li>IPX2 means protection from vertically dripping water</li>\n' +
        '        <li>IPX3 means protection from sprayed water</li>\n' +
        '        <li>IPX4 means protection from splashed water</li>\n' +
        '        <li>IPX5 means protection from water projected from a nozzle</li>\n' +
        '        <li>IPX6 means protection from strong jet of water</li>\n' +
        '        <li>IPX7 means protection from immersion in water up to 3ft (1m) for 30 minutes</li>\n' +
        '        <li>IPX8 means better than IPX7, but there are no exact requirements (IPX8 is usually claimed by the manufacturer)</li>\n' +
        '    </ul>\n' +
        '    <p>It’s important to know there are no IPX8 Bluetooth headphones on the market since the wireless connection probably wouldn’t work properly under water.</p>\n' +
        '    <p>To get the best possible protection from water, look for IPX7 Bluetooth headphones that you can accidentally drop in the water up to 3ft in-depth without damage. This is the best protection currently available in waterproof <a href="http://www.bluetooth.com/Pages/Bluetooth-Home.aspx" target="_blank" rel="noopener noreferrer">Bluetooth</a> headphones.</p>\n' +
        '    <p>For example, Plantronics BackBeat Fit have an IPX7 rating. If you get headphones with anything less than that and you drop them in water, it’s very likely they’ll get damaged.</p>\n' +
        '    <p>If you plan on using headphones near water, it’s a good idea to get ones with the best water protection you can get.</p>\n' +
        '</div>\n' +
        '<a data-toggle="collapse" class="collapsed" href="#collapseBest_Use_of_Waterproof_Bluetooth_Headphones_1"><span id="Best_Use_of_Waterproof_Bluetooth_Headphones">Best Use of Waterproof Bluetooth Headphones</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseBest_Use_of_Waterproof_Bluetooth_Headphones_1">\n' +
        '    <p>The intended way of using waterproof Bluetooth earbuds and headphones is somewhere they can get wet or fall in the water.</p>\n' +
        '    <p>Whether you’re kayaking, paddle boarding or you like to drive around in a jet-ski but are afraid to use your regular <a href="https://headphonesaddict.com/category/sports-headphones/">sports headphones</a>, this is the perfect opportunity to use waterproof Bluetooth headphones.</p>\n' +
        '    <p>Basically, you can use waterproof headphones for any activity near the water where it is possible they will get wet, while still above the water level. For Bluetooth to function properly, the headphones have to be above water.</p>\n' +
        '    <p>Put your smartphone in a dry bag, connect via Bluetooth and paddle away. If the headphones get wet, just wipe them after use.</p>\n' +
        '    <p>Keep in mind that the average Bluetooth range is about 30ft, so keep your music device close enough to hold the connection.</p>\n' +
        '</div>\n' +
        '<a data-toggle="collapse" class="collapsed" href="#collapseHow_to_Use_Your_Phone_with_Waterproof_Headphones-" id="How_to_Use_Your_Phone_with_Waterproof_Headphones-"><span id="How_to_Use_Your_Phone_with_Waterproof_Headphones">How to Use Your Phone with Waterproof Headphones?</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseHow_to_Use_Your_Phone_with_Waterproof_Headphones-">\n' +
        '    <p>Make sure to get a good waterproof phone bag. <a href="https://www.amazon.com/dp/B01I1430WQ/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB01I1430WQ%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Mpow waterproof case</a> is very popular and protects the phone from water up to 100ft in depth. It’s suitable for iPhones and Android phones.</p>\n' +
        '    <p>Once you have your phone protected, put on your waterproof headphones and go on your way without fear of damaging any of your electronics.</p>\n' +
        '</div>\n' +
        '<a data-toggle="collapse" class="collapsed" href="#collapseUnderwater_Bluetooth_Headphones_for_Swimming_1" id="Underwater_Bluetooth_Headphones_for_Swimming_1"><span id="Underwater_Bluetooth_Headphones_for_Swimming">Underwater Bluetooth Headphones for Swimming</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseUnderwater_Bluetooth_Headphones_for_Swimming_1">\n' +
        '    <p>A lot of swimmers are looking for wireless Bluetooth headphones for swimming.</p>\n' +
        '    <p>But there’s an issue.</p>\n' +
        '    <p>Now, there is no problem creating water-resistant and waterproof headphones, but as of right now we have no wireless technology that would transmit the signal underwater with high enough proficiency.</p>\n' +
        '    <p>Swimming headphones cannot use Bluetooth technology.</p>\n' +
        '    <p>The water is simply too “dense” and soaks up all the signal, making Bluetooth useless underwater.</p>\n' +
        '    <p>This wireless technology doesn’t work properly underwater, and so far no manufacturer has been able to produce a decent pair of wireless underwater headphones.</p>\n' +
        '    <p>For real underwater purposes, you’ll have to use <a href="https://headphonesaddict.com/best-swimming-headphones/">wired swimming headphones</a> together with an <a href="https://headphonesaddict.com/best-waterproof-ipod-mp3-players/">underwater music player</a>.</p>\n' +
        '</div>\n' +
        '<a data-toggle="collapse" class="collapsed" href="#collapseHow_Not_to_Use_Wireless_Headphones_Even_if_They_are_Waterproof_1" id="How_Not_to_Use_Wireless_Headphones_Even_if_They_are_Waterproof_1"><span id="How_Not_to_Use_Wireless_Headphones_Even_if_They_are_Waterproof">How Not to Use Wireless Headphones Even if They are Waterproof</span></a>\n' +
        '<div class="collapse cxl-collapse" id="collapseHow_Not_to_Use_Wireless_Headphones_Even_if_They_are_Waterproof_1">\n' +
        '    <p>Don’t use them f<a href="https://headphonesaddict.com/best-swimming-headphones/">or swimming</a> or intentionally submerge them in water. While most of these are designed to survive lots of water, some even underwater, it’s never a good idea to push the limits, especially with headphones rated below IPX7.</p>\n' +
        '    <p>These are perfect for using above water while being protected enough to survive an accidental drop in the water or heavy splashing. Anything more than that is likely to damage them. (dropping them deep underwater…)</p>\n' +
        '</div>\n' +
        '<h2 id="The_Best_Waterproof_Bluetooth_Headphones_1"><span id="The_Best_Waterproof_Bluetooth_Headphones">The Best Waterproof Bluetooth Headphones</span></h2>\n' +
        '<h3 id="best_overall-_Jaybird_X4"><span id="best_overall_Jaybird_X4">best overall: <a href="https://www.amazon.com/dp/B07GVCZPSJ/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07GVCZPSJ%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Jaybird X4</a></span></h3>\n' +
        '<p><img class="alignnone wp-image-3091 size-full" title="Jaybird X4 wireless sports earbuds" src="https://headphonesaddict.com/wp-content/uploads/2016/07/Jaybird-X4-wireless-sports-earbuds.jpg" alt="Jaybird X4 wireless sports earbuds" width="650" height="380" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2016/07/Jaybird-X4-wireless-sports-earbuds.jpg 650w, https://headphonesaddict.com/wp-content/uploads/2016/07/Jaybird-X4-wireless-sports-earbuds-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2016/07/Jaybird-X4-wireless-sports-earbuds-500x292.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></p>\n' +
        '<h4>Jaybird X4 are the best waterproof Bluetooth headphones right now (<a href="https://headphonesaddict.com/jaybird-x4-review/">full review</a>).</h4>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Water-protection:</strong> IPX7<br><strong>Battery:</strong> Up to 8 hours<br><strong>Bluetooth codecs:</strong> SBC, AAC</p>\n' +
        '<p><strong>Should You Buy These?</strong></p>\n' +
        '<p>If you’re looking for amazing stability, high comfort, decent battery life, and great sound, then you should check the Jaybird X4.</p>\n' +
        '<p><strong>The Good</strong></p>\n' +
        '<p>First of all, the sporty design looks appealing and fun. And, it’s also lightweight.</p>\n' +
        '<p>The earbuds don’t enter the ear canal as deep as others. That’s why they are extremely comfortable. And, these are one of <a href="https://headphonesaddict.com/best-headphones-for-running/">the best headphones for running</a>.</p>\n' +
        '<p>Also, the noise isolation is pretty amazing, especially with Comply memory foam eartips.</p>\n' +
        '<p>While the overall build quality is just okay, since they’re fully plastic, they have an IPX7 certification. This means you can wash the buds under water and easily run in the rain. Their stability is solid as a rock.</p>\n' +
        '<p>You also get an in-line remote. It helps you set the volume, skip/play/pause tracks and manage calls. Plus a rechargeable battery that lasts up to 8 hours provides enough time for a daily workout.</p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>Charging is possible only with the proprietary cable and that’s annoying.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>Their sound signature is rather balanced (in flat mode). Bass is consistent and deep. If you like to listen to many different music genres, these waterproof earbuds are just perfect.</p>\n' +
        '<p>What makes them sound great is the app. It allows you to change the sound exactly the way you want it. If you want more bass or more of a V-shaped sound, you can get it right away.</p>\n' +
        '<p><iframe src="https://www.youtube-nocookie.com/embed/N0k7o_CtMmY" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p>\n' +
        '<p><strong>The Verdict</strong></p>\n' +
        '<p>Jaybird X4 are the only premium, heavy-sports wireless earbuds with proper water-resistance. Being waterproof (IPX7), super comfy and having great sound, these workout earbuds compete with the best.</p>\n' +
        '<p><a href="https://headphonesaddict.com/jaybird-x4-review/">Read the Jaybird X4 full review</a>.</p>\n' +
        '<div class="addict-button addict-button-1"><a href="https://www.amazon.com/dp/B07GVCZPSJ/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07GVCZPSJ%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-1 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_The_Best_Waterproof_Bluetooth_Headphones">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_true_wireless-_Jabra_Elite_Active_65t"><span id="best_true_wireless_Jabra_Elite_Active_65t">best true wireless: <a href="https://www.amazon.com/dp/B07BHF993Q/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07BHF993Q%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Jabra Elite Active 65t</a></span></h3>\n' +
        '<p><img class="alignnone wp-image-2900" title="Jabra Elite Active 65t" src="https://headphonesaddict.com/wp-content/uploads/2015/01/Jabra-Elite-Active-65t.jpg" alt="Jabra Elite Active 65t" width="650" height="378" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/Jabra-Elite-Active-65t.jpg 960w, https://headphonesaddict.com/wp-content/uploads/2015/01/Jabra-Elite-Active-65t-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/Jabra-Elite-Active-65t-768x447.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2015/01/Jabra-Elite-Active-65t-500x291.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></p>\n' +
        '<h4>Jabra Elite Active 65t are the best true wireless earbuds with water protection.</h4>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Water-protection:</strong> IPX6 (IP56)<br><strong>Battery:</strong> Up to 5 hours (+ 2 additional charges in the case, altogether up to 15 hours)<br><strong>Bluetooth codecs:</strong> SBC, AAC</p>\n' +
        '<p><strong>Should You Buy These?</strong></p>\n' +
        '<p>Are you tired of wires? Then you should get yourself true wireless earbuds with amazing sound and nice design.</p>\n' +
        '<p><strong>The Good</strong></p>\n' +
        '<p>Their design looks cool (being true wireless and all). It’s also not heavy, so you can wear them for a long time without complaining.</p>\n' +
        '<p>Water resistance (IPX6) makes them a perfect partner for your sweatiest workouts. The Jabra earbuds are also perfect for sports because of their great stability (one of the most secure in the category).</p>\n' +
        '<p>Additionally, the two main buttons allow you to manage tracks, calls and control Siri/Alexa.</p>\n' +
        '<p>Add a decent battery life of 5 hours and an additional 2 charges in the case, and you get fantastic truly wireless buds suitable for long workouts.</p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>People with smaller ears might find them uncomfortable. Earbuds are bigger than usual so they might put some extra pressure on the ear. Plus, they are quite pricey.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>Having better overall sound than most of the true Bluetooth headphones is definitely a big advantage. Otherwise, their sound signature is rather balanced. The bass is clear and can give you just the right amount of motivation when needed.</p>\n' +
        '<p><iframe src="https://www.youtube-nocookie.com/embed/76N0cWwYrDs" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p>\n' +
        '<p><strong>The Verdict</strong></p>\n' +
        '<p>Jabra Elite Active 65t can be your “match made in heaven” for running or just every day listening. Their well-built design, stable fit, and lovely sound can no doubt blur their high price.</p>\n' +
        '<div class="addict-button addict-button-2"><a href="https://www.amazon.com/dp/B07BHF993Q/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07BHF993Q%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-2 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_The_Best_Waterproof_Bluetooth_Headphones">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_bass-_Sony_MDR-XB80BS_Extra_Bass"><span id="best_bass_Sony_MDR-XB80BS_Extra_Bass">best bass: <a href="https://www.amazon.com/dp/B079J4Q6F7/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB079J4Q6F7%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Sony MDR-XB80BS Extra Bass</a></span></h3>\n' +
        '<p><img class="wp-image-3279 alignnone" title="Sony MDR-XB80BS Extra Bass" src="https://headphonesaddict.com/wp-content/uploads/2015/02/Sony-MDR-XB80BS-Extra-Bass.jpg" alt="Sony MDR-XB80BS Extra Bass" width="650" height="379" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/02/Sony-MDR-XB80BS-Extra-Bass.jpg 960w, https://headphonesaddict.com/wp-content/uploads/2015/02/Sony-MDR-XB80BS-Extra-Bass-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/02/Sony-MDR-XB80BS-Extra-Bass-768x448.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2015/02/Sony-MDR-XB80BS-Extra-Bass-500x292.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></p>\n' +
        '<h4>Sony MDR-XB80BS Extra Bass are the best waterproof wireless earbuds for a basshead.</h4>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Water-protection:</strong> IPX5<br><strong>Battery:</strong> Up to 7 hours<br><strong>Bluetooth codecs:</strong> SBC, LDAC</p>\n' +
        '<p><strong>Should You Buy These?</strong></p>\n' +
        '<p>If you’re a fan of the ear-hook design and strong bassy sound, then read on.</p>\n' +
        '<p><strong>The Good</strong></p>\n' +
        '<p>Their design is made especially for sports enthusiasts. Rubbery ear hooks help them stay in their place.</p>\n' +
        '<p>The lightweight and well-thought design is comfortable. The ear hooks feature the remote buttons which navigate music and calls.</p>\n' +
        '<p>When it comes to “waterproofness,” IPX5 protection is enough to prevent your sweat or rain from damaging them.</p>\n' +
        '<p>And, having up to 7 hours of battery life provides you enough time for a week’s worth of exercise.</p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>Buttons can be a little awkward to use. You have to press them against your head. In addition, if you’re not a bass lover, you’ll hate the overpowering lows.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>Like their name says, they have a lot of bass. This makes the waterproof earphones perfect for music like EDM and hip-hop. So, if you’re a basshead, these are perfect for you. You can <a href="https://headphonesaddict.com/best-bass-earbuds/">find more bass earphones here</a>.</p>\n' +
        '<p><strong>The Verdict</strong></p>\n' +
        '<p>Do you need wireless earbuds with solid water-resistance that can stay in the ear while you go running? Do you like big punchy bass? Then Sony MDR-XB80BS Extra Bass are your top choice.</p>\n' +
        '<div class="addict-button addict-button-3"><a href="https://www.amazon.com/dp/B079J4Q6F7/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB079J4Q6F7%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-3 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_The_Best_Waterproof_Bluetooth_Headphones">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_value-_Plantronics_BackBeat_Fit"><span id="best_value_Plantronics_BackBeat_Fit">best value: <a href="https://www.amazon.com/dp/B00KJLMBQQ/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB00KJLMBQQ%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Plantronics BackBeat Fit</a></span></h3>\n' +
        '<p><img class="alignnone wp-image-2909" title="Plantronics BackBeat FIT wet" src="https://headphonesaddict.com/wp-content/uploads/2015/01/Plantronics-BackBeat-FIT-wet.jpg" alt="Plantronics BackBeat FIT wet" width="650" height="379" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/Plantronics-BackBeat-FIT-wet.jpg 960w, https://headphonesaddict.com/wp-content/uploads/2015/01/Plantronics-BackBeat-FIT-wet-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/Plantronics-BackBeat-FIT-wet-768x448.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2015/01/Plantronics-BackBeat-FIT-wet-500x292.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></p>\n' +
        '<h4>Plantronics BackBeat Fit are one of the most popular sports headphones.</h4>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Water-protection:</strong> IPX7<br><strong>Battery:</strong> Up to 8 hours<br><strong>Bluetooth codecs:</strong> custom SBC</p>\n' +
        '<p>These are suitable for all sports and not just near water activity.</p>\n' +
        '<p>Running, working out, cycling… are all activities these are perfect for.</p>\n' +
        '<p><iframe src="https://www.youtube-nocookie.com/embed/5MFAQFacv_s?rel=0" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p>\n' +
        '<p><strong>Durability &amp; Water Resistance</strong></p>\n' +
        '<p>Thanks to their IP57 (IPX7) rating, they are well protected from water. This rating means you can submerge them in 3ft (1m) deep water for 30 minutes without damage. It comes handy if you accidentally drop them in water.</p>\n' +
        '<p>Because they are lightweight they don’t submerge quickly, so you have more time to catch them.</p>\n' +
        '<p>They also have high dust protection (rating of 5) as a bonus.</p>\n' +
        '<p>Moreover, they are made out of flexible, rubbery plastics that can endure quite a lot of physical strain that would happen during sports activity.</p>\n' +
        '<p>Overall, these <a href="https://headphonesaddict.com/best-bluetooth-earbuds/">wireless earbuds</a> are well built and suitable for even the harshest sports activity.</p>\n' +
        '<p><strong>Comfort</strong></p>\n' +
        '<p>The fit is rather tight, which might be annoying in the begging, but very soon you’ll get used to it. The benefit of this is that the headset stays in place even during fast movement like running.</p>\n' +
        '<p>If you’ve never before used over-ear hooks, you’ll need some time to adapt. In a few weeks, though, it will be the same as putting on regular earbuds.</p>\n' +
        '<p>The ear tips do a pretty good job of sealing the sound while maintaining comfort for hours. Wearing them for hours doesn’t irritate your ears, but this also depends on the size of your head.</p>\n' +
        '<p><strong>Bluetooth &amp; Battery</strong></p>\n' +
        '<p>Connecting via Bluetooth is fast and easy, especially once you get used to the control on the right headphone. Once connected it works like it’s supposed to, no breaking of sound even up to 30ft (10m) of range.</p>\n' +
        '<p>Just keep your playing device somewhere close, and it’s going to work 99% of times.</p>\n' +
        '<p>Additionally, you can accept calls with it. The microphone has a clear, easy to understand, sound to easily call your friends and chat even when enjoying the boat ride for example.</p>\n' +
        '<p><strong>Built-in controls are easy to use and very intuitive. You can control the volume, song selection and accept/hung up calls.</strong></p>\n' +
        '<p>The recharageable battery is also quite good with 8 hours of playtime. This is more or less standard with Bluetooth headbands, but there are many other wireless waterproof headphones with less battery life than that.</p>\n' +
        '<p>Above all, in 8 hours you can enjoy a lot of activity.</p>\n' +
        '<p><strong>Sound</strong></p>\n' +
        '<p>When it comes to sound these are OK. They’re not great, but for such comfortable, sports-oriented headband <a href="https://en.wikipedia.org/wiki/Plantronics">Plantronics</a> BackBeat Fit do just fine.</p>\n' +
        '<p>With slightly bloated bass you may actually like the sound signature of these if you’re not a hardcore audiophile. Mids and highs aren’t the most precise and detailed, but then again, you’ll probably focus more on paddleboarding than the lack of sound details.</p>\n' +
        '<p><em><strong>To sum up, Plantronics BackBeat Fit are very comfortable, durable, waterproof, Bluetooth headphones suitable for all kinds of sports with good, fun sound.</strong></em></p>\n' +
        '<div class="addict-button addict-button-4"><a href="https://www.amazon.com/dp/B00KJLMBQQ/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB00KJLMBQQ%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-4 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_The_Best_Waterproof_Bluetooth_Headphones">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_on-ear-_Plantronics_BackBeat_FIT_500"><span id="best_on-ear_Plantronics_BackBeat_FIT_500">best on-ear: <a href="https://www.amazon.com/dp/B075ZC7FHT/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB075ZC7FHT%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Plantronics BackBeat FIT 500</a></span></h3>\n' +
        '<p><img class="alignnone wp-image-2596" title="Plantronics BackBeat Fit 500" src="https://headphonesaddict.com/wp-content/uploads/2015/01/Plantronics-BackBeat-Fit-500.jpg" alt="Plantronics BackBeat Fit 500" width="650" height="379" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/Plantronics-BackBeat-Fit-500.jpg 900w, https://headphonesaddict.com/wp-content/uploads/2015/01/Plantronics-BackBeat-Fit-500-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/Plantronics-BackBeat-Fit-500-768x448.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2015/01/Plantronics-BackBeat-Fit-500-500x292.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></p>\n' +
        '<h4>Plantronics BackBeat FIT 500 are the best waterproof Bluetooth on-ear headphones.</h4>\n' +
        '<p><strong>Type:</strong> On-ear<br><strong>Water-protection:</strong> Waterproof<br><strong>Battery:</strong> Up to 18 hours<br><strong>Bluetooth codecs:</strong> SBC</p>\n' +
        '<p><strong>Should You Buy These?</strong></p>\n' +
        '<p>If you’re looking for on-ear headphones with a waterproof rating and Bluetooth technology, check these.</p>\n' +
        '<p><strong>The Good</strong></p>\n' +
        '<p>Although their design might look cheap at first sight, they are quite durable. Being extremely lightweight for on-ear headphones is a nice surprise (and needed to stay on during a workout). Note, these are on-ear and not over-ear headphones. The difference is in size, on-ears are smaller.</p>\n' +
        '<p>Their battery can get you through 18 hours of listening. If you’re using them for sports, that means you get up to a whole week of workouts. Plus, you can plug the cable and enjoy them wired.</p>\n' +
        '<p>Moreover, the easy-to-use buttons on the ear cup give you the ability to skip/play songs and make calls. Their on-ear design may not provide the best noise isolation. But that can come in handy when you want to be aware of the surroundings.</p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>The on-ear design might put too much pressure on the head. If you’re looking for headphones you can use for running or other heavy cardio workouts; you might want to reconsider your choice. After all, their design is not as stable as earbuds.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>Even though the ranges are quite balanced, bass still stands out. That is great for music genres like electronic or rap. And, listening to other music genres is satisfying as well. The overall sound is excellent for their price range.</p>\n' +
        '<p><strong>The Verdict</strong></p>\n' +
        '<p>Plantronics BackBeat FIT 500 are simple, yet efficient on-ear sports headphones. By efficient we mean that they give you all you need—extra good sound, great durability, and long battery life.</p>\n' +
        '<div class="addict-button addict-button-5"><a href="https://www.amazon.com/dp/B075ZC7FHT/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB075ZC7FHT%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-5 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_The_Best_Waterproof_Bluetooth_Headphones">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_under_-50-_Origem_HS-1"><span id="best_under_50_Origem_HS-1">best under $50: <a href="https://www.amazon.com/dp/B07C9ZM22D/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07C9ZM22D%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Origem HS-1</a></span></h3>\n' +
        '<p><img class="alignnone wp-image-2960" title="Origem HS-1 featured" src="https://headphonesaddict.com/wp-content/uploads/2018/09/Origem-HS-1-featured.jpg" alt="Origem HS-1 featured" width="650" height="435" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2018/09/Origem-HS-1-featured.jpg 800w, https://headphonesaddict.com/wp-content/uploads/2018/09/Origem-HS-1-featured-300x201.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2018/09/Origem-HS-1-featured-768x514.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2018/09/Origem-HS-1-featured-500x334.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></p>\n' +
        '<h4><a href="https://headphonesaddict.com/origem-hs-1-review/">Origem HS-1 (full review)</a> are fully waterproof with IPX7 protection for all water sports and a fantastic battery with 10h capacity.</h4>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Water-protection:</strong> IPX7<br><strong>Battery:</strong> Up to 10 hours<br><strong>Bluetooth codecs:</strong> SBC, aptX</p>\n' +
        '<p><strong>Should You Buy These:</strong></p>\n' +
        '<p>Origem HS-1 is an excellent choice for waterproof Bluetooth headphones with a V-shaped sound signature (emphasized bass and treble). If you like affordable <a href="https://headphonesaddict.com/best-bluetooth-earbuds-under-50/">wireless earbuds under $50</a>, these are for you.</p>\n' +
        '<p><strong>The Good</strong></p>\n' +
        '<p>Apart from excellent water-protection (IPX7) the earbuds are well built and fit comfortably in your ears. Use the proper ear wings, and you can use them for running as well. The fast charging is a nice feature as well.</p>\n' +
        '<p>Additionally, the microphone is clear and the remote control easy to use. There’s only one thing that bothers…</p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>It’s lousy Bluetooth connection between walls. The moment you put a barrier between your headphones and your music device you’ll get distortion. Thankfully, there’s no a lot of walls outside in nature.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>Furthermore, audio quality is better than expected for the price. With <a href="http://www.aptx.com/" target="_blank" rel="noopener">aptX</a> support, you get an enjoyable V-shaped sound that gets very loud. It’s one of the better choices in this price range.</p>\n' +
        '<p><iframe src="https://www.youtube.com/embed/dwObY7mwL54" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p>\n' +
        '<p><strong>The Verdict</strong></p>\n' +
        '<p>To maximize your money, get Origem HS-1 for your Bluetooth waterproof earbuds and a fun fix of boosted bass and treble.</p>\n' +
        '<p><a href="https://headphonesaddict.com/origem-hs-1-review/">Read the full Origem HS-1 review</a>.</p>\n' +
        '<div class="addict-button addict-button-6"><a href="https://www.amazon.com/dp/B07C9ZM22D/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB07C9ZM22D%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-6 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_The_Best_Waterproof_Bluetooth_Headphones">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="VAVA_Moov_28_1"><span id="VAVA_Moov_28"><a href="https://www.amazon.com/dp/B071JDP15H/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB071JDP15H%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">VAVA Moov 28</a></span></h3>\n' +
        '<p><img class="alignnone wp-image-2197" title="VAVA Moov 28" src="https://headphonesaddict.com/wp-content/uploads/2015/01/VAVA-Moov-28.jpg" alt="VAVA Moov 28" width="650" height="344" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/VAVA-Moov-28.jpg 850w, https://headphonesaddict.com/wp-content/uploads/2015/01/VAVA-Moov-28-300x159.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/VAVA-Moov-28-768x407.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2015/01/VAVA-Moov-28-500x265.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></p>\n' +
        '<h4><a href="https://headphonesaddict.com/vava-moov-28-review/">VAVA Moov 28</a> are a superb cheap pair of wireless waterproof headphones.</h4>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Water-protection:</strong> IPX6<br><strong>Battery:</strong> Up to 9 hours<br><strong>Bluetooth codecs:</strong> SBC, aptX</p>\n' +
        '<p>For the price under $30, you’re getting small, ergonomic in-ear headphones with lots of features.</p>\n' +
        '<p>Having great build-quality with IPX6 water protection you can even wash these with water. Flat rubber wires and lightweight metal casing help them withstand a lot of use.</p>\n' +
        '<p><span lang="EN-US">Want to find more <a href="https://headphonesaddict.com/the-most-durable-earbuds/" target="_blank" rel="noopener">durable IEMs?</a></span></p>\n' +
        '<p>The in-line microphone and remote control are well designed and easy to use. With <a href="https://www.cnet.com/news/bluetooth-4-0-what-is-it-and-does-it-matter/" target="_blank" rel="noopener">Bluetooth 4.2</a>, aptX and CVC 6.0 noise cancelling microphone, you get better sound quality for music and talks. The battery life is solid 8-9 hours which is surprisingly long for such small wireless earbuds.</p>\n' +
        '<p>Don’t forget, this ANC technology is different and shouldn’t be mistaken for real <a href="https://headphonesaddict.com/the-best-noise-canceling-bluetooth-headphones/">noise-cancelling headphones</a>.</p>\n' +
        '<p>The sound quality isn’t bad either. They get loud enough and have a balanced sound signature with good bass. At times you might hear some sibilance and cable noise if you don’t put them on properly. Otherwise, they sound very well and are a lot of fun for working out or enjoying the outside.</p>\n' +
        '<p><a href="https://headphonesaddict.com/vava-moov-28-review/">Read the full review of VAVA Moov 28.</a></p>\n' +
        '<div class="addict-button addict-button-7"><a href="https://www.amazon.com/dp/B071JDP15H/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB071JDP15H%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-7 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_The_Best_Waterproof_Bluetooth_Headphones">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="under_-30_runner-up-_Anker_SoundBuds_Slim-"><span id="under_30_runner-up_Anker_SoundBuds_Slim">under $30 runner-up: <a href="https://www.amazon.com/dp/B0756T7R5T/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB0756T7R5T%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Anker SoundBuds Slim+</a></span></h3>\n' +
        '<p><img class="wp-image-2902 alignnone" title="Anker SoundBuds Slim+" src="https://headphonesaddict.com/wp-content/uploads/2015/01/Anker-SoundBuds-Slim.jpg" alt="Anker SoundBuds Slim+" width="650" height="379" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/01/Anker-SoundBuds-Slim.jpg 960w, https://headphonesaddict.com/wp-content/uploads/2015/01/Anker-SoundBuds-Slim-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/01/Anker-SoundBuds-Slim-768x448.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2015/01/Anker-SoundBuds-Slim-500x292.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></p>\n' +
        '<h4><a href="https://headphonesaddict.com/anker-soundbuds-slim-review/">Anker SoundBuds Slim+ (review)</a> are great under $30 waterproof wireless buds.</h4>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Water-protection:</strong> IPX5<br><strong>Battery:</strong> Up to 7 hours<br><strong>Bluetooth codecs:</strong> SBC, aptX</p>\n' +
        '<p>Water protection is good with an IPX5 rating. This means you can wash these headphones with a wet cloth but dipping them under water is not advised. They could probably survive the accidental dip in the water but can’t survive there for long.</p>\n' +
        '<p>With good build-quality, other features aren’t neglected. Lightweight and comfortable for any sports activity. A good selection of ear tips and ear wings in a hard carrying case is common but always a plus.</p>\n' +
        '<p><strong><em><span lang="EN-US">Note:</span></em></strong><a href="https://headphonesaddict.com/best-earbuds-under-30/"><span lang="EN-US"> Best earbuds under $30</span></a></p>\n' +
        '<p>The Bluetooth connection is above average. The range is average at around 33ft (10m), but the connection strength is better than with most alternatives. The signal doesn’t die out or disconnect even behind a wall.</p>\n' +
        '<p><iframe src="https://www.youtube-nocookie.com/embed/pEuiwxqjEwU?rel=0" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p>\n' +
        '<p>The battery holds solid 7 hours of music on a full charge and even more of calling with the in-line microphone. Add to this aptX Bluetooth codec with good sound quality, and you have a great pair of waterproof headphones.</p>\n' +
        '<p>With a rather balanced sound signature, all music genres will sound good and be fun to listen to. These are perfect for inside or outside sports activity like trekking, mountain biking, and any other outside sport.</p>\n' +
        '<p><a href="https://headphonesaddict.com/anker-soundbuds-slim-review/">Read the Anker SoundBuds Slim+ full review</a>.</p>\n' +
        '<div class="addict-button addict-button-8"><a href="https://www.amazon.com/dp/B0756T7R5T/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB0756T7R5T%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-8 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_The_Best_Waterproof_Bluetooth_Headphones">Back to top</a></p>\n' +
        '<hr>\n' +
        '<h3 id="best_cheap-_Senso_Bluetooth_Headphones"><span id="best_cheap_Senso_Bluetooth_Headphones">best cheap: <a href="https://www.amazon.com/dp/B0792QJQT1/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB0792QJQT1%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Senso Bluetooth Headphones</a></span></h3>\n' +
        '<p><img class="alignnone wp-image-3281" title="SENSO Bluetooth Headphones" src="https://headphonesaddict.com/wp-content/uploads/2015/02/SENSO-Bluetooth-Headphones.jpg" alt="SENSO Bluetooth Headphones" width="650" height="379" data-popupalt-original-title="null" srcset="https://headphonesaddict.com/wp-content/uploads/2015/02/SENSO-Bluetooth-Headphones.jpg 960w, https://headphonesaddict.com/wp-content/uploads/2015/02/SENSO-Bluetooth-Headphones-300x175.jpg 300w, https://headphonesaddict.com/wp-content/uploads/2015/02/SENSO-Bluetooth-Headphones-768x448.jpg 768w, https://headphonesaddict.com/wp-content/uploads/2015/02/SENSO-Bluetooth-Headphones-500x292.jpg 500w" sizes="(max-width: 650px) 100vw, 650px"></p>\n' +
        '<h4>Senso Bluetooth Headphones are popular cheap wireless earbuds that can easily compete with some high-end alternatives.</h4>\n' +
        '<p><strong>Type:</strong> In-ear<br><strong>Water-protection:</strong> IPX7<br><strong>Battery: </strong>Up to 8 hours<br><strong>Bluetooth codecs:</strong> SBC</p>\n' +
        '<p><strong>Should You Buy These?</strong></p>\n' +
        '<p>If you’re looking for budget earbuds with waterproof sports design and reliable Bluetooth performance, get these. Or, check <a href="https://headphonesaddict.com/best-earbuds-for-the-money/">wired cheap buds</a>.</p>\n' +
        '<p><strong>The Good</strong></p>\n' +
        '<p>Their sporty design with ear hooks provides amazing stability. You can do your heaviest cardio workouts, and they will never fall off.</p>\n' +
        '<p>On top of that, being IPX7 certified makes them your indispensable partner in the gym. Since the tips don’t enter the ear canal deeply, you can wear them for a long time. Comfort stays the same throughout the time.</p>\n' +
        '<p>Furthermore, simple controls help you play/stop audio and take calls. And, despite them being cheap, their battery life is pretty amazing (up to 8 hours of music per charge is fantastic).</p>\n' +
        '<p><strong>The Bad </strong></p>\n' +
        '<p>If you’re looking for an audiophile experience, their sound will disappoint you.</p>\n' +
        '<p><strong>The Sound</strong></p>\n' +
        '<p>Actually, you get the sound you pay for. Bass is powerful but can get muddy at times. Otherwise, if you’re not too keen on high sound quality, you’ll be happy. They will more than satisfy an average user.</p>\n' +
        '<p><strong>The Verdict</strong></p>\n' +
        '<p>Senso Bluetooth Headphones are low-priced, but despite that, they still have many features that make them worth every penny. What really stands out, in the “cheap category”, is their stunning battery life and reliable performance.</p>\n' +
        '<div class="addict-button addict-button-9"><a href="https://www.amazon.com/dp/B0792QJQT1/?tag=headphonesaddict-20" target="_blank" rel="nofollow" data-geniuslink="//buy.geni.us/Proxy.ashx?TSID=83480&amp;GR_URL=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB0792QJQT1%2F%3Ftag%3Dheadphonesaddict-20&amp;dtb=1">Buy on Amazon</a></div>\n' +
        '<style>.addict-button-9 > a { background-color: #1583dc;\n' +
        '    color: #fff;\n' +
        '    font-family: Yantramanav, sans-serif;;\n' +
        '    font-size: 19px;\n' +
        '    font-weight: 700; }\n' +
        '</style>\n' +
        '<p style="text-align: right;"><a href="#Comparison-_The_Best_Waterproof_Bluetooth_Headphones">Back to top</a></p>\n' +
        '<hr>\n' +
        '<p><a href="https://headphonesaddict.com/about-us/" target="_blank" rel="noopener">How we do reviews?</a></p>\n' +
        '<p>&nbsp;</p>\n' +
        '<hr>\n' +
        '<p><strong>More popular guides:</strong></p>\n' +
        '<p><span lang="EN-US">Looking for a <a href="https://headphonesaddict.com/best-gaming-headset-gaming-headphones/">good gaming headset?</a></span></p>\n' +
        '<p><a href="https://headphonesaddict.com/best-noise-cancelling-earbuds/">The best noise cancelling earbuds</a></p>\n' +
        '<p>&nbsp;</p>\n' +
        '<p><strong>Share Your Favorite Waterproof Bluetooth Headphones</strong></p>\n' +
        '<p>If you have your own model of wireless, waterproof headphones that you think are better than those on this list, please share it with us.</p>\n' +
        '<p>We’d like to know what you’re successfully using in real life, so we can review and put it on our top headphones list.</p>\n' +
        '<p>To get future updates of the best waterproof Bluetooth earbuds, subscribe or like the website on any of the social media.</p>\n' +
        '<hr>\n' +
        '<p><em>Disclosure: We might receive affiliate compensation if you purchase products via links on this page. This is how we finance headphones for new reviews and keep the site adds-free. In spite of that, we do our best, to tell the truth about every product and don’t favor any one brand or model.</em></p>';
    var waitForObj = function (selector, callback, maxTimes) {
        if (typeof selector === 'function') {
            console.debug('waitForObj: executing callback');
            callback();
        } else {
            if (maxTimes === false || maxTimes > 0) {
                (maxTimes !== false) && maxTimes-- ;
                setTimeout(function () {
                    console.debug('waitForObj: repeat search');
                    waitForObj(selector, callback, maxTimes);
                }, 100);
            }
        }
    };
    var guidePageTemplate = {
        init: function() {
            this.cacheDom();
            this.changeHtml();
        },
        cacheDom: function() {
            this.$body = $('body');
        },
        changeHtml: function() {
            this.hideUntil();
            this.replacePostHtml();
            this.insertProductInfo();
            this.addHeadingClasses();
            this.changeTitleTexts();
        },
        hideUntil: function() {
            var $hideStart = $('.jumpto');
            var $hideEnd = $('.swp_social_panel');
            // Hide content between top subheading and jump to block
            if ($hideStart.length && $hideEnd.length) {
                //$hideStart.nextUntil($hideEnd).addClass('cxl-hide cxl-between-elements');
                $hideStart.nextUntil($hideEnd).remove();
            }
        },
        replacePostHtml: function() {
            var newHtml = '';
            if (document.location.pathname === "/best-noise-cancelling-earbuds/") {
                newHtml = bestNoiseCancelling;
            } else if (document.location.pathname === "/best-earbuds-for-the-money/") {
                newHtml = bestForMoney;
            } else if (document.location.pathname === "/best-underwater-bluetooth-headphones/") {
                newHtml = bestUnderwaterBluetooth;
            }
            if (newHtml !== '') {
                $('#the-post').find('.the-post-article:not(#end-of-post) .swp_social_panel').last().before(newHtml);
            }
        },
        generateInfoBoxHtml: function($img, $cta, pros, cons, quote, specs, label) {
            var labelHtml = '';
            var labelClass = '';
            var consProsHtml = '';
            var imgString = $img.parent().html();
            var ctaString = $cta.find('a').parent().html().replace('Check on Amazon', 'Buy on Amazon');
            if (pros !== '' && cons !== '') {
                consProsHtml =
                    '<div class="col-sm-4 cxl-col-sm-4">\n' +
                    '   <div class="cxl-info-box__list-wrap">\n' +
                    '      <h3 class="cxl-info-box__title">The good</h3>\n' +
                    '      <ul class="cxl-info-box__list">' + pros + '</ul>\n' +
                    '      <div class="cxl-info-box__cta">'+ ctaString + '</div>\n' +
                    '   </div>\n' +
                    '</div>\n' +
                    '<div class="col-sm-4 cxl-col-sm-4">\n' +
                    '   <div class="cxl-info-box__list-wrap">\n' +
                    '      <h3 class="cxl-info-box__title">The bad</h3>\n' +
                    '      <ul class="cxl-info-box__list cxl-info-box__list--red">'+ cons +'</ul>\n' +
                    '   </div>\n' +
                    '</div>\n';
                // Hide ORIGINAL pros and cons block
                $('p>strong:contains("PROS")').hide();
                $('p>strong:contains("PROS")').parent().next('ul').hide();
                $('p>strong:contains("CONS")').hide();
                $('p>strong:contains("CONS")').parent().next('ul').hide();
            }
            if (label && label !== '') {
                labelHtml = label;
                labelClass = ' cxl-with-label';
            }
            var html =
                '<div class="cxl-info-box'+labelClass+'">\n' +
                '<div class="cxl-info-box__label" style="background-image:url('+labelHtml+');"></div>' +
                '   <div class="cxl-info-box__inner">\n' +
                '      <div class="row">\n' +
                '         <div class="col-sm-4 cxl-col-sm-4">\n' +
                '            <div class="cxl-info-box__img">\n' +
                '               <p>' + imgString + '</p>\n' +
                '            </div>\n' +
                '         </div>\n' +
                consProsHtml +
                '      </div>\n' +
                '      <div class="row">\n' +
                '         <div class="col-sm-12 cxl-col-sm-12">\n' +
                '            <div class="cxl-info-box__quote">\n' +
                '               <p><em>' + quote + '</em></p>\n' +
                '            </div>\n' +
                '         </div>\n' +
                '      </div>\n' +
                '   </div>\n' +
                '</div>\n'
            if (specs && specs !== '') {
                html +=
                    '<div class="cxl-specs">\n' +
                    '<p class="cxl-small-heading"><strong>Specifications</strong></p>\n' +
                    '<table class="cxl-specs__table">\n' +
                    '   <tbody>\n' +
                    specs +
                    '   </tbody>\n' +
                    '</table>\n' +
                    '</div>';
                setTimeout(function() {
                    var textsArray = [];
                    $('.cxl-specs td').each(function() {
                        var thisText = $.trim($(this).text());
                        textsArray.push(thisText);
                        if ($('p>strong:contains("'+thisText+'")')) {
                            $('p>strong:contains("'+thisText+'")').parent().addClass('cxl-specs-hide-class');
                        }
                    });
                }, 200);
            }
            $('p:contains("'+quote+'"), h4:contains("'+quote+'")').hide();
            return html;
        },
        generateAmazonBoxHtml: function($img, $cta, price, discount) {
            var imgString = $img.parent().html();
            var ctaString = $cta.find('a').parent().html();
            var html =
                '<div class="cxl-amazon-box">\n' +
                '   <div class="row">\n' +
                '      <div class="col-sm-3 cxl-col-sm-3">\n' +
                '         <div class="cxl-amazon-box__img">\n' +
                '            <p>' + imgString + '</p>\n' +
                '         </div>\n' +
                '      </div>\n' +
                '      <div class="col-sm-3 cxl-col-sm-3">\n' +
                '         <div class="cxl-amazon-box__logo"><img src="//cdn.optimizely.com/img/165817466/b534212f26074d2681ce8b5fb4fc0979.svg"></div>\n' +
                '      </div>\n' +
                '      <div class="col-sm-3 cxl-col-sm-3">\n' +
                '         <div class="cxl-amazon-box__price">\n' +
                //'            <p class="cxl-amazon-box__price-discount">'+ discount + '</p>\n' +
                '            <p class="cxl-amazon-box__price-regular">'+ price + '</p>\n' +
                '         </div>\n' +
                '      </div>\n' +
                '      <div class="col-sm-3 cxl-col-sm-3">\n' +
                '         <div class="cxl-amazon-box__cta">'+ ctaString.replace('Check on Amazon', 'View').replace('Buy on Amazon', 'View') + '</div>\n' +
                '      </div>\n' +
                '   </div>\n' +
                '</div>\n';
            // Hide ORIGINAL image, CTA
            $img.hide();
            $cta.hide();
            return html;
        },
        insertInfoBoxes: function($title, $img, $cta, pros, cons, quote, price, discount, specs, label) {
            var that = this;
            var $productSelector = $title;
            var $productCtaSelector = $cta;
            $productSelector.addClass('cxl-title-element');
            var productHtml = that.generateInfoBoxHtml(
                // IMG
                $img,
                // CTA
                $productCtaSelector,
                // PROS
                pros,
                // CONS
                cons,
                // QUOTE
                quote,
                // SPECS
                specs,
                // LABEL
                label
            );
            var productAmazonHtml = that.generateAmazonBoxHtml(
                // IMG
                $img,
                // CTA
                $productCtaSelector,
                // PRICE
                price,
                // DISCOUNT
                discount
            );
            $productSelector.after(productHtml);
            $productCtaSelector.after(productAmazonHtml);
        },
        insertProductInfo: function() {
            if (document.location.pathname === "/best-noise-cancelling-earbuds/") {
                this.insertInfoBoxes(
                    $('h3:contains("Bose QuietComfort 20")'),
                    $('img[title="Bose QuietComfort 20 - Best Noise Cancelling Earbuds"]'),
                    $('.addict-button.addict-button-1'),
                    // PROS
                    '<li>Best in class noise cancelling technology</li><li>Very comfortable with stable fit</li><li>Good build quality that’s going to last</li><li>Perfect earbuds for travelers</li><li>Sound quality comparable with the best ANC headphones</li>',
                    // CONS
                    '<li>Pricey</li><li>With ANC off, sound quality takes a dive</li>',
                    // QUOTE
                    'Bose QuietComfort 20 are the best noise cancelling earbuds, bar none, on the market right now.',
                    // Price
                    '($200-$300)',
                    // Discount
                    '€379',
                    // Specs
                    '',
                    // Label
                    '//headphonesaddict.com/wp-content/themes/addict/imgs/table-tag-top-model.png'
                );
                this.insertInfoBoxes(
                    $('h3:contains("Sony WI-1000X")'),
                    $('img[title="Sony WI-1000X"]'),
                    $('.addict-button.addict-button-2'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Sony WI-1000X are the best wireless noise cancelling earbuds you can get today.',
                    // Price
                    '($200-$300)',
                    // Discount
                    '€379',
                    '<tr><td>Active noise-cancelling:</td><td>Yes</td></tr>' +
                    '<tr><td>Battery life:</td><td>Up to 10 hours</td></tr>' +
                    '<tr><td>Neckband-design:</td><td>Yes</td></tr>' +
                    '<tr><td>Connection:</td><td>Wireless, Bluetooth 4.1</td></tr>'
                );
                this.insertInfoBoxes(
                    $('h3:contains("Bose QuietControl 30")'),
                    $('img[title="Bose QuietControl 30"]'),
                    $('.addict-button.addict-button-3'),
                    // PROS
                    '<li>Premium sound quality</li><li>Good ANC performance</li><li>Very comfortable</li><li>Wireless Bluetooth connectivity</li>',
                    // CONS
                    '<li>Talkback microphone is low quality</li><li>ANC may be slightly lower than other Bose products</li><li>Build-quality issues</li>',
                    // QUOTE
                    'Bose is known for delivering great sound and best-in-class active noise canceling performance. While not as good as QC20, we think these are the best wireless noise cancelling earbuds right now.',
                    // Price
                    '($200-$300)',
                    // Discount
                    '€379'
                );
                this.insertInfoBoxes(
                    $('h3:contains("B&O Beoplay E4")'),
                    $('img[title="B&O Beoplay E4"]'),
                    $('.addict-button.addict-button-4'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'One of the best wired noise cancelling earbuds.',
                    // Price
                    '($200-$300)',
                    // Discount
                    '€379'
                );
                this.insertInfoBoxes(
                    $('h3:contains("Phiaton BT 120 NC")'),
                    $('img[title="Phiaton BT 120 NC"]'),
                    $('.addict-button.addict-button-5'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Phiaton Curve BT 120 NC are the best noise cancelling earbuds under $100.',
                    // Price
                    '($30-$80)',
                    // Discount
                    '€379',
                    '<tr><td>Active noise-cancelling:</td><td>Yes</td></tr>' +
                    '<tr><td>Battery life:</td><td>Up to 8.5 hours</td></tr>' +
                    '<tr><td>Neckband-design:</td><td>Yes</td></tr>' +
                    '<tr><td>Connection:</td><td>Wireless, Bluetooth 4.2</td></tr>'
                );
                this.insertInfoBoxes(
                    $('h3:contains("1MORE E1004 Dual ANC Earbuds")'),
                    $('img[title="1MORE E1004"]'),
                    $('.addict-button.addict-button-6'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'The best noise cancelling earbuds for Apple Lightning devices.',
                    // Price
                    '($30-$80)',
                    // Discount
                    '€379',
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("Linner NC50 Wireless")'),
                    $('img[title="Linner NC50 Noise Cancelling Earbuds"]'),
                    $('.addict-button.addict-button-7'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Great value-for-money noise cancelling earbuds.',
                    // Price
                    '($30-$80)',
                    // Discount
                    '€379',
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("Cowin HE8D")'),
                    $('img[title="Cowin HE8D"]'),
                    $('.addict-button.addict-button-8'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Great pair of noise-cancelling earphones under $100.',
                    // Price
                    '($30-$80)',
                    // Discount
                    '€379',
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("Sony MDR-NC31EM (only for Sony)")'),
                    $('img[title="Sony MDR NC31EM for Sony Xperia Devices"]'),
                    $('.addict-button.addict-button-9'),
                    // PROS
                    '<li>Noise cancelling works better than average</li><li>No “box” attached to the cables since NC is processed by connected device</li><li>Needs no battery</li><li>Affordable</li><li>Unique design</li><li>Decent to good sound quality with NC on</li>',
                    // CONS
                    '<li>Only work with Sony Xperia devices (crucial)</li><li>Should make them more useful for non-Sony devices</li>',
                    // QUOTE
                    'Before the review, you have to know that Sony MDR-NC31E are only compatible with Sony devices that support noise-cancelling technology (Xperia smartphones and tablets).',
                    // Price
                    '($30-$80)',
                    // Discount
                    '€379',
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("TaoTronics Noise Cancelling Earbuds (TT-EP002)")'),
                    $('img[title="TaoTronics Noise Cancelling Earbuds"]'),
                    $('.addict-button.addict-button-10'),
                    // PROS
                    '<li>Very cheap price</li><li>Quite comfortable and durable design</li><li>Effective noise cancellation for the price</li><li>Great value for money overall</li>',
                    // CONS
                    '<li>Can’t compare to higher-end models</li>',
                    // QUOTE
                    'The best cheap noise cancelling earbuds.',
                    // Price
                    '($30-$80)',
                    // Discount
                    '€379',
                    ''
                );
            }
            if (document.location.pathname === "/best-earbuds-for-the-money/") {
                this.insertInfoBoxes(
                    $('h3:contains("SoundMAGIC E10")'),
                    $('img[title="SoundMAGIC E10"]'),
                    $('.addict-button.addict-button-1'),
                    // PROS
                    '<li>Great balanced sound, audiophile standard</li><li>“Clean mid bass expert”</li><li>Durable and stylish metal casing with premium feel</li><li>Awesome value for money</li>',
                    // CONS
                    '<li>Not suitable for bass heads</li>',
                    // QUOTE
                    'The overall best earbuds under $50.',
                    // Price
                    'under $50',
                    // Discount
                    '',
                    // Specs
                    '',
                    // Label
                    '//headphonesaddict.com/wp-content/themes/addict/imgs/table-tag-top-model.png'
                );
                this.insertInfoBoxes(
                    $('h3:contains("Tin Audio T2")'),
                    $('img[title="Linsoul Tin Audio T2"]'),
                    $('.addict-button.addict-button-2'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Tin Audio T2 are a great pair of double dynamic driver earbuds you can get under $50.',
                    // Price
                    'under $50',
                    // Discount
                    '',
                    // Specs
                    '<tr><td>Type:</td><td>In-ear</td></tr>' +
                    '<tr><td>Noise-cancelling:</td><td>No</td></tr>' +
                    '<tr><td>Connection:</td><td>Wired, 3.5mm</td></tr>' +
                    '<tr><td>Microphone:</td><td>No</td></tr>'
                );
                this.insertInfoBoxes(
                    $('h3:contains("Sennheiser CX 300 II Precision Enhanced Bass")'),
                    $('img[title="Sennheiser CX 300 II"]'),
                    $('.addict-button.addict-button-3'),
                    // PROS
                    '<li>Quality, punchy bass</li><li>Suitable for bassheads</li><li>Sennheiser (high quality, German brand)</li><li>Good price</li><li>Durable design that lasts</li>',
                    // CONS
                    '<li>Lacks balance and detail in sound (because of overpowering, deep bass)</li>',
                    // QUOTE
                    'If you like thumping bass, you’re going to like the Sennheiser CX300 II.',
                    // Price
                    'under $50',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("Anker Soundcore Spirit Pro")'),
                    $('img[title="Anker Soundcore Spirit Pro"]'),
                    $('.addict-button.addict-button-4'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Anker Soundcore Spirit Pro are the best wireless earbuds under $50.',
                    // Price
                    'under $50',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("Symphonized NRG 3.0")'),
                    $('img[title="Symphonized NRG 3.0"]'),
                    $('.addict-button.addict-button-5'),
                    // PROS
                    '<li>Great sound quality, balanced, detailed, slightly warmer</li><li>Made out of real wood</li><li>Durable and comfortable to wear</li><li>Gold plated jack (usually a sign of more expensive headphones)</li><li>Innovative design for affordable earbuds</li>',
                    // CONS
                    '<li>Some people don’t like the way wood changes the sound</li>',
                    // QUOTE
                    'In our opinion, these are the #1 choice and the best cheap earbuds under $30 right now.',
                    // Price
                    'under $30',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("Anker Soundbuds Slim+")'),
                    $('img[title="Anker SoundBuds Slim+"]'),
                    $('.addict-button.addict-button-6'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Anker Soundbuds Slim+ are the best wireless earbuds under $30.',
                    // Price
                    'under $30',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("Sony MDR XB50AP")'),
                    $('img[title="Sony MDR XB50AP - best bass workout headphones"]'),
                    $('.addict-button.addict-button-7'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Best cheap bass earbuds, bar none (priced under $30).',
                    // Price
                    'under $30',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("MEE Audio M6B")'),
                    $('img[title="MEE Audio M6B"]'),
                    $('.addict-button.addict-button-8'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'MEE Audio M6B are a great alternative for budget wireless in-ears under $30.',
                    // Price
                    'under $30',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("House of Marley Smile Jamaica")'),
                    $('img[alt="House of Marley Smile"]'),
                    $('.addict-button.addict-button-9'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'House of Marley Smile Jamaica are cool-looking budget in-ears made of wood.',
                    // Price
                    'under $30',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("Brainwavz Delta")'),
                    $('img[title="Brainwavz Delta"]'),
                    $('.addict-button.addict-button-10'),
                    // PROS
                    '<li>Clean, balanced sound comparable with $50+ models</li><li>Durable design that’s going to last</li><li>Perfect “throw away” earbuds</li>',
                    // CONS
                    '<li>For this price you can’t expect more value</li>',
                    // QUOTE
                    'All in all, you’re getting very balanced, clean sound quality that will even satisfy an audiophile, packaged in stylish aluminum casing with a durable cord for slightly over $20. This is a sure fit for one of the best value for money earbuds today.',
                    // Price
                    'under $30',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("KZ ZST")'),
                    $('img[title="KZ ZST -best earbuds under $20"]'),
                    $('.addict-button.addict-button-11'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Top pick under $20. The best sound quality in earbuds under $20.',
                    // Price
                    'under $20',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("best sports: MEE Audio M6")'),
                    $('img[title="MEE Audio M6 black workout eabruds"]'),
                    $('.addict-button.addict-button-12'),
                    // PROS
                    '<li>High sound quality with slightly warmer touch and prominent bass</li><li>Noise isolation helps the clear sound to come alive</li><li>Durable, comfortable “ear hook” design</li><li>Water resistant, great for sports</li><li>Great value for money which makes them very popular</li>',
                    // CONS
                    '<li>“Ear hook” design might be a problem for some</li>',
                    // QUOTE
                    'Best cheap earbuds for working out (under $20).',
                    // Price
                    'under $20',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("Betron YSM1000")'),
                    $('img[title="Betron YSM1000"]'),
                    $('.addict-button.addict-button-13'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Best bass earbuds under $20 are the Betron YSM1000.',
                    // Price
                    'under $20',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("Panasonic RPHJE120K")'),
                    $('img[title="Panasonic RPHJE120"]'),
                    $('.addict-button.addict-button-14'),
                    // PROS
                    '<li>Best dirt cheap “I don’t care if they break” earbuds</li><li>Good comfort, stay in ears</li><li>Good bass with balanced mid tones</li><li>A little bit of everything</li>',
                    // CONS
                    '<li>For this money, you can’t ask for more</li>',
                    // QUOTE
                    'The top pick for in-ear headphones under $10 is the popular Panasonic RPHJE120K.',
                    // Price
                    'under $10',
                    // Discount
                    '',
                    // Specs
                    '',
                    // Label
                    '//headphonesaddict.com/wp-content/themes/addict/imgs/table-tag-budget-model.png'
                );
                this.insertInfoBoxes(
                    $('h3:contains("KZ ATE")'),
                    $('img[title="KZ ATE in-ear monitors"]'),
                    $('.addict-button.addict-button-15'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Best bass earbuds under $10 (around 10 bucks).',
                    // Price
                    'under $10',
                    // Discount
                    '',
                    // Specs
                    ''
                );
            }
            if (document.location.pathname === "/best-underwater-bluetooth-headphones/") {
                this.insertInfoBoxes(
                    $('h3:contains("Jaybird X4")'),
                    $('img[title="Jaybird X4 wireless sports earbuds"]'),
                    $('.addict-button.addict-button-1'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Jaybird X4 are the best waterproof Bluetooth headphones right now (<a href="https://headphonesaddict.com/jaybird-x4-review/">full review</a>).',
                    // Price
                    '($120-$200)',
                    // Discount
                    '',
                    // Specs
                    '<tr><td>Type:</td><td>In-ear</td></tr>' +
                    '<tr><td>Water-protection:</td><td>IPX7</td></tr>' +
                    '<tr><td>Battery:</td><td>Up to 8 hours</td></tr>' +
                    '<tr><td>Bluetooth codecs:</td><td>SBC, AAC</td></tr>',
                    // Label
                    '//headphonesaddict.com/wp-content/themes/addict/imgs/table-tag-top-model.png'
                );
                $('h4:contains("Jaybird X4 are the best waterproof Bluetooth headphones right now")').hide();
                this.insertInfoBoxes(
                    $('h3:contains("Jabra Elite Active 65t")'),
                    $('img[title="Jabra Elite Active 65t"]'),
                    $('.addict-button.addict-button-2'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Jabra Elite Active 65t are the best true wireless earbuds with water protection.',
                    // Price
                    '($120-$200)',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("Sony MDR-XB80BS Extra Bass")'),
                    $('img[title="Sony MDR-XB80BS Extra Bass"]'),
                    $('.addict-button.addict-button-3'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Sony MDR-XB80BS Extra Bass are the best waterproof wireless earbuds for a basshead.',
                    // Price
                    '($80-$120)',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('#best_value-_Plantronics_BackBeat_Fit'),
                    $('img[title="Plantronics BackBeat FIT wet"]'),
                    $('.addict-button.addict-button-4'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Plantronics BackBeat Fit are one of the most popular sports headphones.',
                    // Price
                    '($80-$120)',
                    // Discount
                    '',
                    // Specs
                    '',
                    // Label
                    '//headphonesaddict.com/wp-content/themes/addict/imgs/table-tag-best-value.png'
                );
                this.insertInfoBoxes(
                    $('h3:contains("Plantronics BackBeat FIT 500")'),
                    $('img[title="Plantronics BackBeat Fit 500"]'),
                    $('.addict-button.addict-button-5'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Plantronics BackBeat FIT 500 are the best waterproof Bluetooth on-ear headphones.',
                    // Price
                    '($30-$80)',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                this.insertInfoBoxes(
                    $('h3:contains("Origem HS-1")'),
                    $('img[title="Origem HS-1 featured"]'),
                    $('.addict-button.addict-button-6'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    '<a href="https://headphonesaddict.com/origem-hs-1-review/">Origem HS-1 (full review)</a> are fully waterproof with IPX7 protection for all water sports and a fantastic battery with 10h capacity.',
                    // Price
                    '($30-$80)',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                $('h4:contains("are fully waterproof with IPX7 protection for all water sports and a fantastic battery with 10h capacity")').hide();
                this.insertInfoBoxes(
                    $('h3:contains("VAVA Moov 28")'),
                    $('img[title="VAVA Moov 28"]'),
                    $('.addict-button.addict-button-7'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    '<a href="https://headphonesaddict.com/vava-moov-28-review/">VAVA Moov 28</a> are a superb cheap pair of wireless waterproof headphones.',
                    // Price
                    '($30-$80)',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                $('h4:contains("VAVA Moov 28 are a superb cheap pair of wireless waterproof headphones.")').hide();
                this.insertInfoBoxes(
                    $('h3:contains("Anker SoundBuds Slim+")'),
                    $('img[title="Anker SoundBuds Slim+"]'),
                    $('.addict-button.addict-button-8'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    '<a href="https://headphonesaddict.com/anker-soundbuds-slim-review/">Anker SoundBuds Slim+ (review)</a> are great under $30 waterproof wireless buds.',
                    // Price
                    '(<$30)',
                    // Discount
                    '',
                    // Specs
                    ''
                );
                $('h4:contains("Anker SoundBuds Slim+ (review) are great under $30 waterproof wireless buds.")').hide();
                this.insertInfoBoxes(
                    $('h3:contains("Senso Bluetooth Headphones")'),
                    $('img[title="SENSO Bluetooth Headphones"]'),
                    $('.addict-button.addict-button-9'),
                    // PROS
                    '',
                    // CONS
                    '',
                    // QUOTE
                    'Senso Bluetooth Headphones are popular cheap wireless earbuds that can easily compete with some high-end alternatives.',
                    // Price
                    '(<$30)',
                    // Discount
                    '',
                    // Specs
                    ''
                );
            }
        },
        addHeadingClasses: function() {
            var smallHeadingClass = 'cxl-small-heading';
            $('p>strong').each(function() {
                var thisText = $.trim($(this).text());
                if ($(this).text() === 'Noise Cancellation') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Durability') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Comfort') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Features') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Sound') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Why Should You Buy These?') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'The Bad') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Noise Cancellation') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'What’s in the box?') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Noise Isolation') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'The Bad') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'The Sound') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Noise Cancelling') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Fit (Isolation)') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Controls') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'The Verdict') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'The Good') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Should You Buy These?') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Value for Money') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Audio Quality') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Single Driver or Multiple Drivers') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'But if you want Bluetooth earbuds check the guides below:') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Durability & Water Resistance') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Bluetooth & Battery') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Built-in controls are easy to use and very intuitive. You can control the volume, song selection and accept/hung up calls.') {
                    $(this).parent().addClass(smallHeadingClass);
                } else if (thisText === 'Should You Buy These:') {
                    $(this).parent().addClass(smallHeadingClass);
                }
            });
        },
        changeTitleTexts: function() {
            var count = 1;
            $('.cxl-title-element').each(function() {
                var link = $(this).find('a');
                $(this).html('').html(link);
                $(this).find('a').prepend(count+'. ');
                count++;
            });
        }
    };
    $(document).ready(function() {
        console.log('guidePageTemplate.init()');
        $('html').addClass('cxl-active-guide-page-template');
        guidePageTemplate.init();
    });
})(jQuery);
