(function ($) {
    $.fn.calendar = function(options) {
        /**
         * 基本参数设置
         * @defaulte defaults = {input:'.calendarInput',clickFun:null,autoClose:false,box:'#calendar',LimitStart:'0',LimitEnd:'0',radio:false,defaultType:'day',dayNumber:3,weekNumber:1,monthNumber:1,timeLimit:false,calenderPrev:'.calendarPrev',calenderNext:'.calendarNext',flip:true}
         * @param weekYear 年
         * @param input '.className' 日历输出框
         * @param clickFun ‘functionName’ 选择日期后 外接方法接口
         * @param autoClose Boolen(true|false) 选择日期后 日历自动关闭
         * @param box '#id' 日历页面控制区Box Id
         * @param LimitStart 'yyyy-0m-0d' 日历可选择起始日期 个位数前加0
         * @param LimitEnd 'yyyy-0m-0d' 日历可选择结束日期 个位数前加0
         * @param radio Boolen(true|false) 是否是单选
         * @param calenderPrev '.className'  页面前 显示设置
         * @param calenderNext '.className' 页面后 显示设置
         * @param defaultType 'day'|'week'|'month' 默认时间类型
         * @param dayNumber Number(1,2,3,4...) 日 列表显示月列表个数
         * @param weekNumber Number(1,2,3,4...) 周 列表显示年个数
         * @param monthNumber Number(1,2,3,4...) 月 列表年显示年个数
         * @param timeLimit Boolen(true|false) 日历显示 是否禁选今天后日期
         * @param flip  Boolen(true|false)  日历翻页是否禁用 x
         * @type {Object}
         */
        var defaults = {input:'.calendarInput',clickFun:null,autoClose:false,box:'#calendar',LimitStart:'0',LimitEnd:'0',radio:false,defaultType:'day',dayNumber:3,weekNumber:1,monthNumber:1,timeLimit:false,calenderPrev:'.calendarPrev',calenderNext:'.calendarNext',flip:true};
        var ops = $.extend({},defaults,options)
            ,CalendarEndTime =  ops.LimitEnd
            ,tLimitStart = Date.parse((ops.LimitStart).replace(/[\-\.]/gi,'/'))
            ,tLimitEnd = Date.parse((ops.LimitEnd).replace(/[\-\.]/gi,'/'))
            ,inputDom = $(ops.input)
            ,startInput = $(ops.input+":first")
            ,endInput = $(ops.input+":last")
            ,calendarControl = ops.box
            ,calendarPrev = $(ops.calenderPrev,calendarControl)
            ,calendarNext =  $(ops.calenderNext,calendarControl)
            ,nowCalendar = new Date()
            ,nowCalendarParse = Date.parse(nowCalendar)
            ,nowYear = nowCalendar.getFullYear()
            ,nowMonth = nowCalendar.getMonth()
            ,nowDate = nowYear+'/'+numDeal(nowMonth+1)+'/'+numDeal(nowCalendar.getDate())
            ,daySeconds = 24*60*60*1000
            ,reelectedYN = 0
            ,TemporaryType = '';
		inputDom.attr("readonly","readonly");
        if(ops.timeLimit&&tLimitEnd>0){
            if(tLimitEnd >= nowCalendarParse){
                tLimitEnd = nowCalendarParse;
                CalendarEndTime = nowDate.replace(/[\-\.\/]/gi,'-');
            }
        }else if(ops.timeLimit&&!tLimitEnd){
            tLimitEnd = nowCalendarParse;
            CalendarEndTime = nowDate.replace(/[\-\.\/]/gi,'-');
        }else if(!ops.timeLimit&&!tLimitEnd){
            tLimitEnd = false;
            CalendarEndTime = false;
        }
        /**
         * 日历模式切换
         */
        $('.calendarTab',calendarControl).children().click(function(){
            TemporaryType = ($(this).attr('class')).replace(/[^day|week|month]/g,'');
            var modeTxt = $(this).text();
            $(this).addClass('cur').siblings().removeClass('cur');
            calendarPrev.text('<<前一'+modeTxt);
            calendarNext.text('下一'+modeTxt+'>>');
            setTimeout(function(){inputDom.trigger('click');},0);
			return;
        });
        setDefaultArg();
        /**
         * 默认日历模式
         */
        function setDefaultArg(){
        	if(inputDom.attr('datatype')!=null) { return;}
            var dataType = (ops.defaultType!="" && $('.'+ops.defaultType,calendarControl).length>0)?ops.defaultType:'day';
            inputDom.attr('datatype',dataType);
          //  $('.'+dataType,calendarControl).addClass('cur');
        }
        /**
         * Input - 日历激活
         */
        inputDom.click(function(){
            calendarShow();
            return false;
        });
        /**
         * 日历载入
         */
        function calendarShow(){
            closeCalendar();
            var dataType = inputDom.attr('datatype')
                ,nowDataType = $('.calendarTab > .cur',calendarControl)[0].className
                ,nowDataType = TemporaryType!=''?TemporaryType:nowDataType.replace(/[^(day|week|month)]/g,'')
                ,relationType = (dataType==nowDataType)?1:0
                ,argYear,argMonth;
            var flipPrev = 'prev'
                ,flipNext = 'next';
            if(nowDataType!='day'){
                flipPrev = ops.flip&&nowDataType!='day'|''?'prev':'prevNo';
                flipNext = ops.flip&&nowDataType!='day'|''?'next':'nextNo';
            }
            var boxHtml = '<div id="calenderBox" class="'+ nowDataType +'Mode"><b id="calendarPrev" class="'+ flipPrev +'"></b><b id="calendarNext" class="'+flipNext+'"></b><small id="calendarMsg"></small><div id="'+ nowDataType +'box" class="calenderBox"></div><div class="calendarBt"><span id="calendarCancel"></span><span id="calendarConfir"></span></div></div>'
                ,boxTop = startInput.offset().top+startInput.height()/*+1*/
                ,boxLeft=startInput.offset().left;
            $(boxHtml).appendTo($('body')).css({top:boxTop,left:boxLeft});
            var startInputVal = startInput.val()
                ,endInputVal = endInput.val();
            if(!relationType||startInputVal==''||endInputVal==''){
                argYear = nowYear;
                argMonth = nowMonth;
                reelectedYN = 0;
            }else{
                argYear = Number(endInputVal.split(/[\-|\.]/g)[0]);
                argMonth = Number(endInputVal.split(/[\-|\.]/g)[1])-1;
                reelectedYN = 1;
            }
            if(nowDataType=='week'){
                for(var i = 0; i< ops.weekNumber;i++){
                    weekCalendar(argYear-i,-1);
                }
            }else if(nowDataType=='month'){
                for(var i = 0; i< ops.monthNumber;i++){
                    monthCalendar(argYear-i,-1);
                }
            }else{
                var dayHead = '';
                for(var i = 0;i<ops.dayNumber;i++){
                    if(argMonth<0){
                        dayCalendar(--argYear,12,-1);
                        argMonth = 11;
                    }else{
                        dayCalendar(argYear,argMonth+1,-1);
                    }
                    dayHead = '<td width="174">'+argYear+'年'+(argMonth+1)+'月</td>'+dayHead;
                    argMonth--;
                }
                $('#calendarMsg').replaceWith('<table id="dayHead" border="0" cellpadding="0"cellspacing="0"><tr>'+dayHead+'</tr></table>');// width="'+ ops.dayNumber*172 +'"
            }
        }
        /**
         * 月-模式
         * @param monthYear 年
         * @param nextYear 前后
         */
        function monthCalendar(monthYear,nextYear){
            var calendarStr = '<table class="monthTable" date='+monthYear+' cellspacing="0" cellpadding="0"><tr><th>'+monthYear+'</th>';
            for(var b=1;b<=12;b++){
                var titleB = monthYear+'-'+numDeal(b)+'-01'
                    ,titleA = monthYear +'-'+ numDeal(b) +'-'+Number(monthDays(monthYear,b-1));
                calendarStr += '<td '+ canselect(titleB,'month',titleA) +'>'+b+'</td>';
            }
            createCalendar('month','#monthbox',nextYear,calendarStr);
        }

        /**
         * 日-模式
         * @param dayYear 年
         * @param dayMonth 月
         * @param prevNext 前后
         */
        function dayCalendar(dayYear,dayMonth,nextMonth){
            var calendarStr = '<table date='+dayYear+"/"+dayMonth+' class="dayTable" cellspacing="0" cellpadding="0"><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class="yellowTxt">六</th><th class="yellowTxt">日</th></tr><tr>'
                ,monthDate = new Date(dayYear+'/'+dayMonth+'/1')
                ,firstDay = monthDate.getDay()
                ,days = monthDays(dayYear,dayMonth-1)
                ,poorDays = firstDay>0?firstDay-1:6
                ,showDaysNum = days+poorDays
                ,dayShow = 0
                ,forNumber = showDaysNum%7==0?showDaysNum:showDaysNum+7-(showDaysNum%7)
                ,prevFlag = firstDay==1?false:true;
            var prevData = new Date(Date.parse(monthDate)-poorDays*daySeconds)
                ,prevYear = prevData.getFullYear()
                ,prevMonth = prevData.getMonth()
                ,prevDate = prevData.getDate()
                ,prevMonthDays = monthDays(prevYear,prevMonth);
            for(var a = 0;a<forNumber;a++){
                if(prevFlag){
                    var nowDays = prevDate+a;
                    /*calendarStr += '<td title="'+ prevYear +'-'+numDeal(prevMonth+1)+'-'+(prevDate+a)+'">'+nowDays+'</td>';*/
					calendarStr += '<td>'+nowDays+'</td>'
                    if(nowDays>=prevMonthDays) prevFlag = false;
                }else{
                    dayShow++;
                    var nowDateStr = dayYear +'-'+numDeal(dayMonth)+'-'+numDeal(dayShow);
                    calendarStr+= dayShow<= days?'<td '+ canselect(nowDateStr,'day') +' title="'+ nowDateStr +'">'+(dayShow)+'</td>':'<td></td>';
                }
                if(a!=0 && (a+1)%7 == 0 && a<forNumber-1){
                    calendarStr+= '</tr><tr>';
                }
            }
            createCalendar('day','#daybox',nextMonth,calendarStr);
        }
        /**
         * 周 - 模式
         * @param weekYear 年
         * @param nextYear 前后
         */
        function weekCalendar(weekYear,nextYear){
            var calendarStr = '<table class="weekTable" date='+weekYear+' cellspacing="0" cellpadding="0"><tr><th rowspan="3">'+weekYear+'</th>'
                ,firstDay = (new Date(weekYear+'/01/1')).getDay()
                ,lastDay = (new Date(weekYear+'/12/31')).getDay()
                ,startDay,endDay;
            /*第一周起始天*/
            if(firstDay<4){
                startDay = firstDay > 0 ? ((weekYear-1)+'/12/'+(32-firstDay)) : weekYear+'/01/1';
            }else{
                startDay = weekYear+'/01/'+(8-firstDay);
            }
            /*最后一周结束天*/
            if(lastDay > 2){
                endDay = lastDay < 6 ? ((weekYear+1)+'/01/'+(6-lastDay)) : weekYear+'/12/31';
            }else{
                endDay = (weekYear+'/12/'+(30-lastDay));
            }
            var startParse = Date.parse(startDay)
                ,endParse = Date.parse(endDay);
            for(var d = 0;d<=53;d++){
                var sFirstParse = startParse+d*7*daySeconds
					//,sDate = new Date(sFirstParse)
                    //,eDate = new Date(sFirstParse+6*daySeconds)
                    ,sDate = new Date(sFirstParse+daySeconds)
                    ,eDate = new Date(sFirstParse+7*daySeconds)
                    ,timeA = sDate.getFullYear()+'-'+numDeal(sDate.getMonth()+1)+'-'+numDeal(sDate.getDate())
                    ,timeB = eDate.getFullYear()+'-'+numDeal(eDate.getMonth()+1)+'-'+numDeal(eDate.getDate());
                if(sFirstParse <= endParse){
                    calendarStr += '<td '+ canselect(timeA,'week',timeB)+'>'+(d+1)+'</td>';
                }else{
                    calendarStr += '<td></td>';
                }
                calendarStr += ((d+1)%18==0&&d<53)?'</tr><tr>':'';
            }
            createCalendar('week','#weekbox',nextYear,calendarStr);
        }

        /**
         * 日历 - 单格处理
         * @param timeStr 第一时间
         * @param mode日历模式
         * @param timeStrB 第二时间
         * @return {String}
         */
        function canselect(timeStr,mode,timeStrB){
            if(mode=='week'){
                if(ops.LimitStart=='0'&&ops.LimitEnd=='0'){
                    return 'class="date" title="' + timeStr +' 至  '+ timeStrB+'"';
                }
                var timeParse = Date.parse(timeStr.replace(/[\-\.]/gi,'/'))
                    ,timeBParse = Date.parse(timeStrB.replace(/[\-\.]/gi,'/'));
                  if(tLimitStart){
                    var sLimitParse = Date.parse(ops.LimitStart.replace(/[\-\.]/gi,'/'));
                    if(timeBParse<sLimitParse){
                        return 'title="' + timeStr +' 至  '+ timeStrB+'"';
                    }else if(timeBParse>=sLimitParse&&timeParse<=sLimitParse){
                        if(sLimitParse == tLimitEnd){
                            document.getElementById('calendarNext').className = 'nextNo';
                            document.getElementById('calendarPrev').className = 'prevNo';
                            return 'class="date" title="' + CalendarEndTime +' 至  '+ CalendarEndTime+'"';
                        }
                        document.getElementById('calendarPrev').className = 'prevNo';
                        return 'class="date" title="' + ops.LimitStart +' 至  '+ timeStrB+'"';
                    }
                }
                if(tLimitEnd){
                    if(tLimitEnd>=timeParse){
                        if(tLimitEnd<=timeBParse){
                            document.getElementById('calendarNext').className = 'nextNo';
                            return 'class="date" title="' + timeStr +' 至  '+ CalendarEndTime+'"';
                        }
                    }else if(tLimitEnd<timeParse){
                        return 'title="' + timeStr +' 至  '+ timeStrB+'"';
                    }
                }
                return 'class="date" title="'+timeStr +' 至 '+timeStrB+'"';
            }else if(mode=='month'){
                if(ops.LimitStart=='0'&&ops.LimitEnd=='0'){
                    return 'class="date" title="' + timeStr +' 至  '+ timeStrB+'"';
                }
                var timeNum = Number(timeStr.replace(/([\-\.]\d+)$|(\-|\.)/gi,''))
                    ,timeBNum = Number(timeStrB.replace(/([\-\.]\d+)$|(\-|\.)/gi,''));
                if(tLimitStart){
                    var limitStartNum = Number(ops.LimitStart.replace(/([\-\.]\d+)$|(\-|\.)/gi,''));
                    if(timeNum == limitStartNum){
                        if(CalendarEndTime == ops.LimitStart){
                            document.getElementById('calendarNext').className = 'nextNo';
                            document.getElementById('calendarPrev').className = 'prevNo';
                            return 'class="date" title="' + CalendarEndTime +' 至  '+ CalendarEndTime+'"';
                        }else{
                            document.getElementById('calendarPrev').className = 'prevNo';
                            return 'class="date" title="' + ops.LimitStart +' 至  '+ timeStrB+'"';
                        }
                    }else if(timeNum <limitStartNum){
                        return 'title="' + timeStr +' 至  '+ timeStrB+'"';
                    }
                }
                if(tLimitEnd){
                    var limitEndNum = Number(CalendarEndTime.replace(/([\-\.]\d+)$|(\-|\.)/gi,''));
                    if(timeBNum == limitEndNum){
                        document.getElementById('calendarNext').className = 'nextNo';
                        return 'class="date" title="' + timeStr +' 至  '+ CalendarEndTime+'"';
                    }else if(timeBNum > limitEndNum){
                        return ' title="' + timeStr +' 至  '+ timeStrB +'"';
                    }
                }
                return 'class="date" title="' + timeStr +' 至  '+ timeStrB+'"';
            }else{
                if(ops.LimitStart=='0'&&ops.LimitEnd=='0'){
                    return 'class="date"';
                }
                var timeNum = Number(timeStr.replace(/[\-|\.]/gi,''));
                if(tLimitStart){
                  var startNum = Number(ops.LimitStart.replace(/[\-|\.]/gi,''));
                  if(timeNum<startNum){
                     document.getElementById('calendarPrev').className = 'prevNo';
                     return '';
                  }
                }
                if(CalendarEndTime){
                  var endNum = Number(CalendarEndTime.replace(/[\-|\.]/gi,''));
                    if(timeNum==endNum){
                        document.getElementById('calendarNext').className = 'nextNo';
                    }else if(timeNum>endNum){
                      return '';
                  }
                }
                return 'class="date"';
            }
        }
        /**
         * 选择日期
         * @param modeType 日历模式
         * @param boxId 日历Box
         */
        function selectDate(modeType,boxId){
            $('td.date',boxId).die('click').live('click',function(){
                var _this = $(this);
                if(ops.radio){
                    var thisDate = $(this).attr('title');
                    $('td','#calenderBox').removeClass('sltCalendar');
                    _this.addClass('sltCalendar');
                    if(modeType == 'day'){
                        inputDom.val(thisDate);
                    }else{
                        var dateArr = thisDate.split(/\s+[\u4E00-\u9FA5]\s+/g)
                            ,thisNum = _this.text()
                            ,thisYear = _this.parents('table').attr('date')
                            ,msg = '';
                        if(modeType == 'week'){
                            msg = thisYear+'年第'+ thisNum +'周 ('+thisDate+')';
                        }else{
                            msg = thisYear+'年'+ thisNum +'月 ('+thisDate+')';
                        }
                        $('#calendarMsg').text(msg);
                        startInput.val(dateArr[0]);
                        endInput.val(dateArr[1]);
                    }
                    if(ops.autoClose){
                        $('#calendarConfir').trigger('click');//closeCalendar();
                    }
                }else{
                    var sltNum = $('td.sltCalendar').length;
                    if(sltNum == 0||sltNum > 1){
                        clearSelect();
                        _this.addClass('sltCalendar');
                        if(modeType != 'day'|''){
                            var thisNum = _this.text()
                                ,thisYear = _this.parents('table').attr('date')
                                ,weekInfo = _this[0].title
                                ,cMsg = thisYear+( modeType=='week'?('年第'+ thisNum +'周 ('+weekInfo+')'):('年'+ thisNum +'月 ('+ weekInfo +')'));
                            $('#calendarMsg').text(cMsg);
                        }
                    }else if(sltNum==1){
                        if(_this.hasClass('sltCalendar')){
                            _this.removeClass('sltCalendar');
                            calendarMsg('');
                        }else{
                            var cTd = $('td.date',boxId)
                                ,thisIndex = cTd.index(this)
                                ,sltIndex = cTd.index($('td.sltCalendar',boxId))
                                ,sortIndex = sortNumber([thisIndex,sltIndex]);
                            for(var e = sortIndex[0];e<= sortIndex[1];e++){
                                cTd[e].className = 'date sltCalendar';
                            }
                            if(modeType != 'day'|''){
                                var startTime = cTd[sortIndex[0]].title.split(/\s+[\u4E00-\u9FA5]\s+/g)
                                 ,endTime = cTd[sortIndex[1]].title.split(/\s+[\u4E00-\u9FA5]\s+/g);
                                calendarMsg(startTime[0]+' 至 '+endTime[1]);
                            }
                        }
                    }
                }
                return false;
            });
        }
        /**
         * 前后日历翻页
         * @param calendarType 日历模式
         */
        function prevNext(calendarType){
            $('#calendarPrev').unbind('click').bind('click',function(){
                if($(this).hasClass('prevNo'))return false;
                reelectedYN = 0;
                calendarMsg('');
                if(calendarType=='week'){
                    var firstYear = Number($('table:first','#weekbox').attr('date'));
                    weekCalendar(firstYear-1,0);
                }else if(calendarType=='month'){
                    var firstYear = Number($('table:first','#monthbox').attr('date'));
                    monthCalendar(firstYear-1,0);
                }else{
                    var firstDate = ($('table:first','#daybox').attr('date')).split('/')
                        ,getMonthYear = getPrevNextDate(Number(firstDate[0]),Number(firstDate[1]),1);
                    $('td:last','#dayHead').remove();
                    if(ops.dayNumber == 1 ){
                        document.getElementById('dayHead').getElementsByTagName('tr')[0].innerHTML = '<td width="174">'+getMonthYear.year+'年'+(getMonthYear.month)+'月</td>';
                    }else{
                        $('<td width="174">'+getMonthYear.year+'年'+(getMonthYear.month)+'月</td>').insertBefore($('td:first','#dayHead'));
                    }
                    dayCalendar(getMonthYear.year,getMonthYear.month,0);
                }
                document.getElementById('calendarNext').className = 'next';
                return false;
            });
            $('#calendarNext').unbind('click').bind('click',function(){
                if($(this).hasClass('nextNo'))return false;
                reelectedYN = 0;
                calendarMsg('');
                if(calendarType=='week'){
                    var lastYear = Number($('table:last','#weekbox').attr('date'));
                    weekCalendar(lastYear+1,1);
                }else if(calendarType=='month'){
                    var lastYear = Number($('table:last','#monthbox').attr('date'));
                    monthCalendar(lastYear+1,1);
                }else{
                    var lastDate = ($('table:last','#daybox').attr('date')).split('/')
                        ,getMonthYear = getPrevNextDate(Number(lastDate[0]),Number(lastDate[1]),0);
                    $('td:first','#dayHead').remove();
                    if(ops.dayNumber == 1 ){
                        document.getElementById('dayHead').getElementsByTagName('tr')[0].innerHTML = '<td width="174">'+getMonthYear.year+'年'+(getMonthYear.month)+'月</td>';
                    }else{
                        $('<td width="174">'+getMonthYear.year+'年'+getMonthYear.month+'月</td>').insertAfter($('td:last','#dayHead'));
                    }
                    dayCalendar(getMonthYear.year,getMonthYear.month,1);
                }
                document.getElementById('calendarPrev').className = 'prev';
                return false;
            });
            $('td.date').hover(function(){
                $(this).addClass('cur');
            },function(){
                $(this).removeClass('cur');
            });
        }
        /**
         * 日历生成
         * @param type 日历模式
         * @param boxid 内容Box
         * @param prevNextType 翻页模式
         * @param calendarStr 生成内容
         * @return {Boolean}
         */
        function createCalendar(mode,boxid,prevNextType,calendarStr){
            calendarStr+= '</tr></table>';
            if(prevNextType==1){
                $('table:first',boxid).remove();
                $(boxid).append(calendarStr);
            }else if(prevNextType == 0){
                $('table:last',boxid).remove();
                $(boxid).prepend(calendarStr);
            }else{
                $(boxid).prepend(calendarStr);
            }
            prevNext(mode);
            selectDate(mode,boxid);
            confirmOpare(mode);
            if(reelectedYN){
                var startInputVal = startInput.val()
                    ,endInputVal = endInput.val()
                    ,tdFirst = $("td[title*='"+ startInputVal +"']",boxid)
                    ,tdLast = $("td[title*='"+ endInputVal +"']",boxid);
                if(tdFirst.length>0&&!tdFirst.hasClass('sltCalendar')){
                    tdFirst[0].className = 'date sltCalendar';
                    if(ops.radio){return false;}
                    if((tdLast.length>0&&tdFirst.attr('title').indexOf(endInputVal))<0&&!tdLast.hasClass('sltCalendar')){
                        tdLast[0].className = 'date sltCalendar';
                        setTimeout(function(){defalutSelect();},140);
                    }
                }
            }
            $('#calenderBox').siblings().click(function(){
                closeCalendar();
            });
            return false;
        }

        /**
         * 打开日历默认选中
         */
        function defalutSelect(){
            var tdFlag = false
                ,firstIndex = $('td.date','#calenderBox').index($('td.sltCalendar:first','#calenderBox'))
                ,lastIndex = $('td.date','#calenderBox').index($('td.sltCalendar:last','#calenderBox'));
            for(var td = lastIndex-1;td>firstIndex;td--){
                $('td.date','#calenderBox')[td].className = 'date sltCalendar';
            }
        }
        /**
         * 获取前或后时间
         * @param relativeYear 当前年
         * @param relativeMonth 当前月
         * @param relativePrevNext 向前还是向后
         */
        function getPrevNextDate(relativeYear,relativeMonth,relativePrevNext){
            if(relativePrevNext){
                if(relativeMonth>1){
                    return {year:relativeYear,month:relativeMonth-1};
                }else{
                    return {year:relativeYear-1,month:12};
                }
            }else{
                if(relativeMonth==12){
                    return {year:relativeYear+1,month:1};
                }else{
                    return {year:relativeYear,month:relativeMonth+1};
                }
            }
        }
        /**
         * 数字位加0
         * @param num 数字
         * @return {String}
         */
       function numDeal(num){
           return num < 10? "0"+num:num;
       }
        /**
         * 闰二月天数
         * @param yearNum 年
         * @param month 月
         * @return {*}
         */
       function monthDays(yearNum,month){
           var monthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
           if (((yearNum % 4 == 0) && (yearNum % 100 != 0)) || (yearNum % 400 == 0)){
               monthArray[1] = 29;
           }
           if(month>=0){
              return monthArray[month];
           }else{
              return monthArray;
           }
       }
        /**
         * 数据数据排序
         * @param sortArray 数组
         * @return {*}
         * @constructor
         */
       function sortNumber(sortArray){
           return sortArray.sort(function(a,b){return a>b?1:-1});
       }
        /**
         * 日历确认与取消操作
         * @param modeType 日历模式
         */
       function confirmOpare(modeType){
            $('#calendarCancel,#calendarConfir').click(function(){
                 if(($(this)[0].id).indexOf('ancel')>-1){
                     clearSelect();
                     calendarMsg('');
                 }else{
                     if(!$('.sltCalendar').length){return false;}
                     var startTimeValue = $('.sltCalendar:first').attr('title')
                         ,endTimeValue = $('.sltCalendar:last').attr('title');
                     if(modeType != 'day'|''){
                         startTimeValue = (startTimeValue.split(/\s+[\u4E00-\u9FA5]\s+/g))[0];
                         endTimeValue = (endTimeValue.split(/\s+[\u4E00-\u9FA5]\s+/g))[1];
                     }
                     startInput.val(startTimeValue).css('color','#0067d6');
                     endInput.val(endTimeValue).css('color','#0067d6');
                     $(ops.input).attr('datatype',modeType);
                     if(ops.clickFun!=null){
                         eval(ops.clickFun+'()');
                     }
                     closeCalendar();
                 }
                return false;
            });
       }
        /**
         * 日历操作提示
         * @param msg 提示内容
         */
       function calendarMsg(msg){
           $('#calendarMsg').text(msg);
       }
        /**
         * 关闭日历*/
        function closeCalendar(){
            $('#calenderBox').remove();
        }
        /**
         * 取消选择*/
        function clearSelect(){
            $('td.sltCalendar').removeClass('sltCalendar');
        }
		/**
         * input设置属性*/
/*			$('.day').click(function(){
				$(inputDom).attr('timetype','multiple,day');
			});
			$('.week').click(function(){
				$(inputDom).attr('timetype','multiple,week');
			});
			$('.month').click(function(){
				$(inputDom).attr('timetype','multiple,month');
			});*/
		 
    };
})(jQuery);
