// JavaScript Document
/* parameter ex--
   title:"经营快照"
   fileds:{
	   		id:{
				'title':"编号"
			},
		    name:{
			    'title':"姓名"
			}
		  }
remote json 
{
	total:30,
	data:[
		{Name:"tom",EmailAddress:"上海
",Password:"123456",Gender:"man",CityId:"021",BirthDate:"198910006",Education:"College",About:"web-frond-dev"},
		{Name:"tom",EmailAddress:"上海",Password:"123456",Gender:"man",CityId:"021",BirthDate:"198910006",Education:"College",About:"web-frond-dev"},
		{Name:"tom",EmailAddress:"上海",Password:"123456",Gender:"man",CityId:"021",BirthDate:"198910006",Education:"College",About:"web-frond-dev"},
		{Name:"tom",EmailAddress:"上海",Password:"123456",Gender:"man",CityId:"021",BirthDate:"198910006",Education:"College",About:"web-frond-dev"},
		{Name:"tom",EmailAddress:"上海",Password:"123456",Gender:"man",CityId:"021",BirthDate:"198910006",Education:"College",About:"web-frond-dev"},
		{Name:"tom",EmailAddress:"上海",Password:"123456",Gender:"man",CityId:"021",BirthDate:"198910006",Education:"College",About:"web-frond-dev"},
		{Name:"tom",EmailAddress:"上海",Password:"123456",Gender:"man",CityId:"021",BirthDate:"198910006",Education:"College",About:"web-frond-dev"},
		{Name:"tom",EmailAddress:"上海",Password:"123456",Gender:"man",CityId:"021",BirthDate:"198910006",Education:"College",About:"web-frond-dev"}
	]	  
}
*/
;(function(w,d,$,undefined){
	var ui_custome_rtable = function(options){
	    this.options = $.extend({
				  domWraper:"",
				  title:"",
				  pagesize:10,
				  datasource:"",
				  fields:{
						  Name: {
							  title: 'Name',
						  },
						  EmailAddress: {
							  title: 'Email address',
						  },
						  Password: {
							  title: 'User Password',
						  },
						  Gender: {
							  title: 'Gender',
						  },
						  CityId: {
							  title: 'City',
						  },
						  BirthDate: {
							  title: 'Birth date',
							   
						  },
						  Education: {
							  title: 'Education',
						  },
						  About: {
							  title: 'About this person',
						  }
				   }
				},options);
		this.pagesize = options.pagesize;
		this.domWraper = document.getElementById(options.domWraper);
		this.prepageclicked = 1;
	    this.init.call(this,options);
	}
	
	ui_custome_rtable.prototype.init = function(){
	    var _this = this;
		this.tableObj = document.createElement("table");
		this.tableObj.className = "bi-ui-rtable";
		this.tableObj.setAttribute("width","100%");
		this._thead = document.createElement("thead");
		var _tr = document.createElement("tr");
		for(var i in _this.options.fields){
			for(var j in _this.options.fields[i]){
				var _td = document.createElement("td");
				var _title = document.createTextNode(_this.options.fields[i][j])
				_td.appendChild(_title);
				_tr.appendChild(_td);
			}
		}
		this._thead.appendChild(_tr);
		this.loadtbody.call(this); 
	}
	
	ui_custome_rtable.prototype.loadtbody = function(){
		var _this = this;
		this._tableFrag = null;
		this._tableFrag = document.createDocumentFragment();
		this._tableFrag.appendChild(this._thead);
		this.getData({datasource:this.options.datasource,pagenum:1},function(data){
			if(_this.tableObj.hasChildNodes()){
			   _this.tableObj.removeChild(_this.tableObj.childNodes[0]);
			}
			_this._tableFrag.appendChild(_this.datafit.call(_this,data));
			_this.tableObj.appendChild(_this._tableFrag);
			
			if(_this.domWraper.hasChildNodes()){
				_this.domWraper.removeChild(_this.domWraper.lastChild)
			}
			_this.domWraper.appendChild(_this.tableObj);
			_this.domWraper.appendChild((_this.pagelistfit.call(_this,data.total,_this.pagesize,data.currPageNum))[0]);
		 	_this.pagenavBind.call(_this);
		 })
	}
	
	ui_custome_rtable.prototype.getData = function(options,func){
		var _this = this;
		$.ajax({
		     url:options.datasource,
			type:"GET",
			data:{pagenum:options.pagenum,pagesize:_this.pagesize},
			beforeSend:function(){},
			error:function(){console.log('error')},
			success:function(data){
				func(data)
			},
			dataType:"json"
		});
	}
	
	ui_custome_rtable.prototype.datafit = function(data){
		var _tbody = document.createElement("tbody");
		for(var i = 0; i<data.data.length; i++){
			 var _tr = document.createElement("tr");
			 for(var j in data.data[i]){
			 	 _td = document.createElement("td"),
			     _text = document.createTextNode(data.data[i][j]);
				 _td.appendChild(_text);
				 _tr.appendChild(_td);
			 }
			_tbody.appendChild(_tr); 
		}
		return _tbody;
	}
	
	ui_custome_rtable.prototype.pagelistfit = function(total,pagesize,currpagenum){
		this.total = total;
		this.pagenum =total%pagesize>0?parseInt(total/pagesize)+1:total/pagesize;
	    var _pagedom = $('<div class="bi-ui-rtable-bottompanel"></div>'), _pagelistdom = "";
		var _pagelisttemp = "",_pagelistnum="",_rangenum="";
		this.pagenum*pagesize > total ? _rangenum = (currpagenum-1)*pagesize+1+" - "+currpagenum*pagesize:_rangenum = (currpagenum-1)*pagesize+1+" - "+currpagenum*pagesize;
		for(var i = 1;i <= this.pagenum; i++){
			var _t = "",_n = "";
			i == currpagenum?_t= "bi-ui-rtable-pagelist-curr bi-ui-rtable-pagelist-disabled":"";
			i == currpagenum?_n="selected":"";
			_pagelisttemp+='<span class="bi-ui-rtable-pagelist-num '+_t+'">'+i+'</span>';
			_pagelistnum+="<option >"+i+"</option>";
		}
		
		if(this.pagenum<=7){
			_pagelistdom='<div class="bi-ui-rtable-bottompanel-left">'+
							'<span class="bi-ui-rtable-pagelist">'+
								 '<span class="bi-ui-rtable-pagelist-first bi-ui-rtable-pagelist-disabled">&laquo;</span>'+  
								 '<span class="bi-ui-rtable-pagelist-pre bi-ui-rtable-pagelist-disabled">&lsaquo;</span>'+ 
								 _pagelisttemp+
								 '<span class="bi-ui-rtable-pagelist-next  bi-ui-rtable-pagelist-disabled">&rsaquo;</span>'+ 
								 '<span class="bi-ui-rtable-pagelist-last  bi-ui-rtable-pagelist-disabled">&raquo;</span>'+
							 '</span>'+
							 '<span class="bi-ui-rtable-goto">'+
									'<span>转到：</span><select class="goto">'+_pagelistnum+'</select>'+
							 '</span>'+
							 '<span class="bi-ui-rtable-count">'+
									'<span>每页：</span><select class="goto" value="'+pagesize+'"><option>10</option><option>20</option><option>50</option></select>'+
							 '</span>'+
						 '</div>'+
						 '<span class="bi-ui-rtable-bottompanel-right">'+
							'<span class="bi-ui-rtable-rangenum">'+_rangenum+'</span>'+
							'<span class="bi-ui-rtable-totalnum">   总数:'+this.total+'</span>'+
						'</span>';
			return  _pagedom.append(_pagelistdom);
		}else if(this.pagenum>7){
			var _predom = '<span class="bi-ui-rtable-pagelist-first">&laquo;</span>'+  
						  '<span class="bi-ui-rtable-pagelist-pre">&lsaquo;</span>',
			    _behinddom = '<span class="bi-ui-rtable-pagelist-next ">&rsaquo;</span>'+ 
							 '<span class="bi-ui-rtable-pagelist-last ">&raquo;</span>';
			if(currpagenum==1){
				_predom = '<span class="bi-ui-rtable-pagelist-first bi-ui-rtable-pagelist-disabled">&laquo;</span>'+  
						  '<span class="bi-ui-rtable-pagelist-pre bi-ui-rtable-pagelist-disabled">&lsaquo;</span>';
			}
			if(currpagenum == this.pagenum){
				_behinddom = '<span class="bi-ui-rtable-pagelist-next bi-ui-rtable-pagelist-disabled">&rsaquo;</span>'+ 
							 '<span class="bi-ui-rtable-pagelist-last bi-ui-rtable-pagelist-disabled">&raquo;</span>';
			}
			_pagelisttemp="";
			console.log("currpagenum ："+currpagenum);
			if(currpagenum<=4){
				 var _i = 1;
				 for( ; _i <=  currpagenum ; _i++){
					var  _c = '';
					_i==currpagenum?_c = "bi-ui-rtable-pagelist-curr bi-ui-rtable-pagelist-disabled":"";
				 	_pagelisttemp +='<span class="bi-ui-rtable-pagelist-num '+_c+'">'+_i+'</span>';
				 }
				 _pagelisttemp +='<span class="bi-ui-rtable-pagelist-num">'+(_i)+'</span>'+
				                 '<span class="bi-ui-rtable-pagelist-space">...</span>'+
				 				 '<span class="bi-ui-rtable-pagelist-num">'+(this.pagenum-1)+'</span>'+
								 '<span class="bi-ui-rtable-pagelist-num">'+(this.pagenum)+'</span>';
			}else if(currpagenum>=this.pagenum-4){
				 _pagelisttemp +='<span class="bi-ui-rtable-pagelist-num">1</span>'+
				 				 '<span class="bi-ui-rtable-pagelist-num">2</span>'+
				                 '<span class="bi-ui-rtable-pagelist-space">...</span>';
			     var _i =  currpagenum;
				 _pagelisttemp +='<span class="bi-ui-rtable-pagelist-num ">'+(_i-1)+'</span>';
				 for(;_i<=this.pagenum;_i++){
				 	var  _c = '';
					_i==currpagenum?_c = "bi-ui-rtable-pagelist-curr bi-ui-rtable-pagelist-disabled":"";
					_pagelisttemp +='<span class="bi-ui-rtable-pagelist-num '+_c+'">'+_i+'</span>';
				 }
			}else if( currpagenum > 4 && currpagenum < this.pagenum-4){
				 _pagelisttemp +='<span class="bi-ui-rtable-pagelist-num">1</span>'+
				 				 '<span class="bi-ui-rtable-pagelist-num">2</span>'+
				                 '<span class="bi-ui-rtable-pagelist-space">...</span>'+
								 '<span class="bi-ui-rtable-pagelist-num">'+(currpagenum-1)+'</span>'+
								 '<span class="bi-ui-rtable-pagelist-num bi-ui-rtable-pagelist-curr bi-ui-rtable-pagelist-disabled">'+(currpagenum)+'</span>'+
								 '<span class="bi-ui-rtable-pagelist-num">'+(currpagenum+1)+'</span>'+
								 '<span class="bi-ui-rtable-pagelist-space">...</span>'+
								 '<span class="bi-ui-rtable-pagelist-num">'+(this.pagenum-1)+'</span>'+
								 '<span class="bi-ui-rtable-pagelist-num">'+(this.pagenum)+'</span>'; 
			}
			
			_pagelistdom='<div class="bi-ui-rtable-bottompanel-left">'+
							'<span class="bi-ui-rtable-pagelist">'+
								 _predom+ 
								 _pagelisttemp+
								 _behinddom+
							 '</span>'+
							 '<span class="bi-ui-rtable-goto">'+
									'<span>转到：</span><select class="goto">'+_pagelistnum+'</select>'+
							 '</span>'+
							 '<span class="bi-ui-rtable-count">'+
									'<span>每页：</span><select class="goto"><option>10</option><option>20</option><option>50</option></select>'+
							 '</span>'+
						 '</div>'+
						 '<span class="bi-ui-rtable-bottompanel-right">'+
							'<span class="bi-ui-rtable-rangenum">'+_rangenum+'</span>'+
							'<span class="bi-ui-rtable-totalnum">   总数:'+this.total+'</span>'+
						 '</span>';
			return  _pagedom.append(_pagelistdom);
		}		
	}
	
	ui_custome_rtable.prototype.pagenavBind = function (){
		var _this = this;
		$(this.domWraper).children(".bi-ui-rtable-bottompanel").find(".bi-ui-rtable-pagelist").children("span").bind('click',function(){
			 
			 if(!$(this).hasClass("bi-ui-rtable-pagelist-disabled")){
			 	 if($(this).hasClass("bi-ui-rtable-pagelist-num")){
				 	_this.postpagenum = $(this).text();
				 }else if($(this).hasClass("bi-ui-rtable-pagelist-first")){
				 	_this.postpagenum = 1;
				 }else if($(this).hasClass("bi-ui-rtable-pagelist-pre")){
				 	_this.postpagenum -= 1;
				 }else if($(this).hasClass("bi-ui-rtable-pagelist-next")){
					_this.postpagenum += 1;
				 }else if($(this).hasClass("bi-ui-rtable-pagelist-last")){
				 	_this.postpagenum += 1;
				 }
				 _this.loadtbody.call(_this)
			 }
	    }).end().siblings(".bi-ui-rtable-goto").children("select").change(function(e) {
             _this.pagenum  =  $(this).val();
			 _this.loadtbody.call(_this);
		}).end().siblings(".bi-ui-rtable-count").children("select").val(_this.pagesize).change(function(e) {
             _this.pagesize = $(this).val();
			 _this.loadtbody.call(_this)
        });
	}
	
	w.ui_custome_rtable = ui_custome_rtable;
	
})(window,document,jQuery)