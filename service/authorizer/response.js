// response template
function _200Callback (message) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: message
        })
    }
}

function _401Callback (message) {
    return {
        statusCode: 401,
        body: JSON.stringify({
            message: message
        })
    }
}
function _500Callback (message) {
    return {
        statusCode: 500,
        body: JSON.stringify({
            message: message
        })
    }
}

module.exports = {
    _200Callback,
    _401Callback,
    _500Callback
}