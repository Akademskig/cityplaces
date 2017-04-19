console.log(user)
if(user==undefined){
    $('ul').addClass('noDisplay')
    $('.container-2').html("Please login to see the apps")
}
else{
    $('ul').removeClass('noDisplay')
    $('#user').html(user)
}