var pgp = require('pg-promise')(/* options */)
var db = pgp('postgres://postgres:postgresql@localhost:5432/VirtualPhotoAlbum')

class DatabaseService {

    searchForAlbum() {
        return new Promise(resolve => {
            db.query(`SELECT * FROM "Albums"`)
            .then((data) => {
                console.log('DATA:', data[0])
                resolve(data)
            })
            .catch((error) => {
                console.log('ERROR:', error)
            });
        });
    }
}

module.exports = DatabaseService;
