function(data){
                    
                    var opened;
                    var attribution;
                    console.log(data.places.results)
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
                        place.icon+'\'></div><div class=\'col-md-6\'><p class=\'photo\'>'+photo+'<br/>'+attribution+'</p></div></div>')
                    })
}