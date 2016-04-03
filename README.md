# Accordion

This component is based on the blueprint of Veams-Components. 

It represents a simple accordion with `transitions` and `max-height`.

## Usage

### Include: Page

``` hbs
{{! @INSERT :: START @id: accordion, @tag: component-partial }}
{{#with accordion-bp.simple}}
	{{! WrapWith START: Accordion }}
		{{#wrapWith "c-accordion"}}
		{{! WrapWith START: Item }}
			{{#wrapWith "c-accordion__item" accItemId="test-1" accButton="Item 1"}}
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid assumenda, ducimus facilis inventore iste labore laborum libero nam necessitatibus neque nulla numquam perspiciatis rem, repudiandae sed soluta veniam vero.
			{{/wrapWith}}
			{{#wrapWith "c-accordion__item" accItemId="test-2" accButton="Item 2"}}
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid assumenda, ducimus facilis inventore iste labore laborum libero nam necessitatibus neque nulla numquam perspiciatis rem, repudiandae sed soluta veniam vero.
			{{/wrapWith}}
		{{! WrapWith END: Item }}
		{{/wrapWith}}
	{{! WrapWith END: Accordion }}
{{/with}}

{{#with accordion-bp.custom}}
{{! WrapWith START: Accordion }}
	{{#wrapWith "c-accordion" jsOptions=this.accordionOptions.jsOptions}}
	{{! WrapWith START: Item }}
		{{#wrapWith "c-accordion__item" accItemId="test-3" accButton="Item 3"}}
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid assumenda, ducimus facilis inventore iste labore laborum libero nam necessitatibus neque nulla numquam perspiciatis rem, repudiandae sed soluta veniam vero.
		{{/wrapWith}}
		{{#wrapWith "c-accordion__item" accItemId="test-4" accButton="Item 4"}}
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid assumenda, ducimus facilis inventore iste labore laborum libero nam necessitatibus neque nulla numquam perspiciatis rem, repudiandae sed soluta veniam vero.		{{/wrapWith}}
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
	openAll: 'accordion:openAll',
	closeAll: 'accordion:closeAll'
};
// @INSERT :: END
```