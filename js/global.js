var url = "http://api.thetshirtguylv.com";
//var url = "http://localhost:27932";
String.prototype.formatDate = function () {
    var d = new Date(parseInt(this.substr(6)));
    var o = d.getTimezoneOffset() / 60;
    var h = d.getHours();
    d.setHours(h - o);
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return ((d.getMonth() + 1).pad() + '/' + (d.getDay() + 1).pad() + '/' + d.getFullYear() + ' ' + hours.pad() + ':' + minutes.pad() + ' ' + ampm);
}
Number.prototype.pad = function () {
    if (this.toString().length == 1)
        return ('0' + this);
    else
        return (this);
}
function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}
