
$(document).ready(function(){
    
   $.get('/nightlife/allPlaces',function(data){
       console.log(data)
       $('.results-list').empty()
       if(typeof data=='string'){
           alert(data)
           return
       }
       renderMyPlaces(data);
   })
   
  $('.my').on('click',function(){
       $.get('/nightlife/myPlaces',function(data){
       console.log(data)
       if(typeof data == 'string'){
           alert(data);
           return
       }
       $('.results-list').empty()
       $('.my').addClass('active')
       $('.all').removeClass('active');
       renderMyPlaces(data);
   })
   })
       $('.all').on('click',function(){
           $.get('/nightlife/allPlaces',function(data){
           console.log(data)
           $('.results-list').empty()
           $('.all').addClass('active')
           $('.my').removeClass('active');
           if(typeof data=='string'){
               alert(data)
               return
           }
           renderMyPlaces(data);
       })
   })
   $('#submit').on('click', function(data){
       var city={city: $('#location').val()}
       $.post('/nightlife/allPlaces',city,function(data){
           $('.results-list').empty()
           renderMyPlaces(data);
       })
   })
    
})