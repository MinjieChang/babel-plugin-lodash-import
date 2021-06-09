# babel-plugin-lodash-import

a **babel plugin** that implements lodash imports on demand, converting the full volume of lodash imports into only the parts of the function that need to be imported

[here](https://www.npmjs.com/package/babel-plugin-lodash) is the official plugin with similar functionality which is more reliable once you use it in production mode 😄

this plugin can convert the code:

```js
import lodash from 'lodash'
import _ from 'lodash'
import * as lodash3 from 'lodash'

import uniq from 'lodash/uniq'
import debounce from 'lodash/debounce'

import { map, forEach } from 'lodash'
import { add } from 'lodash/fp'

forEach(function (a){console.log(a)})
map()
uniq()
debounce(999)

const addOne = add(1)
_.map([1, 2, 3], addOne)

lodash.debounce(1,2)
lodash.isEqual(1,2)
lodash3.throttle(33)
lodash.filter(1,2)
_.filter(3333)
```

to the following code：

```js
import _add from 'lodash/fp/add';
import _filter from 'lodash/filter';
import _throttle from 'lodash/throttle';
import _isEqual from 'lodash/isEqual';
import _debounce from 'lodash/debounce';
import _forEach from 'lodash/forEach';
import _map from 'lodash/map';


import uniq from 'lodash/uniq';
import debounce from 'lodash/debounce';

_forEach(function (a) {
  console.log(a);
});
_map();
uniq();
debounce(999);

const addOne = _add(1);
_map([1, 2, 3], addOne);

_debounce(1, 2);
_isEqual(1, 2);
_throttle(33);
_filter(1, 2);
_filter(3333);
```

## usage

### 1. babel-cli

add following code to `.babelrc` file

```js
{
  "plugins": [
    ["./plugins/3babel-plugin-lodash/index"]
  ]
}
```

package.json

```js
{
  "scripts": {
    "lodash": "babel ./test/lodashPlugin.js",
  },
}
```

### 2. babel api

testd by babel api

```js
const babel = require("babel-core");
const lodashPlugin = require("../plugins/3babel-plugin-lodash/index")

const result = babel.transform(code, {
  plugins: [[lodashPlugin]]
});

console.log(result.code, 'result');
```

### 3. webpack.config.js

used in webpack

```js
'module': {
  'loaders': [{
    'loader': 'babel-loader',
    'test': /\.js$/,
    'exclude': /node_modules/,
    'query': {
      'plugins': ['lodash-import'],
      'presets': [['@babel/env', { 'targets': { 'node': 6 } }]]
    }
  }]
}
```

## how to implement a babel plugin

[guideline to implement babel plugin](https://github.com/MinjieChang/myBlog/issues/35)