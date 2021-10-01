var pgp = require('pg-promise')(/* options */);
var db = pgp('postgres://postgres:postgresql@localhost:5432/VirtualPhotoAlbum');
const { ParameterizedQuery: PQ } = require('pg-promise');

class DatabaseService {

    searchForAlbum(searchValue) {

        let args = [];
        args.push('%' + searchValue + '%');

        let string = `
        SELECT
            al."Name",
            al."Id",
            ( SELECT "FilePath" FROM "Photos" ph WHERE ph."AlbumId" = al."Id" LIMIT 1 )
        FROM "Albums" al
        WHERE 
            UPPER("Name") LIKE UPPER($1)
            OR UPPER("City") LIKE UPPER($1)
            OR UPPER("State") LIKE UPPER($1)
            OR UPPER("Country") LIKE UPPER($1);`;

        const searchForAlbum = new PQ(string);

        searchForAlbum.values = args;

        return new Promise(resolve => {
            db.query(searchForAlbum)
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    console.log('ERROR:', error);
                });
        });
    }

    getAlbum(albumId) {

        let args = [];
        args.push(albumId);

        let string = `
        SELECT
            al."Name", ph."AlbumId", ph."Id", ph."Caption", ph."FilePath"
	    FROM public."Photos" ph JOIN public."Albums" al
        ON al."Id" = ph."AlbumId"
	    WHERE "AlbumId" = $1;`;

        const searchForAlbum = new PQ(string);
        searchForAlbum.values = args;

        return new Promise(resolve => {
            db.query(searchForAlbum)
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    console.log('ERROR:', error);
                });
        });
    }

}

module.exports = DatabaseService;