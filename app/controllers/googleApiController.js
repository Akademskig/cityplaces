$(document).ready(function(){
    
     
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position)
            var lat=position.coords.latitude;
            var long= position.coords.longitude;
            var city;
            var cityID;
            var cityName;
            
            var LOC_API_KEY='7701a8bdadb391afeedd037116f2cb2b'
            var call1= 'https://geoip-db.com/json/geoip.php?jsonp=?';
           
             $.getJSON(call1, function(json) {
                 $('.location').html(json.city + ', '+ json.country_name)
                    city=json.city + ','+ json.country_code;
                    cityName=json.city;
                    var getCityID='https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/find?q='+city+'&type=like&appid='+LOC_API_KEY;
                    $.getJSON(getCityID, function(data){
                        cityID=data.list[0].id
                    })
            })
                    
            /*   location.country_name, location.state, location.latitude, location.longitude, location.IPv4;
                 
                    */
             
            $('.getLocation').on('click', function() {
               var keyword=null;
                if($('#keyword').val() !=null){
                    keyword=$('#keyword').val();
                }
                console.log(cityID)
                var reqData={'location': lat + ','+long, 'keyword': keyword, 'city': city, 'cityId':cityID, 'cityName':cityName};
                $('.container-3').html('<div class=\'results-list\'></div>')
                $.post('/nightlife/loc/',{reqData},function(data){
                    console.log(data)
                    
                    if(data.places.error_message){
                        $('.results-list').html('No data found')
                        return
                    }
                    renderPlaces(data)
                    
                })
            })
            
            //--------SHOW-HIDE MAP------------
            $('.showMap').on('click',function(){
                 $('.map').fadeIn('slow')
                 initMap(lat,long,15);
                    
            })
             $('body').dblclick(function(){
                 $('.map').fadeOut('slow')
            })
            $('.showMap').click(function(){
                event.stopPropagation();
            })
            $('.map').click(function(){
                event.stopPropagation();
            })
            $('.info .name').click(function(){
                event.stopPropagation();
            })
        })
    }
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
    
    var keyword=null;
    
    $('#submit').on('click',function(){
        
        if($('#keyword').val() !=null){
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
            renderDb(data)
       })
    })
    
})



   


  


