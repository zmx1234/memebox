//返回顶部
window.onscroll=function(){
	var sTop=document.documentElement.scrollTop || document.body.scrollTop;
	if(sTop>50){
		$('#top').css('display','block');
	}else{
		$('#top').css('display','none');
	}
}
$('#top').click(function(){
	document.documentElement.scrollTop=0;
})
//横排选项
$('.zy li').each(function(index,value){
	$(value).mouseenter(function(){
		$(this).siblings().find('.romve').hide();
		$(this).find('.romve').show();
	})
	$(value).mouseleave(function(){
		$(this).find('.romve').hide();
	})
})
//竖排选项
$('.mm .mian').each(function(index,value){
	$(value).mouseenter(function(){
		$(this).siblings().find('.mack_right').hide();
		$(this).find(".mack_right").show();
	})
	$(value).mouseleave(function(){
		$(this).find(".mack_right").hide();
	})
})

//轮播图	
$(function(){
	var callbackIndex = 0;
	$('.silder-box-1').mySilder({
		width:280, 
		height:400,
		auto:true,//是否自动滚动
		autoTime:5, //自动滚动时，时间间隙，即多长滚动一次,单位(秒)
		direction:'x',//滚动方向,默认X方向
		autoType:'left', //滚动方向，auto为true时生效
		few:1,//一次滚动几个，默认滚动1张
		showFew:4, //显示几个,就不用调css了,默认显示一个
		clearance:0, //容器之间的间隙，默认为 0
		silderMode:'linear' ,//滚动方式
		timeGap:350,//动画间隙，完成一次动画需要多长时间，默认700ms
		buttonPre:'.silder-button.btl',//上一个，按钮
		buttonNext:'.silder-button.btr',//下一个，按钮
		jz:true, //点击时，是否等待动画完成
		runEnd:function(){//回调函数
			callbackIndex ++ ;
			$('.cj em').text(callbackIndex);
		}
	})
})
	//页面加载后 ajax请求服务器数据
	$.ajax( {
		type:"get",
		url : "data.json",
		success : function(json){
			var conStr = "";
			for( var i = 0; i < json.length; i++ ){
				var pro = json[i];
				conStr += `<li>
								<a href="minute.html">
									<img src="img/${pro.src}" alt=""/>
									<p>${pro.name}</p>
									<p>${pro.name1}</p>
								</a>
								<div class="money">
									<p>${pro.price}</p>
									<button data-name="${pro.name}" data-name1="${pro.name1}" data-price="${pro.price}" data-src="${pro.src}" data-id="${pro.id}">加入购物车</button>
								</div>
							</li>`;
			}
	//		将内容列表添加到页面
			$(".shoplist").html( conStr );
		}
	})
	
	//添加购物车功能
	//当点击按钮时 将当前商品作为一个对象 存入到数组中
	//然后再将数组存入到cookie中 （存数组的原因是 用户有可能会买多件商品）
	//为多个购物车按钮添加单击事件  （因为按钮是动态创建的 ，在ajax的下面使用委托实现）
	$(".shoplist").on("click","button",function(){
		var moveImg = $(this).parent().parent().find("img");
		var startObj = $(this);
		var endObj = $(".shopp");
		$.fnInit(startObj,endObj).fnMove(moveImg);
		var arr = [];//用于存放多个商品对象  [{},{},{},....]
		var flag = true;//假设值为true时 执行push()操作
		//用于存放当前点击的商品信息
		var json = {
			"id ": $(this).data("id"),
			"src" : $(this).data("src"),
			"name" : $(this).data("name"),
			"name1": $(this).data("name1"),
			"price" : $(this).data("price"),
			"count" : 1
		}
		//再次点击时，先将cookie中的数据取出来（是一个数组）
		//将取出来的数组 先存入到 arr中 
		var brr = getCookie("shoplist");
		//第一次向数组中存对象时，cookie是没有数据的
		if( brr.length != 0 ){
			//当cookie中有数据时  才执行下面的操作
			arr = brr;
			//遍历数组arr  判断当前点击的商品是否在arr中存在，如果存在就将该商品的数量累加
			//判断依据 ：  当前点击的对象的id ==  arr[i].id
			for( var i = 0 ; i < arr.length ; i++ ){
				if( json.id == arr[i].id ){  
					arr[i].count++;
					flag = false;
					break;
				}
			}
		}
		if( flag ){
			//将json存入到数组中
			arr.push( json );
		}
		//在数组存入到cookie中  
		//cookie中存储的一定是字符串
		setCookie( "shoplist",JSON.stringify( arr ) );
	})
//}
//插件编写  抛物线
$.extend({
	fnInit : function(startObj,endObj){ //设置坐标
		//起始点坐标
		this.startPoint = {
			"x":startObj.offset().left + startObj.width()/2,
			"y":startObj.offset().top
		}
		//结束点坐标
		this.endPoint = {
			"x":endObj.offset().left + endObj.width()/2,
			"y": endObj.offset().top
		}
		//最高点坐标
		this.topPoint = {
			"x": this.endPoint.x - 100 ,
			"y": this.endPoint.y - 80
		}
		//根据三点坐标 
		//根据三点坐标确定抛物线的系数

		this.a = ((this.startPoint.y - this.endPoint.y) * (this.startPoint.x - this.topPoint.x) - (this.startPoint.y - this.topPoint.y) * (this.startPoint.x - this.endPoint.x)) / ((this.startPoint.x * this.startPoint.x - this.endPoint.x * this.endPoint.x) * (this.startPoint.x - this.topPoint.x)-(this.startPoint.x * this.startPoint.x - this.topPoint.x * this.topPoint.x) * (this.startPoint.x - this.endPoint.x));  
				
		this.b = ((this.endPoint.y - this.startPoint.y) - this.a * (this.endPoint.x * this.endPoint.x - this.startPoint.x * this.startPoint.x)) / (this.endPoint.x - this.startPoint.x);  
				
		this.c = this.startPoint.y - this.a * this.startPoint.x * this.startPoint.x - this.b * this.startPoint.x;
		return this;
	},
	fnMove :function(moveImg){ //商品运动
		//抛物线方程 ： y = this.a*x*x + this.b*x + this.c
		//创建商品：
		//商品的起始点坐标
		var x = this.startPoint.x;
		
		var y = this.startPoint.y;

		var  good = $("<img>");
		$("body").append(good);
		good.attr("src",moveImg.attr("src"));
		var x = this.startPoint.x;
		var y = this.startPoint.y;
		good.css({
			width : 20,
			height : 20,
			position : "absolute",
			left : x,
			top : y
		})
		var timer = setInterval(function(){
			x = x + 10;
			y = this.a*x*x + this.b*x + this.c;
			if( x < this.endPoint.x ){
				good.css({
					left : x,
					top : y
				})
			}else{
				good.css("top",this.endPoint.y);
				clearInterval(timer);
				good.remove();
				$("#shopNum").html( Number( $("#shopNum").html() )+1 );
			}
		}.bind(this),30)
	}
})
getCount();
function getCount(){
	var brr=getCookie("shoplist");
	var count = 0;
	if(brr.length !=0){
		for(var i=0; i<brr.length; i++){
			count += brr[i].count;
		}
		$('#shopNum').html(count);
	}
}

