'use strict';

module.exports = {
    // todo make these random.
    launch: 'Hello! You can start by asking "which country has highest listeners or which city has the most number of streams?".',
    invalidRank: 'Sorry, I dont know this rank. Try asking highest, second highest up to fifth highest stream.',
    invalidGroup: 'Sorry, I dont know this. Try asking highest streams or highest listeners.',
    invalidCountry: 'Sorry, I dont know this country.',

    NoDataFound: 'No data found, maybe try some other request.',

    successByCountry: 'Country with %(rank)s streams is %(region)s. It got %(count)s streams in last seven days.',
    successByCity: 'City with %(rank)s streams is %(region)s. It got %(count)s streams, in last seven days.',
    successInCityByCountry: '%(region)s in %(country)s has %(rank)s streams. It got %(count)s streams in last seven days.',
    successArtistByCountry: '%(country)s the most popular artist is %(artist)s, with %(count)s streams in last seven days.',
};