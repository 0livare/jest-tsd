import {expectType, expectError, expectAssignable, expectNotAssignable} from 'tsd-lite'
Array.from('foo')
Array.from(new Set())
Array.from([1, 2, 3])
Array.from({length: 3}, (_, i) => i)
