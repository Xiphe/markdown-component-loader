import hash from 'sha.js';

const noOpReplacer = (thing) => thing;

export default class StringReplacementCache {
  constructor(expression, outputReplacer = noOpReplacer, identityReplacer = noOpReplacer, algorithm = 'sha256') {
    this.expression = expression;
    this.outputReplacer = outputReplacer;
    this.identityReplacer = identityReplacer;
    this.algorithm = algorithm;
    this._cache = {};
  }

  load(body) {
    if (this.loaded === true) {
      throw new Error("StringReplacementCache: `load` called when cache was already loaded!");
    }

    const processed = body
      .replace(this.expression, (match, ...values) => {
        const identityHash = hash(this.algorithm)
          .update(match, 'utf-8')
          .digest('hex');

        const identity = this.identityReplacer(
            identityHash,
            match,
            ...values
          );

        this._cache[identity] = this.outputReplacer(match, ...values);

        return identity;
      });

    this.loaded = true;
    return processed;
  }

  unload(body) {
    if (this.loaded === false) {
      throw new Error("StringReplacementCache: `unload` called when cache was not loaded!");
    }

    let processed = body;

    Object.keys(this._cache).forEach((identity) =>
      processed = processed
        .replace(
          new RegExp(
            identity.replace(
              /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
              '\\$&'
            ),
            'g'
          ),
          this._cache[identity]
        )
    );

    this._cache = {};
    this.loaded = false;
    return processed;
  }
}
