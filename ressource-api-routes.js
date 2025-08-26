import express from 'express';
const apiRouter = express.Router();

import ressourceDao from './ressource-dao-mongoose.js';
// ressourceDao.ThisPersistentModelFn() //to use only for specific extra request (not in dao)


import { statusCodeFromEx , nullOrEmptyObject , build_api_uris , 
	    addDefaultPrivateReInitRoute , addRedirectPublicToPrivateRoute,
	    addDefaultGetByIdRoute ,addDefaultGetByCriteriaRoute ,
	    addDefaultDeleteRoute , addDefaultPostRoute , addDefaultPutRoute} from "./generic-express-util.js";

const api_name="res-api"
const api_version="v1"
const main_entities_name="ressources" // main collection (entities name)  

const api_uris = build_api_uris(api_name,api_version,main_entities_name);

//exemple URL: .../res-api/v1/private/reinit
addDefaultPrivateReInitRoute(apiRouter,ressourceDao,api_uris)


//exemple URL: .../res-api/v1/public/ressources/62139848eb02e0dc09503d4f
/**
 * @openapi
 * /res-api/v1/public/ressources/{id}:
 *   get:
 *     description: ressource by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: 62139cf0b7c87471f20642bd
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ressource"
 *         description: Returns Ressource
 *       404:
 *         description: NOT_FOUND
 */
addDefaultGetByIdRoute(apiRouter,ressourceDao,api_uris,"public")

//exemple URL: .../res-api/v1/public/ressources (returning all ressources)
//             .../res-api/v1/public/ressources?categorie=plan
/**
 * @openapi
 * /res-api/v1/public/ressources:
 *   get:
 *     description: get ressouces from optional criteria (categorie=)
 *     parameters:
 *       - name: categorie
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: plan
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RessourceArray"
 *         description: ressource list
 */
addDefaultGetByCriteriaRoute(apiRouter,ressourceDao,api_uris,"public",
	(req)=>{let categorie = req.query.categorie;
            let criteria=categorie?{ res_categorie  : categorie }:{};
			return criteria }
)

//POST WITHOUT UPLOAD (application/json):

// .../res-api/v1/private/ressources en mode post
/**
 * @openapi
 * /res-api/v1/private/ressources:
 *   post:
 *     description: post (upload) a new publication 
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Ressource"
 *     responses:
 *       201:
 *         description: saved ressource
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ressource"
 *       500:
 *         description: INTERNAL_SERVER_ERROR
 */
addDefaultPostRoute(apiRouter,ressourceDao,api_uris,
     (savedRes)=>savedRes.id 
)

//POST WITH UPLOAD (multipart/form-data):

// .../res-api/v1/private/upload-ressource en mode post
/**
 * @openapi
 * /res-api/v1/private/upload-ressource:
 *   post:
 *     description: post (upload) a new ressource 
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/Ressource"
 *     responses:
 *       201:
 *         description: saved ressource
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ressource"
 *       500:
 *         description: INTERNAL_SERVER_ERROR
 */
apiRouter.route('/res-api/v1/private/upload-ressource')
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
		res.status(201).send(savedRessource);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

/**
 * @openapi
 * /res-api/v1/private/ressources/{id}:
 *   put:
 *     description: update ressource with existing id
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
 *             $ref: "#/components/schemas/Ressource"
 *     responses:
 *       200:
 *         description: updated Ressource
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ressource"
 *       204:
 *         description: NO_CONTENT (OK)
 *       404:
 *         description: NOT_FOUND
 */
addDefaultPutRoute(apiRouter,ressourceDao,api_uris,
	 (idRes,ressourceToUpdate) => { ressourceToUpdate.id = idRes; }
)

//exemple URL: .../res-api/v1/private/ressources/618d53514e0720e69e2e54c8 en mode DELETE
/**
 * @openapi
 * /res-api/v1/private/ressources/{id}:
 *   delete:
 *     description: delete ressource from id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: 62139cf0b7c87471f20642c7
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
addDefaultDeleteRoute(apiRouter,ressourceDao,api_uris)

export  default { apiRouter };