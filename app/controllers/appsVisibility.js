if(user=='undefined'){
    $('ul').addClass('noDisplay')
    $('.container-2').html("<p style='text-align:center; font-size:18px'>Please login to see the apps</p>")
}
else{
    $('ul').removeClass('noDisplay')
    $('#user').html(user)
}