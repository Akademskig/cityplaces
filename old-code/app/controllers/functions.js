var renderPlaces = function (data, index) {
    var opened;
    var attribution;
    var dataJson = data;
    if (typeof data != 'object') {
        dataJson = JSON.parse(data)
    }
    var places = dataJson.results;

    var photosKey = 'AIzaSyBXLMrmKqkc4CJijlW73FHU3hoAsGOyws0'
    places.forEach(function (place, i) {
        i = i + index
        if (place.opening_hours != undefined) {
            opened = (place.opening_hours.open_now == true) ? 'yes :)' : 'no :(';
        }

        else {
            opened = 'unknown';
        }
        var photo = '';
        if (place.photos) {
            attribution = 'Photo by:  ' + place.photos[0].html_attributions;
            photo = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=' + place.photos[0].photo_reference + '&key=' + photosKey;
        }
        else {
            attribution = ""
        }
        var lat = place.geometry.location.lat
        var long = place.geometry.location.lng

        $('.results-list').append('<div class=\'row place\'><div class=\'position noDisplay\'><p id=\'lat\'>' + lat + '</p><p id=\'long\'>' + long + '</p></div><div class=\'col-md-6 info\'><p class=\'name ' + i + '\'>' + place.name + '</p><p class=\'address\'>' +
            place.vicinity + '</p><div class=\'opened \'>Opened: ' + opened + '</div><img class=\'icon\'src=\'' +
            place.icon + '\'><p id="details' + i + '" class="detailsH">Details</p><ul class="det details' + i + '"></ul></div><div class=\'col-md-6\'><p class=\'photo\'><img src=' + photo + '></img><br/>' + attribution + '</p><div class="save save' + i + '"><button id="save"class="">Save</button></div></div></div>')

        var saveData = { 'place': place.name, 'placeId': place.place_id }

        $('.save' + i).on('click', function () {
            if (!$(this).children().hasClass("active")) {
                var route = 'nightlife/save';
                if (page == 'cities') {
                    route = '/nightlife/save';
                }
                $.post(route, saveData, function (data) {
                    if (typeof data == 'string') {
                        alert(data)
                        return
                    }
                    $('.save' + i).children().addClass("active")
                })
            } else {
                var routeRem = 'nightlife/removesave';
                if (page == 'cities') {
                    routeRem = '/nightlife/removesave';
                }
                $(this).children().removeClass("active")
                $.post(routeRem, saveData, function (data) {
                })
            }
        })

        $('.name.' + i).on('click', function () {
            $('.map').fadeIn('slow');
            var showLocMap = new ShowLocMap(lat, long, place.name);
        })

        $('#details' + i).on('click', function () {
            if ($('.details' + i).is(':empty')) {
                var detailsUrl = { url: 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place.place_id + '&key=AIzaSyBsEIashHje_Mirls38eHsplMXbdrxaFLI' }
                $.post('/nightlife/details', detailsUrl, function (data) {

                    if (data.status == 'OK' && data.result.opening_hours) {
                        $('.details' + i).html("<p class='opened' style='border-bottom: solid 1px black'>Opened: </p>")

                        data.result.opening_hours.weekday_text.forEach(function (val) {
                            $('.details' + i).append("<li>" + val + "</li>")
                        })
                    }
                    else {
                        $('.details' + i).html("<p>No details found</p>")
                    }
                    $('.details' + i).append("<a href=" + data.result.url + "><p style='color:purple; margin-top:10px'>See on map</p></a>")
                })
            }
            else {
                $('.details' + i).toggle()
            }
        })

        if (i == places.length - 1) {
            $('.more').html('<div id="more">More</div>');
            $('.more').on('click', function () {

                if (data.next_page_token) {
                    var placesNextUrl = { url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=' + data.next_page_token + '&key=AIzaSyAJRnPCMCZ9ViyoX36Ijvho3DCTEv3QVI0' }
                    $.post('/nightlife/loc', placesNextUrl, function (data) {
                        data = JSON.parse(data)
                        if (data.status === "OVER_QUERY_LIMIT") {
                            var message = "<p style=\"text-align:center; padding:5px\">No data available</p>"
                            $('.container-3').html(message)
                            return
                        }
                        renderPlaces(data, places.length)

                        $('.showMap').on('click', function () {
                            $('.map').fadeIn('slow')
                            var showLocMap = new ShowLocMap(lat, long, data.results);
                        })
                    })
                }
            })
        }
    })
    return
}

function renderDb(data) {
    data.forEach(function (item, i) {

        var detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + item.placeID + '&key=AIzaSyBsEIashHje_Mirls38eHsplMXbdrxaFLI'
        $('.results-list').append('<div class=\'row place place-' + i + '\'><div class=\'col-md-8 info' + i + '\'><p class=\'name' + i + '\'style="font-weight:bold">' + item.placeName + '</p></div></div>')


        var detailsUrl = { url: 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + item.placeID + '&key=AIzaSyBsEIashHje_Mirls38eHsplMXbdrxaFLI' }

        $.post('/nightlife/details', detailsUrl, function (data) {
            if (data.status == 'OK') {
                $('.info' + i).append('<p class=\'address ' + i + '\'>' + data.result.formatted_address + '</p>')
                if (data.result.international_phone_number) {
                    $('.info' + i).append('<p class=\'phoneNum ' + i + '\'>' + data.result.international_phone_number + '</p>')
                }
                $('.info' + i).append('<p style="cursor:pointer"class=\'detailText-' + i + '\'>Details</p>')
                $('.info' + i).append('<p class="noDisplay det details-' + i + '"></p>')
                if (data.result.opening_hours) {
                    $('.details-' + i).html("<p class='opened' style='border-bottom: solid 1px black'>Opened: </p>")
                    data.result.opening_hours.weekday_text.forEach(function (val) {
                        $('.details-' + i).append("<li>" + val + "</li>")
                    })
                }
                else {
                    $('.details-' + i).html("<p>No details found</p>")
                }
                $('.details-' + i).append("<a href=" + data.result.url + "><p style='color:purple; margin-top:10px'>See on map</p></a>")

                $('.detailText-' + i).on('click', function () {
                    $('.details-' + i).toggle()
                })
            }
            $('.info' + i).append('<p id="notesText-' + i + '" style="color:#0B2161; cursor:pointer">Notes: </p><div class="notes-' + i + '"style="display:none"></div>')
            $('.info' + i).append('<div class="editArea' + i + '"></div>')
            item.notes.forEach(function (note, j) {
                $('.notes-' + i).append('<p style="margin:0;border-top:solid 1px gray;height:40px;"><span id="note">' + note + '</span><span class="noDisplay"style="clear:both;float:right;cursor:pointer;color:red" id="removeNote-' + j + '">x</span></p>')
                if ($('.my').hasClass('active') || user == "Akademskig") {
                    $('#removeNote-' + j).removeClass('noDisplay')
                }
                $('#removeNote-' + j).on('click', function () {

                    var noteRem = { note: $(this).prev().text(), placeID: item.placeID }

                    $.post('/nightlife/removeNote', noteRem, function (data) {
                    })
                    $(this).parent().remove()
                })
            })
            $('#notesText-' + i).on('click', function () {
                $('.notes-' + i).toggle()
            })
        })

        if ($('.my').hasClass('active') || user == 'Akademskig') {
            $('.place-' + i).append('<div style="padding:0"class="col-md-2 edit-' + i + '" ><p class="editrem">Add note</p></div><div class="col-md-2 remove-' + i + '"style="padding:0"><p class="editrem">Remove</p></div>')

        }
        $('.remove-' + i).on('click', function () {
            var removeData = { placeId: item.placeID }
            $.post('/nightlife/removesave', removeData, function (data) {
            })
            $(this).parent().remove();
        })
        var j = 100;
        $('.edit-' + i).on('click', function () {
            if ($('.editArea' + i).is(':empty')) {
                j++;
                $('.editArea' + i).append('<div class="editDiv-' + i + '"><textarea id="note-' + i + '"></textarea><br><button style="cursor:pointer;" id="saveNote-' + i + '">Save</button></div>')
                $('#saveNote-' + i).on('click', function () {
                    var note = { note: $('#note-' + i).val(), placeID: item.placeID }
                    $.post('/nightlife/addNote', note, function (data) {
                    })
                    $('.editDiv-' + i).remove()
                    $('.notes-' + i).append('<p style="margin:0;border-top:solid 1px gray;height:40px;"><span id="note">' + note.note + '</span><span style="clear:both;float:right;cursor:pointer;color:red" id="removeNote-' + j + '">x</spans></p>')
                    $('#removeNote-' + j).on('click', function () {
                        var noteRem = { note: $(this).prev().text(), placeID: item.placeID }
                        $.post('/nightlife/removeNote', noteRem, function (data) {
                        })
                        $(this).parent().remove()
                    })
                })
            }
            else {
                $('.editArea' + i).toggle()
            }
        })
    })
}


function renderMyPlaces(data) {

    data.forEach(function (item, i) {
        $('.results-list').append('<div class=\'row place place-' + i + '\'><div class=\'info col-md-10\'><p class=\'name ' + i + '\'>Name:   ' + item.placeName + '</p><p class=\'address ' + i + '\'>Address:   ' + item.address + ', ' +
            item.cityName + '</p><p class=\'phoneNo ' + i + '\'>Phone number:   ' + item.phoneNo + '</p><p class=\'addInfo ' + i + '\'>Additional information:   ' + item.addInfo + '</p><p class=\'keywords ' + i + '\'>Keywords:   ' + item.keyword + '</p></div></div>')

        if ($('.my').hasClass('active') || user == 'Akademskig') {
            $('.place-' + i).append('<div style="float:right;cursor:pointer;padding:0"class="edit-' + i + ' col-md-1"><p class="editrem">Edit</p></div><div style="float:right;cursor:pointer;padding:0"class="remove-' + i + ' col-md-1"><p class="editrem">x</p></div>')
        }
        $('.remove-' + i).on('click', function () {

            var removeData = { placeName: item.placeName }

            $.post('/nightlife/removePlace', removeData, function (data) {

            })
            $(this).parent().remove();
        })
        $('.edit-' + i).on('click', function () {
            $('.editForm').html('<div class="formEdit"><p id="hideForm" class="editrem" style="width:30px;float:right">X</p><form action="/nightlife/putData/newPlace" method="post" id="cityForm" style="clear:both"><input type="text" id="city" name="city" placeholder="city name" value="' + item.cityName
                + '"/><br><input type="text" id="placeName" name= "place" placeholder="place name" value="' + item.placeName + '" /><br><textarea type="text" id="address" name = "address" placeholder="address" value="' + item.address +
                '"></textarea><br><input type="text" id="phoneNo" name = "phoneNo" placeholder="phone number" value="' + item.phoneNo +
                '"/><br><input type="text" id="keywords" name="keywords" placeholder="keywords" value="' + item.keyword + '"/><br><input name="id" class="noDisplay" value="' + item.id +
                '" /><br><textarea type="text" id="addInfo"name="addInfo"placeholder="additional info" value="' + item.addInfo + '"></textarea><br><input type="submit" value="Save" id="submit" class="b" style="display:inline-block" /></form></div>')
            $('.editForm').slideToggle({ duration: 200, easing: 'swing' })
            $('textarea#address').val(item.address)
            $('textarea#addInfo').val(item.addInfo)
            $('#hideForm').on('click', function () {
                $('.editForm').slideToggle({ duration: 200, easing: 'swing' })
            })
        })
    })
}

function ShowLocMap(lat, long, place) {
    this.lat = lat
    this.long = long

    var place = place
    this.loc = { lat: this.lat, lng: this.long };

    var map = new google.maps.Map(document.getElementById('map'), {
        center: this.loc,
        zoom: 15
    });

    if (typeof place == 'string') {
        this.marker = new google.maps.Marker({
            map: map,
            position: this.loc
        });

        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(this.marker, 'click', function () {
            infowindow.setContent(place);
            infowindow.open(this.map, this);
        });
    }
    else {
        place.forEach(function (place) {

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
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });
    }
}

