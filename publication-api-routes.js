import express from 'express';
const apiRouter = express.Router();

import publicationDao from './publication-dao-mongoose.js';
var PersistentSessionModel = publicationDao.ThisPersistentModel; //to use only for specific extra request (not in dao)


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

//exemple URL: .../news-api/private/reinit
apiRouter.route('/news-api/private/reinit')
.get( async function(req , res  , next ) {
	try{
		let doneActionMessage = await publicationDao.reinit_db();
		res.send(doneActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


//exemple URL: .../news-api/public/publication/6213be90e247ac2221112840
apiRouter.route('/news-api/public/publication/:id')
.get( async function(req , res  , next ) {
	var idRes = req.params.id;
	try{
		let ressource = await publicationDao.findById( idRes);
		res.send(ressource);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: .../news-api/public/publication (returning all ressources)
//             .../news-api/public/publication?...=...
apiRouter.route('/news-api/public/publication')
.get( async function(req , res  , next ) {
	let  xyz = req.query.xyz;
	var criteria=xyz?{xyz  : xyz}:{};
	try{
		let ressources = await publicationDao.findByCriteria(criteria);
		res.send(ressources);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


// .../news-api/private/upload-publication en mode post
apiRouter.route('/news-api/private/upload-publication')
.post(async function(req , res  , next ) {
	var publication = JSON.parse(req.body.publication); // explicit JSON.parse() needed here because multipart / formData / upload
    console.log("posting  publication :" +JSON.stringify(publication));

    if (!req.files){
        console.log('No ressource files were uploaded.');
    }
     else{
      // req.files.fileNameXyz (ici .imageFile et .detailsFile) 
      let imageFile = req.files.imageFile ;
	  let detailsFile = req.files.detailsFile
      let postFolderPath = "./html/posts/";
      if(imageFile){
          // Use the mv() method to place the file somewhere on your server
          imageFile.mv(postFolderPath +"/images/"+ imageFile.name, function(err) {
            if (err)
              console.log(imageFile.name + " was not upload");
            else 
              console.log(imageFile.name + " was upload in "+postFolderPath +"/images/");
          });
      }
	  if(detailsFile){
		// Use the mv() method to place the file somewhere on your server
		detailsFile.mv(postFolderPath + detailsFile.name, function(err) {
		  if (err)
			console.log(detailsFile.name + " was not upload");
		  else 
			console.log(detailsFile.name + " was upload in "+postFolderPath);
		});
	  }
     }

	try{
		let savedPublication = await publicationDao.save(publication);
		res.send(savedPublication);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});



//exemple URL: .../news-api/private/publication/6213be90e247ac2221112840 en mode DELETE
apiRouter.route('/news-api/private/publication/:id')
.delete( async function(req , res  , next ) {
	var idRes = req.params.id;
	console.log("DELETE,idRes="+idRes);
	try{
		let deleteActionMessage = await publicationDao.deleteOne(idRes);
		res.send(deleteActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

export  default { apiRouter };