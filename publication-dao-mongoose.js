import mongoose from 'mongoose';
import ddcDbMongoose from './ddc-db-mongoose.js';
import genericPromiseMongoose from './generic-promise-mongoose.js';
var thisDb = ddcDbMongoose.thisDb;

//NB: This is for current entity type ("Devise" or "Customer" or "Product" or ...)
//NB: thisSchema and ThisPersistentModel should not be exported (private only in this current module)
var thisSchema;//mongoose Schema (structure of mongo document)
var ThisPersistentModel; //mongoose Model (constructor of persistent ThisPersistentModel)


function initMongooseWithSchemaAndModel () {

    mongoose.Connection = thisDb;
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

initMongooseWithSchemaAndModel();

function reinit_db(){
  return new Promise( (resolve,reject)=>{
      const deleteAllFilter = { }
      ThisPersistentModel.deleteMany( deleteAllFilter, function (err) {
        if(err) { 
          console.log(JSON.stringify(err));
          reject(err);
        }
        (new ThisPersistentModel({ _id : "6213be90e247ac2221112840" ,titre : "tour eiffel" , 
                fichier_image_name: "tourEiffel.jpg" , resume : "tour eiffel (Paris)" , 
                texte_complet : "<p> la <b>Tour Eiffel</b> mesure environ 300 mètres </p>" , date : "2019-07-12" ,
                fichier_details_name : null,  lien_externe : null})).save();
        (new ThisPersistentModel({ _id : "6213be90e247ac2221112842" ,titre : "Mont Saint Michel" , 
                fichier_image_name: "montSaintMichel.jpg" , resume : "Mont Saint Michel" , 
                texte_complet : "<p> le <b>Mont Saint Michel</b> change de couleur très fréquemment </p>" , date : "2019-07-12" ,
                fichier_details_name : null,  lien_externe : null})).save();
        resolve({action:"publications collection in database re-initialized"})
      })
 
  });
}

function findById(id) {
  return genericPromiseMongoose.findByIdWithModel(id,ThisPersistentModel);
}

//exemple of criteria : {} or { unitPrice: { $gte: 25 } } or ...
function findByCriteria(criteria) {
  return genericPromiseMongoose.findByCriteriaWithModel(criteria,ThisPersistentModel);
}

function save(entity) {
  return genericPromiseMongoose.saveWithModel(entity,ThisPersistentModel);
}

function updateOne(newValueOfEntityToUpdate) {
  return genericPromiseMongoose.updateOneWithModel(newValueOfEntityToUpdate,newValueOfEntityToUpdate.id,ThisPersistentModel);
}

function deleteOne(idOfEntityToDelete) {
  return genericPromiseMongoose.deleteOneWithModel(idOfEntityToDelete,ThisPersistentModel);
}


export default { ThisPersistentModel ,  reinit_db ,
   findById , findByCriteria , save , updateOne ,  deleteOne};
