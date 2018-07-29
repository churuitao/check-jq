/*
 * login.js
 * 功能：实现注册，登陆
 * 检查缓存中的数据，向页面中添加节点
 */

//存储localStorage中的宠物信息
var local_user_pets;
//存储在线用户的信息
var user_info_temp;
//存储img文件的Base64格式
var filePath;
//储存所有宠物的名称
var pet_names_list = new Array();
//指针对象
let _this = this;
//用户名、密码及宠物名的正则
const name_ragu = /^[0-9a-zA-Z\u4e00-\u9fa5_]{3,12}$/;
const pass_ragu = /^[\w]{6,18}$/;
const pet_name_ragu = /^[a-zA-Z\u4e00-\u9fa5_]{1,6}$/;
//选择宠物图片时触发的事件
//会对选择的文件进行判断，判断其是否为图片格式
$('#petImageFile input').change(function(){
	var file = this.files[0];
	if(file==undefined){
		$('#petImageFile').children("label").html("选择宠物照片");
		return;
	}
	if(!/image\/\w+/.test(file.type)){ 
		alert("请确保文件为图像类型"); 
		return; 
 	}
	$('#petImageFile').children("label").html($(this).val().split("\\")[2]);
	//创建一个文件输入流，把图片文件解析为Base64格式并存储起来
	var reader = new FileReader(); 
	reader.readAsDataURL(file); 
	reader.onload = function(e){  
		var temp = this.result;
		_this.filePath = temp;
	}
});
//判断loaclStrage中是否有用户在线
checkLogined();
//显示登陆窗口
$("#user").click(function(){
	$("#user-login-register").show(400);
});
//隐藏并清除登陆窗口
$("#close-login").click(function(){
	$("#user-login-register").hide(400,function(){
		clearLogin();
	});
});
//显示用户信息窗口
$("#user-login").click(function(){
	$("#user-info").show(400);
});
//关闭并清除用户信息界面
$("#close-info").click(function(){
	$("#user-info").hide(400,function(){
		clearLogin();
	});
});
//关闭用户信息界面并退出登陆
$("#close-info-exit").click(function(){
	$("#user-info").hide(400,function(){
		//解析localStrage中用户的信息
		var info = eval('(' + localStorage.getItem($("#user-info .name-lab").html()) + ')');
		login_exit_Action($("#user-info .name-lab").html(),info,false);
		//清除登陆的用户名
		user_info_temp="";
		//清除名字数组
		pet_names_list.length=0;
		alert("退出登陆成功");
	});
});
//显示并清除添加宠物面板
$("#add-pet").click(function(){
	clearadd_edit_pet();
	$("#user-add-edit-pet").show(400);
});
//隐藏并清除添加宠物面板
$("#close-edit-add-pet").click(function(){
	hide_add_edit();
});
//隐藏并清除添加宠物面板
function hide_add_edit(){
	$("#user-add-edit-pet").hide(400,function(){
		clearadd_edit_pet();
	});
}
//添加/修改宠物方法
$("#edit-add-pet").click(function(){
	if($(this).parent().siblings(".card-header").children("h3").html().substring(0,2)!="修改"){
		if($("#pet-name").children("input").val()==""){
			alert("请输入宠物名称！");
		}else if($("#petImageFile input").val()==""){
			alert("请选择宠物图片");
		}else if(!check_pet_name($("#pet-name").children("input").val())){
			alert("宠物名已经存在了！");
		}else if(!pet_name_ragu.test($("#pet-name").children("input").val())){
			alert("宠物名不规范\n1-5位英文字母或汉字的组合")
		}else{
			//添加宠物
			console.log("修改宠物");
			add_edit_pet($("#pet-name").children("input").val(),$("#pet-type select").prop('selectedIndex'),$("#pet-attribute select").prop('selectedIndex'),_this.filePath,true);
			hide_add_edit();
		}
	}else{
		console.log("修改宠物");
		var fileData = _this.filePath;
		if(!fileData){
			fileData = imgBase64;
		}
		//修改宠物
		add_edit_pet($("#pet-name").children("input").val(),$("#pet-type select").prop('selectedIndex'),$("#pet-attribute select").prop('selectedIndex'),fileData,false);
		hide_add_edit();
	}
});
//注册按钮点击事件
//进行各种判断，通过验证后，将信息转换为JSON字符串存到localStrage中，并设置其为登陆状态
$("#btn-register").click(function(){
	//判断其注册是否为注册状态
	if($(this).attr("power")==="off"){
		$("#password-check").show();
		$(this).attr("power","on");
		$("#btn-login").attr("power","off");
		$(".card-header h3").text("注册");
	}else{
		if($("#username input").val()===""){
			alert("用户名为空");
		}else if($("#password input").val()===""){
			alert("密码为空");
		}else if($("#password-check input").val()===""){
			alert("确认密码为空");
		}else if($("#password input").val()!=$("#password-check input").val()){
			alert("两次密码不相同，请重新输入");
		}else if(!name_ragu.test($("#username input").val())){
			alert("用户名不规范\n3-12位英文字母数字或汉字的组合");
		}else if(!pass_ragu.test($("#password input").val())){
			alert("密码不规范\n6-18位英文字母数字及字符的组合")	
		}else{
			//用户信息的JSON形式
			var info = {
			"name":$("#username input").val(),
			"pass":$("#password input").val(),
			"number":0,
			"static":false
			}
			//判断用户是否已经在localStrage中存在
			//存在就弹出提示信息，若没有就返回登陆界面
			if(addUser($("#username input").val(),JSON.stringify(info))){
				alert("注册成功");
				$(".card-header h3").text("登陆");
				$("#password input").val("");
				$("#password-check input").val("");
				$("#password-check").hide();
				$("#btn-login").attr("power","on");
				$(this).attr("power","off");
			}else{
				alert("用户名已存在");
			}
		}
	}
});
//登陆按钮点击事件
//判断其填写的没有问题，将输入的数据与localStrage中的数据进行比对，正确登陆，错误提示
$("#btn-login").click(function(){
	if($(this).attr("power")==="off"){
		$("#password-check").hide();
		$(this).attr("power","on");
		$("#btn-register").attr("power","off");
		$("#password-check input").val("");
		$("#password input").val("");
		$(".card-header h3").text("登陆");
	}else{
		if($("#username input").val()===""){
			alert("用户名为空");
		}else if($("#password input").val()===""){
			alert("密码为空");
		}else{
			if(localStorage.getItem($("#username input").val())) {
				var info = eval('(' + localStorage.getItem($("#username input").val()) + ')');
				if($("#password input").val()==info.pass){
					if(info.static==false){
						alert("登陆成功");
						//设置登陆后的信息
						console.log(info);
						login_exit_Action($("#username input").val(),info,true);
					}else{
						alert("用户已经登陆登陆过了");
					}
				}else{
					alert("密码错误");
				}
			}else{
				alert("该用户不存在");
			}
		}
	}
});
//清除登陆页面
function clearLogin(){
	$("#password-check").hide();
	$("#btn-login").attr("power","on");
	$("#btn-register").attr("power","off");
	$("#username input").val("");
	$("#password input").val("");
	$("#password-check input").val("");
}
//清除添加宠物界面
function clearadd_edit_pet(){
	_this.filePath="";
	$("#pet-name input").prop('disabled', false); 
	$("#user-add-edit-pet").find("h3").html("添加宠物");
	$("#edit-add-pet").html("添加");
	$("#pet-name").children("input").val("");
	$("#pet-type select").get(0).selectedIndex=0;
	$("#pet-attribute select").get(0).selectedIndex=0;
	$("#petImageFile input").val("");
	$("#petImageFile label").html("选择宠物图片");
}

