# Accordion

This component is based on the blueprint of Veams-Components.

## Usage

### Include: Page

``` hbs
{{! @INSERT :: START @id: accordion, @tag: component-partial }}
{{! WrapWith START: Accordion }}
	{{#wrapWith "c-accordion"}}
	{{! WrapWith START: Item }}
		{{#wrapWith "c-accordion__item"}}
			Content 1
		{{/wrapWith}}
		{{! WrapWith END: Item }}
		{{! WrapWith START: Item }}
		{{#wrapWith "c-accordion__item"}}
			Content 2
		{{/wrapWith}}
	{{! WrapWith END: Item }}
	{{/wrapWith}}
{{! WrapWith END: Accordion }}
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
