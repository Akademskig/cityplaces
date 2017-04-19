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
       $('.my').addClass('active')
       $('.all').removeClass('active');
       renderDb(data);
   })
   })
   $('.all').on('click',function(){
       $.get('/nightlife/goings',function(data){
       console.log(data)
       $('.results-list').empty()
       $('.all').addClass('active')
       $('.my').removeClass('active');
       renderDb(data);
   })
   })
    
})