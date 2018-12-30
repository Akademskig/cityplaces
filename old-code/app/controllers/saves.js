$(document).ready(function(){
    var tags=[];
   $.get('/nightlife/saves',function(data){
       data.forEach(function(item,i){
           tags.push(item.placeName)
       })
       $('.results-list').empty()
       renderDb(data);
   })
   
   $('.my').on('click',function(){
       $.get('/nightlife/mysaves',function(data){
           tags=[]
           data.forEach(function(item,i){
           tags.push(item.placeName)
           })
           $('.results-list').empty()
           $('.my, .numPpl').addClass('active')
           $('.all, .info').removeClass('active');
           renderDb(data);
       })
   })
   $('.all').on('click',function(){
       
       $.get('/nightlife/saves',function(data){
           tags=[]
           data.forEach(function(item,i){
           tags.push(item.placeName)
           })
           $('.results-list').empty()
           $('.all, .info').addClass('active')
            
           $('.my, .numPpl').removeClass('active');
           renderDb(data);
        })
    })
    $('.navig').on('click',function(){
        $('.nav2').toggle()
    })
    //------AUTOCOMPLETE---------------//
    $( "#placeText" ).on('input',function(){
        $( "#placeText" ).autocomplete({
        source: tags
    });
    })
    
    $('#submit').on('click',function(){
        var place=$( "#placeText" ).val()
        var placeData={placeName: place}
        $.post('/nightlife/saves',placeData,function(data){
            $('.results-list').empty()
            renderDb(data);
        })
    })
    
  
    
})


