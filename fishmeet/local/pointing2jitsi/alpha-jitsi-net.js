/* eslint-disable */
var config;

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

    // BOSH URL. FIXME: use XEP-0156 to discover it.
config.bosh = '//alpha.jitsi.net/' + 'http-bind';

    // Websocket URL
config.websocket = 'wss://alpha.jitsi.net/' + 'xmpp-websocket';

//config.welcomePage = { ...config.welcomePage, 
//    customUrl: '' // '/fishmeet/fishmeet-Welcome.html'
//};

//for local testing, fishmeet files are not copied to the root
config.defaultLogoUrl = 'fishmeet/fishmeet.png';
interfaceConfig.DEFAULT_LOGO_URL = 'fishmeet/fishmeet.png';


