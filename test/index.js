const babel = require("babel-core");
const lodashPlugin = require("../src/index")

const code =`
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

export default lodash
`

const result = babel.transform(code, {
  plugins: [[lodashPlugin, { removeMethods: null }]]
});

console.log(result.code, 'result');
// console.log(result.ast);