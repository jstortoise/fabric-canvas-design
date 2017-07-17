var brandcolors = [];
var apparelcolors = [];
var sessionid;

jQuery(document).ready(function () {
    adminLogin();
});

function adminLogin() {
    var xml = '<request><sitekey>2FBCAA6B-7826-4D6B-8DCC-BC1342E79CD8</sitekey><username>admin</username></request>';
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/Login",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.LoginResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                sessionid = r.SessionID;
                listFilterCategories();
                listBrands();                
                listApparelColors();
                listMediaSuppliers();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function listMediaSuppliers() {
    if (sessionid == undefined)
        sessionid = '';
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/MediaSuppliersList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.MediaSuppliersListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#cbxMediaSuppliers").empty("");
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    $('#cbxMediaSuppliers').append($("<option></option>").attr("value", f.ID).text(f.Name));
                    if (i == 0)
                        listMediaProducts(f.ID);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function listMediaProducts(mediasupplierid) {
    if (sessionid == undefined)
        sessionid = '';
    if (mediasupplierid == undefined)
        mediasupplierid = 0;
    
    var xml = "<request><sessionid>" + sessionid + "</sessionid><mediasupplierid>" + mediasupplierid + "</mediasupplierid></request>";
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/MediaProductsList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.MediaProductsListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#cbxMediaProducts").empty();
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    $('#cbxMediaProducts').append($("<option></option>").attr("value", f.ID).text(f.Name));
                    if (i == 0)
                        listMediaColors(f.ID);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function listMediaColors(mediaproductid) {
    if (sessionid == undefined)
        sessionid = '';
    if (mediaproductid == undefined)
        mediaproductid = 0;

    var xml = "<request><sessionid>" + sessionid + "</sessionid><mediaproductid>" + mediaproductid + "</mediaproductid></request>";
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/MediaColorList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.MediaColorListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#tblMediaColors > tbody").html("");
                var data = eval(r.Data);
                var script = "";
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    var html = "<tr><td><a href=\"javascript:updateMediaColorThumbnail(" + f.ID + ",'" + f.Name + "','" + f.HtmlColor + "');\">" + f.ID + "</a></td><td>" + f.Name + "</td><td>" + f.HtmlColor + "</td>";
                    if (f.HasPattern == true) {
                        html += "<td><img id='imgThumb" + f.ID + "' /></td>";
                        script += "getMediaColorThumbnail(" + f.ID + ", 'imgThumb" + f.ID + "');\n";
                    }
                    else
                        html += "<td><div style=\"width:40px; height:40px; background-color:" + f.HtmlColor + "\" /></td>";
                    html += "<td><a href='javascript:deleteMediaColor(" + f.ID + ");'>remove</a></td></tr>";
                    $("#tblMediaColors").append(html);
                }
                $("#tblMediaColors").append("<script>" + script + "</script>");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function saveMediaColor(mediaproductid, name, htmlcolor, patternimage) {        
    if (sessionid == undefined)
        sessionid = '';
    if (mediaproductid == undefined)
        mediaproductid = 0;
    if (name == undefined)
        name = '';
    if (htmlcolor == undefined)
        htmlcolor = '';
    var file;
    if (jQuery('#imgmediacolor').val()) {
        file = document.getElementById("imgmediacolor").files[0];
        var blob = file.slice(0, file.size - 1);
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            var xml = "<request><sessionid>" + sessionid + "</sessionid><mediaproductid>" + mediaproductid + "</mediaproductid><name>" + name + "</name><htmlcolor>" + htmlcolor + "</htmlcolor><patternimage>" + reader.result + "</patternimage><id>0</id></request>";
            $.ajax({
                type: "POST",
                url: url + "/AdminAPI.svc/MediaColorSave",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify($.xml2json(xml)),
                dataType: "json",
                success: function (response) {
                    var r = response.MediaColorSaveResult;
                    if (r.isSuccessful == false) {
                        alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
                    }
                    else {
                        $("#tbxmediacolorname").val("");
                        $("#tbxhtmlcolor").val("");
                        listMediaColors(mediaproductid)
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
                }
            });
        }, false);

        reader.readAsDataURL(blob);
    }
    else {
        var xml = "<request><sessionid>" + sessionid + "</sessionid><mediaproductid>" + mediaproductid + "</mediaproductid><name>" + name + "</name><htmlcolor>" + htmlcolor + "</htmlcolor><patternimage></patternimage><id>0</id></request>";
        $.ajax({
            type: "POST",
            url: url + "/AdminAPI.svc/MediaColorSave",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify($.xml2json(xml)),
            dataType: "json",
            success: function (response) {
                var r = response.MediaColorSaveResult;
                if (r.isSuccessful == false) {
                    alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
                }
                else {
                    $("#tbxmediacolorname").val("");
                    $("#tbxhtmlcolor").val("");
                    listMediaColors(mediaproductid)
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
            }
        });
    }
}
function addFilterCategory(name, id) {
    if (sessionid == undefined)
        sessionid = '';
    if (name == undefined)
        name = '';
    if (id == undefined)
        id = 0;
    var xml = "<request><sessionid>" + sessionid + "</sessionid><name>" + name + "</name><id>" + id + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/SaveFilterCategory",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveFilterCategoryResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#tbxfiltercategoryname").val("");
                listFilterCategories();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
var filtercategoryid = 0;
function addFilterItem(name, id) {
    if (sessionid == undefined)
        sessionid = '';
    if (name == undefined)
        name = '';
    if (id == undefined)
        id = 0;
    var xml = "<request><sessionid>" + sessionid + "</sessionid><filtercategoryid>" + filtercategoryid + "</filtercategoryid><name>" + name + "</name><id>" + id + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/SaveFilterItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveFilterItemResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#tbxfilteritemname").val("");
                listFilterItems(filtercategoryid);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function listFilterCategories() {
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/GetFilterCategories",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetFilterCategoriesResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#tblFilterCategory > tbody").html("");
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    $("#tblFilterCategory").append("<tr><td><a href='javascript:getFilterItem(" + f.ID + ",\"" + f.Name + "\");'>" + f.ID + "</a></td><td>" + f.Name + "</td><td>" + f.ModifyBy + "</td><td>" + f.ModifyOn.formatDate() + "</td><td><a href='javascript:updateFilter(" + f.ID + ",\"" + f.Name + "\",\"" + f.Value + "\");'>update</a></td><td><a href='javascript:deleteFilterCategory(" + f.ID + ");'>remove</a></td></tr>");
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function listFilterItems(filtercategoryid) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><filtercategoryid>' + filtercategoryid + '</filtercategoryid></request>';
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/GetFilterItems",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetFilterItemsResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#tblFilterItem > tbody").html("");
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    $("#tblFilterItem").append("<tr><td>" + f.ID + "</td><td>" + f.Name + "</td><td>" + f.ModifyBy + "</td><td>" + f.ModifyOn.formatDate() + "</td><td><a href='javascript:updateFilter(" + f.ID + ",\"" + f.Name + "\",\"" + f.Value + "\");'>update</a></td><td><a href='javascript:deleteFilterItem(" + filtercategoryid + "," + f.ID + ");'>remove</a></td></tr>");
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function deleteFilterCategory(id) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/DeleteFilterCategory",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteFilterCategoryResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                listFilterCategories();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function deleteFilterItem(filtercategoryid,id) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/DeleteFilterItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteFilterItemResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                listFilterItems(filtercategoryid);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
var apparelcolors = [];
var brandcolors = [];
function listApparelColors() {
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';    
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/ListApparelColors",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (result) {	            
            var r = result.ListApparelColorsResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
                return;
            }
            else {
                $("#tblColors > tbody").html("");
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    $("#tblColors").append("<tr><td>" + f.ID + "</td><td>" + f.Name + "</td><td><a href='javascript:deleteApparelColor(" + f.ID + ");'>remove</a></tr>");
                    apparelcolors[f.Name] = f.ID;
                }                
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert('Request Status: ' + xhr.status + '\nStatus Text: ' + xhr.statusText + '\n' + xhr.responseText);	            
        }
    });
}
function listBrandColors(id) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><apparelbrandid>' + id + '</apparelbrandid></request>';
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/ListApparelBrandColors",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListApparelBrandColorsResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#tblBrandColors > tbody").html("");
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    brandcolors[f.ID] = f;
                    var tmpcolors = '';
                    for (var j = 0; j < f.ApparelColors.length; j++)
                        tmpcolors += f.ApparelColors[j].Name + '<br/>';

                    $("#tblBrandColors").append("<tr><td>" + f.Brand + "</td><td>" + f.ID + "</td><td>" + f.Name + "</td><td><img src='http://api.thetshirtguylv.com/image/COLOR_SQUARE_IMAGE/" + f.ColorSquareImage + "'/></td><td id='td" + f.ID + "'>" + tmpcolors + "</td><td id='tdAction" + f.ID + "'><a href='javascript:editColors(" + f.ID + ");'>edit</a></td></tr>");
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function listBrands() {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><apparelsupplierid>1</apparelsupplierid></request>';
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/ListApparelBrands",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListApparelBrandsResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {                
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    $('#cbxBrand').append($("<option></option>").attr("value", f.ID).text(f.Name));
                    if (i == 0)
                        listBrandColors(f.ID);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function editColors(id) {
    var bc = brandcolors[id];    
    var td = document.getElementById('td' + id);
    td.innerHTML = '';
    var tdAction = document.getElementById('tdAction' + id);
    tdAction.innerHTML = '<a href="javascript:saveBrandToApparelColors(' + id + ');">Save</a> <a href="javascript:cancelEditColors(' + id + ')">Cancel</a>';

    for (var i = 0; i < bc.ApparelColors.length; i++) {
        var s = document.createElement("select");
        s.id = bc.ApparelColors[i].Object;
        s.options[s.options.length] = new Option('', 0);
        for (var key in apparelcolors) {            
            s.options[s.options.length] = new Option(key, apparelcolors[key]);        
        }
        for (var j = 0; j < s.options.length; j++) {
            if (bc.ApparelColors[i].ID == s.options[j].value) {
                s.options[j].selected = true;
            }
        }        
        td.appendChild(s);
        td.appendChild(document.createElement('br'));
    }

    // add one blank select //
    var s = document.createElement("select");
    s.id = '0';
    s.options[s.options.length] = new Option('', 0);
    for (var key in apparelcolors)
        s.options[s.options.length] = new Option(key, apparelcolors[key]);
    s.onchange = function () { addSelect(s, td); };
    td.appendChild(s);
    td.appendChild(document.createElement('br'));
}
function addSelect(ss,td) {
    if (ss.selectedIndex > 0) {
        var sss = document.createElement("select");
        sss.id = '0';
        sss.options[sss.options.length] = new Option('', 0);
        for (var key in apparelcolors)
            sss.options[sss.options.length] = new Option(key, apparelcolors[key]);
        sss.onchange = function () { addSelect(sss,td); };
        td.appendChild(sss);
        td.appendChild(document.createElement('br'));
    }
}
function saveBrandToApparelColors(apparelbrandcolorid) {
    var td = document.getElementById('td' + apparelbrandcolorid);
    var selects = td.getElementsByTagName("select");
    var values = '';
    for (var i = 0; i < selects.length; i++) {
        var s = selects[i];
        var o = s[s.selectedIndex];
        if ((s.selectedIndex > 0) || (s.id > 0))
            values += ';' + s.id + ',' + o.value;        
    }
    if (sessionid == undefined)
        sessionid = '';
    if (values.length > 1)
        values = values.substring(1);
    var xml = "<request><sessionid>" + sessionid + "</sessionid><apparelbrandcolorid>" + apparelbrandcolorid + "</apparelbrandcolorid><values>" + values + "</values></request>";
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/SaveBrandToApparelColors",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveBrandToApparelColorsResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#tbxcolorname").val("");
                var data = eval(r.Data);
                f = brandcolors[apparelbrandcolorid];
                f.ApparelColors = data;
                var tmpcolors = '';
                for (var j = 0; j < f.ApparelColors.length; j++)
                    tmpcolors += f.ApparelColors[j].Name + '<br/>';
                document.getElementById('td' + f.ID).innerHTML = tmpcolors;

                var tdAction = document.getElementById('tdAction' + apparelbrandcolorid);
                tdAction.innerHTML = "<a href='javascript:editColors(" + apparelbrandcolorid + ");'>edit</a>";

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function addColor(name, id) {
    if (sessionid == undefined)
        sessionid = '';
    if (name == undefined)
        name = '';
    if (id == undefined)
        id = 0;
    var xml = "<request><sessionid>" + sessionid + "</sessionid><name>" + name + "</name><id>" + id + "</id></request>";
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/SaveColor",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveColorResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                $("#tbxcolorname").val("");
                listApparelColors();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function deleteApparelColor(id) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/DeleteApparelColor",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteApparelColorResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                listApparelColors();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function getMediaColorThumbnail(id, imgid) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><mediacolorid>' + id + '</mediacolorid></request>';
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/MediaColorThumbnailGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.MediaColorThumbnailGetResult;
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
function updateMediaColorThumbnail(id,name,htmlcolor) {
    $("#tbxmediacolorname").val(name);
    $("#tbxhtmlcolor").val(htmlcolor);
    $("#btnMediaColor").val("Update");
}
function deleteMediaColor(mediacolorid) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><mediacolorid>' + mediacolorid + '</mediacolorid></request>';
    $.ajax({
        type: "POST",
        url: url + "/AdminAPI.svc/MediaColorDelete",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.MediaColorDeleteResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                listMediaColors($('#cbxMediaProducts').val());
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}