const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// adding 'pte' to the list of "allowed assets"
// so Metro knows it should just copy this file into the bundle 
// rather than trying to read it as code.
config.resolver.assetExts.push('pte');

module.exports = config;