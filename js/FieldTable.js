webpackJsonpCoveo__temporary([22,67],{

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SVGDom = (function () {
    function SVGDom() {
    }
    SVGDom.addClassToSVGInContainer = function (svgContainer, classToAdd) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', "" + SVGDom.getClass(svgElement) + classToAdd);
    };
    SVGDom.removeClassFromSVGInContainer = function (svgContainer, classToRemove) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', SVGDom.getClass(svgElement).replace(classToRemove, ''));
    };
    SVGDom.getClass = function (svgElement) {
        var className = svgElement.getAttribute('class');
        return className ? className + ' ' : '';
    };
    return SVGDom;
}());
exports.SVGDom = SVGDom;


/***/ }),

/***/ 301:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var QueryUtils_1 = __webpack_require__(19);
var Initialization_1 = __webpack_require__(2);
var FieldValue_1 = __webpack_require__(98);
var Dom_1 = __webpack_require__(3);
var KeyboardUtils_1 = __webpack_require__(23);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
__webpack_require__(592);
var SVGIcons_1 = __webpack_require__(15);
var SVGDom_1 = __webpack_require__(16);
/**
 * The FieldTable component displays a set of {@link FieldValue} components in a table that can optionally be
 * expandable and minimizable. This component automatically takes care of not displaying empty field values.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * **Example:**
 *
 * ```
 * // This is the FieldTable component itself, which holds a list of table rows.
 * // Each row is a FieldValue component.
 * <table class='CoveoFieldTable'>
 *    // Items
 *    <tr data-field='@sysdate' data-caption='Date' data-helper='dateTime' />
 *    <tr data-field='@sysauthor' data-caption='Author' />
 *    <tr data-field='@clickuri' data-html-value='true' data-caption='URL' data-helper='anchor' data-helper-options='{text: \"<%= raw.syssource %>\" , target:\"_blank\"}'>
 * </table>
 * ```
 */
