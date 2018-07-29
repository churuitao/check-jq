/*
 * hotPet.js
 * 实现小型宠物轮播图
 * 其内主要写了两个方法
 * 1.perv_btn  2.next_btn
 * 
 */
//上一页和下一页按钮
var prev = $("#hotReco-prev");
var next = $("#hotReco-next");
//声明判断按钮变量用与判断当前是否可以点击按钮
var check_btn = true;
//使用计时器保证用户不能多次点击按钮
//使用setTimeout把按钮进行限制，不能在1S内点击多次，至多一次.
//不能同时多次点击上一页/下一页按钮
prev.click(function(){
	if(check_btn){
		perv_btn();
		check_btn=false;
		setTimeout(function(){
			check_btn = true;
		},900);
	}
		
});
//不能同时多次点击上一页/下一页按钮
next.click(function(){
	if(check_btn){
		next_btn();
		check_btn=false;
		setTimeout(function(){
			check_btn = true;
		},900);
	}

});

//HOTPET上一页按钮功能
function perv_btn(){
	var temp = $("#hot-rowBox li:last");
	$("#hot-rowBox").children().last().remove();
	$("#hot-rowBox").prepend(temp).css("margin-left"," -147px").animate({"margin-left":'0px'},900);
}

//HOTPET上一页按钮功能
function next_btn(){
	var temp = $("#hot-rowBox li:first");
	$("#hot-rowBox").animate({"margin-left":'-148px'},900,function(){
		$(this).css("margin-left"," 0px");
		$(this).append(temp);
	});
}

//添加宠物修改和删除面板功能，使用鼠标移入和移除实现
function addHover(obj){
	$(obj).children("img").mouseenter(function(){
		$(this).siblings(".edit-panel").show();
	});
	$(obj).children(".edit-panel").mouseleave(function(){
		$(this).hide();
	});
}

