/**
 * Accordion
 * 
 * Displaying 1-x items which get (each) toggled via a related trigger.
 * An item contains a tab (trigger) and a panel (content).
 *
 * Possible configuration options:
 * - Multiselectable: If two or more items can be open at the same time (default value: false)
 * - Items: An array, where amount of objects equals accordion items. Set key 'isExanded'
 * to true or false to set a default state on initialize for every item.
 * 
 * @module Accordion
 * @version v1.0.0
 * 
 * @author Thomas Kaenel
 */

import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/module';
const $ = App.$;

class Accordion extends AppModule {
	/**
	 * Constructor for our class
	 *
	 * @see module.js
	 *
	 * @param {Object} obj - Object which is passed to our class
	 * @param {Object} obj.el - element which will be saved in this.el
	 * @param {Object} obj.options - options which will be passed in as JSON object
	 */
	constructor(obj) {
		let options = {
			keyCodes: {
				enter: 13,
				space: 32,
				left: 37,
				up: 38,
				right: 39,
				down: 40
			},
			triggerElement: '[data-js-atom="trigger"]',
			panelElement: '[data-js-atom="panel"]'
		};

		super(obj, options);
		App.registerModule && App.registerModule(Accordion.info, this.el);
	}


	/**
	 * Get module information
	 */
	static get info() {
		return {
			name: 'Accordion',
			version: '1.0.0'
		};
	}


	/**
	 * Initialize the view and merge options
	 */
	initialize() {
		this.$previousTrigger = $();
		this.$previousPanel = $();
		this.panelHeightList = [];
		this.selectedIndex = -1;
		this.previousIndex = -1;
		this.initialized = false;

		this.itemStateList = this.options.items || [];
		this.multiselectable = (this.options.multiselectable === "true");

		console.log('init Accordion');
		
		super.initialize();

		this.$triggerList = this.$el.find(this.options.triggerElement);
		this.$panelList = this.$el.find(this.options.panelElement);
		this.$currentTrigger = $(this.$triggerList[this.selectedIndex]);
		this.$currentPanel = $(this.$panelList[this.selectedIndex]);

		this.getHeight();

		this.initModel();

		// set initial Index
		for (let i = 0; i < this.itemStateList.length; i++) {
			if (this.itemStateList[i].isExpanded) {
				this.selectedIndex = this.previousIndex = i;
			}
		}
	}


	/**
	 * Bind events
	 */
	bindEvents() {
		let self = this;

		// Local events
		this.$el.on('click', this.options.triggerElement, self.handleClick.bind(self));
		this.$el.on('keyup', this.options.triggerElement, self.handleKeyUp.bind(self));

		// Global events
		App.Vent.on(App.EVENTS.accordion.toggleItem, self.toggleItem.bind(self) );
		App.Vent.on(App.EVENTS.resize, self.getHeight.bind(self) );
		// App.Vent.on(App.EVENTS.fontLoaded, self.getHeight.bind(self) ); // ToDo: include? comment?
	}


	/**
	* Handle click input
	* 
	* @param {event} e - event object
	*/
	handleClick(e) {
		let $target = $(e.currentTarget);

		e.preventDefault();

		this.selectedIndex = this.$triggerList.index($target);

		this.updateSelectedElements();
		this.updateModel();
		this.toggle();
	}


	/**
	* Handle key input events
	* 
	* @param {event} e - event object
	*/
	handleKeyUp(e) {
		let $target = $(e.currentTarget);

		e.preventDefault();

		switch (e.keyCode) {
			case this.options.keyCodes.enter:
			case this.options.keyCodes.space:
				this.updateModel();
				this.toggle();
				break;

			case this.options.keyCodes.left:
			case this.options.keyCodes.up:
				this.selectPrevious();
				this.addFocus();
				break;

			case this.options.keyCodes.right:
			case this.options.keyCodes.down:
				this.selectNext();
				this.addFocus();
				break;
		}

		// Todo:
		// add more usecases, see 
		// https://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#accordion
		// http://www.oaa-accessibility.org/example/37/
	}


	/**
	 * Get the height of all items 
	 */
	getHeight() {
		let height;

		if (this.initialized) {
			// empty array first
			this.panelHeightList.splice(0, this.panelHeightList.length);

			// we need to reset all items to get correct height
			this.destroy();
		}

		$.each(this.$panelList, (index, panel) => {
			height = $(panel).height()

			this.panelHeightList.push(height);

			if (height <= 0) {
				console.warn("Accordion: The height of panel #" + (index + 1) + " is not positive! Please make sure, that there's no style that hides it initially.")
			}
		});

		if (this.initialized) {
			this.render();
		}
	}


