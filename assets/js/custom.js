// JavaScript Document
/*
	desc:当前页面效果脚本
	time:2013-3-12
	au:tom
*/
$(function(){
	//左侧导航伸缩
	var _bodyWidth = $(window.document.body).width(),isclicked=false;
	
	function sidebar_binding(_bwidth){
		var _sidebar_toggle_btn = $("#sidebar-toggle-btn").children().children();
		if(_bwidth>1200){
			navigation_bind()
			$("#sidebar-toggle-btn").unbind('click').bind('click',function(){
			   _sidebar_toggle_btn.toggleClass("right");
			   isclicked = _sidebar_toggle_btn.hasClass("right");
			   if(isclicked){
			   		$("#navigation").find(".sub_navigation").hide(0);
			   }else{
			   		$("#navigation>ul>li.active").children(".sub_navigation").show(0);
			   }
			   
			   $("#navigation").parent().toggleClass("content_sidebar_70");
			   $("#mainContent").toggleClass("mainContent_ml70");
			});
		}else if(980<_bwidth && _bwidth<1200){
			navigation_bind()
			$("#sidebar-toggle-btn").unbind('click').bind('click',function(){
			   _sidebar_toggle_btn.toggleClass("right");
			   isclicked = _sidebar_toggle_btn.hasClass("right");
			   if(isclicked){
			   		$("#navigation").find(".sub_navigation").hide(0);
			   }else{
			   		$("#navigation>ul>li.active").children(".sub_navigation").show(0);
			   }
			   $("#navigation").parent().toggleClass("content_sidebar_45");
			   $("#mainContent").toggleClass("mainContent_ml45");
			});
		}else if(480<_bwidth && _bwidth<980){
			 $("#navigation>ul>li:not(:last)").removeClass("active").find("ul").hide();
			 $("#navigation>ul>li:not(:last)").unbind('mouseover').mouseover(function(e) {
				$("#navigation").data("curr-nav",$(this).index());
                $(this).addClass("active").siblings().removeClass("active");
				 var _t = $(this).position().top+2;
				 $(this).find("ul.sub_navigation").css("top",_t).show()
             }).unbind('mouseout').mouseout(function(){
			 	$(this).removeClass("active").find("ul.sub_navigation").hide().css("top",0);
			 });
		}else if(_bwidth<480){
			$("#nav-iphone").unbind('click').click(function(){
				 $("#nav-iphone").toggleClass('nav-iphone-on')
				 $("#navigation").slideToggle()
			});
			$("#navigation>ul>li:not(:last)").each(function(index, element) {
                $(this).unbind("mouseover").unbind("mouseout").bind('click',function(){
						$(this).children('ul').show(0).end().siblings().children('ul').hide(0);
				});
            });
		}
	}
 
	sidebar_binding(_bodyWidth);
	
	//监听窗口resize事件
	$(window).resize(function(e) {
        _bodyWidth = $(window.document.body).width();
		sidebar_binding(_bodyWidth);
		if(_bodyWidth>480){
			$("#navigation").show(0);
		}
		if(_bodyWidth>980){
			$("#navigation>ul>li:not(:last)").each(function(index, element) {
                $(this).unbind("mouseover").unbind("mouseout");
            });
			if(!isclicked){
				
				if($("#navigation").data("curr-nav")){
					$("#navigation>ul>li:not(:last)").eq($("#navigation").data("curr-nav")).addClass("active").children("ul").show(1);
				}else{
					$("#navigation>ul>li:not(:last)").eq(0).addClass("active").children("ul").show(1);
				} 
			}	
		}
		if(isclicked && _bodyWidth>1200 && $("#mainContent").hasClass("mainContent_ml45")){
			
		    $("#navigation").parent().removeClass("content_sidebar_45").toggleClass("content_sidebar_70");
			$("#mainContent").removeClass("mainContent_ml45").toggleClass("mainContent_ml70");
		}else if(isclicked && 980<_bodyWidth && _bodyWidth<1200 && $("#mainContent").hasClass("mainContent_ml70")){
			$("#navigation").parent().removeClass("content_sidebar_70").toggleClass("content_sidebar_45");
			$("#mainContent").removeClass("mainContent_ml70").toggleClass("mainContent_ml45");
		}else if(_bodyWidth<980){
			$("#navigation").parent().removeClass("content_sidebar_70");
			$("#mainContent").removeClass("mainContent_ml70");
		}
		
	});
	
	//>980px 绑定左边导航点击事件
	function navigation_bind(){
		$("#navigation>ul>:not(:last)").each(function(index, element) {
			$(element).unbind('click').live('click',function(){
				$("#navigation").data("curr-nav",$(this).index());
				var isclicked = $("#sidebar-toggle-btn").children().children().hasClass("right");
				//if(!$(this).hasClass("active")){
					if(!isclicked){
						$(this).children('ul').show(0);
						$(this).addClass('active').siblings(':not(:last)').each(function(index, element) {
							$(this).removeClass('active').children('ul').hide(0);
						});
					}else{
						$("#sidebar-toggle-btn").trigger('click');
						$("#navigation").find(".sub_navigation").hide(0);
					    $(this).addClass('active').children('ul').show(0)
							   .parent().siblings('.active').removeClass('active')
					}
				//}
			  });
   		 });
		 
		 $("#navigation>ul>:not(:last)").find("ul").children('li').each(function(index, element) {
			$(this).unbind('click').live('click',function(){
				$(this).addClass("active").siblings().removeClass("active");
				
			});
		});
	}
});
