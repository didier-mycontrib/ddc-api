import mongoose from 'mongoose';
import ddcDbMongoose from './ddc-db-mongoose.js';
import genericPromiseMongoose from './generic-promise-mongoose.js';
import { readJsonTextFile } from './generic-file-util.js'
//NB: This is for current entity type ("Devise" or "Customer" or "Product" or ...)
//NB: thisSchema and ThisPersistentModel should not be exported (private only in this current module)
var thisSchema;//mongoose Schema (structure of mongo document)
var ThisPersistentModel; //mongoose Model (constructor of persistent ThisPersistentModel)

/*Ressource ( image , pdf, ... )
  titre :  'titre facultatif de la ressource "
  res_fic_name : nom du fichier (image ou pdf ou ...)
  res_type :  type/role technique de ressource "pdf" , "image" , "video" , ...
  res_categorie : categorie fonctionnelle (ex: plan , ...)
  date:  date éventuelle : "2018-06-25"
}*/


function initMongooseWithSchemaAndModel () {

/**
 * @openapi
 * components:
 *   schemas:
 *     Ressource:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example : 618d53514e0720e69e2e54c8
 *         titre:
 *           type: string
 *           example : image1
 *         res_fic_name:
 *           type: string
 *           example : image1.jpg
 *         res_type:
 *           type: string
 *           example : image ou pdf ou video ou ...
 *         res_categorie:
 *           type: string
 *           example : ressource ou plan ou ...
 *         date:
 *           type: string
 *           example : "2020-02-17"
 * 
 *     RessourceArray:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Ressource"
 *
 */  

    mongoose.Connection = ddcDbMongoose.thisDbFn();
      thisSchema = new mongoose.Schema({
        /* default mongo _id: { type : String , alias : "id" } ,*/
        titre: String,
        res_fic_name : String,
        res_type : String,
        res_categorie : String,
        date : String,
      });
      thisSchema.set('id',true); //virtual id alias as string for _id
      thisSchema.set('toJSON', { virtuals: true , 
                                   versionKey:false,
                                   transform: function (doc, ret) {   delete ret._id; delete ret._v;  }
                                 });                             
      //console.log("mongoose thisSchema : " + JSON.stringify(thisSchema) );
      //"Ressource" model name is "ressources" collection name in mongoDB  database
      ThisPersistentModel = mongoose.model('Ressource', thisSchema);
}

function ThisPersistentModelFn(){
  if(ThisPersistentModel==null)
      initMongooseWithSchemaAndModel();
  return ThisPersistentModel;
}

async function reinit_db(){
  try {
      const deleteAllFilter = { }
      await ThisPersistentModelFn().deleteMany( deleteAllFilter );
      let entitiesFromFileDataSet = await readJsonTextFile("dataset/default_ressources.json");
       for(let e of entitiesFromFileDataSet){
        if(e.id) { e._id = e.id; delete e.id}
        await  (new ThisPersistentModelFn()(e)).save();
      }
      return {action:"ressources collection in database re-initialized"}
  } catch(ex){
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
