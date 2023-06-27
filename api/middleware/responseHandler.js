

const responseMessage = (status, msg, data = null ,type = "data")=>
{

    res = {status};
    if (status) {
      
        res.message = msg;
        if (data != null) {
            res[type] = data;
        }
    }
    else
    {
        res.error = msg;
    }


    return res;

}



module.exports = responseMessage;