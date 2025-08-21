/* eslint-disable */
var config;

config.hosts = {
    ...config.hosts, 
    domain: 'localhost',
    muc: 'conference.localhost'
};

config.bosh = 'http://localhost:5280/http-bind';
config.websocket = 'ws://localhost:5280/xmpp-websocket';

/*
config.hosts = 
    {
        // XMPP domain.
        domain: 'alpha.jitsi.net',

        // When using authentication, domain for guest users.
        // anonymousdomain: 'guest.example.com',

        // Domain for authenticated users. Defaults to <domain>.
        // authdomain: 'alpha.jitsi.net',

        // Focus component domain. Defaults to focus.<domain>.
        // focus: 'focus.alpha.jitsi.net',

        // XMPP MUC domain. FIXME: use XEP-0030 to discover it.
        muc: 'conference.' + 'alpha.jitsi.net',
    };
*/

config.defaultLogoUrl = 'fishmeet/fishmeet.png';
interfaceConfig.DEFAULT_LOGO_URL = 'fishmeet/fishmeet.png';
config.welcomePage = { ...config.welcomePage, 
    customUrl: '/fishmeet/fishmeet-Welcome.html'
};



