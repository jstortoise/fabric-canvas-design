var sessionid;
var brandcolors = [];
var productid = 0;
var designid = 0;
var designplacementid = 0;
var mediacolordropdownid = 0;
var hiddenfilterid = 0;
var mediacolortypes;
var mediacolors = [];
jQuery(document).ready(function () {
    userLogin();

    var timeout;
    $('body').on('click', '.dropdown-menu', function (e) {
        e.stopPropagation();
    });
    $('.add-filter-btn,ul.add-filter-list').on('mouseover', function (e) {
        $(this).parent().addClass('open');
        clearTimeout(timeout);
    });
    $('.add-filter-btn,ul.add-filter-list').on('mouseout', function (e) {
        var $this = $(this);
        timeout = setTimeout(function () {
            $this.parent().removeClass('open');
        }, 200);
    });
    $('.add-filter-list input[type=checkbox]').each(function () {
        if ($(this).prop("checked") != true) {
            $('.filter-container')
				.find("[data-filter-menu='" + $(this).attr('data-filter-box') + "']")
				.removeClass('active-filter');
        }
        SearchApparel();
    });

    //for show filter that user select from dropdown
    $('body').on('change', 'input[type=checkbox].add-filter-checkbox', function () {
        if ($(this).prop("checked") != true) {
            $('.filter-container')
				.find("[data-filter-menu='" + $(this).attr('data-filter-box') + "']").remove();
        }
        SearchApparel();
    });

    $('body').on('change', '.js-filter-item input[type=checkbox]', function () {
        SearchApparel();	    
    });
    //for show chosen filter to user
    $('body').on('change', '.js-filter-item input[type=checkbox]', function () {
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
        SearchApparel();
    });

    //for remove chosen filter by user
    $('body').on('click', '.remove-chosenFilter', function () {
        var showFilter = $(this).parent().attr('class');

        $(this)
			.parents('.filter-item:first')
			.find('input[type=checkbox].' + showFilter.replace('chosen ', '') + '')
			.removeClass(showFilter)
			.prop("checked", false);
        $(this).parent().remove();
        SearchApparel();
    });
});
function userLogin() {
    //var xml = '<request><clientname>Sparkly Tees</clientname><sitekey>C7488241-3948-4827-BF7C-86D8A63AC51F</sitekey><username>kjwaltz73</username></request>';
    var xml = '<request><clientname>DEV</clientname><sitekey>12345</sitekey><username>admin</username></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/UserLogin",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.UserLoginResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                sessionid = r.SessionID;
                listFilters();
                SetupSearch();
                SubscribedApparelSuppliers();
                SubscribedMediaSuppliers();
                listDesigns();
                listProducts();
                listColorPalette();
                listDropDownList();
                listPlacements();
                getMediaColorThumbnail(3372, 'imgPattern');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function saveFilter(hasfilterid) {
    name = $("#tbxfiltername").val();
    if (hasfilterid == 1) {
        id = hiddenfilterid;        
    }
    else {
        id = 0;
    }

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


    var xml = '<request><sessionid>' + sessionid + '</sessionid><name>' + name + '</name><value>' + filtercats + '</value><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveFilter",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveFilterResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                listFilters();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function deleteFilter(id) {
    if (id == undefined)
        id = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteFilter",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteFilterResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                listFilters();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function listFilters() {
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ListFilters",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListFiltersResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#tblFilters > tbody").html("");
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    $("#tblFilters").append("<tr><td><a href='javascript:SetupSearch(" + f.ID + ");'>" + f.ID + "</a></td><td>" + f.Name + "</td><td>" + f.ModifyBy + "</td><td>" + f.ModifyOn.formatDate() + "</td><td><td><a href='javascript:deleteFilter(" + f.ID + ");'>remove</a></td></tr>");
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function SetupSearch(filterid) {
    if (filterid == undefined)
        filterid = 0;
    var xml = "<request><sessionid>" + sessionid + "</sessionid><filterid>" + filterid + "</filterid></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ApparelSearchSetup",
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
                $("#productsFacets").empty();
                var tmpActiveItems = [];
                var data = eval(r.Data);

                var FILTERNAME = data[0];
                var COLORS = data[1];
                var CATS = data[2];
                var SORT = data[3];
                
                if (FILTERNAME != undefined) {
                    $("#tbxfiltername").val(FILTERNAME);
                    hiddenfilterid = filterid;
                }

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
                        $html += '			<input type="checkbox" class="js-filter-checkbox" id="' + c.ID + '~' + ci.ID + '" onchange="javascript:SearchApparel();">';
                        $html += '			<span class="add-filter-name">' + ci.Name + '</span>';
                        $html += '		</label>';
                        $html += '	</li>';

                        if (ci.IsActive == true)
                            tmpActiveItems.push(c.ID + '~' + ci.ID);
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
                for (var i = 0; i < tmpActiveItems.length; i++) {
                    var d = document.getElementById(tmpActiveItems[i]);
                    $(d).prop("checked", true).change();                    
                }
                SearchApparel();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function SearchApparel() {
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

    var xml = "<request><sessionid>" + sessionid + "</sessionid><filterid>0</filterid><filteritems>" + filtercats + "</filteritems><sortby>" + $('#sortBy').val() + "</sortby></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ApparelSearch",
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
                    div += '  <img src="http://api.thetshirtguylv.com/image/COLOR_PRODUCT_IMAGE/' + a.PreviewImage + '" class="img-responsive" >';
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
function SearchResults(startat) {
    var xml = "<request><sessionid>" + sessionid + "</sessionid><startat>" + startat + "</startat></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ApparelSearchResults",
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
function addSubscribedApparelSupplier(apparelpricecategoryid, markuppercent, id) {
    if (sessionid == undefined)
        sessionid = '';
    if ((apparelpricecategoryid == undefined) || (markuppercent == undefined)) {
        markuppercent = 0;
        if (($("#markuppercent").val() == undefined) || ($("#markuppercent").val() == ''))
            markuppercent = 0;
        else
            markuppercent = $("#markuppercent").val();
        apparelpricecategoryid = $("#cbxapparelpricecategory").val();
        id = 0;
    }
    var xml = "<request><sessionid>" + sessionid + "</sessionid><apparelsupplierid>" + $("#cbxapparelsupplier").val() + "</apparelsupplierid><markuppercent>" + markuppercent + "</markuppercent><apparelpricecategoryid>" + apparelpricecategoryid + "</apparelpricecategoryid><id>" + subscribedapparelsupplierid + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveSubscribedApparelSupplier",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveSubscribedApparelSupplierResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                subscribedapparelsupplierid = 0;
                SubscribedApparelSuppliers();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
var APPARELSUPPLIERS = [];
function SubscribedApparelSuppliers() {
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetSubscribedApparelSuppliers",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetSubscribedApparelSuppliersResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
                return;
            }
            else {
                $("#tblApparelSuppliers > tbody").html("");
                var data = eval(r.Data);

                APPARELSUPPLIERS = data[0];
                var SUBSCRIBED = data[1];
               for (var i = 0; i < SUBSCRIBED.length; i++) {
                    var s = SUBSCRIBED[i];
                    $("#tblApparelSuppliers").append("<tr><td>" + s.ID + "</td><td>" + s.Name + "</td><td>" + s.ApparelPriceCategoryName + "</td><td>" + s.MarkupPercent + "%</td><td>" + s.ModifyBy + "</td><td>" + s.ModifyOn.formatDate() + "</td><td><a href=\"javascript:updateSubscribedApparelSupplier(" + s.ID + ",'" + s.Name + "','" + s.ApparelPriceCategoryName + "'," + s.MarkupPercent + ");\">update</a></td><td><a href='javascript:deleteSubscribedApparelSupplier(" + s.ID + ");'>remove</a></td></tr>");
               }
               $("#markuppercent").val("");
               $("#markuppercent_edit").val("");
               $('#cbxapparelpricecategory_edit').empty();

               $('#cbxapparelsupplier').empty();
               for (var i = 0; i < APPARELSUPPLIERS.length; i++) {
                   var d = APPARELSUPPLIERS[i];
                    $('#cbxapparelsupplier').append($("<option></option>").attr("value", d.ID).text(d.Name));
               }
               loadApparelPriceCategory();                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
var subscribedapparelsupplierid = 0;
function updateSubscribedApparelSupplier(id, apparelsuppliername, apparelpricecategoryname, markuppercent) {
    $("#markuppercent_edit").val(markuppercent);
    subscribedapparelsupplierid = id;
    $('#cbxapparelpricecategory_edit').empty();
    for (var i = 0; i < APPARELSUPPLIERS.length; i++) {
        var d = APPARELSUPPLIERS[i];
        if (d.Name == apparelsuppliername) {
            for (var j = 0; j < d.ApparelPriceCategories.length; j++) {
                var apc = d.ApparelPriceCategories[j];
                if (apc.Name == apparelpricecategoryname)
                    $('#cbxapparelpricecategory_edit').append($("<option selected></option>").attr("value", apc.ID).text(apc.Name));
                else
                    $('#cbxapparelpricecategory_edit').append($("<option></option>").attr("value", apc.ID).text(apc.Name));
            }

        }
    }
}
function loadApparelPriceCategory() {
    var apparelsupplierid = $('#cbxapparelsupplier').val();
    $('#cbxapparelpricecategory').empty();
    for (var i = 0; i < APPARELSUPPLIERS.length; i++) {
        var d = APPARELSUPPLIERS[i];
        if (d.ID == apparelsupplierid) {
            for (var j = 0; j < d.ApparelPriceCategories.length; j++) {
                var apc = d.ApparelPriceCategories[j];
                $('#cbxapparelpricecategory').append($("<option></option>").attr("value", apc.ID).text(apc.Name));
            }
        }
    }
    document.getElementById("cbxapparelpricecategory").selectedIndex = 0;
}
function deleteSubscribedApparelSupplier(id) {
    if (sessionid == undefined)
        sessionid = '';
    var markuppercent = 0;
    if (($("#markuppercent").val() == undefined) || ($("#markuppercent").val() == ''))
        markuppercent = 0;
    else
        markuppercent = $("#markuppercent").val();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + id + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteSubscribedApparelSupplier",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteSubscribedApparelSupplierResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#markuppercent").val("");
                SubscribedApparelSuppliers();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function listDesigns() {
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ListDesigns",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListDesignsResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#tblDesigns > tbody").html("");
                var data = eval(r.Data);
                var designs = data[0];
                
                for (var i = 0; i < designs.length; i++) {
                    var f = designs[i];
                    $("#tblDesigns").append("<tr><td><a href='javascript:updateDesignLoad(" + f.ID + ",\"" + f.Name + "\",\"" + f.PreviewImage + "\");'>" + f.ID + "</a></td><td>" + f.Name + "</td><td>" + f.PreviewImage + "</td><td>" + f.ModifyBy + "</td><td>" + f.ModifyOn.formatDate() + "</td><td><a href='javascript:deleteDesign(" + f.ID + ");'>remove</a></td></tr>");
                    $('#ddlproductdesign').append($("<option></option>").attr("value", f.ID).text(f.Name));
                }                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
var attributetypes;
function updateDesignLoad(id, name, previewimage) {
    if (sessionid == undefined)
        sessionid = '';
    designid = id;
    $("#sDesignFunction").text("Update");
    $("#btndesignadd").attr("value", "Update");
    $("#designname").val(name);
    $("#designpreviewimage").val(previewimage);
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + designid + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetDesign",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetDesignResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                var data = eval(r.Data);
                var designs = data[0];
                var design = designs[0];
                attributetypes = data[1];
                $("#tblDesignColors > tbody").html("");
                for (var i = 0; i < design.DesignColors.length; i++) {
                    var mc = design.DesignColors[i];
                    $("#tblDesignColors").append("<tr id='trdc" + mc.ID + "'><td><a href='javascript:loadEditDesignColor(" + mc.ID + "," + mc.ColorPaletteID + ",\"" + mc.Description.replaceAll('"', '\\"') + "\"," + mc.DefaultColorPaletteItemID + ")'>" + mc.ID + "</a></td><td>" + mc.ColorPaletteName + "</td><td>" + mc.Description + "</td><td>" + mc.DefaultColorPaletteItemName + "</td><td>" + mc.ModifyBy + "</td><td>" + mc.ModifyOn.formatDate() + "</td><td><a href='javascript:deleteDesignColor(" + mc.ID + ");'>remove</a></td></tr>");
                }
                $("#tblDesignAttributes > tbody").html("");
                for (var i = 0; i < design.DesignAttributes.length; i++) {
                    var da = design.DesignAttributes[i];
                    $("#tblDesignAttributes").append("<tr id='trda" + da.ID + "'><td>" + da.ID + "</a></td><td>" + da.DesignAttributeTypeName + "</td><td>" + da.Description + "</td><td>" + da.DropDownListName + "</td><td>" + da.DefaultValue + "</td><td>" + da.ModifyBy + "</td><td>" + da.ModifyOn.formatDate() + "</td><td><a href='javascript:editDesignAttribute(" + da.ID + "," + da.DesignAttributeTypeID + ",\"" + da.Description + "\"," + da.DropDownListID  + ",\"" + da.DefaultValue + "\");'>edit</a></td><td><a href='javascript:deleteDesignAttribute(" + da.ID + ");'>remove</a></td></tr>");
                }
                $('#ddldesignattributetype').empty();
                $('#ddldesignattributetype').append($("<option></option>").attr("value", 0).text(''));
                for (var i = 0; i < attributetypes.length; i++) {
                    var at = attributetypes[i];
                    $('#ddldesignattributetype').append($("<option></option>").attr("value", at.ID).text(at.Name));
                }                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function loadEditDesignColor(id, colorpaletteid, description, defaultvalue) {
    designcolorid = id;
    $("#ddlcolorpalette").val(colorpaletteid);
    $("#designcolordescription").val(description);
    $("#btndesigncoloradd").val("Update");
    $("#ddldesigncolorpaletteitems").val(defaultvalue);
}
function editDesignAttribute(id,typeid,description,ddlid,defaultvalue) {
    var ddl = '<select id="ddldesignattributetypeedit" onchange="designattributeedit_onchange(this,\'#trda' + id + '\')"><option value="0"></option>';
    for (var i = 0; i < attributetypes.length; i++) {
        var at = attributetypes[i];
        if (typeid == at.ID) {
            ddl += '<option value="' + at.ID + '" SELECTED>' + at.Name + '</option>';
            if (at.Name == 'Drop Down List') {
                var ddlitems = '';
                for (var j = 0; j < dropdownlists.length; j++) {
                    var ddls = dropdownlists[j];
                    if (ddlid == ddls.ID) {
                        ddlitems += "<option value='" + ddls.ID + "' SELECTED>" + ddls.Name + "</option>";
                        //var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + ddlid + "</id></request>";
                        //$.ajax({
                        //    type: "POST",
                        //    url: url + "/Settings.svc/GetDropDownList",
                        //    contentType: "application/json; charset=utf-8",
                        //    data: JSON.stringify($.xml2json(xml)),
                        //    dataType: "json",
                        //    success: function (response) {
                        //        var r = response.GetDropDownListResult;
                        //        if (r.isSuccessful == false) {
                        //            alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
                        //        }
                        //        else {
                        //            dropdownlists = eval(r.Data);
                        //            for (var k = 0; k < dropdownlists.length; k++) {
                        //                var ddl = dropdownlists[k];
                        //                var ddldefaultitems = '';
                        //                for (var l = 0; l < ddl.Items.length; l++) {
                        //                    var item = ddl.Items[l];
                        //                    if (item.Name == defaultvalue)
                        //                        ddldefaultitems += "<option value='" + item.Name + "' SELECTED>" + item.Name + "</option>";
                        //                    else
                        //                        ddldefaultitems += "<option value='" + item.Name + "'>" + item.Name + "</option>";
                        //                }
                        //                $("#trda" + id).find('td').eq(4).html("<select id='designattributeddledit' onchange='setDefaultDropDownListItems()'><option value='0'></option>" + ddldefaultitems + "</select>");
                        //            }
                        //        }
                        //    },
                        //    error: function (xhr, ajaxOptions, thrownError) {
                        //        alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
                        //    }
                        //});
                    }
                    else
                        ddlitems += "<option value='" + ddls.ID + "'>" + ddls.Name + "</option>";
                }
                $("#trda" + id).find('td').eq(3).html("<select id='designattributeddl' onchange='setDefaultDropDownListItems($(\"#trda" + id + "\").find(\"td\").eq(4),undefined,true)'><option value='0'></option>" + ddlitems + "</select>");
                setDefaultDropDownListItems($("#trda" + id).find('td').eq(4), ddlid, true, defaultvalue);
            }
        }
        else
            ddl += '<option value="' + at.ID + '">' + at.Name + '</option>';
    }
    ddl += '</select>';
    $("#trda" + id).find('td').eq(1).html(ddl);
    $("#trda" + id).find('td').eq(2).html("<input type='text' id='designdescriptionedit' value='" + description + "'/>");
    $("#trda" + id).find('td').eq(4).html("<input type='text' id='designdefaultvalueedit' value='" + defaultvalue + "'/>");
    $("#trda" + id).find('td').eq(8).find('a').text('Save');
    $("#trda" + id).find('td').eq(8).find('a').prop('href', 'javascript:saveDesignAttribute(' + id + ', $("#ddldesignattributetypeedit").val(), $("#designdescriptionedit").val(), $("#designdefaultvalueedit").val(), $("#designattributeddl").val());');
}
function addDesign() {
    if (sessionid == undefined)
        sessionid = '';    

    var designname = $("#designname").val();
    var previewimage = $("#designpreviewimage").val();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><name>" + designname + "</name><previewimage>" + previewimage + "</previewimage><id>" + designid + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveDesign",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveDesignResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                designid = 0;
                $("#sDesignFunction").text("Add");
                $("#btndesignadd").attr("value", "Add");
                $("#designname").val("");
                listDesigns();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function deleteDesign(id) {
    if (id == undefined)
        id = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteDesign",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteDesignResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                listDesigns();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function deleteDesignColor(id) {
    if (id == undefined)
        id = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteDesignColor",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteDesignColorResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#trdc" + id).remove();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function deleteDesignAttribute(id) {
    if (id == undefined)
        id = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteDesignAttribute",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteDesignAttributeResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#trda" + id).remove();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function addMediaColorDropdown() {
    if (sessionid == undefined)
        sessionid = '';

    var mediacolordropdownname = $("#mediacolordropdownname").val();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><name>" + mediacolordropdownname + "</name><id>" + mediacolordropdownid + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveColorPalette",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveColorPaletteResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                var data = eval(r.Data);
                mediacolordropdownid = data;
                listColorPalette();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function listColorPalette() {
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ListColorPalette",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListColorPaletteResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#tblColorPalettes > tbody").html("");
                var data = eval(r.Data);
                var mediacolordropdowns = data[0];
                mediacolortypes = data[1];
                var mcs = data[2];
                for (var i = 0; i < mcs.length; i++) {
                    var mc = mcs[i];
                    mediacolors[mc.ID] = mc;
                }
                //mediacolors = data[2];
                $('#ddlcolorpalette').empty();                
                for (var i = 0; i < mediacolordropdowns.length; i++) {
                    var f = mediacolordropdowns[i];
                    $("#tblColorPalettes").append("<tr id='tr" + i + "'><td><a href='javascript:loadColorPaletteItems(tr" + i + "," + f.ID + ",'msAddedMediaColor');'>" + f.ID + "</a></td><td>" + f.Name + "</td><td>" + f.ModifyBy + "</td><td>" + f.ModifyOn.formatDate() + "</td><td><a href='javascript:deleteMediaColorDropdowns(" + f.ID + ");'>remove</a></td></tr>");
                    $('#ddlcolorpalette').append($("<option></option>").attr("value", f.ID).text(f.Name));
                }
                onChangeDesignColor();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function deleteMediaColorDropdowns(id) {
    if (id == undefined)
        id = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteColorPalette",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteColorPaletteResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                listColorPalette();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function loadColorPaletteItems(tr, id, ddl, loadOnlyItems) {
    if (loadOnlyItems == undefined)
        loadOnlyItems = false;

    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetColorPalette",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetColorPaletteResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                var data = eval(r.Data);
                var colorpalette = data[0];
                if (loadOnlyItems == false) {
                    var t = "<tr><td colspan='5'>";
                    t += "<table>";
                    t += "<tr><td>Media Colors:<br/><select id='ddlMediaColorType' style='width:200pt;' onchange='loadMediaColors();' /></td><td><input onclick='addColorPaletteGroup(" + id + ");' type='button' value='Add Group'/><input type='button' value='Add Item(s)' onclick='addColorPaletteItem(" + id + ");'/><input type='button' value='Edit' onclick='editColorPaletteItem(" + id + ");'/><input type='button' value='Delete' onclick='deleteColorPaletteItem(" + id + ");'/></td></tr>";
                    t += "<tr><td><select id='msMediaColor' multiple style='height:500pt;width:200pt;' /></td><td><select id='msAddedMediaColor' style='height:500pt;width:200pt;' size='50' /></td></tr>";
                    t += "</td></tr>";
                    $(t).insertAfter($(tr));
                    for (var i = 0; i < mediacolortypes.length; i++) {
                        var f = mediacolortypes[i];
                        $('#ddlMediaColorType').append($("<option></option>").attr("value", f.ID).text(f.Name));
                    }
                    loadMediaColors();
                }
                $("#" + ddl).empty();
                for (var i = 0; i < colorpalette.ColorPaletteGroups.length; i++) {
                    var group = colorpalette.ColorPaletteGroups[i];
                    $("#" + ddl).append($("<option></option>").attr("value", group.ID * -1).text(group.Name + '(+' + group.PriceIncrease + ')'));
                    for (var j = 0; j < group.ColorPaletteItems.length; j++) {
                        var item = group.ColorPaletteItems[j];
                        $("#" + ddl).append($("<option></option>").attr("value", item.ID).text(mediacolors[item.MediaColorID].Name));
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function addColorPaletteGroup(colorpaletteid, name, priceincrease, id) {
    var position = $("#msAddedMediaColor").val();
    if (position == undefined)
        position = 0;
    if (position < 0) {
        var pos = 1;
        var ddl = document.getElementById('msAddedMediaColor');
        for (var i = 0; i < ddl.length; i++) {
            if (ddl.options[i].value < 0) {
                pos += 1;
                if (ddl.options[i].value == position) {
                    position = pos;
                    break;
                }
            }
        }
    }
    if (name == undefined)
        name = '';
    if (priceincrease == undefined)
        priceincrease = 0;
    if (id == undefined)
        id = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><colorpaletteid>' + colorpaletteid + '</colorpaletteid><position>' + position + '</position><name>' + name + '</name><priceincrease>' + priceincrease + '</priceincrease><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveColorPaletteGroup",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveColorPaletteGroupResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                loadColorPaletteItems(undefined, colorpaletteid, 'msAddedMediaColor', true);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function loadMediaGroupOptions() {
    //ddlMediaGroup
}
function loadMediaColors() {
    var typeid = $('#ddlMediaColorType').val();
    $('#msMediaColor').empty();
    $.each(mediacolors, function (key, mc) {
        if (mc != undefined) {
            if (typeid == mc.MediaProductID)
                $('#msMediaColor').append($("<option></option>").attr("value", mc.ID).text(mc.Name));
        }
    });    
}
function addColorPaletteItem(colorpaletteid) {
    var vals = '';
    $("#msMediaColor option:selected").each(function () {
        vals += (',' + $(this).val());
    });
    vals = vals.substring(1);

    var tmp = $("#msAddedMediaColor").val();    
    if (tmp == undefined) {
        alert('Item must be selected');
        return;
    }
    var groupid = 0;
    var itemid = 0;
    if (tmp < 0) {
        groupid = Math.abs(tmp);
    }
    else if (tmp > 0) {
        itemid = tmp;
    }
    else {
        alert('Item must be selected');
        return;
    }
    
    var xml = '<request><sessionid>' + sessionid + '</sessionid><colorpalettegroupid>' + groupid + '</colorpalettegroupid><colorpaletteitemid>' + itemid + '</colorpaletteitemid><mediacolors>' + vals + '</mediacolors></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveColorPaletteItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveColorPaletteItemResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                loadColorPaletteItems(undefined, colorpaletteid, 'msAddedMediaColor', true);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function editColorPaletteItem(colorpaletteid) {
    var tmp = $("#msAddedMediaColor").val();
    if (tmp == undefined) {
        alert('Item must be selected');
        return;
    }
    var groupid = 0;
    var itemid = 0;
    if (tmp < 0) {
        id = Math.abs(tmp);
        var name = prompt("Enter Group Name", "");
        var priceincrease = prompt("Enter Additional Cost", "0");
        addColorPaletteGroup(colorpaletteid, name, priceincrease, id);
    }
    else if (tmp > 0) {
    }
    else {
        alert('Item must be selected');
        return;
    }

}
function deleteColorPaletteItem(colorpaletteid) {
    var tmp = $("#msAddedMediaColor").val();
    if (tmp == undefined) {
        alert('Item must be selected');
        return;
    }
    var groupid = 0;
    var itemid = 0;
    if (tmp < 0) {
        groupid = Math.abs(tmp);
    }
    else if (tmp > 0) {
        itemid = tmp;
    }
    else {
        alert('Item must be selected');
        return;
    }

    var xml = '<request><sessionid>' + sessionid + '</sessionid><colorpalettegroupid>' + groupid + '</colorpalettegroupid><colorpaletteitemid>' + itemid + '</colorpaletteitemid></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteColorPaletteItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteColorPaletteItemResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                loadColorPaletteItems(undefined, colorpaletteid, 'msAddedMediaColor', true);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
var designcolorid = 0;
function addDesignColor() {
    if (sessionid == undefined)
        sessionid = '';

    var ddlcolorpaletteid = $("#ddlcolorpalette").val();
    var description = $("#designcolordescription").val();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><designid>" + designid + "</designid><colorpaletteid>" + ddlcolorpaletteid + "</colorpaletteid><description>" + description + "</description><defaultcolorpaletteitemid>" + $("#ddldesigncolorpaletteitems").val() + "</defaultcolorpaletteitemid><id>" + designcolorid + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveDesignColor",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveDesignColorResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                //$("#sDesignFunction").text("Add");
                //$("#btndesignadd").attr("value", "Add");
                $("#ddlcolorpalette").val("");
                $("#designcolordescription").val("");
                updateDesignLoad(designid);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function onChangeDesignColor() {
    loadColorPaletteItems(undefined, $("#ddlcolorpalette").val(), 'ddldesigncolorpaletteitems', true);
}
function listDropDownList() {
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ListDropDownList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListDropDownListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#tblDropDownLists > tbody").html("");
                dropdownlists = eval(r.Data);
                
                for (var i = 0; i < dropdownlists.length; i++) {
                    var ddl = dropdownlists[i];
                    $("#tblDropDownLists").append("<tr><td><a href='javascript:getDropDownList(" + ddl.ID + ");'>" + ddl.ID + "</a></td><td>" + ddl.Name + "</td><td>" + ddl.ModifyBy + "</td><td>" + ddl.ModifyOn.formatDate() + "</td><td><a href='javascript:deleteDropDownList(" + ddl.ID + ");'>remove</a></td></tr>");
                }                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function addDropDownList() {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><name>' + $("#dropdownlistname").val() + '</name></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveDropDownList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveDropDownListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                listDropDownList();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function deleteDropDownList(id) {
    if (sessionid == undefined)
        sessionid = '';
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + id + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteDropDownList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteDropDownListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                listDropDownList();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
var dropdownlistid = 0;
function getDropDownList(id) {
    if (sessionid == undefined)
        sessionid = '';
    dropdownlistid = id;
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + id + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetDropDownList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetDropDownListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                dropdownlists = eval(r.Data);
                for (var i = 0; i < dropdownlists.length; i++) {
                    var ddl = dropdownlists[i];
                    $("#ddlName").html("Drop Down List: " + ddl.Name);
                    $("#tblDropDownListItems > tbody").html("");
                    for (var j = 0; j < ddl.Items.length; j++) {
                        var item = ddl.Items[j];
                        $("#tblDropDownListItems").append("<tr><td><a href='javascript:updateDropDownListItemLoad(" + item.ID + ",\"" + item.Name + "\"," + item.PriceIncrease.toFixed(2) + ");'>" + item.ID + "</a></td><td>" + item.Name + "</td><td>" + item.PriceIncrease.toFixed(2) + "</td><td>" + item.ModifyBy + "</td><td>" + item.ModifyOn.formatDate() + "</td><td><a href='javascript:deleteDropDownListItem(" + item.ID + ");'>remove</a></td><td><a href='javascript:arrangeDropDownListItem(" + item.ID + "," + (item.Position - 1) + ");'>Up</a></td><td><a href='javascript:arrangeDropDownListItem(" + item.ID + "," + (item.Position + 2) + ");'>Down</a></td></tr>");
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
var dropdownlistitemid = 0;
function updateDropDownListItemLoad(id, name, priceincrease) {
    dropdownlistitemid = id;
    $("#dropdownlistitemname").val(name);
    $("#dropdownlistitempriceincrease").val(priceincrease);
    $("#btndropdownlistitemadd").val("Update");
}
function addDropDownListItem() {
    var priceincrease = $("#dropdownlistitempriceincrease").val();
    if ((priceincrease == undefined) || (priceincrease == ''))
        priceincrease = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><dropdownlistid>' + dropdownlistid + '</dropdownlistid><name>' + $("#dropdownlistitemname").val() + '</name><priceincrease>' + priceincrease + '</priceincrease><id>' + dropdownlistitemid + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveDropDownListItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveDropDownListItemResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                dropdownlistitemid = 0;
                $("#dropdownlistitemname").val("");
                $("#dropdownlistitempriceincrease").val("");
                $("#btndropdownlistitemadd").val("Add");
                getDropDownList(dropdownlistid);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function arrangeDropDownListItem(id, position) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><dropdownlistid>' + dropdownlistid + '</dropdownlistid><id>' + id + '</id><position>' + position + '</position></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ArrangeDropDownListItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ArrangeDropDownListItemResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                getDropDownList(dropdownlistid);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function deleteDropDownListItem(id) {
    if (sessionid == undefined)
        sessionid = '';
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + id + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteDropDownListItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteDropDownListItemResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                getDropDownList(dropdownlistid);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
var dropdownlists;
function designattribute_onchange() {
    switch (parseInt($("#ddldesignattributetype").val())) {
        case 4: // Drop Down List
            var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
            $.ajax({
                type: "POST",
                url: url + "/Settings.svc/ListDropDownList",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify($.xml2json(xml)),
                dataType: "json",
                success: function (response) {
                    var r = response.ListDropDownListResult;
                    if (r.isSuccessful == false) {
                        alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
                    }
                    else {
                        dropdownlists = eval(r.Data);
                        var ddlitems = '';
                        for (var i = 0; i < dropdownlists.length; i++) {
                            var ddl = dropdownlists[i];
                            ddlitems += "<option value='" + ddl.ID + "'>" + ddl.Name + "</option>";
                        }
                        $("#tdAttributeDDL").html("<select id='designattributeddl' onchange='setDefaultDropDownListItems()'><option value='0'></option>" + ddlitems + "</select>");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
                }
            });
            break;
        case 7: // File Upoad
            $("#tdAttributeDDL").html('');
            $("#tdAttributeDefaultValue").html('');
            break;
        default:
            $("#tdAttributeDDL").html('');
            $("#tdAttributeDefaultValue").html("<input type='text' id='designdefaultvalue' />");
            break;
    }
}
function designattributeedit_onchange(select, tr) {
    switch (parseInt($(select).val())) {
        case 4: // Drop Down List
            var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
            $.ajax({
                type: "POST",
                url: url + "/Settings.svc/ListDropDownList",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify($.xml2json(xml)),
                dataType: "json",
                success: function (response) {
                    var r = response.ListDropDownListResult;
                    if (r.isSuccessful == false) {
                        alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
                    }
                    else {
                        dropdownlists = eval(r.Data);
                        var ddlitems = '';
                        for (var i = 0; i < dropdownlists.length; i++) {
                            var ddl = dropdownlists[i];
                            ddlitems += "<option value='" + ddl.ID + "'>" + ddl.Name + "</option>";
                        }
                        $(tr).find('td').eq(3).html("<select id='designattributeddledit' onchange='setDefaultDropDownListItems(\"" + $(tr).find('td').eq(4).id + "\"," + ddl.ID + ")'><option value='0'></option>" + ddlitems + "</select>");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
                }
            });
            break;
        case 7: // File Upoad
            $(tr).find('td').eq(3).html('');
            $(tr).find('td').eq(4).html('');
            break;
        default:
            $(tr).find('td').eq(3).html('');
            $(tr).find('td').eq(4).html("<input type='text' id='designdefaultvalueedit' />");
            break;
    }
}
function saveDesignAttribute(id, ddldesignattributetype, tbxdesignattributedescription, designdefaultvalue, ddlid) {
    if (isNaN(ddlid) == true)
        ddlid = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><designid>' + designid + '</designid><designattributetypeid>' + ddldesignattributetype + '</designattributetypeid><description>' + tbxdesignattributedescription + '</description><dropdownlistid>' + ddlid + '</dropdownlistid><defaultvalue>' + designdefaultvalue + '</defaultvalue><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveDesignAttribute",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveDesignAttributeResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                updateDesignLoad(designid);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });

}
function setDefaultDropDownListItems(td, ddlid, isedit, defaultvalue) {
    if (td == undefined)
        td = "#tdAttributeDefaultValue";
    if (ddlid == undefined)
        ddlid = $("#designattributeddl").val();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + ddlid + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetDropDownList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetDropDownListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                dropdownlists = eval(r.Data);
                for (var i = 0; i < dropdownlists.length; i++) {
                    var ddl = dropdownlists[i];
                    var ddlitems = '';
                    for (var j = 0; j < ddl.Items.length; j++) {
                        var item = ddl.Items[j];
                        if (item.Name == defaultvalue)
                            ddlitems += "<option value='" + item.Name + "' SELECTED>" + item.Name + "</option>";
                        else
                            ddlitems += "<option value='" + item.Name + "'>" + item.Name + "</option>";
                    }
                    if (isedit == true)
                        $(td).html("<select id='designdefaultvalueedit'><option value='0'></option>" + ddlitems + "</select>");
                    else
                        $(td).html("<select id='designdefaultvalue'><option value='0'></option>" + ddlitems + "</select>");
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function addSubscribedMediaSupplier(id) {
    if (sessionid == undefined)
        sessionid = '';
    if (id == undefined)
        id = 0;
    var xml = "<request><sessionid>" + sessionid + "</sessionid><mediasupplierid>" + $("#cbxmediasupplier").val() + "</mediasupplierid><id>" + id + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveSubscribedMediaSupplier",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveSubscribedMediaSupplierResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                SubscribedMediaSuppliers();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
var MEDIASUPPLIERS = [];
function SubscribedMediaSuppliers() {
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetSubscribedMediaSuppliers",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetSubscribedMediaSuppliersResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
                return;
            }
            else {
                $("#tblMediaSuppliers > tbody").html("");
                var data = eval(r.Data);

                MEDIASUPPLIERS = data[0];
                var SUBSCRIBED = data[1];
                for (var i = 0; i < SUBSCRIBED.length; i++) {
                    var s = SUBSCRIBED[i];
                    $("#tblMediaSuppliers").append("<tr><td>" + s.ID + "</td><td>" + s.Name + "</td><td>" + s.ModifyBy + "</td><td>" + s.ModifyOn.formatDate() + "</td><td></td><td><a href='javascript:deleteSubscribedMediaSupplier(" + s.ID + ");'>remove</a></td></tr>");
                }
                $('#cbxmediasupplier').empty();
                for (var i = 0; i < MEDIASUPPLIERS.length; i++) {
                    var s = MEDIASUPPLIERS[i];
                    $('#cbxmediasupplier').append($("<option></option>").attr("value", s.ID).text(s.Name));
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function deleteSubscribedMediaSupplier(id) {
    if (sessionid == undefined)
        sessionid = '';
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + id + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteSubscribedMediaSupplier",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteSubscribedMediaSupplierResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                SubscribedMediaSuppliers();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function listProducts() {
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ListProducts",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListProductsResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#tblProducts > tbody").html("");
                var data = eval(r.Data);
                var products = data[0];
                var filters = data[1];

                for (var i = 0; i < products.length; i++) {
                    var f = products[i];
                    $("#tblProducts").append("<tr><td><a href='javascript:updateProductLoad(" + f.ID + ",\"" + f.Name + "\"," + f.ApparelFilterID + "," + f.Price + "," + f.SalePrice + ");'>" + f.ID + "</a></td><td>" + f.Name + "</td><td>" + f.ApparelFilterName + "</td><td>" + f.Price + "</td><td>" + f.SalePrice + "</td><td>" + f.ModifyBy + "</td><td>" + f.ModifyOn.formatDate() + "</td><td><a href='javascript:deleteProduct(" + f.ID + ");'>remove</a></td></tr>");
                }
                $('#ddlapparelfilterid').empty();
                for (var i = 0; i < filters.length; i++) {
                    var d = filters[i];
                    $('#ddlapparelfilterid').append($("<option></option>").attr("value", d.ID).text(d.Name));
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function addProduct() {
    if (sessionid == undefined)
        sessionid = '';

    var productname = $("#productname").val();
    var ddlapparelfilterid = $("#ddlapparelfilterid").val();
    var productprice = 0;
    if (($("#productprice").val() != undefined) && ($("#productprice").val() != ''))
        productprice = $("#productprice").val();

    var productsaleprice = 0;
    if (($("#productsaleprice").val() != undefined) && ($("#productsaleprice").val() != ''))
        productsaleprice = $("#productsaleprice").val();

    var xml = "<request><sessionid>" + sessionid + "</sessionid><name>" + productname + "</name><apparelfilterid>" + ddlapparelfilterid + "</apparelfilterid><price>" + productprice + "</price><saleprice>" + productsaleprice + "</saleprice><id>" + productid + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveProduct",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveProductResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                productid = 0;
                $("#sProductFunction").text("Add");
                $("#btnproductadd").attr("value", "Add");
                $("#dproductname").val("");
                $("#ddlapparelfilterid").val("");
                $("#productprice").val("");
                $("#productsaleprice").val("");
                listProducts();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function deleteProduct(id) {
    if (id == undefined)
        id = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteProduct",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteProductResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                listProducts();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function updateProductLoad(id, name, apparelfilterid, price, saleprice) {
    if (sessionid == undefined)
        sessionid = '';
    productid = id;
    
    $("#sProductFunction").text("Update");
    $("#btnproductadd").attr("value", "Update");
    $("#productname").val(name);
    $("#ddlapparelfilterid").val(apparelfilterid);
    $("#productprice").val(price);
    $("#productsaleprice").val(saleprice);
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + productid + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetProduct",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetProductResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                var data = eval(r.Data);
                var products = data[0];
                var p = products[0];
                $("#tblProductDesigns > tbody").html("");
                for (var i = 0; i < p.Designs.length; i++) {
                    var d = p.Designs[i];
                    $("#tblProductDesigns").append("<tr id='trdp" + d.ID + "'><td><a href='javascript:updateDesignPlacementLoad(" + d.ID + "," + d.PlacementID + "," + d.DesignID + ");'>" + d.ID + "</a></td><td>" + d.PlacementName + "</td><td>" + d.DesignName + "</td><td>" + d.ModifyBy + "</td><td>" + d.ModifyOn.formatDate() + "</td><td><a href='javascript:deleteDesignPlacement(" + d.ID + ");'>remove</a></td></tr>");
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function listPlacements() {
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ListPlacements",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListPlacementsResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                var data = eval(r.Data);
                var placements = data[0];

                for (var i = 0; i < placements.length; i++) {
                    var p = placements[i];
                    $('#ddlplacement').append($("<option></option>").attr("value", p.ID).text(p.Name));
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function addDesignPlacement() {
    if (sessionid == undefined)
        sessionid = '';

    var placementid = $("#ddlplacement").val();
    var designid = $("#ddlproductdesign").val();
    
    var xml = "<request><sessionid>" + sessionid + "</sessionid><productid>" + productid + "</productid><placementid>" + placementid + "</placementid><designid>" + designid + "</designid><id>" + designplacementid + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveDesignPlacement",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveDesignPlacementResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                designplacementid = 0;
                $("#sDesignPlacementFunction").text("Add");
                $("#btndesignplacementadd").attr("value", "Add");
                $("#ddlplacement").val("");
                $("#ddlproductdesign").val("");
                updateProductLoad(productid);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function deleteDesignPlacement(id) {
    if (id == undefined)
        id = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteDesignPlacement",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteDesignPlacementResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#trdp" + id).remove();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function updateDesignPlacementLoad(id, placementid, designid) {
    if (sessionid == undefined)
        sessionid = '';
    designplacementid = id;
    $("#sDesignPlacementFunction").text("Update");
    $("#btndesignplacementadd").attr("value", "Update");
    $("#ddlplacement").val(placementid);
    $("#ddlproductdesign").val(designid);
}
function getMediaColorThumbnail(id, imgid) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><mediacolorid>' + id + '</mediacolorid></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetMediaColorPatternThumbnail",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetMediaColorPatternThumbnailResult;
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
function arrangeDesignColor(id, position) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><designid>' + designid + '</designid><id>' + id + '</id><position>' + position + '</position></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ArrangeDesignColor",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ArrangeDesignColorResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                //success
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function arrangeDesignAttribute(id, position) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><designid>' + designid + '</designid><id>' + id + '</id><position>' + position + '</position></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ArrangeDesignAttribute",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ArrangeDesignAttributeResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                //success
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function arrangeColorPaletteGroup(id, position) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><colorpaletteid>' + colorpaletteid + '</colorpaletteid><id>' + id + '</id><position>' + position + '</position></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ArrangeColorPaletteGroup",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ArrangeColorPaletteGroupResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                //success
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function arrangeColorPaletteItem(id, position) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><colorpalettegroupid>' + colorpalettegroupid + '</colorpalettegroupid><id>' + id + '</id><position>' + position + '</position></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ArrangeColorPaletteItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ArrangeColorPaletteItemResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                //success
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function arrangeProductDesign(id, position) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><productid>' + productid + '</productid><id>' + id + '</id><position>' + position + '</position></request>';
    $.ajax({
        type: "POST",
        url: url + "/Settings.svc/ArrangeProductDesign",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ArrangeProductDesignResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                //success
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
