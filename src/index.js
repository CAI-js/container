class Container {
  constructor() {
    this.factory = {};
  }

  register(name, Clazz, isSingleton = true) {
    const isClass = typeof Clazz === 'function';
    const item = { name, isSingleton };
    if (isSingleton) {
      item.instance = isClass ? new Clazz() : Clazz;
    } else {
      item.instance = isClass ? Clazz : Clazz.constructor;
    }
    this.factory[name] = item;
  }

  get(name, settings) {
    const item = this.factory[name];
    if (!item && name[name.length - 3] === '-') {
      if (name.endsWith('en')) {
        return this.get(`${name.slice(0, -3)}`, settings);
      }
      return this.get(`${name.slice(0, -3)}-en`, settings);
    }
    if (!item) {
      return undefined;
    }
    if (item.isSingleton) {
      return item.instance;
    }
    const Clazz = item.instance;
    return new Clazz(settings, this);
  }

  use(plugin) {
    this.register(plugin.info.name, plugin, plugin.info.isSingleton);
  }
}

const defaultContainer = new Container();

module.exports = { Container, defaultContainer };
