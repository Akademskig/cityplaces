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
                    console.log(json)
                    var getCityID='https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/find?q='+city+'&type=like&appid='+LOC_API_KEY;
                    $.getJSON(getCityID, function(data){
                        cityID=data.list[0].id
                    })
            })
                    
               
              var keyword=null;
            $('.getLocation').on('click', function() {
               $('.container-3').html('<div class=\'results-list\'></div>')
              
                if($('#keyword').val() !=''){
                    keyword=$('#keyword').val();
                }
                getMap(lat,long,15, keyword);
               
                var reqData={'location': lat + ','+long, 'keyword': keyword, 'city': city, 'cityId':cityID, 'cityName':cityName};
                 console.log(reqData)
                
            })
            
            $('.showMap').on('click',function(){
                console.log($('.container-3').val())
                if($('.container-3').is(':empty')){
                    
                     $('.map').fadeIn('slow')
                    var showLocMap=new ShowLocMap(lat,long,15,'Your location');
                }
                else{
                 $('.map').fadeIn('slow')
                 getMap(lat,long,15,keyword)
                }
            //--------SHOW-HIDE MAP------------
            
                    
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



   


  


