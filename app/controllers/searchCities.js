function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13
        });

        var input = document.getElementById('location');

        var autocomplete = new google.maps.places.Autocomplete(input);
        //autocomplete.bindTo('bounds', map);

       
        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        
        autocomplete.addListener('place_changed', function() {
          infowindow.close();
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            return;
          }
          
          var keyword="&keyword=";
          var message;
          var lat=place.geometry.location.lat();
          var long=place.geometry.location.lng();
          $('#submit').on('click', function() {
               
               $('.container-3').html('<div class=\'results-list\'></div>')
              
                if($('#keyword').val() !='' && $('#keyword').val() != null){
                    keyword='&keyword='+$('#keyword').val();
                    
                }
            var placesUrl={url:'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+long+keyword+'&rankby=distance&key=AIzaSyAJRnPCMCZ9ViyoX36Ijvho3DCTEv3QVI0'};
            console.log(keyword)
            $.post('/nightlife/loc',placesUrl, function(data){
                    
                    data=JSON.parse(data)
                    if(data.status=== "OVER_QUERY_LIMIT"){
                        message ="<p style=\"text-align:center; padding:5px\">No data available</p>"
                        console.log(message)
                        $('.container-3').html(message)
                        return
                    }
                    renderPlaces(data, 0)
                    
                    $('.showMap').on('click',function(){
                        $('.map').fadeIn('slow')
                        var showLocMap=new ShowLocMap(lat,long,data.results);
                    })
                })
          
          })
          

        });
      }
     $('.hide').on('click',function(){
        $('.map').fadeOut('slow');
    })