//记录宠物导航的上一次操作。
var petsNav1;
var petsNav2;
var petsNav3;

$(function(){
	petsNav1 = $("#pets-nav").children().first();
	
	var petList = $("#pets-list .row .col-md-2");
	var petNav = $("#pets-nav");
	var litterQuery = $("#litter-query li");
	var attributeQuery = $("#attribute-query li");
	petsNav3 = attributeQuery.first();
	//按照种类查找
	for(var i=0;i<petNav.children().length;i++){
		$(petNav.children()[i]).click(function(){
			queryPets($(this).attr("rel"));
			clearNavs(1);
			$(this).addClass("active");
			petsNav1=$(this);
		});
	}
	//按照字母查找
	for(var i=0;i<litterQuery.length;i++){
		$(litterQuery[i]).click(function(){
			searchPets($(this).children("span").html());
			clearNavs(2);
			$(this).children("span").addClass("active");
			petsNav2 = $(this).children("span");
		});
	}
	//按照系别查找
	for(var i=0;i<attributeQuery.length;i++){
		$(attributeQuery[i]).click(function(){
			searchPets($(this).index()+1000);
			clearNavs(3);
			$(this).addClass("active");
			petsNav3 = $(this);
		});
	}
});
//查询宠物种类（类别）
function queryPets(rel){
	var petList = $("#pets-list .row .col-md-2");
	if(rel=="all"){
		for(var i=0;i<petList.length;i++){
			$(petList[i]).css("display","block");
		}
	}else{
		for(var i=0;i<petList.length;i++){
			$(petList[i]).css("display","block");
			if(!($(petList[i]).children("ins").attr("class")==rel)){
				$(petList[i]).css("display","none");
			}
		}
	}
}

//查询宠物的方法（字母、系别）
function searchPets(rel){
	var petList = $("#pets-list .row .col-md-2");
	if(rel=="all"||rel=="1000")
		rel="";
	for(var i=0;i<petList.length;i++){
		$(petList[i]).css("display","block");
		if(!String($(petList[i]).attr("rel")).includes(rel)){
			$(petList[i]).css("display","none");
		}
	}
}

//清除三个导航按钮状态
function clearNavs(index){
	console.log("清除上一次状态")
	$(petsNav1).removeClass("active");
	$(petsNav2).removeClass("active");
	$(petsNav3).removeClass("active");
	//设置默认的
	if(index==1){
		$("#attribute-query li").first().addClass("active");
		petsNav3=$("#attribute-query li").first();
	}
	else if(index==3){
		$("#pets-nav").children().first().addClass("active");
		petsNav1=$("#pets-nav").children().first();
	}else{
		$("#attribute-query li").first().addClass("active");
		$("#pets-nav").children().first().addClass("active");
		petsNav3=$("#attribute-query li").first();
		petsNav1=$("#pets-nav").children().first();
	}
}
