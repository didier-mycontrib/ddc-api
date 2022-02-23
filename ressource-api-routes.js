import express from 'express';
const apiRouter = express.Router();

import ressourceDao from './ressource-dao-mongoose.js';
var PersistentSessionModel = ressourceDao.ThisPersistentModel; //to use only for specific extra request (not in dao)


function statusCodeFromEx(ex){
	let status = 500;
	if(ex== null || ex.error == null ) return status;
	switch(ex.error){
		case "BAD_REQUEST" : status = 400; break;
		case "NOT_FOUND" : status = 404; break;
		//...
		case "CONFLICT" : status = 409; break;
		default: status = 500;
	}
	return status;
}

/*
Nouvelle convention d'URL :
http://localhost:8xxx/xyz-api/private/xyz en accès private (avec auth nécessaire)
http://localhost:8xxx/xyz-api/public/xyz en accès public (sans auth nécessaire)
*/

//exemple URL: .../res-api/private/reinit
apiRouter.route('/res-api/private/reinit')
.get( async function(req , res  , next ) {
	try{
		let doneActionMessage = await ressourceDao.reinit_db();
		res.send(doneActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


//exemple URL: .../res-api/public/ressource/62139848eb02e0dc09503d4f
apiRouter.route('/res-api/public/ressource/:id')
.get( async function(req , res  , next ) {
	var idRes = req.params.id;
	try{
		let ressource = await ressourceDao.findById( idRes);
		res.send(ressource);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: .../res-api/public/ressource (returning all ressources)
//             .../res-api/public/ressource?categorie=plan
apiRouter.route('/res-api/public/ressource')
.get( async function(req , res  , next ) {
	let  categorie = req.query.categorie;
	var criteria=categorie?{res_categorie  : categorie}:{};
	try{
		let ressources = await ressourceDao.findByCriteria(criteria);
		res.send(ressources);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


// .../res-api/private/upload-ressource en mode post
apiRouter.route('/res-api/private/upload-ressource')
.post(async function(req , res  , next ) {
	var ressource = JSON.parse(req.body.ressource); // explicit JSON.parse() needed here because multipart / formData / upload
    console.log("posting  ressource :" +JSON.stringify(ressource));

    if (!req.files){
        console.log('No ressource files were uploaded.');
    }
     else{
      // req.files.fileNameXyz (ici .resFile ) 
      let resFile = req.files.resFile ;
      let postFolderPath = "./html/posts/";
      if(resFile){
          if(ressource.res_type == "image"){
            postFolderPath = "./html/posts/images/";
          }
          // Use the mv() method to place the file somewhere on your server
          resFile.mv(postFolderPath + resFile.name, function(err) {
            if (err)
              console.log(resFile.name + " was not upload");
            else 
              console.log(resFile.name + " was upload in "+postFolderPath);
          });
      }
     }

	try{
		let savedRessource = await ressourceDao.save(ressource);
		res.send(savedRessource);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});



//exemple URL: .../res-api/private/ressource/618d53514e0720e69e2e54c8 en mode DELETE
apiRouter.route('/res-api/private/ressource/:id')
.delete( async function(req , res  , next ) {
	var idRes = req.params.id;
	console.log("DELETE,idRes="+idRes);
	try{
		let deleteActionMessage = await ressourceDao.deleteOne(idRes);
		res.send(deleteActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

export  default { apiRouter };