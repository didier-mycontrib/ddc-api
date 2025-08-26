import express from 'express';
const apiRouter = express.Router();

import publicationDao from './publication-dao-mongoose.js';
//publicationDao.ThisPersistentModelFn() //to use only for specific extra request (not in dao)


import { statusCodeFromEx , nullOrEmptyObject , build_api_uris , 
	    addDefaultPrivateReInitRoute , addRedirectPublicToPrivateRoute,
	    addDefaultGetByIdRoute ,addDefaultGetByCriteriaRoute ,
	    addDefaultDeleteRoute , addDefaultPostRoute , addDefaultPutRoute} from "./generic-express-util.js";

const api_name="news-api"
const api_version="v1"
const main_entities_name="publications" // main collection (entities name)  

const api_uris = build_api_uris(api_name,api_version,main_entities_name);

//exemple URL: .../news-api/private/reinit
apiRouter.route('/news-api/private/reinit')
addDefaultPrivateReInitRoute(apiRouter,publicationDao,api_uris)



//exemple URL: .../news-api/public/publication/6213be90e247ac2221112840
/**
 * @openapi
 * /news-api/v1/public/publications/{id}:
 *   get:
 *     description: publication/news by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: 6213be90e247ac2221112840
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Publication"
 *         description: Returns Publication
 *       404:
 *         description: NOT_FOUND
 */
addDefaultGetByIdRoute(apiRouter,publicationDao,api_uris,"public")

//exemple URL: .../news-api/public/publication (returning all ressources)
//             .../news-api/public/publication?...=...
/**
 * @openapi
 * /news-api/v1/public/publications:
 *   get:
 *     description: get publications from optional criteria (???)
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PublicationArray"
 *         description: product list
 */
addDefaultGetByCriteriaRoute(apiRouter,publicationDao,api_uris,"public")

//POST WITHOUT UPLOAD (application/json):

// .../news-api/private/publications en mode post
/**
 * @openapi
 * /news-api/v1/private/publications:
 *   post:
 *     description: post (upload) a new publication 
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Publication"
 *     responses:
 *       201:
 *         description: saved publication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Publication"
 *       500:
 *         description: INTERNAL_SERVER_ERROR
 */
addDefaultPostRoute(apiRouter,publicationDao,api_uris,
     (savedpublication)=>savedpublication.id 
)

//POST WITH UPLOAD (multipart/form-data):

// .../news-api/private/upload-publication en mode post
/**
 * @openapi
 * /news-api/v1/private/upload-publication:
 *   post:
 *     description: post (upload) a new publication 
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/Publication"
 *     responses:
 *       201:
 *         description: saved publication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Publication"
 *       500:
 *         description: INTERNAL_SERVER_ERROR
 */
apiRouter.route('/news-api/v1/private/upload-publication')
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
      let postFolderPath = "./html/mnt_posts/";
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
		res.status(201).send(savedPublication);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

/**
 * @openapi
 * /news-api/v1/private/publications/{id}:
 *   put:
 *     description: update publication with existing id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: 618d53514e0720e69e2e54c8
 *       - name: v
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         description: "verbose: to ask 200/updatedproduct (not 204/NO_CONTENT)"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Publication"
 *     responses:
 *       200:
 *         description: updated Product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Publication"
 *       204:
 *         description: NO_CONTENT (OK)
 *       404:
 *         description: NOT_FOUND
 */
addDefaultPutRoute(apiRouter,publicationDao,api_uris,
	 (idRes,publicationToUpdate) => { publicationToUpdate.id = idRes; }
)

//exemple URL: .../news-api/private/publication/6213be90e247ac2221112840 en mode DELETE
/**
 * @openapi
 * /news-api/v1/private/publications/{id}:
 *   delete:
 *     description: delete publication from id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: 6213be90e247ac2221112840
 *       - name: v
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         description: "verbose: to ask 200/message (not 204/NO_CONTENT)"
 *     responses:
 *       200:
 *         description : delete action json message with deletedId
 *       204:
 *         description: NO_CONTENT (OK)
 *       404:
 *         description: NOT_FOUND
 */
addDefaultDeleteRoute(apiRouter,publicationDao,api_uris)


export  default { apiRouter };