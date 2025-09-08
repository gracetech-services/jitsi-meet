/* eslint-disable */
var config;

config.bosh = 'https://m.fishmeet.top/' + 'http-bind';
config.websocket = 'wss://m.fishmeet.top/' + 'xmpp-websocket';

//for local testing, fishmeet files are not copied to the root
config.defaultLogoUrl = 'fishmeet/fishmeet.jpg';
interfaceConfig.DEFAULT_LOGO_URL = 'fishmeet/fishmeet.jpg';
config.welcomePage = { ...config.welcomePage,
    customUrl: '/fishmeet/fishmeet-Welcome.html'
};

config.hosts.muc = 'muc.meet.jitsi';
config.hosts.domain = 'meet.jitsi';
config.hosts.authdomain = 'meet.jitsi';


