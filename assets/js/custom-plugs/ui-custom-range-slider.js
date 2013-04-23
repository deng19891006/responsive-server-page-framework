// JavaScript Document
/*
	desc : ui-range-slider.js
		 : tom
		 : 2013-03-28
*/

/*;(function($,undefined){
	$.fn.extend({
		"ui_range_slider":function(options){
			options = $.extend({
						 startValue:300,
						 endValue:400,
						 maxValue:1000
					  },options);
			var _this = $(this),
				_startAccount = options.startValue/options.maxValue*100,
				_endAccount = options.endValue/options.maxValue*100,
				_rangeAccount = (_endAccount-_startAccount),
				_draging = "",
				_thisleft = _this.position().left,
				_offsetSmall = 0;
			var _ui_str = '<div class="ui-rangeSlider-horizontal">'
							+'<div class="ui-rangeSlider-range" style="left:'+_startAccount+'%; width:'+_rangeAccount+'%"></div>'
							+'<a class="ui-rangeSlider-btn lhandel" style="left:'+_startAccount+'%"></a>'
							+'<a class="ui-rangeSlider-btn rhandel " style="left:'+_endAccount+'%"></a>'
						 +'</div>';
						 
			_this.append(_ui_str);
			var _lhandel = _this.find('.lhandel') , _rhandel = _this.find('.rhandel'), _range=_this.find('.ui-rangeSlider-range');
			
			_lhandel.mousedown(function(e){
				_draging = 'l';
			    _offsetSmall = e.pageX-_lhandel.offset().left;
			});
			
			_rhandel.mousedown(function(e){
			 	_draging = 'r';
			    _offsetSmall = e.pageX-_rhandel.offset().left;
			});
			
			$(window.document).mousemove(function(e){
				 if(_draging=='l'){
					  var _t = ((e.pageX - _thisleft- _offsetSmall)/options.maxValue)*100;
					  if(_t>=0 && _lhandel.offset().left < _rhandel.offset().left){
					  	_lhandel.css({"left":_t+"%"})
						_range.css({"left":(_t)+"%","width":getRangeWidth()*100+"%"})
					  }
				 }else if(_draging=='r'){
				 	  var _t = ((e.pageX - _thisleft- _offsetSmall)/options.maxValue)*100;
					  if( _lhandel.offset().left <= _rhandel.offset().left){
					  	 _rhandel.css({"left":_t+"%"})
						_range.css({ "width":getRangeWidth()*100+"%"})
					  }
				}else{
				 	return ;
				}
			}).mouseup(function(e) {
                _draging="stop"
			});
			
			function getRangeWidth (){
				return (_rhandel.offset().left - _lhandel.offset().left)/options.maxValue;
			}
		}	
	});
})(jQuery)
*/