var FieldTable = (function (_super) {
    __extends(FieldTable, _super);
    /**
     * Creates a new FieldTable.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the FieldTable component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function FieldTable(element, options, bindings, result) {
        var _this = _super.call(this, element, ValueRow.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, FieldTable, options);
        var rows = Dom_1.$$(_this.element).findAll('tr[data-field]');
        _.each(rows, function (e) {
            new ValueRow(e, {}, bindings, result);
        });
        if (Dom_1.$$(_this.element).find('tr') == null) {
            Dom_1.$$(element).detach();
        }
        if (_this.isTogglable()) {
            _this.toggleContainer = Dom_1.$$('div', { className: 'coveo-field-table-toggle-container' }).el;
            _this.buildToggle();
            Dom_1.$$(_this.toggleContainer).insertBefore(_this.element);
            _this.toggleContainer.appendChild(_this.element);
            _this.toggleContainer.appendChild(_this.toggleButtonInsideTable);
        }
        else {
            _this.isExpanded = true;
        }
        return _this;
    }
    /**
     * Toggles between expanding (showing) and minimizing (collapsing) the FieldTable.
     *
     * @param anim Specifies whether to show a sliding animation when toggling the display of the FieldTable.
     */
    FieldTable.prototype.toggle = function (anim) {
        if (anim === void 0) { anim = false; }
        if (this.isTogglable()) {
            this.isExpanded = !this.isExpanded;
            this.isExpanded ? this.expand(anim) : this.minimize(anim);
        }
    };
    /**
     * Expands (shows) the FieldTable,
     * @param anim Specifies whether to show a sliding animation when expanding the FieldTable.
     */
    FieldTable.prototype.expand = function (anim) {
        if (anim === void 0) { anim = false; }
        if (this.isTogglable()) {
            this.isExpanded = true;
            this.toggleCaption.textContent = this.options.expandedTitle;
            SVGDom_1.SVGDom.addClassToSVGInContainer(this.toggleButtonSVGContainer, 'coveo-opened');
            SVGDom_1.SVGDom.addClassToSVGInContainer(this.toggleButtonInsideTable, 'coveo-opened');
            anim ? this.slideToggle(true) : this.slideToggle(true, false);
        }
    };
    /**
     * Minimizes (collapses) the FieldTable.
     * @param anim Specifies whether to show a sliding animation when minimizing the FieldTable.
     */
    FieldTable.prototype.minimize = function (anim) {
        if (anim === void 0) { anim = false; }
        if (this.isTogglable()) {
            this.isExpanded = false;
            this.toggleCaption.textContent = this.options.minimizedTitle;
            SVGDom_1.SVGDom.removeClassFromSVGInContainer(this.toggleButtonSVGContainer, 'coveo-opened');
            SVGDom_1.SVGDom.removeClassFromSVGInContainer(this.toggleButtonInsideTable, 'coveo-opened');
            anim ? this.slideToggle(false) : this.slideToggle(false, false);
        }
    };
    /**
     * Updates the toggle height if the content was dynamically resized, so that the expanding and minimizing animation
     * can match the new content size.
     */
    FieldTable.prototype.updateToggleHeight = function () {
        this.updateToggleContainerHeight();
        this.isExpanded ? this.expand() : this.minimize();
    };
    FieldTable.prototype.isTogglable = function () {
        if (this.options.allowMinimization) {
            return true;
        }
        return false;
    };
    FieldTable.prototype.buildToggle = function () {
        var _this = this;
        this.toggleCaption = Dom_1.$$('span', { className: 'coveo-field-table-toggle-caption', tabindex: 0 }).el;
        this.toggleButton = Dom_1.$$('div', { className: 'coveo-field-table-toggle coveo-field-table-toggle-down' }).el;
        this.toggleButtonSVGContainer = Dom_1.$$('span', null, SVGIcons_1.SVGIcons.icons.arrowDown).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.toggleButtonSVGContainer, 'coveo-field-table-toggle-down-svg');
        this.toggleButton.appendChild(this.toggleCaption);
        this.toggleButton.appendChild(this.toggleButtonSVGContainer);
        Dom_1.$$(this.toggleButton).insertBefore(this.element);
        this.toggleButtonInsideTable = Dom_1.$$('span', { className: 'coveo-field-table-toggle coveo-field-table-toggle-up' }, SVGIcons_1.SVGIcons.icons.arrowUp).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.toggleButtonInsideTable, 'coveo-field-table-toggle-up-svg');
        if (this.options.minimizedByDefault === true) {
            this.isExpanded = false;
        }
        else if (this.options.minimizedByDefault === false) {
            this.isExpanded = true;
        }
        else {
            this.isExpanded = !QueryUtils_1.QueryUtils.hasExcerpt(this.result);
        }
        setTimeout(function () {
            _this.updateToggleHeight();
        }); // Wait until toggleContainer.scrollHeight is computed.
        var toggleAction = function () { return _this.toggle(true); };
        Dom_1.$$(this.toggleButton).on('click', toggleAction);
        Dom_1.$$(this.toggleButtonInsideTable).on('click', toggleAction);
        Dom_1.$$(this.toggleButton).on('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, toggleAction));
    };
    FieldTable.prototype.slideToggle = function (visible, anim) {
        if (visible === void 0) { visible = true; }
        if (anim === void 0) { anim = true; }
        if (!anim) {
            Dom_1.$$(this.toggleContainer).addClass('coveo-no-transition');
        }
        if (visible) {
            this.toggleContainer.style.display = 'block';
            this.toggleContainer.style.height = this.toggleContainerHeight + 'px';
        }
        else {
            this.toggleContainer.style.height = this.toggleContainerHeight + 'px';
            this.toggleContainer.style.height = '0';
        }
        if (!anim) {
            this.toggleContainer.offsetHeight; // Force reflow
            Dom_1.$$(this.toggleContainer).removeClass('coveo-no-transition');
        }
    };
    FieldTable.prototype.updateToggleContainerHeight = function () {
        this.toggleContainerHeight = this.toggleContainer.scrollHeight;
    };
    return FieldTable;
}(Component_1.Component));
FieldTable.ID = 'FieldTable';
FieldTable.doExport = function () {
    GlobalExports_1.exportGlobally({
        'FieldTable': FieldTable,
        'FieldValue': FieldValue_1.FieldValue
    });
};
/**
 * The options for the component
 * @componentOptions
 */
