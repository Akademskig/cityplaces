var renderPlaces=function(data){
    var opened;
    var attribution;
    //console.log(data.places.results)
    var places=data;
    
    
    places.forEach(function(place,i){
        
        if(place.opening_hours != undefined){
            opened=(place.opening_hours.open_now==true)? 'yes :)':'no :(';
        }
        
        else{
            opened='unknown';
        }
        var photo='';
        if(place.photos){
            attribution=place.photos[0].html_attributions;
            photo=place.photos[0].getUrl({maxWidth:200, maxHeigth: 200})
        }
        else{
            attribution=""
        }
        
        if(place.photos){
            
        }
        var lat=place.geometry.location.lat() 
        var long=place.geometry.location.lng()
        
        var nameEle=document.createElement('p')
        nameEle.className="name";
        var text=document.createTextNode(place.name);
        nameEle.appendChild(text);
        
        
        $('.results-list').append('<div class=\'row place\'><div class=\'position noDisplay\'><p id=\'lat\'>'+lat+'</p><p id=\'long\'>'+long+'</p></div><div class=\'col-md-6 info\'><p class=\'name '+i+'\'>'+place.name+'</p><p class=\'address\'>'+
        place.vicinity+'</p><div class=\'opened \'>Opened: '+opened+'</div><img class=\'icon\'src=\'' +
        place.icon+'\'><a href=\'/nightlife/loc/details/'+place.place_id+' \'><p>Details</p></a></div><div class=\'col-md-6\'><p class=\'photo\'><img src='+photo+'></img><br/>'+attribution+'</p></div></div>')
        
         $('.name.'+i).on('click',function(){
           $('.map').fadeIn('slow');
           var showLocMap=new ShowLocMap(lat,long,15,place.name);
           
        })
        if(i==places.length-1){
            $('.more').html('<div id="more">More</div>');
        }
    
    })
    return
}

function renderDb(data){
    $('.container-3').html('<div class=\'results-list\'></div>')
    data.forEach(function(item,i){
        console.log(item)
        var photo='<img src=\''+ item.photoRef+'\'>';
        console.log(item.address)
        $('.results-list').append('<div class=\'row place\'><div class=\'position noDisplay\'><p id=\'lat\'>'+item.lat+'</p><p id=\'long\'>'+item.long+'</p></div><div class=\'col-md-6 info\'><p class=\'name '+i+'\'>'+item.placeName+'</p><p class=\'address\'>'+
     item.address+'</p><a href=\'/nightlife/loc/details/'+item.placeId+' \'><p>Details</p></a></div><div class=\'col-md-6\'><p class=\'photo\'>'+photo+'<br/>'+item.attribution+'</p></div></div>')
     
     var lat=Number(item.coordinates.lat)
     var long=Number(item.coordinates.long)
     $('.name.'+i).on('click',function(){
         console.log(lat)
        this.lat=lat;
        this.long=long;
           
       $('.map').fadeIn('slow');
        initMap(lat,long, 15);
    })
  })
    
     
}

function ShowLocMap(lat,long,zoom,place){
    this.lat=lat
    this.long=long
    this.zoom=zoom
    var place=place 
    this.loc = {lat: this.lat, lng: this.long};
    console.log(this.place)
    this.map = new google.maps.Map(document.getElementById('map'), {
    center: this.loc,
    zoom: this.zoom
    });
    
    
    this.marker = new google.maps.Marker({
        map: this.map,
        position: this.loc
    });
    
    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(this.marker, 'click', function() {
        infowindow.setContent(place);
        infowindow.open(this.map, this);
    });
       
 
}

function getMap(lat,long,zoom, key) {
      var map;
      var infowindow;
      var initMarker;
      
     
      initMap(lat,long,zoom,key)

      function initMap(lat,long,zoom,key) {
        var loc = {lat: lat, lng: long};

        map = new google.maps.Map(document.getElementById('map'), {
          center: loc,
          zoom: zoom
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        google.maps.places.RankBy.DISTANCE
        
        service.nearbySearch({
          location: loc,
          radius: 500,
          keyword: key
        }, callback);
      }

      function callback(results, status,pagination) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
          renderPlaces(results)
        }
        
        if (pagination.hasNextPage) {
            var moreButton = document.getElementById('more');
            
            moreButton.addEventListener('click', function() {
            renderPlaces(pagination.nextPage());
            });
           
        }
       
        
      }
      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }
}

var getData=function(data){
    console.log(data)
}