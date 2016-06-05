

(function () {


    $ = function (selector) {

        //Remove the need to use the 'new' keyword
        //if 'this' is not pointing to $, call new $
        if (!(this instanceof $)) {
            return new $(selector);
        }
        //Get elements from the page using selector and queryselectorall
        var elems;
        if (typeof selector === 'string') {
            elems = document.querySelectorAll(selector);
        }
        else {//assume array
            elems = selector;
        }
//Array.prototype.push.apply(this,elems); //Would also work
        for (var i = 0; i < elems.length; i++) {
            this[i] = elems[i];
        }
        this.length = elems.length;
    };

    $.extend = function (target, object) {
        for (prop in object) {
            if (object.hasOwnProperty(prop)) {
                target[prop] = object[prop];

            }
        }
        return target;

    };

    // Static methods
    var isArrayLike = function (obj) {
        if (typeof obj.length === "number") {
            if (obj.length === 0) {
                return true;
            } else if (obj.length > 0) {
                return (obj.length - 1) in obj;
            }
        }
    };

    $.extend($, {
        isArray: function (obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        },
        each: function (collection, cb) {

            if (isArrayLike(collection)) {
                for (var i = 0; i < collection.length; i++) {
                    var val = collection[i];
                    cb.call(val, i, val);
                }
            } else {
                for (var prop in collection) {
                    if (collection.hasOwnProperty(prop)) {
                        var val = collection[prop];
                        cb.call(val, prop, val);
                    }
                }
            }
            return collection;
        },
        makeArray: function (arr) {
            var array = [];
            $.each(arr, function (i, val) {
                array.push(val);
            });
            return array;
        },
        proxy: function (fn, context) {
            return function () {
                return fn.apply(context, arguments);

            }
        }
    });


    var getText = function (childNodes) {
        var txt = "";

        $.each(childNodes, function (i, child) {
            if (child.nodeType === Node.TEXT_NODE) {
                txt = txt + child.nodeValue;
            }
            else {
                txt += getText(child.childNodes);
            }
        });
        return txt;
    };

    var makeTraverser = function (traverser) {
        return function () {
            var elements = [], args = arguments;

            //For each element in the collection
            $.each(this, function (i, elem) {
                var els = traverser.apply(elem, args);

                if (els && isArrayLike(els)) {
                    [].push.apply(elements, els);
                } else if (els) {
                    elements.push(els);
                }
            });
            //Return accumulator
            return $(elements);
        }
    };

    $.extend($.prototype, {
        html: function (newHtml) {
            if (arguments.length) {
                //setting .Go through each element in this and set its innerHTML to newHTML
                $.each(this, function (i, elem) {
                    elem.innerHTML = newHtml;
                });
                return this;
            }
            else {
                //return this[0]s inner html
                return this[0].innerHTML;
            }
        },
        val: function (newVal) {
            if (arguments.length) {
                //setting .Go through each element in this and set its innerHTML to newHTML
                $.each(this, function (i, elem) {
                    elem.value = newVal;
                });
                return this;
            }
            else {
                //return this[0]s inner html
                return this[0].value;
            }
        },
        text: function (newText) {
            if (arguments.length) {
                //setting .Go through each element in this and set its innerHTML to ""

                return $.each(this, function (i, elem) {
                    elem.innerHTML = "";

                    var txt = document.createTextNode(newText);
                    //create new text node and append to the element
                    elem.appendChild(txt);
                });
            } else {
                return getText(this[0].childNodes);

            }
        },
        find: makeTraverser(function (selector) {
            return this.querySelectorAll(selector);
        }),
        next: makeTraverser(function () {

            var current = this.nextSibling;
            while (current && current.nodeType !== 1) {
                current = current.nextSibling;
            }
            if (current) {
                return current;
            }
        }),
        prev: makeTraverser(function () {
            var current = this.previousSibling;
            while (current && current.nodeType !== 1) {
                current = current.previousSibling;
            }
            if (current) {
                return current;
            }
        }),
        parent: makeTraverser(function () {
            return this.parentNode;
        }),
        children: makeTraverser(function () {
            return this.children;
        }),
        attr: function (attrName, value) {
            //For setter function
            if (arguments.length == 2) {
                return $.each(this, function (i, element) {
                    element.setAttribute(attrName, value);
                });
            } else {
                //For getter function
                return this[0] && this[0].getAttribute(attrName);
            }
        },
        css: function (cssPropName, value) {
            //For setter function
            if (arguments.length == 2) {
                return $.each(this, function (i, element) {
                    element[cssPropName] = value;
                });
            } else {
                //For getter function
                return this[0] && document.defaultView.getComputedStyle(this[0]).getPropertyValue(cssPropName);
            }
        },
        width: function () {
            var leftPadding = parseInt(this.css("padding-left"));
            var rightPadding = parseInt(this.css("padding-right"));

            return this[0].clientWidth - leftPadding - rightPadding;
        },
        offset: function () {
            var offset = this[0].getBoundingClientRect();
            return {
                top: offset.top + window.pageYOffset,
                left: offset.left + window.pageXOffset
            };
        },
        hide: function () {
            return this.css('display', 'none');
        },
        show: function () {
            return this.css('display', '');
        },

        // Events
        bind: function (eventName, handler) {
            return $.each(this, function (i, elem) {
                elem.addEventListener(eventName, handler, false);
            });
        },
        unbind: function (eventName, handler) {
            return $.each(this, function (i, elem) {
                elem.removeEventListener(eventName, handler, false);
            });
        }
    });

})();