FieldTable.options = {
    /**
     * Specifies whether to allow the minimization (collapsing) of the FieldTable.
     *
     * If you set this option to `false`, the component will not create the **Minimize** / **Expand** toggle links.
     *
     * See also {@link FieldTable.options.expandedTitle}, {@link FieldTable.options.minimizedTitle} and
     * {@link FieldTable.options.minimizedByDefault}.
     *
     * Default value is `true`.
     */
    allowMinimization: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * If {@link FieldTable.options.allowMinimization} is `true`, specifies the caption to show on the **Minimize** link
     * (the link that appears when the FieldTable is expanded).
     *
     * Default value is `"Details"`.
     */
    expandedTitle: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ defaultValue: 'Details', depend: 'allowMinimization' }),
    /**
     * If {@link FieldTable.options.allowMinimization} is `true`, specifies the caption to show on the **Expand** link
     * (the link that appears when the FieldTable is minimized).
     *
     * Default value is `"Details"`.
     */
    minimizedTitle: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ defaultValue: 'Details', depend: 'allowMinimization' }),
    /**
     * If {@link FieldTable.options.allowMinimization} is `true`, specifies whether to minimize the table by default.
     *
     * Default value is `undefined`, and the FieldTable will collapse by default if the result it is associated with has
     * a non-empty excerpt.
     */
    minimizedByDefault: ComponentOptions_1.ComponentOptions.buildBooleanOption({ depend: 'allowMinimization' })
};
exports.FieldTable = FieldTable;
Initialization_1.Initialization.registerAutoCreateComponent(FieldTable);
var ValueRow = (function (_super) {
    __extends(ValueRow, _super);
    function ValueRow(element, options, bindings, result) {
        var _this = _super.call(this, element, options, bindings, result, ValueRow.ID) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ValueRow, options);
        var caption = Dom_1.$$('th').el;
        caption.appendChild(document.createTextNode(_this.options.caption.toLocaleString()));
        _this.element.insertBefore(caption, _this.getValueContainer());
        return _this;
    }
    ValueRow.prototype.getValueContainer = function () {
        if (this.valueContainer == null) {
            this.valueContainer = document.createElement('td');
            this.element.appendChild(this.valueContainer);
        }
        return this.valueContainer;
    };
    return ValueRow;
}(FieldValue_1.FieldValue));
ValueRow.ID = 'ValueRow';
ValueRow.options = {
    caption: ComponentOptions_1.ComponentOptions.buildStringOption({ postProcessing: function (value, options) { return value || options.field.substr(1); } })
};
ValueRow.parent = FieldValue_1.FieldValue;


/***/ }),

/***/ 592:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 98:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var Initialization_1 = __webpack_require__(2);
var TemplateHelpers_1 = __webpack_require__(69);
var Assert_1 = __webpack_require__(7);
var DateUtils_1 = __webpack_require__(29);
var QueryStateModel_1 = __webpack_require__(13);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(3);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
var StringUtils_1 = __webpack_require__(20);
function showOnlyWithHelper(helpers, options) {
    if (options == null) {
        options = {};
    }
    options.helpers = helpers;
    return options;
}
/**
 * The FieldValue component displays the value of a field associated to its parent search result. It is normally usable
 * within a {@link FieldTable}.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * A common use of this component is to display a specific field value which also happens to be an existing
 * {@link Facet.options.field}. When the user clicks on the FieldValue component, it activates the corresponding Facet.
 */
