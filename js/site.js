var filter = [];
var cID = 0;
var cLABEL = 1;
var cLABELS = 2;
var cITEMID = 3;
var cITEMNAME = 4;
var cSHOW = 6;
var brandcolors = [];
var sessionid;


jQuery(document).ready(function () {
    login();
    
	var timeout;
	
	//for stop dropdown hide inside click
	$('body').on('click','.dropdown-menu',function(e){
		e.stopPropagation();
	});
	
	//for show and hide add filter menu
	$('.add-filter-btn,ul.add-filter-list').on('mouseover', function(e){
		$(this).parent().addClass('open');
		clearTimeout(timeout);
	});
	
	$('.add-filter-btn,ul.add-filter-list').on('mouseout', function(e){
		var $this = $(this);
		timeout = setTimeout(function(){
			$this.parent().removeClass('open');
		}, 200);
	});
	
	//for page load check filter select and show them
	$('.add-filter-list input[type=checkbox]').each(function(){
		if($(this).prop("checked") != true){			
			$('.filter-container')
				.find("[data-filter-menu='" + $(this).attr('data-filter-box') + "']")
				.removeClass('active-filter');
		}
		SearchApparel(11);
	});
	
	//for show filter that user select from dropdown
	$('body').on('change','input[type=checkbox].add-filter-checkbox',function(){
		if($(this).prop("checked") != true){
			$('.filter-container')
				.find("[data-filter-menu='" + $(this).attr('data-filter-box') + "']").remove();
		}
		SearchApparel(11);
	});	

	$('body').on('change', '.js-filter-item input[type=checkbox]', function () {
	    SearchApparel(11);	    
	});
	//for show chosen filter to user
	$('body').on('change','.js-filter-item input[type=checkbox]',function(){
	    if ($(this).prop("checked") == true) {
	        var showFilter = $(this).next('.add-filter-name').text();
	        $(this).addClass('filterName' + showFilter.replace(/ /g, '') + '');
	        $(this)
				.parents('.filter-item:first')
				.append('<div class="chosen filterName' + showFilter.replace(/ /g, '') + '">' + showFilter + ' <span class="remove-chosenFilter">X</span></div>');
	    }
	    else {
	        var showFilter = $(this).next('.add-filter-name').text();
	        $(this).removeClass('filterName' + showFilter.replace(/ /g, '') + '');
	        $(this)
				.parents('.filter-item:first')
				.find('.filterName' + showFilter.replace(/ /g, '') + '').remove();
	    }
		SearchApparel(11);
	});
	
	//for remove chosen filter by user
	$('body').on('click','.remove-chosenFilter',function(){
		var showFilter = $(this).parent().attr('class');
		
		$(this)
			.parents('.filter-item:first')
			.find('input[type=checkbox].' +showFilter.replace('chosen ','')+'')
			.removeClass(showFilter)
			.prop("checked",false);
		$(this).parent().remove();
		SearchApparel(11);
	});	
});
function SetupSearch(productid) {
    if (productid == undefined)
        productid = 0;
    var xml = "<request><sessionid>" + sessionid + "</sessionid><productid>" + productid + "</productid></request>";
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/ApparelSearchSetup",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ApparelSearchSetupResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
                return;
            }
            else {
                var data = eval(r.Data);
                
                var COLORS = data[0];
                var CATS = data[1];
                var SORT = data[2];

                for (var i = 0; i < COLORS.length; i++) {
                    var c = COLORS[i];
                    brandcolors[c.ID] = c;                    
                }
                for (var i = 0; i < CATS.length; i++) {
                    var c = CATS[i];
                    var $html = [];
                    $html += '	<li class="js-filter-item">';
                    $html += '		<label>';
                    $html += '			<input type="checkbox" class="js-filter-checkbox" id="' + c.ID + '~0" CHECKED>';
                    $html += '			<span class="add-filter-name">All ' + c.Name + '</span>';
                    $html += '		</label>';
                    $html += '	</li>';
                    $html += '	<li class="divider"></li>';
                    for (var j = 0; j < c.Items.length; j++) {
                        var ci = c.Items[j];
                        $html += '	<li class="js-filter-item">';
                        $html += '		<label>';
                        $html += '			<input type="checkbox" class="js-filter-checkbox" id="' + c.ID + '~' + ci.ID + '" onchange="javascript:SearchApparel(11);">';
                        $html += '			<span class="add-filter-name">' + ci.Name + '</span>';
                        $html += '		</label>';
                        $html += '	</li>';
                    }
                    menuData = '';
                    var html = '<div class="btn-group filter-item active-filter" data-filter-menu="' + menuData + '">';
                    html += '<button type="button" id="' + c.ID + '" class="btn add-filter-btn keep-open"  data-target="#" data-toggle="dropdown">';
                    html += '' + c.Name + ' <span class="glyphicon glyphicon-chevron-down"></span></button>';
                    html += '<ul class="dropdown-menu add-filter-list" role="menu">';
                    html += $html;
                    html += '</ul>';
                    html += '</div>';

                    $('.filter-container').append(html);                    
                }                
                for (var i = 0; i < SORT.length; i++) {
                    $('#sortBy').append($("<option></option>").attr("value", SORT[i].ID).text(SORT[i].Name));
                }
                SearchApparel(11);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function login() {
    //var xml = '<request><clientname>Sparkly Tees</clientname><sitekey>C7488241-3948-4827-BF7C-86D8A63AC51F</sitekey></request>';
    var xml = '<request><clientname>DEV</clientname><sitekey>12345</sitekey><username>admin</username></request>';
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/SiteLogin",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SiteLoginResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                sessionid = r.SessionID;
                SetupSearch(10); //productid
                getMediaColorPatternThumbnail(3372, 'imgPatternThumbnail');
                getMediaColorPatternFile(3372, 'imgPatternFile');
                getColorPalette();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function getColorPalette() {
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/ColorPaletteGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ColorPaletteGetResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var cp = data[i];
                    console.log(cp.Name);
                    for (var j = 0; j < cp.ColorPaletteGroups.length; j++) {
                        var g = cp.ColorPaletteGroups[j];
                        console.log('Group: ' + g.Name);
                        for (var k = 0; k < g.ColorPaletteItems.length; k++) {
                            var item = g.ColorPaletteItems[k];
                            console.log(item.MediaColorName + ', ' + item.HasThumbnail);
                        }
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function popDetail(apparelid, productid) {
    var xml = "<request><sessionid>" + sessionid + "</sessionid><apparelid>" + apparelid + "</apparelid><productid>" + productid + "</productid></request>";
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/ApparelGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ApparelGetResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            }
            else {
                var data = eval(r.Data);
                var apparel_list = data[0];
                var colorsize_list = data[1];
                var color_list = data[2];
                var size_list = data[3];
                var design_list = data[4];
                
                var apparel = apparel_list[0];
                $("#aStyle").html(apparel.Style);
                $("#aName").html(apparel.Name);
                $("#aDescription").html(apparel.Description);
                $("#aImage").attr('src', 'http://api.thetshirtguylv.com/image/COLOR_PRODUCT_IMAGE/' + apparel.PreviewImage);

                for (var i = 0; i < colorsize_list.length; i++) {
                    var acs = colorsize_list[i];
                    //alert(new Date(parseInt(acs.SaleStartDate.replace(/\/Date\((-?\d+)\)\//, '$1'))) + ' - ' + new Date(parseInt(acs.SaleEndDate.replace(/\/Date\((-?\d+)\)\//, '$1'))));
                    //alert(acs.PieceWeight);
                    //alert(acs.QuantityAvailable);
                    //alert(acs.ApparelBrandColor.ID);
                    //alert(acs.ApparelSize.ID);
                    //alert(acs.DefaultPrice.Price); // need to add the cost of the design to this value
                }

                for (var i = 0; i < color_list.length; i++) {
                    //ID,Name,ColorSquareImage,Image,Thumbnail
                    var color = color_list[i];
                    var img = "<img src='http://api.thetshirtguylv.com/image/COLOR_SQUARE_IMAGE/" + color.ColorSquareImage + "' alt='" + color.Name + "' />";
                    var link = "<a href=\"javascript:setImage('" + color.Image + "');\">" + img + "</a>";
                    $("#aColors").append(link);
                }

                $.each(size_list, function (i, item) {
                    $('#aSizes').append($('<option>', {
                        value: item.ID,
                        text: item.Name
                    }));
                });

                //var designattribute_list = data[4];
                //var designcolors_list = data[5];

                for (var h = 0; h < design_list.length; h++) {
                    var design = design_list[h];
                    for (var i = 0; i < design.DesignAttributes.length; i++) {
                        var dAttr = design.DesignAttributes[i];
                        //dAttr.ID,dAttr.DesignID,dAttr.Description,dAttr.Defaultvalue
                        if (dAttr.DesignAttributeTypeName == 'Drop Down List') {
                            var ddl = dAttr.DropDownList;
                            //ddl.ID,ddl.Name
                            var temp = dAttr.Description + ': <ul>';
                            for (var j = 0; j < ddl.Items.length; j++) {
                                var item = ddl.Items[j];
                                //item.ID,item.Name
                                temp += '<li value="' + item.ID + '">' + item.Name + '</li>';
                            }
                            temp += '</ul>';
                            $("#aDesignAttributes").html($("#aDesignAttributes").html() + '<br/>' + temp);
                        }
                        else if (dAttr.DesignAttributeTypeName == 'Textbox') {
                            $("#aDesignAttributes").html($("#aDesignAttributes").html() + '<br/>' + dAttr.Description + ': <input type="text" value="' + dAttr.DefaultValue + '"/>');
                        }
                        else if (dAttr.DesignAttributeTypeName == 'Multiline Textbox') {

                        }
                        else if (dAttr.DesignAttributeTypeName == 'Date Picker') {

                        }
                        else if (dAttr.DesignAttributeTypeName == 'File Upload') {

                        }
                    }
                    for (var i = 0; i < design.DesignColors.length; i++) {
                        var dc = design.DesignColors[i];
                        //alert(dc.ID + ' - ' + dc.ColorPaletteID + ' - ' + dc.Description);
                        var temp = dc.Description + ': <ul id="nav">';
                        for (var j = 0; j < dc.ColorPaletteGroups.length; j++) {
                            var cgp = dc.ColorPaletteGroups[j];
                            //alert(cgp.ID + ' - ' + cgp.Name + ' - ' + cgp.PriceIncrease);
                            if (cgp.PriceIncrease > 0)
                                temp += '<li><a href="#">' + cgp.Name + ' +$' + cgp.PriceIncrease.toFixed(2) + '</a>';
                            else
                                temp += '<li><a href="#">' + cgp.Name + '</a>';
                            temp += '<ul>';
                            for (var k = 0; k < cgp.ColorPaletteItems.length; k++) {
                                var cpi = cgp.ColorPaletteItems[k];
                                //alert(cpi.ID + ' - ' + cpi.MediaColorName + ' - ' + cpi.HtmlColor + ' - ' + cpi.PreviewImage + ' - ' + cpi.PatternImage);
                                temp += '<li>' + cpi.MediaColorName + '</li>';
                            }
                            temp += '</ul></li></ul>';
                            $("#aDesignColors").html($("#aDesignColors").html() + '<br/>' + temp);
                        }
                    }
                }

                

                var d = document.getElementById('detail');
                d.style.visibility = '';

                return;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function setImage(PreviewImage) {
    $("#aImage").attr('src', 'http://api.thetshirtguylv.com/image/COLOR_PRODUCT_IMAGE/' + PreviewImage);
}
function loadFilters() {
    GetApparelBrandColors();

    filter[0] = ['fltr_brand', 'Brand', 'All Brands', [], [], false]; GetApparelBrands(filter[0]);
    filter[1] = ['fltr_category', 'Category', 'All Categories', [], [], false]; GetApparelCategories(filter[1]);

    var $addFilterMenu = [];
    for (var i = 0; i < filter.length; i++) {
        $addFilterMenu += '<li class="add-filter-item">';
        $addFilterMenu += '<label>';
        $addFilterMenu += '<input type="checkbox" class="add-filter-checkbox" id="' + filter[i][cID] + '" data-filter-box="' + i + '">';
        $addFilterMenu += '<span class="add-filter-name">' + filter[i][cLABEL] + '</span>';
        $addFilterMenu += '</label>';
        $addFilterMenu += '</li>';
    }
    $('.add-filter-list').append($addFilterMenu);
}
function SearchApparel(productid) {
    var menus = document.getElementsByClassName("btn add-filter-btn keep-open");
    var items = document.getElementsByClassName("js-filter-checkbox");
    var filtercats = '';
    for (var i = 0; i < menus.length; i++) {
        var filteritems = '';
        for (var j = 0; j < items.length; j++) {            
            if (items[j].checked == true) {
                var s = items[j].id.split('~');
                if (s[0] == menus[i].id) {
                    if (s[1] != 0)
                        filteritems += (',' + s[1]);
                }
            }
        }
        if (filteritems.length > 0)
            filtercats += (';' + menus[i].id + ':' + filteritems.substr(1));        
    }
    if (filtercats.length > 0)
        filtercats = filtercats.substr(1);
    
    var xml = "<request><sessionid>" + sessionid + "</sessionid><productid>" + productid + "</productid><filteritems>" + filtercats + "</filteritems><sortby>" + $('#sortBy').val() + "</sortby></request>";
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/ApparelSearch",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ApparelSearchResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
                return;
            }
            else {
                $("#apparelResults").empty();
                var data = eval(r.Data);
                var totalitems = data[0];
                var d = eval(data[1]);
                var p = 1;
                $("#dPaging").empty();
                for (var c = 1; c < totalitems; c += d.length) {
                    $("#dPaging").append("<a href='javascript:SearchResults(" + c + ");'>" + p + " </a>");
                    p += 1;
                }
                for (var i = 0; i < d.length; i++) {
                    var a = d[i];
                    var div = '<div class="col-sm-4 highlight-box ttglv_apparel">';
                    div += '  <a href="javascript:popDetail(' + a.ID + ',11);"><img src="http://api.thetshirtguylv.com/image/COLOR_PRODUCT_IMAGE/' + a.PreviewImage + '" class="img-responsive" ></a>';
                    div += '  <div class="content">';
                    div += '    <h2 class="hding">' + a.Style + '</h2>';
                    div += '    <p class="margin-10-20">' + a.Name + '</p>';
                    div += '    <p class="margin-10-20">Starting At ' + a.StartingPrice + '</p>';
                    div += '    <p class="margin-10-20">' + a.AvailableSizes + '</p>';
                    div += '    <div>' + DisplayBrandColors(a.AvailableColors) + '</div>';
                    div += '  </div>';
                    div += '</div>';
                    $("#apparelResults").append(div);                    
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function SearchResults(startat) {
    var xml = "<request><sessionid>" + sessionid + "</sessionid><startat>" + startat + "</startat></request>";
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/ApparelSearchResults",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ApparelSearchResultsResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
                return;
            }
            else {
                $("#apparelResults").empty();
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var a = data[i];
                    var div = '<div class="col-sm-4 highlight-box ttglv_apparel">';
                    div += '  <a href="javascript:popDetail(' + a.ID + ');"><img src="http://api.thetshirtguylv.com/image/COLOR_PRODUCT_IMAGE/' + a.PreviewImage + '" class="img-responsive" ></a>';
                    div += '  <div class="content">';
                    div += '    <h2 class="hding">' + a.Style + '</h2>';
                    div += '    <p class="margin-10-20">' + a.Name + '</p>';
                    div += '    <p class="margin-10-20">Starting At ' + a.StartingPrice + '</p>';
                    div += '    <p class="margin-10-20">' + a.AvailableSizes + '</p>';
                    div += '    <div>' + DisplayBrandColors(a.AvailableColors) + '</div>';
                    div += '  </div>';
                    div += '</div>';
                    $("#apparelResults").append(div);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function DisplayBrandColors(list) {
    var tmp = '';
    for (var i = 0; i < list.length; i++) {
        if (brandcolors[list[i]] != undefined)
            tmp += "<img src='http://api.thetshirtguylv.com/image/COLOR_SQUARE_IMAGE/" + brandcolors[list[i]].ColorSquareImage + "' class='colorsquare' alt='" + brandcolors[list[i]].Name + "' />";
    }
    return (tmp);
}
function Checkout(apparelcolorsizeid, quantity) {
    var xml = "<request><sessionid>" + sessionid + "</sessionid><apparelcolorsizeid>" + apparelcolorsizeid + "</apparelcolorsizeid><quantity>" + quantity + "</quantity></request>";
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/Checkout",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.CheckoutResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
                return;
            }
            else {
                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function getMediaColorPatternThumbnail(id, imgid) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><mediacolorid>' + id + '</mediacolorid></request>';
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/MediaColorPatternThumbnailGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.MediaColorPatternThumbnailGetResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#" + imgid).attr("src", 'data:image/png;base64,' + r.Data);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function getMediaColorPatternFile(id, imgid) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><mediacolorid>' + id + '</mediacolorid></request>';
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/MediaColorPatternFileGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.MediaColorPatternFileGetResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#" + imgid).attr("src", 'data:image/png;base64,' + r.Data);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
