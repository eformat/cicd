'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/* 
use "child process" module of nodejs to execute any shell commands or scripts with in nodejs.
*/

const exec = require('child_process').exec;
  
const base_path = '';
/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  configconnection: configconnection,
  createservice: createservice,
  importservicedemo: importservicedemo,
  testingservice: testingservice,
  promotion_to_production

};

/*
  Function for running "3scale-cli config" :

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function configconnection(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var subdomain = req.swagger.params.subdomain || 'stranger';
  var access_token = req.swagger.params.access_token || 'stranger';
  var wildcard_domain = req.swagger.params.wildcard_domain || 'stranger';
  var yourscript = exec('sh '+base_path+'/cicd/scripts/create_credentials.sh', {env: {'SUBDOMAIN': subdomain},env: {'ACCESS_TOKEN': access_token},env: {'WILDCARD_DOMAIN': wildcard_domain}},
  (error, stdout, stderr) => {
      console.log(`${stdout}`);
      console.log(`${stderr}`);
      if (error !== null) {
          // this sends back a JSON response which is a single string
          res.json(`exec error: ${error}`);
          console.log(`exec error: ${error}`);
      }
      else {
        res.json('${stdout}');
      }
  });

}

/*
  Function for creating a new 3scale service, it should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function createservice(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var name = req.swagger.params.Service.value.name || 'test';
    console.log(util.inspect(req.swagger.params, {depth: null}));
    console.log ('SERVICE_NAME:'+name);
    var yourscript = exec('sh '+base_path+'/cicd/scripts/create_service.sh '+name, {env: {'SERVICE_NAME':name},env: {'NODE_TLS_REJECT_UNAUTHORIZED':'0'}},
    (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            // this sends back a JSON response which is a single string
            res.json('exec error:'+error);
            console.log('exec error:'+ error);
        }
        else {
          res.json(stdout);
        }
    });
   }


/*
  Function for importing a 3scale demo service, it should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function importservicedemo(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var name = req.swagger.params.Import.value.name;
    var access_token = req.swagger.params.Import.value.access_token;
    var apim = req.swagger.params.Import.value.apim ;  
    var swaggerDef = req.swagger.params.Import.value.swaggerDef || '/cicd/swaggers/payment_swagger.json';
    var yourscript = exec('sh '+base_path+'/cicd/scripts/import_service.sh '+name+' '+access_token+' '+apim+' '+swaggerDef, {env: {'SERVICE_NAME': name},env: {'ACCESS_TOKEN': access_token},env: {'APIM': apim},env: {'NODE_TLS_REJECT_UNAUTHORIZED':'0'}},
    (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            // this sends back a JSON response which is a single string
            res.json('exec error:'+error);
            console.log('exec error:'+ error);
        }
        else {
          res.json(stdout);
        }
    });
  
  }
/*
  Function for testing a demo service, it should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function testingservice(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var name = req.swagger.params.TestService.value.name || 'test';
    // enviroment:= (sandbox || production)
    var environment = req.swagger.params.TestService.value.environment;
    //optional define a specific endpoint to check
    var endpoint = req.swagger.params.TestService.value.endpoint;
    if (endpoint != null) {
        environment=environment+' '+endpoint;
    }
    var yourscript = exec('sh '+base_path+'/cicd/scripts/test_service.sh '+name+' '+environment , {env:  {'NODE_TLS_REJECT_UNAUTHORIZED':'0'}},
    (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            // this sends back a JSON response which is a single string
            res.json('exec error:'+error);
            console.log('exec error:'+ error);
        }
        else {
          res.json(stdout);
        }
    });

  }

  function promotion_to_production(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var name = req.swagger.params.Service.value.name;
    // enviroment:= (sandbox || production)
    var version = req.swagger.params.Service.value.version;
    //optional define a specific endpoint to check
    if (version != null) {
        name=name+' '+version;
    }
    var yourscript = exec('sh '+base_path+'/cicd/scripts/promotion_to_production.sh '+name , {env:  {'NODE_TLS_REJECT_UNAUTHORIZED':'0'}},
    (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            // this sends back a JSON response which is a single string
            res.json('exec error:'+error);
            console.log('exec error:'+ error);
        }
        else {
          res.json(stdout);
        }
    });

  }
  





  
