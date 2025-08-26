import { app , server } from '../server.js';
import { initMongodbContainer , initMainDataSet , removeMainDataSet,
  classicHttpCrudInnerTestObject } from './generic-chai-http-mocha-test.js';

import { chai , expect ,retreiveMyAppRequester } from './common-app-test.js'


//NB: in script (.sh, .bat , ...) : set/export WITHOUT_AUTH=yes // undefined by default
//WITHOUT THAT , security (auth check) will block private requests (post, ..)
export function resClassicSubTestGroup(){


let testContext = {
  chai : chai,
  expect : expect,
  app : app,
  name : "res-api-test",
  httpRequesterFn : retreiveMyAppRequester ,
  mainDataSetFilePath : "test/dataset/ressources.json" ,
  entityToAddFilePath : "test/dataset/new_ressource.json" ,
  entityToUpdateFilePath : "test/dataset/update_ressource.json" ,
  mainPrivateURL:"/res-api/v1/private/ressources" ,
  mainPublicURL:"/res-api/v1/public/ressources" ,
  extractIdFn : (r) => r.id ,
  setIdFn: (r,id) => { r.id = id } ,
  testEssentialSameValues: (e1,e2) => {
      expect(e1.res_fic_name).to.equal(e2.res_fic_name);
      expect(e1.date).to.equal(e2.date);
   }
   // .mainEntities may be dynamically added in testContext (for access from specificsubGroupTests
}

const mySpecificSubGroupTests =
()=>{
  /*
  this tests block will be inserted in a sub described part of classicHttpCrudTest
  all inner tests should be written as following :
     * get http requester via requester = testContext.httpRequesterFn();
       with or without .keepOpen() and .close()
     * testContext.expect(res)....
     * can access testContext.mainEntities initialized by classicHttpCrudTest main describe block 
  */

  
}

return classicHttpCrudInnerTestObject(testContext);

}


