
$(document).ready(function(){
    
   $.get('/nightlife/allPlaces',function(data){
       $('.results-list').empty()
       if(typeof data=='string'){
           alert(data)
           return
       }
       renderMyPlaces(data);
   })
   
  $('.my').on('click',function(){
       $.get('/nightlife/myPlaces',function(data){
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
       var query={city: $('#location').val(), keyword: $('#keyword').val()}
       $.post('/nightlife/allPlaces',query,function(data){
           $('.results-list').empty()
           renderMyPlaces(data);
       })
   })
    
})