;(function($,undefined){
		/**
	 * 左补齐字符串
	 * 
	 * @param nSize
	 *            要补齐的长度
	 * @param ch
	 *            要补齐的字符
	 * @return
	 */
	String.prototype.padLeft = function(nSize, ch)
	{
		var len = 0;
		var s = this ? this : "";
		ch = ch ? ch : '0';// 默认补0
	
		len = s.length;
		while (len < nSize)
		{
			s = ch + s;
			len++;
		}
		return s;
	}
	
	/**
	 * 右补齐字符串
	 * 
	 * @param nSize
	 *            要补齐的长度
	 * @param ch
	 *            要补齐的字符
	 * @return
	 */
	String.prototype.padRight = function(nSize, ch)
	{
		var len = 0;
		var s = this ? this : "";
		ch = ch ? ch : '0';// 默认补0
	
		len = s.length;
		while (len < nSize)
		{
			s = s + ch;
			len++;
		}
		return s;
	}
	/**
	 * 左移小数点位置（用于数学计算，相当于除以Math.pow(10,scale)）
	 * 
	 * @param scale
	 *            要移位的刻度
	 * @return
	 */
	String.prototype.movePointLeft = function(scale)
	{
		var s, s1, s2, ch, ps, sign;
		ch = '.';
		sign = '';
		s = this ? this : "";
	
		if (scale <= 0) return s;
		ps = s.split('.');
		s1 = ps[0] ? ps[0] : "";
		s2 = ps[1] ? ps[1] : "";
		if (s1.slice(0, 1) == '-')
		{
			s1 = s1.slice(1);
			sign = '-';
		}
		if (s1.length <= scale)
		{
			ch = "0.";
			s1 = s1.padLeft(scale);
		}
		return sign + s1.slice(0, -scale) + ch + s1.slice(-scale) + s2;
	}
	/**
	 * 右移小数点位置（用于数学计算，相当于乘以Math.pow(10,scale)）
	 * 
	 * @param scale
	 *            要移位的刻度
	 * @return
	 */
	String.prototype.movePointRight = function(scale)
	{
		var s, s1, s2, ch, ps;
		ch = '.';
		s = this ? this : "";
	
		if (scale <= 0) return s;
		ps = s.split('.');
		s1 = ps[0] ? ps[0] : "";
		s2 = ps[1] ? ps[1] : "";
		if (s2.length <= scale)
		{
			ch = '';
			s2 = s2.padRight(scale);
		}
		return s1 + s2.slice(0, scale) + ch + s2.slice(scale, s2.length);
	}
	/**
	 * 移动小数点位置（用于数学计算，相当于（乘以/除以）Math.pow(10,scale)）
	 * 
	 * @param scale
	 *            要移位的刻度（正数表示向右移；负数表示向左移动；0返回原值）
	 * @return
	 */
	String.prototype.movePoint = function(scale)
	{
		if (scale >= 0)
			return this.movePointRight(scale);
		else
			return this.movePointLeft(-scale);
	}
	Number.prototype.toFixed = function(scale){
		var s, s1, s2, start;
	
		s1 = this + "";
		start = s1.indexOf(".");
		s = s1.movePoint(scale);
	
		if (start >= 0)
		{
			s2 = Number(s1.substr(start + scale + 1, 1));
			if (s2 >= 5 && this >= 0 || s2 < 5 && this < 0)
			{
				s = Math.ceil(s);
			}
			else
			{
				s = Math.floor(s);
			}
		}
	
		return s.toString().movePoint(-scale);
	}
	
	$.fn.extend({
		"ui_range_slider":function(options){
			options = $.extend({
						 startLabel:"",
						 endLabel:"",
						 startValue:330,
						 endValue:430,
						 maxValue:1200,
						 changed:function(sv,ev,tv){
						 	
						 }
					  },options);
			var _this = $(this),
				_startAccount = (options.startValue/options.maxValue*100).toFixed(1)
				_endAccount = (options.endValue/options.maxValue*100).toFixed(1),
				_rangeAccount = (_endAccount-_startAccount).toFixed(1),
				_draging = "",
				_thisleft = _this.offset().left,
				_offsetSmall = 0,
				_totalWidth = _this.width();
			 
			var _ui_str = '<div class="ui-rangeSlider-horizontal">'
							+'<div class="ui-rangeSlider-range" style="left:'+_startAccount+'%; width:'+_rangeAccount+'%"></div>'
							+'<a class="ui-rangeSlider-btn lhandel" style="left:'+_startAccount+'%"></a>'
							+'<a class="ui-rangeSlider-btn rhandel " style="left:'+_endAccount+'%"></a>'
						 +'</div>';
						 
			_this.append(_ui_str);
			var _lhandel = _this.find('.lhandel') , _rhandel = _this.find('.rhandel'), _range=_this.find('.ui-rangeSlider-range');
			
			_lhandel.mousedown(function(e){
				_thisleft = _this.offset().left;
				_totalWidth = _this.width();
				_draging = 'l';
				$(this).css({"z-index":2});
				_rhandel.css({"z-index":1});
			    _offsetSmall = e.pageX-_range.offset().left;
				e.stopPropagation();
        		e.preventDefault();
			});
			
			_rhandel.mousedown(function(e){
				_thisleft = _this.offset().left;
				_totalWidth = _this.width();
			 	_draging = 'r';
				$(this).css({"z-index":2});
				_lhandel.css({"z-index":1});
				_offsetSmall = e.pageX-_range.offset().left-_range.width();
				e.stopPropagation();
        		e.preventDefault();
			});
			  
			$(window.document.body).mousemove(function(e){
			     if(_draging=='l'){
					  var _lh = (_lhandel[0].style.left.split('%'))[0],
					 	  _rh = (_rhandel[0].style.left.split('%'))[0];
				      var _t = (((e.pageX - _thisleft- _offsetSmall)/_totalWidth)*100).toFixed(1);
					  if(_t>=0 && _t<=_rh){
						 _lhandel.css({"left":_t+"%"});
					   	   _range.css({"left":(_t)+"%","width":getRangeWidth()+"%"});
					  } 
				 }else if(_draging=='r'){
					  var _lh = (_lhandel[0].style.left.split('%'))[0],
					 	  _rh = (_rhandel[0].style.left.split('%'))[0];
				 	  var _t = (((e.pageX - _thisleft- _offsetSmall)/_totalWidth)*100).toFixed(1);
					  if( _t>=_lh && _t<=100){
					  	 _rhandel.css({"left":_t+"%"})
						_range.css({ "width":getRangeWidth()+"%"})
					  }
				}
			}).mouseup(function(e) {
                _draging="stop"
			});
			
			function getRangeWidth (){
				var _lh = _lhandel[0].style.left.split('%'),
					_rh = _rhandel[0].style.left.split('%');
				return ((_rh[0]-_lh[0]).toFixed(1));
			}
		}	
	});
})(jQuery)