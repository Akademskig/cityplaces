$(document).ready(function(){
    
   $.get('/nightlife/goings',function(data){
       console.log(data)
       $('.results-list').empty()
       renderDb(data);
   })
   
   $('.my').on('click',function(){
       $.get('/nightlife/myGoings',function(data){
       console.log(data)
       $('.results-list').empty()
       $('.my, .numPpl').addClass('active')
       $('.all, .info').removeClass('active');
       renderDb(data);
   })
   })
   $('.all').on('click',function(){
       $.get('/nightlife/goings',function(data){
       console.log(data)
       $('.results-list').empty()
       $('.all, .info').addClass('active')
        
       $('.my, .numPpl').removeClass('active');
       renderDb(data);
   })
   })
    
})