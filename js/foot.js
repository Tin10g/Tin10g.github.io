// 动态心跳，更改自己的名称
$(document).ready(function(e) {
    $('.copyright').html('©2024 <i class="fa-fw fas fa-heartbeat card-announcement-animation cc_pointer"></i> By Tin10g');
})

$(document).ready(function(e) {
    show_date_time();
})

//本站运行时间，更改自己建立站点的时间
function show_date_time() {
    $('.framework-info').html('小破站已经安全运行<span id="span_dt_dt" style="color: #fff;"></span>');
    window.setTimeout(show_date_time, 1000);
    var birthday = new Date("2024-05-20 00:00:00");
    var today = new Date();
    var timeold = (today.getTime() - birthday.getTime());
    var daysold = Math.floor(timeold / (24 * 60 * 60 * 1000));
    var hrsold = Math.floor((timeold % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    var minsold = Math.floor((timeold % (60 * 60 * 1000)) / (60 * 1000));
    var seconds = Math.floor((timeold % (60 * 1000)) / 1000);
    document.getElementById('span_dt_dt').innerHTML = '<font style=color:#afb4db>' + daysold + '</font> <font style=color:#6495ED>天</font> <font style=color:#87CEFA>' + hrsold + '</font><font style=color:#87CEFA>时</font> <font style=color:#fdb933>' + minsold + '</font> <font style=color:#87CEFA>分</font>  <font style=color:#a3cf62>' + seconds + '</font> <font style=color:#87CEFA>秒</font> ';
}

// 初始化
show_date_time();