const store = new Map();

module.exports = {
  setKeyValue: (k, v) => store.set(k, v),
  getValue: (k) => store.get(k)
};