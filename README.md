# @caijs/container

An IoC container that allows to register instance by locale with a fallback to english or default. 

## Installation

In your project folder run:

```bash
$ npm install @caijs/container
```

## Example of use

```javascript
const container = require('@caijs/container');

class Something {
  constructor(name) {
    this.name = name;
  }
}

container.register('a', new Something('a'), true);
container.register('b', new Something('b'), true);
container.register('Something', Something, false);
const a = container.get('a'); // It will be the instance a
const b = container.get('b'); // it will be the instance b
const c = container.get('c'); // it will be undefined
const something1 = container.get('Something'); // it will return an instance of Something
const something2 = container.get('Something'); // it will return another instance of Something
```

## Fallback locales
```javascript
const container = require('@caijs/container');

class Something {
  constructor(name) {
    this.name = name;
  }
}

container.register('something-es', new Something('something-es'), true);
container.register('something-en', new Something('something-en'), true);
container.register('otherthing-es', new Something('otherthing-es'), true);
container.register('otherthing', new Something('otherthing'), true);

const somethinges = container.get('something-es'); // it will be something-es
const somethingar = container.get('something-ar'); // as something-ar does not exists, it return something-en
const otherthingar = container.get('otherthing-ar'); // as otherthing-ar does not exists, neither otherthing-en, return otherthing
```