var FieldValue = (function (_super) {
    __extends(FieldValue, _super);
    /**
     * Creates a new FieldValue.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the FieldValue component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function FieldValue(element, options, bindings, result, fieldValueClassId) {
        if (fieldValueClassId === void 0) { fieldValueClassId = FieldValue.ID; }
        var _this = _super.call(this, element, fieldValueClassId, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initOptions(element, FieldValue.simpleOptions, options);
        if (_this.options.helper != null) {
            _this.options = ComponentOptions_1.ComponentOptions.initOptions(element, FieldValue.helperOptions, _this.options);
            var toFilter = _.keys(FieldValue.options.helperOptions['subOptions']);
            var toKeep_1 = _.filter(toFilter, function (optionKey) {
                var optionDefinition = FieldValue.options.helperOptions['subOptions'][optionKey];
                if (optionDefinition) {
                    var helpers = optionDefinition.helpers;
                    return helpers != null && _.contains(helpers, _this.options.helper);
                }
                return false;
            });
            _this.options.helperOptions = _.omit(_this.options.helperOptions, function (value, key) {
                return !_.contains(toKeep_1, key);
            });
        }
        _this.result = _this.result || _this.resolveResult();
        Assert_1.Assert.exists(_this.result);
        var loadedValueFromComponent = _this.getValue();
        if (loadedValueFromComponent == null) {
            // Completely remove the element to ease stuff such as adding separators in CSS
            if (_this.element.parentElement != null) {
                _this.element.parentElement.removeChild(_this.element);
            }
        }
        else {
            var values = void 0;
            if (_.isArray(loadedValueFromComponent)) {
                values = loadedValueFromComponent;
            }
            else if (_this.options.splitValues) {
                if (_.isString(loadedValueFromComponent)) {
                    values = _.map(loadedValueFromComponent.split(_this.options.separator), function (v) {
                        return v.trim();
                    });
                }
            }
            else {
                loadedValueFromComponent = loadedValueFromComponent.toString();
                values = [loadedValueFromComponent];
            }
            _this.appendValuesToDom(values);
            if (_this.options.textCaption != null) {
                _this.prependTextCaptionToDom();
            }
        }
        return _this;
    }
    /**
     * Gets the current FieldValue from the current {@link IQueryResult}.
     *
     * @returns {any} The current FieldValue or `null` if value is and `Object`.
     */
    FieldValue.prototype.getValue = function () {
        var value = Utils_1.Utils.getFieldValue(this.result, this.options.field);
        if (!_.isArray(value) && _.isObject(value)) {
            value = null;
        }
        return value;
    };
    /**
     * Renders a value to HTML using all of the current FieldValue component options.
     * @param value The value to render.
     * @returns {HTMLElement} The element containing the rendered value.
     */
    FieldValue.prototype.renderOneValue = function (value) {
        var element = Dom_1.$$('span').el;
        var toRender = value;
        if (this.options.helper) {
            toRender = TemplateHelpers_1.TemplateHelpers.getHelper(this.options.helper).call(this, value, this.getHelperOptions());
            var fullDateStr = this.getFullDate(value, this.options.helper);
            if (fullDateStr) {
                element.setAttribute('title', fullDateStr);
            }
        }
        if (this.options.helper == 'date' || this.options.helper == 'dateTime' || this.options.helper == 'emailDateTime') {
            toRender = StringUtils_1.StringUtils.capitalizeFirstLetter(toRender);
        }
        if (this.options.htmlValue) {
            element.innerHTML = toRender;
        }
        else {
            element.appendChild(document.createTextNode(toRender));
        }
        this.bindEventOnValue(element, value);
        return element;
    };
    FieldValue.prototype.getValueContainer = function () {
        return this.element;
    };
    FieldValue.prototype.getHelperOptions = function () {
        var inlineOptions = ComponentOptions_1.ComponentOptions.loadStringOption(this.element, 'helperOptions', {});
        if (Utils_1.Utils.isNonEmptyString(inlineOptions)) {
            return _.extend({}, this.options.helperOptions, eval('(' + inlineOptions + ')'));
        }
        return this.options.helperOptions;
    };
    FieldValue.prototype.getFullDate = function (date, helper) {
        var fullDateOptions = {
            useLongDateFormat: true,
            useTodayYesterdayAndTomorrow: false,
            useWeekdayIfThisWeek: false,
            omitYearIfCurrentOne: false
        };
        if (helper == 'date') {
            return DateUtils_1.DateUtils.dateToString(new Date(parseInt(date)), fullDateOptions);
        }
        else if (helper == 'dateTime' || helper == 'emailDateTime') {
            return DateUtils_1.DateUtils.dateTimeToString(new Date(parseInt(date)), fullDateOptions);
        }
        return '';
    };
    FieldValue.prototype.appendValuesToDom = function (values) {
        var _this = this;
        _.each(values, function (value, index) {
            if (value != undefined) {
                _this.getValueContainer().appendChild(_this.renderOneValue(value));
                if (index !== values.length - 1) {
                    _this.getValueContainer().appendChild(document.createTextNode(_this.options.displaySeparator));
                }
            }
        });
    };
    FieldValue.prototype.renderTextCaption = function () {
        var element = Dom_1.$$('span', { className: 'coveo-field-caption' }, _.escape(this.options.textCaption));
        return element.el;
    };
    FieldValue.prototype.prependTextCaptionToDom = function () {
        var elem = this.getValueContainer();
        Dom_1.$$(elem).prepend(this.renderTextCaption());
        // Add a class to the container so the value and the caption wrap together.
        Dom_1.$$(elem).addClass('coveo-with-label');
    };
    FieldValue.prototype.bindEventOnValue = function (element, value) {
        var _this = this;
        if (Utils_1.Utils.isUndefined(Coveo['FacetRange'])) {
            return;
        }
        var facetAttributeName = QueryStateModel_1.QueryStateModel.getFacetId(this.options.facet);
        var facets = _.filter(this.componentStateModel.get(facetAttributeName), function (facet) {
            return !facet.disabled && Coveo['FacetRange'] && !(facet instanceof Coveo['FacetRange']);
        });
        var atLeastOneFacetIsEnabled = facets.length > 0;
        if (atLeastOneFacetIsEnabled) {
            var selected_1 = _.find(facets, function (facet) {
                var facetValue = facet.values.get(value);
                return facetValue && facetValue.selected;
            });
            Dom_1.$$(element).on('click', function () {
                if (selected_1 != null) {
                    _.each(facets, function (facet) { return facet.deselectValue(value); });
                }
                else {
                    _.each(facets, function (facet) { return facet.selectValue(value); });
                }
                _this.queryController.deferExecuteQuery({
                    beforeExecuteQuery: function () { return _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.documentField, {
                        facetId: _this.options.facet,
                        facetValue: value.toLowerCase()
                    }); }
                });
            });
            if (selected_1) {
                Dom_1.$$(element).addClass('coveo-selected');
            }
            Dom_1.$$(element).addClass('coveo-clickable');
        }
    };
    return FieldValue;
}(Component_1.Component));
FieldValue.ID = 'FieldValue';
FieldValue.doExport = function () {
    GlobalExports_1.exportGlobally({
        'FieldValue': FieldValue
    });
};
/**
 * The options for the component
 * @componentOptions
 */
