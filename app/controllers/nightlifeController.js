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
                    
                    var opened;
                    var attribution;
                    console.log(data)
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
                        
                        $('.results-list').append('<div class=\'row place\'><div class=\'col-md-6 info\'><p class=\'name\'>'+place.name+'</p><p class=\'address\'>'+
                        place.vicinity+'</p><div class=\'opened \'>Opened: '+opened+'</div><img class=\'icon\'src=\'' +
                        place.icon+'\'></div><div class=\'col-md-6\'><p class=\'photo\'>'+photo+'<br>'+attribution+'</p></div></div>')
                    })
                    
                })
            })
        })
    }
    $('#city').on('click', function() {
        $('h1').removeClass('anim')
    })
    
})


   


  


