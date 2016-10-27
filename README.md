# Accordion

This component is based on the blueprint of Veams-Components. 

The accordion displays 1-x items which get (each) toggled via a related trigger.
An item contains a tab (trigger) and a panel (content).

First, all panels are expanded, because the height of each panel gets measured and stored. Afterwards the panels are closed according to the configuration. Therefore the accordion is built based on the principles of progressive enhancement and guarantees no-js support.


## Possible configuration options:
- Multiselectable: If two or more items can be open at the same time (default value: false)
- Items: An array, where amount of objects equals accordion items. Set key 'isExanded'
to true or false to set a default state on initialize for every item.


## Usage
- Do not hide an accordion wrapping container initially. Otherwise the measure of the panel height will fail.


## Version

Latest version is ```v1.1.2```

## Requirements

### JavaScript
- `Veams-JS >= v3.6.0`

### Include: Page

``` hbs
{{! @INSERT :: START @id: accordion, @tag: component-partial }}
{{#with accordion-bp.simple}}
	{{! WrapWith START: Accordion }}
		{{#wrapWith "c-accordion" context=this.accordionOptions.context cssClasses=this.accordionOptions.cssClasses jsOptions=this.accordionOptions.jsOptions}}
		{{! WrapWith START: Item }}
			{{#wrapWith "c-accordion__item" id="item1" position=1 headline="test headline 1"}}
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid assumenda, ducimus facilis inventore iste labore laborum libero nam necessitatibus neque nulla numquam perspiciatis rem, repudiandae sed soluta veniam vero.
			{{/wrapWith}}
			{{#wrapWith "c-accordion__item" id="item2" position=2 headline="test headline 2"}}
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid assumenda, ducimus facilis inventore iste labore laborum libero nam necessitatibus neque nulla numquam perspiciatis rem, repudiandae sed soluta veniam vero.
			{{/wrapWith}}
		{{! WrapWith END: Item }}
		{{/wrapWith}}
	{{! WrapWith END: Accordion }}
{{/with}}
{{! @INSERT :: END }}
```

### Include: SCSS

``` scss
// @INSERT :: START @tag: scss-import 
@import "components/_c-accordion";
// @INSERT :: END
```

### Include: JavaScript

#### Import
``` js
// @INSERT :: START @tag: js-import 
import Accordion from './modules/accordion/accordion';
// @INSERT :: END
```

#### Initializing in Veams V2
``` js
// @INSERT :: START @tag: js-init-v2 
/**
 * Init Accordion
 */
Helpers.loadModule({
	el: '[data-js-module="accordion"]',
	module: Accordion,
	context: context
});
// @INSERT :: END
```

#### Initializing in Veams V3
``` js
// @INSERT :: START @tag: js-init-v3  
/**
 * Init Accordion
 */
Helpers.loadModule({
	domName: 'accordion',
	module: Accordion,
	context: context
});
// @INSERT :: END
```

#### Custom Events
``` js
// @INSERT :: START @tag: js-events //
/**
 * Events Accordion
 */
EVENTS.accordion = {
	toggleItem: 'accordion:toggleItem',
	itemClosed: 'accordion:itemClosed',
	itemOpened: 'accordion:itemOpened'
};
// @INSERT :: END
```