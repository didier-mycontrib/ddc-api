import mongoose from 'mongoose';
import ddcDbMongoose from './ddc-db-mongoose.js';
import genericPromiseMongoose from './generic-promise-mongoose.js';
var thisDb = ddcDbMongoose.thisDb;

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

    mongoose.Connection = thisDb;
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

initMongooseWithSchemaAndModel();

function reinit_db(){
  return new Promise( (resolve,reject)=>{
      const deleteAllFilter = { }
      ThisPersistentModel.deleteMany( deleteAllFilter, function (err) {
        if(err) { 
          console.log(JSON.stringify(err));
          reject(err);
        }
        (new ThisPersistentModel({ _id : "62139848eb02e0dc09503d4f" ,titre : "plan_spring" , 
                res_fic_name: "plan_spring.pdf" , res_type : "pdf" , 
                res_categorie : "plan" , date : "2020-02-17" })).save();
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642b9" ,titre : "plan_angular" , 
                res_fic_name: "plan_angular.pdf" , res_type : "pdf" , 
                res_categorie : "plan" , date : "2020-02-17" })).save();
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642bb" ,titre : "cv_D_Defrance_pdf" , 
                res_fic_name: "cv_D_Defrance.pdf" , res_type : "pdf" , 
                res_categorie : "cv" , date : "2020-02-17" })).save();
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642bd" ,titre : "cv_D_Defrance_docx" , 
                res_fic_name: "cv_D_Defrance.docx" , res_type : "document" , 
                res_categorie : "cv" , date : "2020-02-17" })).save();  
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642bf" ,titre : "didier_jpg" , res_fic_name: "didier.jpg" , res_type : "image" , res_categorie : "ressource" , date : "2020-02-17" })).save();
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642c1" ,titre : "classroom_jpg" , res_fic_name: "classroom.jpg" , res_type : "image" , res_categorie : "ressource" , date : "2020-02-17" })).save();   
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642c3" ,titre : "coffee_jpg" , res_fic_name: "coffee.jpg" , res_type : "image" , res_categorie : "ressource" , date : "2020-02-17" })).save();   
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642c5" ,titre : "didier_vernon_jpg" , res_fic_name: "didier_vernon.jpg" , res_type : "image" , res_categorie : "ressource" , date : "2020-02-17" })).save();
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642c7" ,titre : "laptop_jpg" , res_fic_name: "laptop.jpg" , res_type : "image" , res_categorie : "ressource" , date : "2020-02-17" })).save();   
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642c9" ,titre : "nature_jpg" , res_fic_name: "nature.jpg" , res_type : "image" , res_categorie : "ressource" , date : "2020-02-17" })).save(); 
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642cb" ,titre : "code_jpg" , res_fic_name: "code.jpg" , res_type : "image" , res_categorie : "ressource" , date : "2020-02-17" })).save();
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642cd" ,titre : "modelisation_jpg" , res_fic_name: "modelisationmodelisation.jpg" , res_type : "image" , res_categorie : "ressource" , date : "2020-02-17" })).save();   
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642cf" ,titre : "domaines_competences_jpg" , res_fic_name: "domaines_competences.jpg" , res_type : "image" , res_categorie : "ressource" , date : "2020-02-17" })).save(); 
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642d1" ,titre : "competences_jee_spring_jpg" , res_fic_name: "competences_jee_spring.jpg" , res_type : "image" , res_categorie : "ressource" , date : "2020-02-17" })).save();
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642d3" ,titre : "competences_javascript_jpg" , res_fic_name: "competences_javascript.jpg" , res_type : "image" , res_categorie : "ressource" , date : "2020-02-17" })).save();   
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642d5" ,titre : "competences_devops_jpg" , res_fic_name: "competences_devops.jpg" , res_type : "image" , res_categorie : "ressource" , date : "2020-02-17" })).save(); 
        (new ThisPersistentModel({ _id : "62139cf0b7c87471f20642d7" ,titre : "competences_transverses_jpg" , res_fic_name: "competences_transverses.jpg" , res_type : "image" , res_categorie : "ressource" , date : "2020-02-17" })).save(); 
        resolve({action:"ressources collection in database re-initialized"})
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
