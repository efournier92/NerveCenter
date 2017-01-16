re('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET',
      userProperty: 'payload'
});
