var renderPlaces=function(data,index){
    var opened;
    var attribution;
    var dataJson=data;
    if(typeof data != 'object'){
        dataJson=JSON.parse(data)
    }
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
            attribution='Photo by:  '+place.photos[0].html_attributions;
            photo='https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference='+place.photos[0].photo_reference+'&key='+photosKey;
        }
        else{
            attribution=""
        }
        var lat=place.geometry.location.lat
        var long=place.geometry.location.lng
        
        $('.results-list').append('<div class=\'row place\'><div class=\'position noDisplay\'><p id=\'lat\'>'+lat+'</p><p id=\'long\'>'+long+'</p></div><div class=\'col-md-6 info\'><p class=\'name '+i+'\'>'+place.name+'</p><p class=\'address\'>'+
        place.vicinity+'</p><div class=\'opened \'>Opened: '+opened+'</div><img class=\'icon\'src=\'' +
        place.icon+'\'><p id="details'+i+'" class="detailsH">Details</p><ul class="det details'+i+'"></ul></div><div class=\'col-md-6\'><p class=\'photo\'><img src='+photo+'></img><br/>'+attribution+'</p><div class="save save'+i+'"><button id="save"class="">Save</button></div></div></div>')
        
        var saveData={'place': place.name, 'placeId': place.place_id}
        
            $('.save'+i).on('click',function(){
                if(!$(this).children().hasClass("active")){
                    var route='nightlife/save';
                    if(page=='cities'){
                        route='/nightlife/save';
                    }
                    $.post(route,saveData,function(data){
                       if(typeof data == 'string'){
                           alert(data)
                           return
                       }
                       $('.save'+i).children().addClass("active")
                    })
                }else{
                    var routeRem='nightlife/removesave';
                    if(page=='cities'){
                        routeRem='/nightlife/removesave';
                    }
                    $(this).children().removeClass("active")
                    $.post(routeRem,saveData,function(data){
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
         
        var detailsUrl='https://maps.googleapis.com/maps/api/place/details/json?placeid='+item.placeID+'&key=AIzaSyBsEIashHje_Mirls38eHsplMXbdrxaFLI'
        $('.results-list').append('<div class=\'row place place-'+i+'\'><div class=\'col-md-8 info'+i+'\'><p class=\'name'+i+'\'>'+item.placeName+'</p></div></div>')
    
    
        var detailsUrl={url:'https://maps.googleapis.com/maps/api/place/details/json?placeid='+item.placeID+'&key=AIzaSyBsEIashHje_Mirls38eHsplMXbdrxaFLI'}
         
        $.post('/nightlife/details',detailsUrl,function(data){
             if(data.status=='OK'){
            $('.info'+i).append('<p class=\'address '+i+'\'>'+data.result.formatted_address+'</p>')
            if(data.result.international_phone_number){
                 $('.info'+i).append('<p class=\'phoneNum '+i+'\'>'+data.result.international_phone_number+'</p>')
            }
            $('.info'+i).append('<p style="cursor:pointer"class=\'detailText-'+i+'\'>Details</p>')
            $('.info'+i).append('<p class="noDisplay det details-'+i+'"></p>')
            if(data.result.opening_hours){
                
                       $('.details-'+i).html("<p class='opened' style='border-bottom: solid 1px black'>Opened: </p>")
                       
                       data.result.opening_hours.weekday_text.forEach(function(val){
                           $('.details-'+i).append("<li>"+val+"</li>")
                       })
                   }
            else {
                $('.details-'+i).html("<p>No details found</p>")
            }
            $('.details-'+i).append("<a href="+data.result.url+"><p style='color:purple; margin-top:10px'>See on map</p></a>")
            
            $('.detailText-'+i).on('click',function(){
                $('.details-'+i).toggle()
            })
             }
            $('.info'+i).append('<div class="notes-'+i+'">Notes: </div>')
            $('.info'+i).append('<div class="editArea'+i+'"></div>')
            item.notes.forEach(function(note,j){
               
                $('.notes-'+i).append('<p style="margin:0;border-top:solid 1px black;height:40px"><span id="note">'+note+'</span><span class="noDisplay"style="clear:both;float:right;cursor:pointer;" id="removeNote-'+j+'">x</span></p>')
                if($('.my').hasClass('active')){
                    $('#removeNote-'+j).removeClass('noDisplay')
                }
                $('#removeNote-'+j).on('click',function(){
                     
                  var noteRem={note:$(this).prev().text(), placeID:item.placeID}
                  
                  $.post('/nightlife/removeNote',noteRem,function(data){
                  })
                  $(this).parent().remove()
              })
            })
        })
      
        if($('.my').hasClass('active')){
            $('.place-'+i).append('<div class="col-md-2 edit-'+i+'" style="font-size:15px;cursor:pointer">Add note</div><div class="col-md-2 remove-'+i+'"style="font-size:15px;cursor:pointer">Remove</div>')
            $('.notes-'+i).children().append('<span style="clear:both;float:right;cursor:pointer;" id="removeNote-'+j+'">x</span>')
        }
        $('.remove-'+i).on('click',function(){
            var removeData={placeId:item.placeID}
            $.post('/nightlife/removesave',removeData,function(data){
            })
            $(this).parent().remove();
        })
        var j= 100;
        $('.edit-'+i).on('click',function(){
            if($('.editArea'+i).is(':empty')){
              j++;
              $('.editArea'+i).append('<div class="editDiv-'+i+'"><textarea id="note-'+i+'"></textarea><br><button style="cursor:pointer;" id="saveNote-'+i+'">Save</button></div>')
              $('#saveNote-'+i).on('click',function(){
                  var note={note:$('#note-'+i).val(), placeID:item.placeID}
                  $.post('/nightlife/addNote',note,function(data){
                  })
                  
                  $('.editDiv-'+i).remove()
                  $('.notes-'+i).append('<p style="margin:0;border-top:solid 1px black;height:40px"><span id="note">'+note.note+'</span><span style="clear:both;float:right;cursor:pointer;" id="removeNote-'+j+'">x</spans></p>')
                  $('#removeNote-'+j).on('click',function(){
                      var noteRem={note:$(this).prev().text(), placeID:item.placeID}
                     
                      $.post('/nightlife/removeNote',noteRem,function(data){
                      })
                      $(this).parent().remove()
                  })
              })
            }
            else{
              $('.editArea'+i).toggle()
            }
        })
    })
}


function renderMyPlaces(data){
    data.forEach(function(item,i){
        $('.results-list').append('<div class=\'place place-'+i+'\'><div class=\'info\'><p class=\'name '+i+'\'>Name:   '+item.placeName+'</p><p class=\'address '+i+'\'>Address:   '+item.address+', '+
        item.cityName+'</p><p class=\'addInfo '+i+'\'>Additional information:   '+item.addInfo+'</p><p class=\'keywords '+i+'\'>Keywords:   '+item.keyword+'</p></div></div>')
        
        if($('.my').hasClass('active')){
            $('.place-'+i).append('<div class="col-md-1"><button class="remove-'+i+'">X</button></div>')
        }
        $('.remove-'+i).on('click',function(){
          
            var removeData={placeName:item.placeName}
            
            $.post('/nightlife/removePlace',removeData,function(data){
              
            })
            $(this).parent().parent().remove();
        })
    })
}

function ShowLocMap(lat,long,place){
    this.lat=lat
    this.long=long
    
    var place=place 
    this.loc = {lat: this.lat, lng: this.long};
    
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
             
             createMarker(place);
         })
    }
    
    function createMarker(place) {
        var placeLoc = place.geometry.location;
        
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

