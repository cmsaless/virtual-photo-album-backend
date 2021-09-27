var pgp = require('pg-promise')(/* options */);
var db = pgp('postgres://postgres:postgresql@localhost:5432/VirtualPhotoAlbum');
const {ParameterizedQuery: PQ} = require('pg-promise');

class DatabaseService {

    searchForAlbum(name, city, state, country, firstDate, lastDate) {

        const minDate = new Date(-130000000000000);
        const maxDate = new Date(130000000000000);

        if (typeof firstDate === "undefined") { firstDate = minDate; }
        if (typeof lastDate === "undefined") { lastDate = maxDate; }

        let args = [name, city, state, country, firstDate, lastDate];

        const searchForAlbum = new PQ(`
            SELECT 
                "Name",
                "Id",
                "CreationDate",
                "City",
                "State",
                "Country" 
            FROM public."Albums" 
            WHERE 
                ("Name" LIKE '%$1::text%' AND $1::text != '' AND $1::text != null)  
                OR ("City" LIKE '%$2::text%' AND $2::text != '' AND $2::text != null)
	            OR ("State" LIKE '%$3::text%' AND $3::text != '' AND $3::text != null)
	            OR ("Country" LIKE '%$4::text%' AND $4::text != '' AND $4::text != null)
	            OR ("CreationDate" >= $5::date AND "CreationDate" <= $6::date)`);

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


/**
 * OR
	                ("City" LIKE '%$2%' AND '$2' != '' AND '$2' != null) OR
	                ("State" LIKE '%$3%' AND '$3' != '' AND '$3' != null) OR
	                ("Country" LIKE '%$4%' AND '$4' != '' AND '$4' != null) OR
	                ("CreationDate" >= $5 AND "CreationDate" <= $6);
 */