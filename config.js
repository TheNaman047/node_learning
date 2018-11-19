/**
 * Create and export Configuration Variables
 * 
 */

// Container for all the environment
var environments = {};

// Staging (default) environment
environments.staging = {
    'port': 3000,
    'env': 'staging'
};

// Production environment
environments.production = {
    'port': 5000,
    'env': 'production'
};

// Determining which environment was passed as a command-line argument
console.log("node env", process.env.NODE_ENV);
var currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default is staging
var environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;