	/**
	* Toggle an accordion item based on the ID set on the trigger
	* 
	* @param {obj} data - data object which is passed with the global event
	* @param {string} data.id - the ID of the accordion item you'd like to toggle
	* @param {boolean} data.openItem - Optinal. if you want to open (true) or close (false) the accordion item
	*/
	toggleItem(data) {	
		let $target;
		let itemIndex;

		if (!data || !data.id) {
			console.warn("Accordion: No item ID was passed.")
			return;
		}

		$target = this.$el.find(data.id);
		itemIndex = this.$triggerList.index($target);

		if (itemIndex < 0) {
			console.warn("Accordion: Passed ID does not exist.")
			return;
		}

		// if a desired state is defined, check if we should toggle
		if (data.openItem !== undefined) {
			if (data.openItem && this.itemStateList[itemIndex].isExpanded) {
				console.warn("Accordion: Item with passed ID is already open.")
				return;
			}
			if (!data.openItem && !this.itemStateList[itemIndex].isExpanded) {
				console.warn("Accordion: Item with passed ID is already closed.")
				return;
			}
		}

		this.selectedIndex = itemIndex;

		this.updateSelectedElements();
		this.updateModel();
		this.toggle();
	}


	/**
	 * Initialize the model
	 */
	initModel() {
		if (this.itemStateList.length !== this.$triggerList.length) {
			console.warn("Accordion: The number of items in the DOM is different to the number of items defined in the module options.");
		}

		// Add missing items to model with default state (closed)
		if (this.itemStateList.length < this.$triggerList.length) {
			for (let i = 0; i < this.$triggerList.length; i++) {
				if (!this.itemStateList[i]) {
					this.itemStateList[i] = { isExpanded: false }
				}
			}
		}
	}


	/**
	 * Update the model and save the desired state of the items
	 */
	updateModel() {
		this.itemStateList[this.selectedIndex].isExpanded = !this.itemStateList[this.selectedIndex].isExpanded;

		if (!this.multiselectable && this.selectedIndex !== this.previousIndex) {
			this.itemStateList[this.previousIndex].isExpanded = false;
		}
	}


	/**
	 * Update the selected elements
	 */
	updateSelectedElements() {
		this.$currentTrigger = $(this.$triggerList[this.selectedIndex]);
		this.$currentPanel = $(this.$panelList[this.selectedIndex]);

		this.$previousTrigger = $(this.$triggerList[this.previousIndex]);
		this.$previousPanel = $(this.$panelList[this.previousIndex]);
	}


	/**
	 * Select previous item in the list of all items
	 */
	selectPrevious() {
		if (this.selectedIndex === 0) {
			this.selectedIndex = this.$triggerList.length;
		}
		this.selectedIndex = (this.selectedIndex - 1) % this.$triggerList.length;

		this.updateSelectedElements();
	}


	/**
	 * Select next item in the list of all items
	 */
	selectNext() {
		this.selectedIndex = (this.selectedIndex + 1) % this.$triggerList.length;

		this.updateSelectedElements();
	}


	/**
	 * Add focus to the selected tab
	 */
	addFocus() {
		this.$currentTrigger.focus();
	}

	
	/**
	 * Toggle items
	 */
	toggle() {
		let isItemExpanded = this.itemStateList[this.selectedIndex].isExpanded;
		let event = isItemExpanded ? App.EVENTS.accordion.itemOpened : App.EVENTS.accordion.itemClosed; 
		let height = isItemExpanded ? this.panelHeightList[this.selectedIndex] : 0;

		// Switch state of clicked item
		this.$currentTrigger.attr('aria-selected', isItemExpanded)
			.attr('aria-expanded', isItemExpanded);
		this.$currentPanel.attr('aria-hidden', !isItemExpanded)
			.height(height);

		// Close already opened item (if not same as clicked)
		if (!this.multiselectable && this.selectedIndex !== this.previousIndex) {
			this.$previousTrigger.attr('aria-selected', false)
				.attr('aria-expanded', false);
			this.$previousPanel.attr('aria-hidden', true)
				.height(0);

			// Trigger event to inform other modules which item was closed
			App.Vent.trigger(App.EVENTS.accordion.itemClosed, {
				type: App.EVENTS.accordion.itemClosed,
				instance: this
			});
		}
		
		// Trigger event to inform other modules what happened
		App.Vent.trigger(event, {
			type: event,
			instance: this
		});

		// store trigger & panel for next toggle
		this.previousIndex = this.selectedIndex;
	}


	/**
	 * Hide all elements initially
	 */
	render() {
		let isItemExpanded;
		let height;

		// Add attributes describing the functionality of the accordion
		this.$el.attr('aria-multiselectable', this.multiselectable);

		// Set inital state of each tab
		this.$triggerList.each((index, item) => {
			isItemExpanded = this.itemStateList[index].isExpanded;

			$(item).attr('aria-selected', isItemExpanded)
				.attr('aria-expanded', isItemExpanded);
		});

		// Set initial state of each panel
		this.$panelList.each((index, item) => {
			isItemExpanded = this.itemStateList[index].isExpanded;
			height = isItemExpanded ? this.panelHeightList[index] : 0;

			$(item).attr('aria-hidden', !isItemExpanded)
				.height(height);
		});

		this.initialized = true;
	}


	/**
	 * Set all elements back to initial state
	 */
	destroy() {
		this.$el.removeAttr('aria-multiselectable');

		this.$triggerList.each(function() {
			$(this).removeAttr('aria-selected')
				.removeAttr('aria-expanded');
		});

		this.$panelList.each(function() {
			$(this).removeAttr('aria-hidden')
				.height('auto');
		});
	}
}

export default Accordion;