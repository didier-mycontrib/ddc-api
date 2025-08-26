import { firstLevelTestWithTestContainer } from './generic-chai-http-mocha-test.js';
import { resClassicSubTestGroup } from './res-api.test.js'
import { newsClassicSubTestGroup } from './news-api.test.js'


//NB: in script (.sh, .bat , ...) : set/export WITHOUT_AUTH=yes // undefined by default
//WITHOUT THAT , security (auth check) will block private requests (post, ..)

firstLevelTestWithTestContainer(
    [   resClassicSubTestGroup(),
        newsClassicSubTestGroup()
    ]);