//向localStrage中添加数据，添加成功返回true，反之返回false
function addUser(name, info) {
	if(localStorage.getItem(name))
		return false;
	localStorage.setItem(name, info);
	return true;
}

//添加/修改宠物方法
//name:宠物的名称	type:宠物的类型		attribute:表示宠物的系别		imgPath:图片的Base64格式	
//control  true 表示添加宠物	false 表示修改宠物
function add_edit_pet(name,type,attribute,imgPath,control){
	//litter存储宠物名称的拼音开头大写字母
	var litter = String(pinyin.getCamelChars(name)).substring(0,1);
	//判断宠物的类别
	switch(type){
		case 0: type="";break;
		case 1: type="god";break;
		case 2: type="super";break;
		case 3: type="rare";break;
		case 4: type="vip";break;
		case 5: type="boss";break;
	}
	//控制台打印宠物资料
	console.log("++++宠物资料+++++");
	console.log("宠物名称："+name);
	console.log("开头字母"+litter);
	console.log("className："+type);
	console.log("系别编号："+(1001+attribute));
	console.log("文件biase 64："+imgPath);
	//将宠物信息转化为JSON字符串
	var pet_info = {
            "pet_name":name,
            "litter":litter,
            "type":type,
            "attribute":attribute,
            "img_path":imgPath
   		}
	
	if(control){
		//向页面添加宠物
		addHtmlPet(pet_info,true);
		//向localStorage添加数据
		useradd_edit_pet($("#user-info .name-lab").html(),pet_info);
		pet_names_list.push(pet_info.pet_name);
	}else{
		var item = $("[name="+name+"]");
		$(item).children("p").children("small").html(pet_info.pet_name);
		$(item).attr("rel",pet_info.litter+"|"+(1001+pet_info.attribute));
		$(item).attr("name",pet_info.pet_name);
		$(item).attr("user",user_info_temp.name);
		$(item).children("ins").attr("class",pet_info.type);
		$(item).children("img").attr("src",pet_info.img_path);
		
		//把上面的JSON字符串放到指定位置
		edit_pet(pet_info);
	}
	
}

