edaijia=(typeof(edaijia)=='undefined'?{}:edaijia);
//log数据统计
edaijia.log = {};

edaijia.log.eventLog = function(data) {
    //在此限定域名，避免非h5域名引用此文件无法发送日志 , 隐患：d.edaijia.cn是下载用的域名
    var url = location.href.indexOf("d.edaijia.cn")<0 ? '//h5.edaijia.cn/core/logs/event_logs?': '//h5.d.edaijia.cn/core/logs/event_logs?'
    var log = new Image, param = [], i;
    if(data && !data.timestamp){
        data.timestamp = (new Date()).getTime().toString()
    }
    for (i in data) {
        if (typeof data[i] === 'object') {
            data[i] = JSON.stringify(data[i]);
        }
        param.push(i + '=' + encodeURIComponent(data[i]));
    }
    log.src = url + param.join('&');
};

edaijia.log._send = function(data, type) {
    var url = location.href.indexOf("d.edaijia.cn")<0 ? '//h5.edaijia.cn/core/logs/'+type+'_logs?': '//h5.d.edaijia.cn/core/logs/'+type+'_logs?'
    var log = new Image, param = [], i;
    if(data && !data.timestamp){
        data.timestamp = (new Date()).getTime().toString()
    }
    for (i in data) {
        if (typeof data[i] === 'object') {
            data[i] = JSON.stringify(data[i]);
        }
        param.push(i + '=' + encodeURIComponent(data[i]));
    }
    log.src = url + param.join('&');
};
edaijia.log.send = function(data, type){
    type = type || 'event'
    if(!data){
        return;
    }
    edaijia.log._send(data, type)
}