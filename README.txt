en mode dev,
URL = http://localhost:8231/html/index.html
et    http://localhost:8231/res-api/v1/public/ressources
et    http://localhost:8231/news-api/v1/public/publications

en mode prod:
URL = https://www.d-defrance.fr/ddc-api-html/index.html
et    https://www.d-defrance.fr/res-api/v1/public/ressources
et    https://www.d-defrance.fr/news-api/v1/public/publications
=======
utilise une base mongoDB "ddc_db".

==========
npm install -s express
npm install -s mongoose
npm install -s passport passport-keycloak-bearer 
npm install -s swagger-ui-express
npm install -s swagger-jsdoc
====
npm install --save-dev mocha chai chai-http @testcontainers/mongodb
====

NB: ddc-api est un ensemble d'api (pour ddc: didier defrance consultant)
res-api : ressources  (titre , nom fichier , …)  sur pdf, image , ...
news-api : news/publications (cas particulier de ressource avec lien_externe, …)
------
En arrière plan de ces deux api on a:
   - des infos "json" stockée dans MongoDB (base ddc_db)
   - des fichiers qui sont "déjà présents" dans le répertoire html/posts (et le sous répertoire html/posts/images)
                        ou bien "uploadés" dans le répertoire html/mnt_posts (et le sous répertoire html/mnt_posts/images)

==> comportement important lors du démarrage du conteneur docker avec mount:
   * le contenu de html/posts n'est pas écrasé/masqué
   * le contenu de html/mnt_posts sera masqué par le volume ou répertoire monté