//登陆/退出登陆方法
//name:用户名		info:用户信息的JSON字符串
//sta    true:表示登陆		false:表示退出登陆
function login_exit_Action(name,info,sta) {
	//设置用户据的状态为其传过来的sta值
	info.static=sta;
	
	if(sta==true){
		setUserInfo(name,info);
		$("#user").hide();
		$("#user-login").show();
		$("#add-pet").show();
		local_user_pets = JSON.parse(localStorage.getItem(user_info_temp.name+"-pets"));
		//将用户的缓存宠物添加到页面中
		if(local_user_pets){
			for(var i=0;i<local_user_pets.length;i++){
				pet_names_list.push(local_user_pets[i].pet_name);
				addHtmlPet(local_user_pets[i],true);
			}
			user_info_temp.number=local_user_pets.length;;
			$(".number-lab").html(user_info_temp.number);
		}
	}else{
		console.log("用户退出登陆");
		//设置页面的一些设置
		$("#user").show();
		$("#user-login").hide();
		$("#add-pet").hide();
		//将页面中用户的个人宠物节点删除
		var userPetsTemp = $("#pets-list").find(".edit-panel");
		for(var i=0;i<userPetsTemp.length;i++){
			$(userPetsTemp[i]).parent().remove();
		}
	}
	//隐藏并清除登陆页面
	$("#user-login-register").hide(400,function(){
		clearLogin();
	});
	
	updateInfo(name,info);
}

//设置用户的个人信息
function setUserInfo(name,info){
	$("#user-info .name-lab").html(name);
	console.log(info.static);
	$("#user-info .static-lab").html(""+info.static);
	$("#user-info .number-lab").html(info.number);
	user_info_temp=info;
}

//判断缓存中用户的登陆情况
function checkLogined(){
	for(var key in localStorage) {
		var info = JSON.parse(localStorage.getItem(key));
		if(info != null){
			if(info.static == true) {
				console.log("在线用户：",key);
				login_exit_Action(key,info,true);
			}
		}
	}
}

//修改localStorage中的用户信息
function updateInfo(name,info){
	localStorage.setItem(name,JSON.stringify(info));
}

//添加loaclStorage中的用户的宠物信息
function useradd_edit_pet(user_name,pet_info){
	var temp_info = JSON.parse(localStorage.getItem(user_name+"-pets"));
	if(temp_info){
		//localStorage 对象中新增加一个宠物
		temp_info.push(pet_info);
		localStorage.setItem(user_name+"-pets",JSON.stringify(temp_info));
	}else{
		//声明一个数组，用来存所有宠物
		var arr = new Array();
		arr.push(pet_info);
		localStorage.setItem(user_name+"-pets",JSON.stringify(arr));
	}
	local_user_pets = temp_info;
	//修改用户点的信息
	user_info_temp.number+=1;
	$(".number-lab").html(user_info_temp.number);
	updateInfo(user_info_temp.name,user_info_temp);
}

//向页面添加宠物
//pet_info 宠物的信息 
//sta  true 
function addHtmlPet(pet_info,sta){
	var tempNode;
	if(sta){
		//可以编辑和删除
		tempNode = $('<div class="col-md-2" rel="" name= ""><div class="card edit-panel" ><button class="btn-edit btn-info">修改</button><button class="btn-delect btn-danger">删除</button></div><img class="img-fluid"  src="" alt="" /><ins class=""></ins><p class="text-muted text-center"><small></small></p><button class="btn btn-sm btn-danger catch">捕捉</button><button class="btn btn-sm btn-info exercise">练级</button></div>');
		$(tempNode).attr("user",user_info_temp.name);
	}else{
		//不能编辑和删除
		tempNode = $('<div class="col-md-2" rel="" name= ""><img  class="img-fluid" src="" alt="" /><ins class=""></ins><p class="text-muted text-center"><small></small></p><button class="btn btn-sm btn-danger catch">捕捉</button><button class="btn btn-sm btn-info exercise">练级</button></div>');		
	}
	//设置各种属性
	$(tempNode).children("p").children("small").html(pet_info.pet_name);
	$(tempNode).attr("rel",pet_info.litter+"|"+(1001+pet_info.attribute));
	$(tempNode).attr("name",pet_info.pet_name);
	$(tempNode).children("ins").attr("class",pet_info.type);
	tempNode.children("img").attr("src",pet_info.img_path);
	
	$("#pets-list .col-md-2:last").after(tempNode);
	if(sta){
		//添加修改和删除面板
		addHover(tempNode);
		//给按钮加上监听
		addClickAction($(tempNode).children(".edit-panel"));
	}
}

//判断宠物名是否存在
function check_pet_name(name){
	for(var i=0;i<pet_names_list.length;i++){
		console.log(pet_names_list[i]);
		if(pet_names_list[i]==name){
			return false;
		}
	}
	return true;
}
