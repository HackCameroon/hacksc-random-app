const request = require('request');
const http = require('http');
const url = require('url');
const datahandler = require('./datahandler.js');
const geo = require('./geology.js');

exports.Server = class {
    constructor(port) {
        this.port = port;

        http.createServer((req, res) => {
            // console.log(req)

            // res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
            // res.setHeader("Access-Control-Allow-Origin", "*");

            
            if (req.method && req.method==='GET'){
                // res.end(JSON.stringify({"result":"Some data", "method":req.method, "URL": req.url}))

                const events = new datahandler.DataHandler("./location.json").retrieve();

                if (req.url==='/'){
                    res.end(JSON.stringify({"data": events.retrieve()}));
                }
                else if (url.parse(req.url).pathname && url.parse(req.url).pathname==='/query_event'){
                    var params = new URLSearchParams(url.parse(req.url).query);
                    
                    console.log(params)
                    // console.log(params.get('delta_time'),params.get('latitude'))
                    var filtered_events = events;
                    if (params.get('delta_time') && eval(params.get('delta_time'))>=0.0){
                        // var delta_time = params.get('delta_time');
                        // filtered_events.forEach(event => {
                        //     var current_time = new Date().getTime();
                        //     var delta_time = eval(params.get('delta_time'))
                        //     console.log(eval(event.start_time) , current_time+delta_time , 
                        //      eval(event.end_time), event.start_time <= current_time+delta_time , 
                        //      current_time + delta_time <= eval(event.end_time));
                        // });
                        filtered_events = filtered_events.filter((event) => {
                            var current_time = new Date().getTime();
                            var delta_time = eval(params.get('delta_time'))
                            return eval(event.start_time) <= current_time+delta_time && current_time + delta_time <= eval(event.end_time);
                        }
                        );
                    }
                    if (params.get('keyword')){
                        filtered_events = filtered_events.filter(event => {
                            var pattern = params.get('keyword').toLowerCase()
                            if (pattern.match(/\/.*\/|\.|\*|\?|\+/)){ // imprecise query
                                return event.description.toLowerCase().match(eval(pattern))
                            }
                            else{
                                return event.description.toLowerCase().match(pattern)
                            }
                        })
                    }
                    if (params.get('distance_delta') && params.get('longitude') && params.get('latitude') && eval(params.get('distance_delta'))>0.0){
                        filtered_events = filtered_events.filter((event) => (new geo.Geology()).distanceInKmBetweenEarthCoordinates(
                            eval(event.location.latitude), eval(event.location.longitude), 
                            eval(params.get('latitude')), eval(params.get('longitude')))<= eval(params.get('distance_delta')));
                    }
                    res.end(JSON.stringify(
                        {"count": filtered_events.length, "data": filtered_events, "url": url.parse(req.url)}
                        ));
                }
                else{
                    res.end("No Data");
                }
            }
            else if (req.method && req.method==='POST'){
                var body = ''
                req.on('data', (data) => {
                    body += data
                })
                req.on('end', () => {
                    // res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(JSON.stringify({"result":"Some data", "method":req.method, "content": body}))
                })
                
            }
        }).listen(this.port);
    }

}