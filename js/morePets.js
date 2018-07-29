/*
 * morePets.js
 * 更多宠物功能
 * 点击“显示更多按钮”，系统会用ajax服务器请求访问本地JSON文件，
 * 然后把读到的JSON文件信息进行存储，然后每次读取几个,
 * 调用addHtmlPet()方法将宠物添加到页面中。
 */

$(function(){
	//指针对象
	let _this = this;
	var json_pets;
	var begin=0;
	var temp = 0;
	var end;
	$("#morePets").click(function(){
		if(json_pets==undefined){
			//ajax是异步服务，将其强制转换为同步
			$.ajaxSettings.async = false; 
			$.getJSON("json/morePets.json",function(data){
				_this.json_pets=data;
				end=data.length;
			});
			
		}
		if(temp+6>end){
			temp=end;
			//隐藏显示更多宠物按钮
			$("#morePets").hide(400);
		}else{
			temp = begin+6;
		}
		for(var i=begin;i<temp;i++){
			addHtmlPet(_this.json_pets[i],false);
		}
		begin=i;
	});
});
