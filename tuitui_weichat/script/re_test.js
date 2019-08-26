const refresh = require('./refresh.js');

function a() {
    refresh.refreshComponentAccessToken()
    setTimeout(function () {
        refresh.refreshComponentAuthCode()
        setTimeout(function () {
            refresh.get_authorizer_info()
            setTimeout(function () {
                refresh.refreshAccessToken()
            }, 3000)
        }, 3000)
    }, 3000)
}
a()

