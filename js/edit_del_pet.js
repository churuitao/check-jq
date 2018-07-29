/*
 * edit_del_pet.js
 * 用于修改或删除宠物，同时修改或删除页面的数据和localStrage中的数据
 */

//所有页面登陆中的用户的信息
var user_pets = $("#pets-list").find(".edit-panel");
//用户存储图片的Base64格式的图片
var imgBase64;

//将页面中所有用户的宠物添加 “修改和删除 ”功能
for(var i=0;i<user_pets.length;i++){
	addClickAction(user_pets[i]);
}
//为对象添加修改宠物按钮监听和删除宠物按钮监听
function addClickAction(obj){
	
	$(obj).children("button").first().click(function(){
		console.log("修改宠物");
		//修改添加宠物界面
		$("#user-add-edit-pet h3").html("修改宠物");
		$("#edit-add-pet").html("修改");
		$("#pet-name input").prop('disabled', true); 
		var type = $(this).parent().siblings("ins").attr("class");
		//判断宠物的类别
		switch(type){
			case "": type=0;break;
			case "god": type=1;break;
			case "super": type=2;break;
			case "rare": type=3;break;
			case "vip": type=4;break;
			case "boss": type=5;break;
		}
		//将修改宠物的页面中的参数进行修改
		var att = $(this).parent().parent().attr("rel").split("|")[1];
		$("#pet-name").children("input").val($(this).parent().parent().attr("name"));
		$("#pet-type select").get(0).selectedIndex = type;
		$("#pet-attribute select").get(0).selectedIndex=att-1001;
		//用变量存储img的base64格式文件
		imgBase64 = $(this).parent().next().attr("src");
		$("#petImageFile label").html("点击重新选择图片");
		
		//显示修改宠物页面
		$("#user-add-edit-pet").show(400);
	});
	//删除宠物按钮监听
	$(obj).children("button").last().click(function(){
		if(window.confirm("你确定要删除这个宠物嘛？")){
			//删除localStrage中的宠物信息
			del_pet($(this).parent().parent().attr("name"));
			//删除页面中的宠物
			$(this).parent().parent().remove();
		}
	});
}

//删除loaclStrage中指定名字的宠物
function del_pet(name){
	console.log(local_user_pets);
	if(local_user_pets!=null){
		for(var i=0;i<local_user_pets.length;i++){
			console.log(local_user_pets[i].pet_name===name);
			if(local_user_pets[i].pet_name===name){
				//数组方法，参数1：起始位置   参数2:删除长度
				local_user_pets.splice(i,1);
			}
		}
	}
	console.log(local_user_pets);
	//更新localStorage中用户的宠物信息
	localStorage.setItem(user_info_temp.name+"-pets",JSON.stringify(local_user_pets));
	//修改用户点的信息
	user_info_temp.number-=1;
	$(".number-lab").html(user_info_temp.number);
	updateInfo(user_info_temp.name,user_info_temp);
}

//修改loaclStrage中宠物的信息    关键字段：名字
function edit_pet(info){
	console.log(info);
	if(local_user_pets){
		//对local_user_pets变量中的宠物进行遍历，查找指定宠物
		//如果名字和那个名字相同就把传过来的info设置到那个位置，并退出循环
		for(var i=0;i<local_user_pets.length;i++){
			if(local_user_pets[i].pet_name==info.pet_name){
				local_user_pets[i]=info;
				break;
			}
		}
	}
	console.log(local_user_pets);
	//把修改好的元素的JOSN字符串存到loaclStrage中
	localStorage.setItem(user_info_temp.name+"-pets",JSON.stringify(local_user_pets));
}
