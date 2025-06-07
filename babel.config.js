module.exports = {
    presets: [ 'module:@react-native/babel-preset' ],
    env: {
        production: {
            plugins: [ 'react-native-paper/babel' ]
        }
    },
    plugins: [
        'optional-require',
        [ '@babel/plugin-transform-private-methods', { loose: true } ],
        [ '@babel/plugin-transform-flow-strip-types' ]
    ]
};
