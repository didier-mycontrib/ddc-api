import mongoose from 'mongoose';
import ddcDbMongoose from './ddc-db-mongoose.js';
import genericPromiseMongoose from './generic-promise-mongoose.js';
import { readJsonTextFile } from './generic-file-util.js'
//NB: This is for current entity type ("Devise" or "Customer" or "Product" or ...)
//NB: thisSchema and ThisPersistentModel should not be exported (private only in this current module)
var thisSchema;//mongoose Schema (structure of mongo document)
var ThisPersistentModel; //mongoose Model (constructor of persistent ThisPersistentModel)


function initMongooseWithSchemaAndModel () {

/**
 * @openapi
 * components:
 *   schemas:
 *     Publication:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example : 618d53514e0720e69e2e54c8
 *         titre:
 *           type: string
 *           example : titre_news_publication
 *         fichier_image_name:
 *           type: string
 *           example : image_news.jpg
 *         resume:
 *           type: string
 *           example : resume_news_publication
 *         texte_complet:
 *           type: string
 *           example : blabla_blabla
 *         date:
 *           type: string
 *           example : "2020-02-17"
 *         fichier_details_name:
 *           type: string
 *           example : fichier_details_facultatif.pdf
 *         lien_externe:
 *           type: string
 *           example : "http://xyz.com/xxx/yyy"
 * 
 *     PublicationArray:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Publication"
 *
 */  

    mongoose.Connection = ddcDbMongoose.thisDbFn();
      thisSchema = new mongoose.Schema({
        /* default mongo _id: { type : String , alias : "id" } ,*/
        titre: String,
        fichier_image_name : String,
        resume : String,
        texte_complet : String,
        date : String,
        fichier_details_name : String,
        lien_externe : String
      });
      thisSchema.set('id',true); //virtual id alias as string for _id
      thisSchema.set('toJSON', { virtuals: true , 
                                   versionKey:false,
                                   transform: function (doc, ret) {   delete ret._id; delete ret._v;  }
                                 });                             
      //console.log("mongoose thisSchema : " + JSON.stringify(thisSchema) );
      //"Ressource" model name is "publications" collection name in mongoDB  database
      ThisPersistentModel = mongoose.model('Publication', thisSchema);
}

function ThisPersistentModelFn(){
  if(ThisPersistentModel==null)
      initMongooseWithSchemaAndModel();
  return ThisPersistentModel;
}

async function reinit_db(){
 try {
      const deleteAllFilter = { }
      await ThisPersistentModelFn().deleteMany( deleteAllFilter);
      let entitiesFromFileDataSet = await readJsonTextFile("dataset/default_news.json");
       for(let e of entitiesFromFileDataSet){
        if(e.id) { e._id = e.id; delete e.id}
        await  (new ThisPersistentModelFn()(e)).save();
      }
      return {action:"news collection in database re-initialized"}
      }
    catch(ex){
     console.log(JSON.stringify(ex));
     throw ex;
  }
}

function findById(id) {
  return genericPromiseMongoose.findByIdWithModel(id,ThisPersistentModelFn());
}

//exemple of criteria : {} or { unitPrice: { $gte: 25 } } or ...
function findByCriteria(criteria) {
  return genericPromiseMongoose.findByCriteriaWithModel(criteria,ThisPersistentModelFn());
}

function save(entity) {
  return genericPromiseMongoose.saveWithModel(entity,ThisPersistentModelFn());
}

function updateOne(newValueOfEntityToUpdate) {
  return genericPromiseMongoose.updateOneWithModel(newValueOfEntityToUpdate,newValueOfEntityToUpdate.id,ThisPersistentModelFn());
}

function deleteOne(idOfEntityToDelete) {
  return genericPromiseMongoose.deleteOneWithModel(idOfEntityToDelete,ThisPersistentModelFn());
}


export default { ThisPersistentModelFn ,  reinit_db ,
   findById , findByCriteria , save , updateOne ,  deleteOne};
