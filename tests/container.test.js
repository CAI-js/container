const { Container, defaultContainer } = require('../src');

class Other {
  constructor() {
    this.name = 'name';
  }
}

describe('Container', () => {
  describe('Constructor', () => {
    it('Should create an instance', () => {
      const instance = new Container();
      expect(instance).toBeDefined();
    });
    it('Should give a default container', () => {
      expect(defaultContainer).toBeDefined();
    });
  });

  describe('Register', () => {
    test('An instance can be registered as singleton', () => {
      const instance = new Container();
      const other = new Other();
      instance.register('other', other);
      expect(instance.factory.other).toBeDefined();
      expect(instance.factory.other.instance).toBe(other);
      expect(instance.factory.other.isSingleton).toBeTruthy();
      expect(instance.factory.other.name).toEqual('other');
    });
    test('A class can be registered as singleton, so an instance will be created', () => {
      const instance = new Container();
      instance.register('other', Other);
      expect(instance.factory.other).toBeDefined();
      expect(instance.factory.other.instance).toBeInstanceOf(Other);
      expect(instance.factory.other.isSingleton).toBeTruthy();
      expect(instance.factory.other.name).toEqual('other');
    });
    test('A class can be registered as no singleton', () => {
      const instance = new Container();
      instance.register('other', Other, false);
      expect(instance.factory.other).toBeDefined();
      expect(instance.factory.other.instance).toBe(Other);
      expect(instance.factory.other.isSingleton).toBeFalsy();
      expect(instance.factory.other.name).toEqual('other');
    });
    test('If an instance is registered as no singleton, its constructor is extracted', () => {
      const instance = new Container();
      const other = new Other();
      instance.register('other', other, false);
      expect(instance.factory.other).toBeDefined();
      expect(instance.factory.other.instance).toBe(Other);
      expect(instance.factory.other.isSingleton).toBeFalsy();
      expect(instance.factory.other.name).toEqual('other');
    });
  });

  describe('Get', () => {
    test('If no item exists with this name, return undefined', () => {
      const instance = new Container();
      const other = new Other();
      instance.register('other', other);
      const actual = instance.get('another');
      expect(actual).toBeUndefined();
    });
    test('We can get a singleton instance and should be the original object', () => {
      const instance = new Container();
      const other = new Other();
      instance.register('other', other);
      const actual = instance.get('other');
      expect(actual).toBe(other);
    });
    test('We can get a singleton class and everytime should be the same object', () => {
      const instance = new Container();
      instance.register('other', Other);
      const actual = instance.get('other');
      expect(actual).toBeInstanceOf(Other);
      const actual2 = instance.get('other');
      expect(actual2).toBe(actual);
    });
    test('If is not a singleton, return different instances', () => {
      const instance = new Container();
      const other = new Other();
      instance.register('other', other, false);
      const actual = instance.get('other');
      expect(actual).toBeInstanceOf(Other);
      expect(actual).not.toBe(other);
      const actual2 = instance.get('other');
      expect(actual2).toBeInstanceOf(Other);
      expect(actual2).not.toBe(other);
      expect(actual2).not.toBe(actual);
    });
    test('If is not a singleton and registering a class, return different instances', () => {
      const instance = new Container();
      instance.register('other', Other, false);
      const actual = instance.get('other');
      expect(actual).toBeInstanceOf(Other);
      const actual2 = instance.get('other');
      expect(actual2).toBeInstanceOf(Other);
      expect(actual2).not.toBe(actual);
    });
    test('An item can be retrieved with locale', () => {
      const instance = new Container();
      const item = new Other();
      item.name = 'something-es';
      instance.register('something-es', item, true);
      const actual = instance.get('something-es');
      expect(actual.name).toEqual('something-es');
    });
    test('If the item does not exists by locale, retrieve the english version', () => {
      const instance = new Container();
      const item = new Other();
      item.name = 'something-en';
      instance.register('something-en', item, true);
      const actual = instance.get('something-es');
      expect(actual.name).toEqual('something-en');
    });
    test('If the item does not exists by locale, neither the english, try to retrieve a version with no locale', () => {
      const instance = new Container();
      const item = new Other();
      item.name = 'something';
      instance.register('something', item, true);
      const actual = instance.get('something-es');
      expect(actual.name).toEqual('something');
    });
  });

  describe('Use', () => {
    it('A plugin can be registered', () => {
      const item = {
        info: {
          name: 'plugin',
          isSingleton: true,
        },
        other: new Other(),
      };
      const instance = new Container();
      instance.use(item);
      const actual = instance.get('plugin');
      expect(actual).toBe(item);
    });
  });
});
