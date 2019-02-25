'use strict';

var ListenersNumber = 'hll_estimate(hll_combine(hll_import(hll_users_variant)))';
var StreamsNumber = 'SUM(streams)';

var CountsByCountryQuery = 'SELECT \
        territory_code as region, \
        %(counts_select)s  as counts \
    FROM FACTS.PROD.summary_geographics_by_label \
    WHERE download_activity_date BETWEEN \'%(start_date)s\' AND \'%(end_date)s\' \
    GROUP BY territory_code \
    ORDER BY counts DESC \
    LIMIT 1 OFFSET %(offset)u;';

var CountsByCityQuery = 'SELECT \
        orchard_region_name  as region, \
        %(counts_select)s  AS counts \
    FROM FACTS.PROD.summary_geographics_by_label \
    WHERE download_activity_date BETWEEN \'%(start_date)s\' AND \'%(end_date)s\' \
        AND orchard_region_code is not null \
    GROUP BY \
        orchard_region_name \
    ORDER BY counts DESC \
    LIMIT 1 OFFSET %(offset)u;';

var CountInCities = 'SELECT \
        orchard_region_name  as region, \
        %(counts_select)s  AS counts \
    FROM FACTS.PROD.summary_geographics_by_label \
    WHERE download_activity_date BETWEEN \'%(start_date)s\' AND \'%(end_date)s\' \
        AND territory_code ILIKE \'%(country)s\' \
        AND orchard_region_code is not null \
    GROUP BY orchard_region_name \
    ORDER BY counts DESC \
    LIMIT 1 OFFSET %(offset)u;';

var WhereCountryCode = 'AND TERRITORY_CODE ILIKE \'%(country)s\'';
var ArtistInCountry = 'SELECT ARTISTID, sum(streams) as counts \
        FROM  FACTS.PROD.SUMMARY_GEOGRAPHICS_BY_ARTIST \
        WHERE download_activity_date BETWEEN \'%(start_date)s\' AND \'%(end_date)s\' \
            %(and_where)s \
        GROUP BY ARTISTID \
        ORDER BY counts desc \
        LIMIT 1;';

var ArtistQuery = 'SELECT artistid, sum(units) as counts ' +
    'FROM facts.prod.FACT_ANALYTICS ' +
    'WHERE artistid in (915250,949798,915232) ' +
    'GROUP BY artistid ' +
    'ORDER BY sum(units) DESC LIMIT 1;';

module.exports = {
    CountsByCountryQuery: CountsByCountryQuery,
    CountsByCityQuery: CountsByCityQuery,
    CountInCities: CountInCities,
    ListenersNumber: ListenersNumber,
    StreamsNumber: StreamsNumber,
    ArtistInCountry: ArtistInCountry,
    WhereCountryCode: WhereCountryCode,
};