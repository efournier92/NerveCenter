app.use('/assets', express.static(__dirname + '/node_modules'));
app.use('/assets', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.listen(8080);
console.log("App listening on port 8080");

