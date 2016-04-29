const fs = require('fs');

var infile = process.argv[2];
var m = infile.match('(.*)\.json');

var outfile = m[1] + '-swagger.json';

console.log('Converting',infile,'to',outfile);

var inbuffer = fs.readFileSync(infile);
var schema_in = JSON.parse(inbuffer);

//console.log(schema_in);

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
    "definitions": {}
};

var defs = schema_out.definitions;

if(schema_in.links instanceof Array){
    schema_in.links.forEach(function(link){
        if (!link.href || !link.method) return;

        var reqname = "RequestBody" + link.href.replace('/','').toLowerCase();
        var resname = "ResponseBody" + link.href.replace('/','').toLowerCase();

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
        traverseDefs("#/definitions/" + reqname);
        traverseDefs("#/definitions/" + resname);

        schema_out.paths[link.href] = ref;
    });
}

function traverseDefs (ref){
    var parts = ref.match('(.*?)#/(.*)');
    var file = parts[1];
    var path = parts[2];
    console.log('traverseDefs', ref, '->', 'file:', file || '.', 'path:', path );

    if(file ==''){
        var value = walkRefRead(schema_in,path); // read definition from input file

        // process nested refs for inclusion
        if(typeof value['parameters'] == 'object'){
            Object.keys(value['parameters']).forEach(function(key) {
                if (value["parameters"][key]["$ref"]) traverseDefs(value["parameters"][key]["$ref"]);
            });
        }

        // write definition to output file
        // TODO: fully translate path. don't just take it verbatim
        walkRefWrite(schema_out,path,value);
    }else {
        throw "TODO: handle file paths";
    }
}

// TODO: these should propably be loops, not recursive
function walkRefRead (obj,path){
    var pathparts = path.split('/');
    if(typeof obj != 'object') return undefined;
    if(pathparts.length = 1){
        return obj[pathparts[0]];
    }else {
        return walkRefRead(obj[pathparts.shift()],pathparts.join('/'))
    }
}
function walkRefWrite (obj,path,setvalue){
    var pathparts = path.split('/');
    if(typeof obj != 'object') return undefined;
    if(pathparts.length = 1){
        obj[pathparts[0]] = setvalue;
        return true;
    }else {
        return walkRefWrite(obj[pathparts.shift()],pathparts.join('/'),setvalue)
    }
}

fs.writeFileSync(outfile,JSON.stringify(schema_out,null, 4));
