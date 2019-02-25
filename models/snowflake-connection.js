'use strict';

const Snowflake = require('snowflake-promise').Snowflake;
const dateFormat = require('dateformat');
const sprintf = require('sprintf-js').sprintf;

const QUERIES = require('../models/queries');

const sflakeConn = new Snowflake({
    account: 'test',
    username: 'test',
    password: 'test',
    warehouse: 'test',
});

async function getConnection() {
    try {
        await sflakeConn.connect();
        console.log('connected');
        return true;
    } catch (ex) {
        // @todo make it better..
        console.log('already connected');
        return false;
    }
}

function getCountsByCountryCity(type, Rank, StreamOrListners) {
    return new Promise(function(resolve, reject) {
        getConnection().then(function() {
            var end = new Date();
            var start = new Date().setDate(end.getDate() - 7); // weeks start

            var query =  QUERIES.CountsByCountryQuery;
            if (type == 'city') {
                query = QUERIES.CountsByCityQuery;
            }
            var query = sprintf(query, {
                start_date: dateFormat(start, 'yyyy-mm-dd'),
                end_date: dateFormat(end, 'yyyy-mm-dd'),
                offset: parseInt(Rank)-1,
                counts_select: QUERIES.StreamsNumber
            });
            console.log(query);
            sflakeConn.execute(query).then(function(rows) {
                console.log('Number of rows produced: ' + rows.length);
                console.log(rows);
                resolve(rows[0]);
                // sflakeConn.destroy();
            }).catch(function(err) {
                console.log('**ERROR**');
                console.log(err);
                reject(err);
                // connection.destroy();
            });
        });
    });
}


function getCountsInCityByCountry(country, rank, streamOrListners) {
    return new Promise(function(resolve, reject) {
        getConnection().then(function() {
            var end = new Date();
            var start = new Date().setDate(end.getDate() - 7); // weeks start

            var query = sprintf(QUERIES.CountInCities, {
                start_date: dateFormat(start, 'yyyy-mm-dd'),
                end_date: dateFormat(end, 'yyyy-mm-dd'),
                offset: parseInt(rank)-1,
                counts_select: QUERIES.StreamsNumber,
                country: country
            });
            console.log(query);
            sflakeConn.execute(query).then(function(rows) {
                console.log('Number of rows produced: ' + rows.length);
                console.log(rows);
                if (rows.length > 0) {
                    resolve(rows[0]);
                } else {
                    resolve(false);
                }
            }).catch(function(err) {
                console.log('**ERROR**');
                console.log(err);
                reject(err);
            });
        });
    });
}

function getArtistInCountry(country) {
    return new Promise(function(resolve, reject) {
        getConnection().then(function() {
            var end = new Date();
            var start = new Date().setDate(end.getDate() - 7); // weeks start
            var and_where = '';
            if (country != null) {
                and_where = sprintf(QUERIES.WhereCountryCode, {country: country})
            }

            var query = sprintf(QUERIES.ArtistInCountry, {
                start_date: dateFormat(start, 'yyyy-mm-dd'),
                end_date: dateFormat(end, 'yyyy-mm-dd'),
                and_where: and_where
            });
            console.log(query);
            sflakeConn.execute(query).then(function(rows) {
                console.log('Number of rows produced: ' + rows.length);
                console.log(rows);
                if (rows.length > 0) {
                    resolve(rows[0]);
                } else {
                    resolve(false);
                }
            }).catch(function(err) {
                console.log('**ERROR**');
                console.log(err);
                reject(err);
            });
        });
    });
}


function getTopArtistTrack(artistName) {
    return new Promise(function(resolve, reject) {
        getConnection().then(function() {
            var query = 'SELECT trackname, artistname, total_streams, growth_percentage \
			FROM facts.prod.MOBILE_TOP_TRACKS \
			WHERE artistname ilike :1 \
			ORDER BY total_streams DESC \
			LIMIT 1;';

            sflakeConn.execute(query, [artistName]).then(function(rows) {
                console.log('Number of rows produced: ' + rows.length);
                // console.log(rows);
                resolve(rows[0]);
                // sflakeConn.destroy();
            }).catch(function(err) {
                console.log(err);
                reject(err);
                // connection.destroy();
            });
        });
    });
}




module.exports = {
    getCountsByCountryCity: getCountsByCountryCity,
    getCountsInCityByCountry: getCountsInCityByCountry,
    getTopArtistTrack: getTopArtistTrack,
    getArtistInCountry: getArtistInCountry,
};