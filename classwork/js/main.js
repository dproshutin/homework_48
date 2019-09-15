$(function() {
    var endpointUrl = "http://146.185.154.90:8000/messages";
    var dateOfLastMessage;

    var getBaseUrl = function(baseUrl) {
        return function(timepoint) {
            return baseUrl + "?datetime=" + timepoint;
        };
    };

    var makeRequest = getBaseUrl(endpointUrl);

    var getMessages = function(url) {
        return fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(res) {
                appendMessagesToPage(res);
                return res;
            })
            .then(function(res) {
                scrollToBottomMessage(res);
                return res;
            })
            .then(function(res) {
                updateDateOfLastMessage(res);
            })
    };

    getMessages(endpointUrl);

    function appendMessagesToPage(arr) {
        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            var datetime = moment(obj.datetime).format("dddd, MMMM Do YYYY, h:mm:ss a");
            var newDiv = $('<div class="message_item">');
            var newP1 = $('<p class="author">' + obj.author + ': </p>');
            var newP2 = $('<p class="message">' + obj.message + '</p>');
            var newP3 = $('<p class="datetime">' + datetime + '</p>');
            newDiv.append(newP1, newP2, newP3);
            $('#left').append(newDiv);
        }
    }

    function scrollToBottomMessage(arr) {
        var MessagePanel = $('#left');
        var heightOfMessagePanel = MessagePanel[0].scrollHeight;
        MessagePanel.scrollTop(heightOfMessagePanel);
    }

    function updateDateOfLastMessage(arr) {
        if (undefined !== arr && arr.length) {
            dateOfLastMessage = arr[(arr.length - 1)].datetime;
        }
    }

    $("#send_message").on("submit", function(e) {
        e.preventDefault();
        sendPost();
        $("#message").val("");
    });

    function sendPost() {
        var author = $("#author").val();
        var message = $("#message").val();
        var newPost = {author: author, message: message};
        $.post("http://146.185.154.90:8000/messages", newPost);
    }

    setInterval(function(){
            var url = makeRequest(dateOfLastMessage);
            getMessages(url);
        }, 3000);
});

