/**
 * Represents a simple accordion with transitions and max-height.
 *
 * @module Accordion
 *
 * @author Sebastian Fitzner
 */

/**
 * Requirements
 */
import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';

var $ = App.$;

/**
 * Class Accordion
 */
class Accordion extends AppModule {
	constructor(obj) {
		let options = {
			openIndex: false,
			openOnViewports: [
				'desktop',
				'tablet-large',
				'tablet-small'
			], // array: viewport names - eg.: ['mobile', 'tablet', 'desktop-small', 'desktop']
			singleOpen: false,
			activeClass: 'is-active',
			openClass: 'is-open',
			closeClass: 'is-closed',
			calculatingClass: 'is-calculating',
			removeStyles: false, // TODO
			dataMaxAttr: 'data-js-height',
			accordionBtn: '[data-js-atom="accordion-btn"]',
			accordionContent: '[data-js-atom="accordion-content"]'
		};

		super(obj, options);
	}

	/**
	 * GETTER AND SETTER
	 */
	set $accordionContents(items) {
		this._$accordionContents = items;
	}

	get $accordionContents() {
		return this._$accordionContents;
	}

	set $accordionBtns(items) {
		this._$accordionBtns = items;
	}

	get $accordionBtns() {
		return this._$accordionBtns;
	}

	set $target(item) {
		this._$target = item;
	}

	get $target() {
		return this._$target;
	}

	set $btn(item) {
		this._$btn = item;
	}

	get $btn() {
		return this._$btn;
	}

	initialize() {
		this.$accordionContents = $(this.options.accordionContent, this.$el);
		this.$accordionBtns = $(this.options.accordionBtn, this.$el);
		this.$target = null;
		this.$btn = null;

		// call super
		super.initialize();
	}

	/**
	 * Bind all events
	 */
	bindEvents() {
		let fnRender = this.render.bind(this);
		let fnHandleClick = this.handleClick.bind(this);
		let fnCloseAll = this.closeAll.bind(this);
		let fnOpenAll = this.openAll.bind(this);

		// Local events
		this.$el.on('click touchstart', this.options.accordionBtn, fnHandleClick);

		// Global events
		App.Vent.on(App.EVENTS.resize, fnRender);
		App.Vent.on(App.EVENTS.accordion.closeAll, fnCloseAll);
		App.Vent.on(App.EVENTS.accordion.openAll, fnOpenAll);
	}

	render() {
		if (!App.currentMedia) {
			console.warn('App.currentMedia is necessary to support the slider module!');
			return;
		}

		this.removeStyles();
		this.saveHeights(this.$accordionContents);
		this.closeAll();
		// Open on index if set in options
		if (this.options.openIndex && this.options.openOnViewports.indexOf(App.currentMedia) != -1) {
			this.activateBtn(this.$accordionBtns.eq(this.options.openIndex));
			this.slideDown(this.$accordionContents.eq(this.options.openIndex));
		}
	}

	/**
	 * Save heights of all accordion contents.
	 *
	 * @param {Array} items - array of items
	 */
	saveHeights(items) {
		Helpers.forEach(items, (idx, item) => {
			this.saveHeight(item);
		});
	}

	/**
	 * Save the height of the node item.
	 *
	 * @param {Object} item - item to calculate the height
	 */
	saveHeight(item) {
		let el = item;
		let wantedHeight = 0;
		// the el is hidden so:
		// making the el block so we can measure its height but still be hidden
		$(el).addClass(this.options.calculatingClass);

		wantedHeight = Helpers.getOuterHeight(el);

		// reverting to the original values
		$(el).removeClass(this.options.calculatingClass);

		// save height in data attribute
		el.setAttribute(this.options.dataMaxAttr, wantedHeight);
	}

	/**
	 * Handle the click,
	 * get the id of the clicked button and
	 * execute the toggleContent method.
	 *
	 * @param {Object} e - event object
	 */
	handleClick(e) {
		this.$btn = $(e.currentTarget);
		let targetId = this.$btn.attr('href');

		e.preventDefault();
		this.toggleContent(targetId);
	}

	/**
	 * Toggle the accordion content by using the id of the accordion button.
	 *
	 * @param {String} id - id of the target
	 *
	 * @public
	 */
	toggleContent(id) {
		this.$target = this.$el.find(id);

		if (this.$target.hasClass(this.options.openClass)) {
			this.slideUp(this.$target);
			this.deactivateBtn(this.$btn);
		} else {
			if (this.options.singleOpen) this.closeAll();

			this.activateBtn(this.$btn);
			this.slideDown(this.$target);
		}
	}

	/**
	 * Mimics the slideUp functionality of jQuery by using height and transition.
	 *
	 * @param {Object} $item - jQuery object of item
	 */
	slideUp($item) {
		$item
			.css('height', 0)
			.removeAttr('style')
			.attr('aria-expanded', 'false')
			.removeClass(this.options.openClass)
			.addClass(this.options.closeClass);
	}

	/**
	 * Mimics the slideDown functionality of jQuery by using height and transition.
	 *
	 * @param {Object} $item - jQuery object of item
	 */
	slideDown($item) {
		$item
			.css('height', $item.attr('data-js-height'))
			.attr('aria-expanded', 'true')
			.removeClass(this.options.closeClass)
			.addClass(this.options.openClass);
	}

	/**
	 * Adds active class to the clicked button.
	 *
	 * @param {Object} $item - jQuery object of button
	 */
	activateBtn($item) {
		$item.addClass(this.options.activeClass);
	}

	/**
	 * Removes active class from the button.
	 *
	 * @param {Object} $item - jQuery object of button
	 */
	deactivateBtn($item) {
		$item.removeClass(this.options.activeClass);
	}

	/**
	 * Remove all styles of the accordion content elements
	 */
	removeStyles() {
		this.$accordionContents.removeAttr('style');
	}

	/**
	 * Close all accordion contents and active buttons
	 *
	 * @public
	 */
	closeAll() {
		Helpers.forEach(this.$accordionContents, (idx, item) => {
			this.slideUp($(item));
		});
		Helpers.forEach(this.$accordionBtns, (idx, item) => {
			this.deactivateBtn($(item));
		});
	}

	/**
	 * Close all accordion contents and active buttons
	 *
	 * @public
	 */
	openAll() {
		Helpers.forEach(this.$accordionContents, (idx, item) => {
			this.slideDown($(item));
		});
		Helpers.forEach(this.$accordionBtns, (idx, item) => {
			this.activateBtn($(item));
		});
	}
}

// Returns constructor
export default Accordion;
