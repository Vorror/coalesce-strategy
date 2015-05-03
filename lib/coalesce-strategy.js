'use strict';

module.exports = function (strategy, model) {
    var _strategies = strategy || {},
        _model = model || {};

    /**
     * Coalesces all items into the model
     * @param items
     * @returns {*|{}}
     */
    function evaluateModel(items) {
        var audit = {},
            bucket = _model,
            ignoredModelKeys = {};

        // check for model-wide ignores
        if (_strategies.model && _strategies.model.ignore) {
            ignoredModelKeys = _strategies.model.ignore.reduce(function (o, v) {
                o[v] = true;
                return o;
            }, {});
        }

        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];

            var keys = Object.keys(bucket);
            // check if the strategy has useOnly set
            // if that's the case only only iterate over that array of keys
            if (_strategies && hasProperty(_strategies, 'strategies.' + item.id + '.useOnly')) {
                keys = _strategies.strategies[item.id].useOnly;
            }

            keys.forEach(function (key) {
                if (!ignoredModelKeys[key]
                    && hasProperty(bucket, key)
                    && item.item.hasOwnProperty(key)
                    && !shouldIgnoreProperty(_strategies, key, item, bucket)) {
                    mergeProperty(_strategies, audit, bucket, item, key);
                }
            });
        }

        return bucket;
    }

    /**
     * Coalesces a item's property into the model/bucket
     * @param strat the strategy file
     * @param audit an object containing a log of the priorities currently coalesced into the model/bucket
     * @param bucket the model we're coalescing into
     * @param water the item we're taking values from to place into the bucket
     * @param key the property we wish to take
     */
    function mergeProperty(strat, audit, bucket, water, key) {
        // check if we should allow empty values
        if (strat.model && !strat.model.allowMergingOfEmptyValues && isEmpty(water.item[key])) {
            return;
        }

        var priority = getPriority(strat, water.id, key),
            oldPriority = audit[key],
            shouldUpdate = false;

        if ((typeof oldPriority === 'undefined') || (priority.priority > oldPriority.priority)) {
            shouldUpdate = true;
        } else if (priority.priority === oldPriority.priority) {
            if (priority.winOnDefault >= oldPriority.winOnDefault) {
                shouldUpdate = true;
            }
        }

        /* istanbul ignore else */
        if (shouldUpdate) {
            bucket[key] = water.item[key];
            audit[key] = priority;
        }
    }

    /**
     * If we should ignore a particular property
     * @param strat
     * @param property
     * @param item
     * @param bucket
     * @returns {boolean}
     */
    function shouldIgnoreProperty(strat, property, item, bucket) {
        var shouldIgnore = false;
        // check if property is ignored on model wide
        if (strat && hasProperty(strat, 'model.useOnly')) {
            shouldIgnore = strat.model.useOnly.indexOf(property) === -1;
        }

        // check if property is ignored on a particular strategy
        if (!shouldIgnore && strat && hasProperty(strat, 'strategies.' + item.id + '.ignore')) {
            shouldIgnore = strat.strategies[item.id].ignore.indexOf(property) > -1;
        }

        // check if we're allowed to overwrite a key that has a function value
        if (!shouldIgnore && strat.model && strat.model.skipKeysWithFunctionValues) {
            shouldIgnore = typeof bucket[property] === 'function';
        }

        return shouldIgnore;
    }

    /**
     * Given a particular strategy file calculates a priority for a particular property
     * @param strat the strategy file
     * @param id the identifier of the merge coalesce strategy
     * @param property the property you want the priority for
     * @returns {{winOnDefault: number, priority: number}}
     */
    function getPriority(strat, id, property) {
        var priority =  0,
            winOnDefault = 0;

        // get baseline priority value
        if (strat && hasProperty(strat, 'strategies.' + id + '.baseline')) {
            priority += strat.strategies[id].baseline;
        }

        // get winOnDefault for entire object
        if (strat && hasProperty(strat, 'strategies.' + id + '.winOnDefault')) {
            winOnDefault = (strat.strategies[id].winOnDefault) ? 1 : -1;
        }

        // get individual priority value value
        if (strat && hasProperty(strat, 'strategies.' + id + '.priorities' + '.' + property)) {
            var pri = strat.strategies[id].priorities[property];
            /* istanbul ignore else */
            if (typeof pri === 'number') {
                priority += pri;
            }else if (typeof pri === 'object') {
                priority += pri.priority || 0;

                /* istanbul ignore else */
                if (typeof pri.winOnDefault !== 'undefined') {
                    winOnDefault = (pri.winOnDefault) ? 1 : -1;
                }
            }
        }

        return {
            winOnDefault: winOnDefault,
            priority: priority
        };
    }

    return {
        /**
         * Merges an array of 'items'
         * @param items
         * @param callback
         */
        merge: function (items, callback) {
            process.nextTick(function () {
                callback(null, evaluateModel(items));
            });
        },
        /**
         * Creates a item that can be used to merge
         * @param id the strategy id of the object
         * @param item the object you wish to coalesce
         * @returns {*}
         */
        createItem: function (id, item) {
            if (id && typeof item === 'undefined') {
                return {id: randomId(), item: id};
            }

            return {id: id || randomId(), item: item || {}};
        }
    };
};

/**
 * Returns a random string of a fixed length
 * @param [length] length of the random string
 * @returns {string}
 */
function randomId(length) {
    var len = length || 15,
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }

    return randomString;
}

/**
 * Checks if a given object has a particular property
 * @param object
 * @param property
 * @returns {boolean}
 */
function hasProperty(object, property) {
    var properties = property.split('.'),
        temp = object;

    while (typeof temp !== 'undefined' && properties.length) {
        temp = temp[properties.shift()];
    }

    return typeof temp !== 'undefined';
}

/**
 * Checks whether or not a given object is "empty"
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
    if (typeof obj === 'string' || Array.isArray(obj)) {
        return obj.length === 0;
    }else if (obj === null) {
        return true;
    }else if (typeof obj === 'object') {
        return Object.keys(obj).length === 0;
    }else if (typeof obj === 'undefined') {
        return true;
    }

    return false;
}

// expose for testing
module.exports.tests = {
    hasProperty: hasProperty,
    isEmpty: isEmpty,
    randomId: randomId
};