FieldValue.options = {
    /**
     * Specifies the field that the FieldValue should display.
     *
     * Specifying a value for this parameter is required in order for the FieldValue component to work.
     */
    field: ComponentOptions_1.ComponentOptions.buildFieldOption({ defaultValue: '@field', required: true }),
    /**
     * Specifies the {@link Facet} component to toggle when the end user clicks the FieldValue.
     *
     * Default value is the value of {@link FieldValue.options.field}.
     *
     * **Note:**
     * > If the target {@link Facet.options.id} is is not the same as its {@link Facet.options.field}), you must specify
     * > this option manually in order to link to the correct Facet.
     */
    facet: ComponentOptions_1.ComponentOptions.buildStringOption({ postProcessing: function (value, options) { return value || options.field; } }),
    /**
     * Specifies whether the content to display is an HTML element.
     *
     * Default value is `false`.
     */
    htmlValue: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies whether to split the FieldValue at each {@link FieldValue.options.separator}.
     *
     * This is useful for splitting groups using a {@link Facet.options.field}.
     *
     * When this option is `true`, the displayed values are split by the {@link FieldValue.options.displaySeparator}.
     *
     * Default value is `false`.
     */
    splitValues: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * If {@link FieldValue.options.splitValues} is `true`, specifies the separator string which separates multi-value
     * fields in the index.
     *
     * See {@link FieldValue.options.displaySeparator}.
     *
     * Default value is `";"`.
     */
    separator: ComponentOptions_1.ComponentOptions.buildStringOption({ depend: 'splitValues', defaultValue: ';' }),
    /**
     * If {@link FieldValue.options.splitValues} is `true`, specifies the string to use when displaying multi-value
     * fields in the UI.
     *
     * The component will insert this string between each value it displays from a multi-value field.
     *
     * See also {@link FieldValue.options.separator}.
     *
     * Default value is `", "`.
     */
    displaySeparator: ComponentOptions_1.ComponentOptions.buildStringOption({ depend: 'splitValues', defaultValue: ', ' }),
    /**
     * Specifies the helper that the FieldValue should use to display its content.
     *
     * While several helpers exist by default (see {@link ICoreHelpers}), it is also possible for you to create your own
     * custom helpers (see {@link TemplateHelpers}).
     */
    helper: ComponentOptions_1.ComponentOptions.buildHelperOption(),
    /**
     * Specifies the options to call on the specified helper.
     */
    helperOptions: ComponentOptions_1.ComponentOptions.buildObjectOption({
        subOptions: {
            text: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
            target: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
            'class': ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
            decimals: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['currency'], { min: 0 })),
            symbol: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['currency'])),
            useTodayYesterdayAndTomorrow: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
            useWeekdayIfThisWeek: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
            omitYearIfCurrentOne: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
            useLongDateFormat: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: false })),
            includeTimeIfToday: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
            includeTimeIfThisWeek: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
            alwaysIncludeTime: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: false })),
            predefinedFormat: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'])),
            companyDomain: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['email'])),
            lengthLimit: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['email'], { min: 1 })),
            truncateName: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['email'])),
            alt: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
            height: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
            width: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
            presision: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['size'], { min: 0, defaultValue: 2 })),
            base: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['size'], { min: 0, defaultValue: 0 })),
            isMilliseconds: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['timeSpan'])),
        }
    }),
    /**
     * Specifies a caption to display before the value.
     *
     * Default value is `undefined`.
     */
    textCaption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption()
};
FieldValue.simpleOptions = _.omit(FieldValue.options, 'helperOptions');
FieldValue.helperOptions = {
    helperOptions: FieldValue.options.helperOptions
};
exports.FieldValue = FieldValue;
Initialization_1.Initialization.registerAutoCreateComponent(FieldValue);


/***/ })

});
//# sourceMappingURL=FieldTable.js.map