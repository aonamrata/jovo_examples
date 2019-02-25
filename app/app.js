'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');
const MSG = require('../models/messages');
const SFLAKE = require('../models/snowflake-connection');
const sprintf = require('sprintf-js').sprintf;

const config = {
    logging: true,
};

const app = new App(config);

// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.ask(MSG.launch);
    },

    'CountsArtistByCountry': function(country) {
        var _self = this;
        console.log('\n------------------------------\n');
        console.log(country);
        var country_code = null;
        // var country_msg = '';
        if (country.id == undefined && country.value != undefined) { // not mandatory
            this.tell(MSG.invalidCountry);
        } else {
            if(country.id != undefined) {
                country_code = country.key;
                // country_msg = 'In ' + country.value;
            }

            SFLAKE.getArtistInCountry(country_code).
                then(
                    function(data) {
                        console.log('data==');
                        console.log(data);
                        if (data == false) {
                            _self.ask(MSG.NoDataFound);
                        } else {
                            var message = sprintf(MSG.successArtistByCountry, {
                                count: data['COUNTS'],
                                country: ( country.value ? 'In ' + country.value : ''),
                                artist: data['ARTISTID'],
                            });
                            _self.ask(message);
                        }
                    }, function(err) {
                        console.log('**ERROR HANDLER 22**');
                        console.log(err);
                        _self.tell('SOME ERROR 22');
                    }
                ).catch(function(err) {
                console.log('**ERROR HANDLER**');
                console.log(err);
                _self.tell('SOME ERROR');
            });
        }
    },

    'CountsInCityByCountry': function(country, rank, streamOrListners) {
        var _self = this;
        // console.log('\n------------------------------\n');
        // console.log(country);
        if (rank.id == undefined) {// user defined rank
            this.tell(MSG.invalidRank);
        } else if (streamOrListners.id == undefined) {// user defined group
            this.tell(MSG.invalidGroup);
        } else if (country.id == undefined) {// user defined group
            this.tell(MSG.invalidCountry);
        } else {
            SFLAKE.getCountsInCityByCountry(country.key, rank.key,
                streamOrListners.key).
                then(function(data) {
                    console.log('data==');
                    console.log(data);
                    var message = MSG.NoDataFound;

                    if (data != false) {
                        var message = sprintf(MSG.successInCityByCountry, {
                            rank: rank.value,
                            region: data['REGION'],
                            count: data['COUNTS'],
                            country: country.value,
                        });
                    }
                    _self.ask(message);
                });
        }
    },

    'CountsByCountry': function(rank, streamOrListners) {
        var _self = this;
        // console.log('\n------------------------------\n');
        // console.log(rank);
        try {
            if (rank.id == undefined) {// user defined rank
                this.tell(MSG.invalidRank);
            } else if (streamOrListners.id == undefined) {// user defined group
                this.tell(MSG.invalidGroup);
            } else {
                SFLAKE.getCountsByCountryCity('country', rank.key,
                    streamOrListners.key).
                    then(function(data) {
                        console.log('data==');
                        console.log(data);
                        var message = sprintf(MSG.successByCountry, {
                            rank: rank.value,
                            region: data['REGION'],
                            count: data['COUNTS'],
                        });
                        _self.ask(message);
                    });
            }
        } catch (e) {
            console.log('**ERROR APP**');
            console.log(e);
            _self.tell('ERROR IT');
        }
    },

    'CountsByCity': function(rank, streamOrListners) {
        var _self = this;
        // console.log('\n------------------------------\n');
        // console.log(rank);
        try {
            if (rank.id == undefined) {// user defined rank
                this.tell(MSG.invalidRank);
            } else if (streamOrListners.id == undefined) {// user defined group
                this.tell(MSG.invalidGroup);
            } else {
                SFLAKE.getCountsByCountryCity('city', rank.key,
                    streamOrListners.key).
                    then(function(data) {
                        console.log('data==');
                        console.log(data);
                        var message = sprintf(MSG.successByCity, {
                            rank: rank.value,
                            region: data['REGION'],
                            count: data['COUNTS'],
                        });
                        _self.ask(message);
                    });
            }
        } catch (e) {
            console.log('**ERROR APP**');
            console.log(e);
            _self.tell('ERROR IT');
        }
    },

    'Unhandled': function() {
        this.toIntent('LAUNCH');
    },

    'END': function() {
        let reason = this.getEndReason();
        console.log("\n---------------------------------------\n");
        console.log("Reason=" + reason);
        // Triggered when a session ends abrupty or with AMAZON.StopIntent
        this.tell('catch you later, bye.');
    },
});

module.exports.app = app;
