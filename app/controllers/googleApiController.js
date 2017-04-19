$(document).ready(function(){
    var lat;
    var long;
    
    if(navigator.geolocation){
        
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("position:"+position)
            lat=position.coords.latitude;
            long= position.coords.longitude;
            var city;
            var cityID;
            var cityName;
        })
    }
            var LOC_API_KEY='7701a8bdadb391afeedd037116f2cb2b'
            var call1= 'https://geoip-db.com/json/geoip.php?jsonp=?';
           
             $.getJSON(call1, function(json) {
                 $('.location').html(json.city + ', '+ json.country_name)
                    city=json.city + ','+ json.country_code;
                    cityName=json.city;
                    lat=json.latitude;
                    long=json.longitude;
                    
                    var getCityID='https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/find?q='+city+'&type=like&appid='+LOC_API_KEY;
                    $.getJSON(getCityID, function(data){
                        cityID=data.list[0].id
                    })
            })
                 
               
              var keyword="&keyword=";
              var distance=500;
            var message;
            $('.getLocation').on('click', function() {
               
               $('.container-3').html('<div class=\'results-list\'></div>')
              
                if($('#keyword').val() !='' && $('#keyword').val() != null){
                    keyword='&keyword='+$('#keyword').val();
                    console.log("true")
                }
                console.log(keyword)
                if(!isNaN(Number($('#distance').val())) && Number($('#distance').val()) !=0){
                    
                    distance=Number($('#distance').val());
                }
                var placesUrl={url:'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+long+'&radius='+distance+keyword+'&key=AIzaSyAJRnPCMCZ9ViyoX36Ijvho3DCTEv3QVI0'};
                
                $.post('/nightlife/loc',placesUrl, function(data){
                    if(data.status= "OVER_QUERY_LIMIT"){
                        message='<p style="text-align:center; padding:5px">No data available</p>'
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
            
            $('.showMap').on('click',function(){
                if($('.container-3').is(':empty') || $('.container-3').html()== message){
                     
                     $('.map').fadeIn('slow')
                    var showLocMap=new ShowLocMap(lat,long,'Your location');
                }
              
            })
           
        
    
    $('#city').on('click', function() {
        $('h1').removeClass('anim')
    })
    
    $('.hide').on('click',function(){
        $('.map').fadeOut('slow');
    })
    var location;
    $('#location').on('input',function(){
        
        location=$('#location').val()
    })
    
   
    
    $('#submit').on('click',function(){
        
        if($('#keyword').val()){
        keyword=$('#keyword').val();
    }
        $.post('/dbSearch',{'city':location, 'keyword':keyword},function(data){
            console.log(typeof data)
            if(typeof data== 'string'){
               $('#location').val(data) 
               $('#location').addClass('error')
               return
            }
            $('#location').on('click',function(){
                this.val('');
                this.removeClass('error')
            })
            console.log(data)
            renderDb(data)
       })
    })
    
})



   


  


