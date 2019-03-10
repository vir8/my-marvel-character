var PRIV_KEY = "f4ce1346ede83a3066788d456b91e8e26b41c680";//"this-should-be-a-long-hash";
var PUBLIC_KEY = "18315cca54033e51b88c61c51ca3e3a4";//"so-should-this";
var CryptoJS=require('crypto-js');
var getJSON = require('get-json')


exports.find=(function(req,res){
 // you need a new ts every request                                                                                    
 var ts = new Date().getTime();
 var hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
 
 // the api deals a lot in ids rather than just the strings you want to use
 var charName = req.body.queryResult.parameters.charName
   ? req.body.queryResult.parameters.charName:
  "Deadpool"; //Not from DC                                                                   


 var url = 'http://gateway.marvel.com:80/v1/public/characters';
   url=url+"?nameStartsWith="+charName+"&ts="+ts+"&apikey="+PUBLIC_KEY+"&hash="+hash;
 console.log(url);
 getJSON(url,function(error,response){

       console.log(error);
       //console.log(response);
       console.log(response);
    var name=response.data.results[0].name;
    var desc=response.data.results[0].description;
    var speech="Here is some description about "+name+". "+desc;
    if(response.data.results[0].description == null)
        {
            speech="You did an oopsie. Please try again.";
        }
      
       console.log(desc);
       let response1=" ";
    let r={

     "fulfillmentText":speech,
     "fulfillmentMessages":[{"text":{"text": [speech]}}],
     "source":""

    };
      return res.json(r);
    
   });

});

