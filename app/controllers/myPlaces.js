
$(document).ready(function(){
    String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	}
	
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
        var cityName=$('#location').val().split("")
       while(cityName[0]==" "){
           cityName.shift()
       }
       while(cityName[cityName.length-1]==" "){
           cityName.pop()
       }
       cityName=cityName.join("")
       console.log(cityName)
       cityName=cityName.capitalize();
       
       var keyword=$('#keyword').val().toLowerCase();
       var query={city: cityName, keyword: keyword}
       $.post('/nightlife/allPlaces',query,function(data){
           $('.results-list').empty()
           renderMyPlaces(data);
       })
   })
   
   $('.navig').on('click',function(){
        $('.nav2').toggle()
    })
    
})