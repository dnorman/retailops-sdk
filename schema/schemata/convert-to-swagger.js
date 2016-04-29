const fs = require('fs');

var infile = process.argv[2];
var m = infile.match('(.*)\.json');

var outfile = m[1] + '-swagger.json';

console.log('Converting',infile,'to',outfile);

var inbuffer = fs.readFileSync(infile);
var schema_in = JSON.parse(inbuffer);

console.log(schema_in);

var schema_out = {
    "swagger": "2.0",
    "info": {
        "title": "RetailOps Channel Webhook Integration Method",
        "description": "Integrate a sales channel with RetailOps",
        "version": "1.0.0"
    },
    "host": "your.servername-here.com",
    "schemes": [
        "https","http"
    ],
    "basePath": "/",
    "produces": [
        "application/json"
    ],
    "paths": {
        "/catalog_get_config": {
        }
    },
    "definitions": JSON.parse(JSON.stringify(schema_in.definitions))
};

var defs = schema_out.definitions;

if(schema_in.links instanceof Array){
    schema_in.links.forEach(function(link){
        if (!link.href || !link.method) return;

        var reqname = "RequestBody-" + link.href.replace('/','').toLowerCase();
        var resname = "ResponseBody-" + link.href.replace('/','').toLowerCase();

        var ref = {};
        ref[ link.method.toLowerCase() ] = {
            "summary": link.title,
            "description": link.description,
            "parameters": [
                {
                    "name": "offset",
                    "in": "body",
                    "name": "body",
                    "description": "request body.",
                    "schema": {
                        "$ref": "#/definitions/" + reqname
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "",
                    "schema": {
                        "$ref": "#/definitions/" + resname
                    }
                }
            },
            tags: [],
        };

        // TODO test to make sure these exist
        defs[reqname] = link.schema;
        defs[resname] = link.targetSchema;

        schema_out.paths[link.href] = ref;
    });
}

fs.writeFileSync(outfile,JSON.stringify(schema_out,null, 4));
