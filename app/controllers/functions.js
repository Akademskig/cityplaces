var renderPlaces=function(data,index){
    var opened;
    var attribution;
    var dataJson=data;
    if(typeof data != 'object'){
        dataJson=JSON.parse(data)
    }
    
    console.log(data.results)
    var places=dataJson.results;
    var photosKey='AIzaSyBXLMrmKqkc4CJijlW73FHU3hoAsGOyws0'
    
    places.forEach(function(place,i){
        
        i=i+index
        if(place.opening_hours != undefined){
            opened=(place.opening_hours.open_now==true)? 'yes :)':'no :(';
        }
        
        else{
            opened='unknown';
        }
        var photo='';
        if(place.photos){
            attribution=place.photos[0].html_attributions;
            photo='https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference='+place.photos[0].photo_reference+'&key='+photosKey;
        }
        else{
            attribution=""
        }
        
        var lat=place.geometry.location.lat
        var long=place.geometry.location.lng
        
        $('.results-list').append('<div class=\'row place\'><div class=\'position noDisplay\'><p id=\'lat\'>'+lat+'</p><p id=\'long\'>'+long+'</p></div><div class=\'col-md-6 info\'><p class=\'name '+i+'\'>'+place.name+'</p><p class=\'address\'>'+
        place.vicinity+'</p><div class=\'opened \'>Opened: '+opened+'</div><img class=\'icon\'src=\'' +
        place.icon+'\'><p id="details'+i+'" class="detailsH">Details</p><ul class="det details'+i+'"></ul></div><div class=\'col-md-6\'><p class=\'photo\'><img src='+photo+'></img><br/>'+attribution+'</p><div class="going going'+i+'"><button id="going"class="">Going</button></div></div></div>')
        
        var goingData={'place': place.name, 'placeId': place.place_id}
        
            $('.going'+i).on('click',function(){
                if(!$(this).children().hasClass("active")){
                    
                    $.post('nightlife/going',goingData,function(data){
                       if(typeof data == 'string'){
                           alert(data)
                           return
                       }
                       $('.going'+i).children().addClass("active")
                    })
                }else{
                    $(this).children().removeClass("active")
                    $.post('nightlife/removeGoing',goingData,function(data){
                    
                })
               
            }
        })
        
         $('.name.'+i).on('click',function(){
           $('.map').fadeIn('slow');
           var showLocMap=new ShowLocMap(lat,long,place.name);
           
        })
        
        
        $('#details'+i).on('click',function(){
            if($('.details'+i).is(':empty')){
                var detailsUrl={url:'https://maps.googleapis.com/maps/api/place/details/json?placeid='+place.place_id+'&key=AIzaSyBsEIashHje_Mirls38eHsplMXbdrxaFLI'}
                $.post('/nightlife/details',detailsUrl,function(data){
                    console.log(data)
                    if(data.status=='OK' && data.result.opening_hours){
                       $('.details'+i).html("<p class='opened' style='border-bottom: solid 1px black'>Opened: </p>")
                       
                       data.result.opening_hours.weekday_text.forEach(function(val){
                           $('.details'+i).append("<li>"+val+"</li>")
                       })
                   }
                   else{
                       $('.details'+i).html("<p>No details found</p>")
                   }
                   $('.details'+i).append("<a href="+data.result.url+"><p style='color:purple; margin-top:10px'>See on map</p></a>")
                })
            }
            else{
                $('.details'+i).toggle()
            }
        })
        
        if(i==places.length-1){
            $('.more').html('<div id="more">More</div>');
            $('.more').on('click',function(){
                
                if(data.next_page_token){
                    var placesNextUrl='https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken='+data.next_page_token+'&key=AIzaSyAJRnPCMCZ9ViyoX36Ijvho3DCTEv3QVI0'
                    $.get(placesNextUrl, function(data){
                        i++;
                        renderPlaces(data, i);
                    })
                }
            })
        }
    })
    return
}

function renderDb(data){
    data.forEach(function(item,i){
        console.log(item)
        var detailsUrl='https://maps.googleapis.com/maps/api/place/details/json?placeid='+item.placeID+'&key=AIzaSyBsEIashHje_Mirls38eHsplMXbdrxaFLI'
        $('.results-list').append('<div class=\'row place place-'+i+'\'><div class=\'col-md-7 info\'><p class=\'name '+i+'\'>'+item.placeName+'</p><p class="det details'+i+'"></p></div><div class="numPpl col-md-4"><p class=\'numOPpl\'>People going: '+
     item.numberOfPpl+'</p></div>')
     
    
     $('.name.'+i).on('click',function(){
         var detailsUrl={url:'https://maps.googleapis.com/maps/api/place/details/json?placeid='+item.placeID+'&key=AIzaSyBsEIashHje_Mirls38eHsplMXbdrxaFLI'}
         if($('.details'+i).is(':empty')){
        $.post('/nightlife/details',detailsUrl,function(data){
            if(data.status=='OK' && data.result.opening_hours){
                       $('.details'+i).html("<p class='opened' style='border-bottom: solid 1px black'>Opened: </p>")
                       
                       data.result.opening_hours.weekday_text.forEach(function(val){
                           $('.details'+i).append("<li>"+val+"</li>")
                       })
                   }
                   else{
                       $('.details'+i).html("<p>No details found</p>")
                   }
                   $('.details'+i).append("<a href="+data.result.url+"><p style='color:purple; margin-top:10px'>See on map</p></a>")
        })
    }
     else{
         $('.details'+i).toggle()
     }
  })
  

  
  if($('.my').hasClass('active')){
      $('.place-'+i).append('<div class="col-md-1"><button class="remove-'+i+'">X</button></div>')
  }
  $('.remove-'+i).on('click',function(){
      
      var removeData={placeId:item.placeID}
      console.log(removeData)
      $.post('/nightlife/removeGoing',removeData,function(data){
          
      })
      $(this).parent().parent().remove();
  })
    })
}

function renderMyPlaces(data){
    data.forEach(function(item,i){
        $('.results-list').append('<div class=\'place place-'+i+'\'><div class=\'info\'><p class=\'name '+i+'\'>'+item.placeName+'</p><p class=\'address '+i+'\'>'+item.address+'</p><p class=\'addInfo '+i+'\'>'+item.addInfo+'</p></div></div>')
    })
}

function ShowLocMap(lat,long,place){
    this.lat=lat
    this.long=long
    
    var place=place 
    this.loc = {lat: this.lat, lng: this.long};
    console.log(typeof place)
     var map = new google.maps.Map(document.getElementById('map'), {
    center: this.loc,
    zoom: 15
    });
    
    if(typeof place == 'string'){
        this.marker = new google.maps.Marker({
        map: map,
        position: this.loc
        });
    
        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(this.marker, 'click', function() {
            infowindow.setContent(place);
            infowindow.open(this.map, this);
        });
    }
    else{
         place.forEach(function(place){
             console.log(place)
             createMarker(place);
         })
    }
    
    function createMarker(place) {
        var placeLoc = place.geometry.location;
        console.log(placeLoc)
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });
        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });
    }
}

function getMap() {
      var map;
     
      var loc={lat:15.5555,lng:20.55555}
      map = new google.maps.Map(document.getElementById('map'), {
          center: loc,
          zoom: 15
      })
        
}

