$(document).ready(function(){
    
     $.getJSON("http://ip-api.com/json", function(jsonPos) {
        $('.location').html(jsonPos.city + ', '+ jsonPos.country)
     })
    
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat=position.coords.latitude;
            var long= position.coords.longitude;
            
            $('.getLocation').on('click', function() {
                var keyword=null;
                if($('#keyword').val() !=null){
                    keyword=$('#keyword').val();
                }
                var reqData={'location': lat + ','+long, 'keyword': keyword};
                $('.container-3').html('<p class=\' results\'>Places found</p><div class=\'results-list\'></div>')
                 
                $.post('/nightlife/loc/',{reqData},function(data){
                    renderPlaces(data)
                    
                //-------MAP SETUP-------------------------
                
                })
            })
            
             $('.showMap').on('click',function(){
                 $('.map').fadeIn('slow')
                 initMap(lat,long,15);
                    
            })
        })
    }
    $('#city').on('click', function() {
        $('h1').removeClass('anim')
    })
    
    $('.hide').on('click',function(){
        $('.map').fadeOut('slow');
    })
  
   
    
})



   


  


