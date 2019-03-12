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
    console.log(response);
    if(!response.data.results[0])
        {
            speech="The character is not recognised please try again.";
            let r={

              "fulfillmentText":speech,
              "fulfillmentMessages":[{"text":{"text": [speech]}}],
              "source":""
         
             };
               return res.json(r);

        }
  else{
    var name=response.data.results[0].name;
    var desc=response.data.results[0].description;
    var speech=/*"Here is some description about "+name+". "+*/desc;
    var img=response.data.results[0].thumbnail.path + "." +response.data.results[0].thumbnail.extension;
    var profile="";
    for(var t in response.data.results[0].urls){
    if(response.data.results[0].urls[t].type =="wiki")
    profile=response.data.results[0].urls[t].url;
    console.log(t);
    }
      
      
    let r={

     "fulfillmentText":speech,
     "fulfillmentMessages":[  {"card": {
      "title": name,
      "subtitle": "",
      "imageUri": img,
      "buttons": [
        {
          "text": "button text",
          "postback": "https://assistant.google.com/"
        }
      ]
     
     }
  }],
     "source":"https://my-marvel-api.herokuapp.com/api/search"

    };

    let s={
      
        "payload": {
          "google": {
            "expectUserResponse": false,
            "richResponse": {
              "items": [
                {
                  "simpleResponse": {
                    "textToSpeech": "Here is some description about "+name + ". "+desc
                  }
                },
                {
                  "basicCard": {
                    "title": name,
                    "subtitle": "Information found on Marvel",
                    "formattedText": speech,
                    "image": {
                      "url": img,
                      "accessibilityText": "MARVEL"
                    },
                    "buttons": [
                      {
                        "title": "Wiki",
                        "openUrlAction": {
                          "url": profile
                        }
                      }
                    ],
                    "imageDisplayOptions": "CROPPED"
                  }
                }
              ]
            }
          }
        }
      };
      return res.json(s);
  }
   });

});




















