var renderPlaces=function(data){
    var opened;
    var attribution;
    //console.log(data.places.results)
    var places=data.places.results;
    var photos=data.photos;
    $('.results-list').empty();
    places.forEach(function(place,i){
        if(place.opening_hours != undefined){
            opened=(place.opening_hours.open_now==true)? 'yes :)':'no :(';
        }
        else{
            opened='unknown';
        }
        if(place.photos){
            attribution=place.photos[0].html_attributions;
        }
        else{
            attribution=""
        }
        var photo='';
        
        photos.forEach(function(val,j){
            if(val.index==i){
                photo='<img src=\''+ val.link+'\'>';
            }
        })
        
        var lat=place.geometry.location.lat 
        var long=place.geometry.location.lng
        
        var nameEle=document.createElement('p')
        nameEle.className="name";
        var text=document.createTextNode(place.name);
        nameEle.appendChild(text);
        
        var showMap=function(lat,long){
            $('#map').removeClass('noDisplay');
            initMap(lat,long)
        }
                        
        $('.results-list').append('<div class=\'row place\'><div class=\'position noDisplay\'><p id=\'lat\'>'+lat+'</p><p id=\'long\'>'+long+'</p></div><div class=\'col-md-6 info\'><p class=\'name '+i+'\'>'+place.name+'</p><p class=\'address\'>'+
        place.vicinity+'</p><div class=\'opened \'>Opened: '+opened+'</div><img class=\'icon\'src=\'' +
        place.icon+'\'><a href=\'/nightlife/loc/details/'+place.place_id+' \'><p>Details</p></a></div><div class=\'col-md-6\'><p class=\'photo\'>'+photo+'<br/>'+attribution+'</p></div></div>')
        
         $('.name.'+i).on('click',function(){
           this.lat=lat;
           this.long=long;
           
           $('.map').fadeIn('slow');
           initMap(this.lat,this.long, 15);
       
        })
    
    })
    return
}

function renderDb(data){
    $('.container-3').html('<div class=\'results-list\'></div>')
    data.forEach(function(item,i){
        var photo='<img src=\''+ item.photoRef+'\'>';
        console.log(item.address)
        $('.results-list').append('<div class=\'row place\'><div class=\'position noDisplay\'><p id=\'lat\'>'+item.lat+'</p><p id=\'long\'>'+item.long+'</p></div><div class=\'col-md-6 info\'><p class=\'name '+i+'\'>'+item.placeName+'</p><p class=\'address\'>'+
     item.address+'</p><a href=\'/nightlife/loc/details/'+item.placeId+' \'><p>Details</p></a></div><div class=\'col-md-6\'><p class=\'photo\'>'+photo+'<br/>'+item.attribution+'</p></div></div>')
     
     var lat=Number(item.coordinates.lat)
     var long=Number(item.coordinates.long)
     $('.name.'+i).on('click',function(){
        this.lat=lat;
        console.log(this.lat)
        this.long=long;
           
       $('.map').fadeIn('slow');
        initMap(this.lat,this.long, 15);
    })
  })
    
     
}

function initMap(lat,long,zoom) {
            var location = {
                 lat: lat, lng: long
                };
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: zoom,
                center: location
            });
            var marker = new google.maps.Marker({
            position: location,
            map: map
            }); 
        /*})
    }*/
}

var getData=function(data){
    console.log(data)
}