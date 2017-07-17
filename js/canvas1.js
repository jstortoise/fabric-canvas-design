var product;
var placementList = [];
var sessionid;
var fonts = [];
var activeObj = null;
var activePlacement = null;
var removeobj = 0;
var isSelectedColor = false;
var graytlx = 0;
var graytly = 0;
var graywidth = 0;
var grayheight = 0;
var canvas_org_imgdata = null;

function Product() {
    this.ID = 0;
    this.Name = "";
    this.Design_List = [];
}
Product.prototype.addDesign_Object = function(Name, PreviewImage, placementID, item) {
    var ID = product.Design_List.length;
    var designobj = {
        ID: ID,
        Name: Name,
        previewImage: PreviewImage,
        placementID: placementID,
        shapes: []
    };
    designobj.shapes.push(item);
    return designobj;

};
Product.prototype.getPlacement = function(placementID) {
    var i = placementID - 1;
    return placementList[i];
}
Product.prototype.addPlacement = function(Name, PreviewImage, PlacementID) {
    var ID = product.Design_List.length;
    product.ID = 0;
    product.Name = ""; // In the future, What,   I have to in here?
    product.Design_List.push({
        ID: ID,
        Name: Name,
        previewImage: PreviewImage,
        placementID: PlacementID,
        shapes: []
    });
};
Product.prototype.getID = function() {
    var id = 0;
    if (product.Design_List.length > 0) {
        for (var i = 0; i < product.Design_List.length; i++) {
            id += product.Design_List[i].shapes.length;
        }
    }
    return id;
}
Product.prototype.setSelectObj = function(item) {
    activeObj = item;
    var selectedObjId = item.id;
    var ca = item.sevData;
    if (item.objType == "image") {
        var html = '';
        $(".cliparteditor").show();
        $(".texteditorext").hide();

        if (removeobj == 0) {
            $('.cliparteditor').show();
            $(".colortab_custom").show();
            $(".texteditor").hide();
        }
        removeobj = 0;
        for (var i = 0; i < ca.CanvasObject.Colors.length; i++) {
            var colstr = ca.CanvasObject.Colors[i].HtmlColor;
            if (!colstr.includes("img")) {

                html += '<a class="btn btn-default colorpicker selectcolor" data-id="' + i +
                    '" style="background-color: ' +
                    ca.CanvasObject.Colors[i].HtmlColor +
                    '"></a>';
            } else {
                var imgstr = $('.cliparteditor .colorlayer').children().eq(i).css('background-image');
                html += "<a class='btn btn-default colorpicker selectcolor' data-id='" + i +
                    "' style='background-image : " + imgstr + ";background-color:" + ca.CanvasObject.Colors[i].HtmlColor + "'></a>";
            }

        }

        if (item.sizelock) {
            item.setControlsVisibility({
                'bl': false,
                'br': false,
                'mb': false,
                'ml': false,
                'mr': false,
                'mt': false
            });
            $('#clipart_width_text,  #clipart_width_range').prop('disabled', true);
            $('#clipart_height_text, #clipart_height_range').prop('disabled', true);
        } else {
            item.setControlsVisibility({
                'bl': true,
                'br': true,
                'mb': true,
                'ml': true,
                'mr': true,
                'mt': true
            });
            $('#clipart_width_text,  #clipart_width_range').prop('disabled', false);
            $('#clipart_height_text, #clipart_height_range').prop('disabled', false);
        }
        var i = $('.cliparteditor .colorlayer').find('a.active').attr('data-id');
        $('.cliparteditor .colorlayer').html(html);
        $('.cliparteditor .colorlayer').find('a.active').removeClass('active');
        $('.cliparteditor .colorlayer').find("[data-id='" + i + "']").addClass('active');
        $('.cliparteditor .firstp').show();
        $('.cliparteditor .secondp').hide();
        $('.edittextbox').hide();
        $('#clipart_width_text,  #clipart_width_range').val(parseFloat(item.getWidth()));
        $('#clipart_height_text, #clipart_height_range').val(parseFloat(item.getHeight()));
        $('#clipart_angle_text,  #clipart_angle_range').val(item.getAngle());

        $('#clipart_layer').find('li.active').removeClass('active');
        $('#clipart_layer').find("[data-id='image_" + selectedObjId + "']").addClass('active');
        // create design_colors array of selected clipart.

        ratio = item.getWidth() / item.getHeight();

        canvas.renderAll();
    } else if (item.objType == "text") {
        $(".cliparteditor").hide();
        $(".texteditor").show();
        if (removeobj == 0) {
            $(".colortab_custom").show();
            $(".texteditor").show();
            $('.cliparteditor').hide();

        }
        removeobj = 0;
        // Set value to html elements.
        item.setControlsVisibility({
            'bl': true,
            'br': true,
            'mb': true,
            'ml': true,
            'mr': true,
            'mt': true
        });
        $('#clipart_width_text,  #clipart_width_range').prop('disabled', false);
        $('#clipart_height_text, #clipart_height_range').prop('disabled', false);

        // $('#clipart_size_text,  #clipart_size_range').val( parseFloat(selectedObj.getFontSize()) );
        // $('#clipart_spacing_text, #clipart_spacing_range').val( parseFloat(selectedObj.spacing) );
        $('#clipart_rotate_text,  #clipart_rotate_range').val(item.getAngle());
        // $('#clipart_arc_text,  #clipart_arc_range').val( selectedObj.radius );

        $('#clipart_layer').find('li.active').removeClass('active');
        $('#clipart_layer').find("[data-id='text_" + selectedObjId + "']").addClass('active');
        $('#lock').attr('data-lock', 'true');
        $('#lock').css('background-position', '0 -3600px');

        item.setControlsVisibility({
            'bl': true,
            'br': true,
            'mb': true,
            'ml': true,
            'mr': true,
            'mt': true
        });
        $('#clipart_width_text,  #clipart_width_range').prop('disabled', false);
        $('#clipart_height_text, #clipart_height_range').prop('disabled', false);
        $('#fillcolor').css('background-color', item.fillColor);
        $('#strokecolor').css('background-color', item.strokeColor);
        $('.texteditor .firstp').show();
        $('.texteditor .secondp').hide();
        $('.edittextbox').hide();
    }
};
Product.prototype.refreshDesign = function(item) {
   var items = item;
   var designs = [];
   for (var i = 0; i < product.Design_List.length; i++) {
      if(product.Design_List[i].placementID == items.ID)
      {
         designs = product.Design_List[i].shapes;
         break;
      }

   }
   console.log(designs.length);
   //product.drawClipArt(designs[0].id, designs[0].left, designs[0].top, items.ID , items);
   for (var j = 0; j < designs.length; j++) {
      if(designs[j].objType == "image")
      {
         console.log(designs[j]);
         product.drawClipArt(designs[j].objID, designs[j].left, designs[j].top, items.ID , items);
         
      }
      else if(designs[j].objType == "text")
      {
         console.log($('#dlFonts_form').val()+"_"+designs[j].text+"_"+designs[j].left+"_"+designs[j].top+"_"+designs[j].fillColor+"_"+designs[j].strokeColor+"_"+items.ID+"_"+items);
         // product.drawCharacters($('#dlFonts_form').val(), designs[j].text, designs[j].left, designs[j].top, designs[j].fillColor, designs[j].strokeColor, items.ID,items);
      }
   }
};
Product.prototype.removeGrayGrid = function(obj) {
    var removegrayobj = [];
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].objType != undefined) {
            if (obj[i].objType == "backplacementID" || obj[i].objType == "image" || obj[i].objType == "text") {
                removegrayobj.push(obj[i]);
            }
        }
    }
    for (var i = 0; i < removegrayobj.length; i++) {
        isSelectedColor = true;
        canvas.remove(removegrayobj[i]);
        isSelectedColor = true;
    }
    isSelectedColor = false;
    $('#clipart_layer li').remove();

};
Product.prototype.drawGrayGrid = function(obj) {
    var ratios = 1;
    var w = obj.Width * 100;
    var h = obj.Height * 100;
    if (obj.Width > 12) {
        w = 1200;
        h = 12 / obj.Width * obj.Height * 100;
        ratios = obj.Height/obj.Width;
    } else if (obj.Height > 8) {
        h = 800;
        w = 8 / obj.Height * obj.Width * 100;
        ratios = obj.Width/obj.Height;
    }
    var gridlp = canvas.width / 2 - w / 2; // <= you must define this with final grid width
    var gridtp = canvas.height / 2 - h / 2; // <= you must define this with final grid height
    graytlx = gridlp;
    graytly = gridtp;
    graywidth = w;
    grayheight = h;
    var groupArray = [];
    // to manipulate grid after creation

    var gridSize = 10; // define grid size

    // define presentation option of grid
    var lineOption = {
        stroke: '#fff',
        strokeWidth: 1,
        selectable: false,
        strokeDashArray: [0, 0]
    };

    // do in two steps to limit the calculations
    // first loop for vertical line
    for (var i = Math.ceil(w / gridSize); i--;) {
        groupArray.push(new fabric.Line([gridSize * i, 0, gridSize * i, h], lineOption));
    }
    // second loop for horizontal line
    for (var i = Math.ceil(h / gridSize); i--;) {
        groupArray.push(new fabric.Line([0, gridSize * i, w, gridSize * i], lineOption));
    }

    // Group add to canvas
    var rect = new fabric.Rect({
        left: gridlp,
        top: gridtp,
        originX: 'left',
        originY: 'top',
        width: w,
        height: h,
        fill: '#eee',
        selectable: false,
        hoverCursor: 'pointer'
    });
    rect.set('objType', 'backplacementID');
    var nGridGroup = new fabric.Group(groupArray, {
        left: gridlp,
        top: gridtp,
        originX: 'left',
        originY: 'top',
        selectable: false,
        hoverCursor: 'pointer'
    });
    nGridGroup.set('objType', 'backplacementID');
    canvas.add(rect);
    canvas.add(nGridGroup);
    return ratios;
};
Product.prototype.drawClipArt = function(clipartid, x, y, placementID , pitem) {
    var xml = "<request><sessionid>" + sessionid + "</sessionid><clipartid>" + clipartid + "</clipartid></request>";
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/ClipArtGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.ClipArtGetResult;

            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {
                var ca = eval(r.Data)[0];
                console.log(ca);
                design_colors = [];
                for (var i = 0; i < ca.CanvasObject.Colors.length; i++) {
                    var isFound = false;
                    for (var j = 0; j < design_colors.length; j++) {
                        if (ca.CanvasObject.Colors[i].ID == design_colors[j].ID) {
                            ca.CanvasObject.Colors[i] = design_colors[j];
                            isFound = true;
                            break;
                        }
                    }

                    if (isFound == false) {
                        design_colors[design_colors.length] = ca.CanvasObject.Colors[i];
                        ca.CanvasObject.Colors[i] = design_colors[design_colors.length - 1];
                    }
                }

                // Set Group Colors to design_color array //
                for (var i = 0; i < ca.CanvasObject.Groups.length; i++) {
                    for (var j = 0; j < design_colors.length; j++) {
                        if (ca.CanvasObject.Groups[i].Fill.HtmlColor == design_colors[j].HtmlColor) {
                            ca.CanvasObject.Groups[i].Fill = design_colors[j];
                        }
                    }
                }

                var id = product.getID();
                var cid = 'image_' + id;
                $('#clipart_layer').find('li.active').removeClass('active');
                $('#clipart_layer').prepend('<li class="active" data-id="' + cid + '"><a data-href="#home"><canvas width="35" height="35" style="border-color:1px solid gray" id="' + cid + '"></canvas></a></li>');

                var source = getCanvasObjects([ca.CanvasObject], "image");
                var mycanvas = document.getElementById(cid);
                var myctx = mycanvas.getContext('2d');
                var newWidth = source.width / 2;
                var newHeight = source.height / 2;

                myctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, 35, 35);
                var h = 200 * source.height / source.width;
                var item = new fabric.Image(source, {
                    left: canvas.width / 2,
                    top: canvas.height / 2,
                    width: source.width*pitem.ratio,
                    height: source.height*pitem.ratio,
                    sizelock: 'false',
                    // opacity : 0.5
                    placementID: placementID,
                    originX: 'center',
                    originY: 'center',
                    name: ca.Name,
                    objId: ca.ID,
                    sevData: ca,
                });

                item.sizelock = ca.LockSize;
                item.set('id', id);
                item.set('objType', 'image');
                canvas.add(item);
                canvas.setActiveObject(item);
                activeObj = item;
                if (product.Design_List.length > 0) {
                    for (var i = 0; i < product.Design_List.length; i++) {

                        if (product.Design_List[i].placementID == placementID) {
                            product.Design_List[i].shapes.push(item);
                        } else {
                            product.Design_List.push(product.addDesign_Object("", "", placementID, item));
                        }
                    }
                } else {
                    product.Design_List.push(product.addDesign_Object("", "", placementID, item));

                }
                var html = '';
                // Set values in html elements.
                for (var i = 0; i < ca.CanvasObject.Colors.length; i++) {
                    html += '<a class="btn btn-default colorpicker selectcolor" data-id="' + i +
                        '" style="background-color: ' +
                        ca.CanvasObject.Colors[i].HtmlColor +
                        '"></a>';
                }
                $('.cliparteditor .colorlayer').html(html);
                $('#clipart_width_text,  #clipart_width_range').val(parseFloat(item.getWidth()));
                $('#clipart_height_text, #clipart_height_range').val(parseFloat(item.getHeight()));
                $('#clipart_angle_text,  #clipart_angle_range').val(item.getAngle());
                product.setSelectObj(item);
            }
        },
        async: false
    });
}
Product.prototype.updateImageDesign = function(item, i, colorstr) {
    if (item == null) {
        alert('Please select a Object.');
        return;
    }
    var ca = item.sevData;
    ca.CanvasObject.Colors[i].HtmlColor = colorstr;
    var source = getCanvasObjects([ca.CanvasObject], item.objType);
    var changeitem = new fabric.Image(source, {
        left: item.left,
        top: item.top,
        width: item.getWidth(),
        height: item.getHeight(),
        angle: item.getAngle(),
        sizelock: false,
        originX: 'center',
        originY: 'center',
        name: ca.Name,
        objID: ca.ID,
        sevData: ca,
        placementID: item.placementID
    });
    changeitem.sizelock = ca.LockSize;
    item.sizelock = ca.LockSize;
    changeitem.set('id', item.id);
    changeitem.set('objType', item.objType);
    canvas.add(changeitem);
    canvas.remove(item);
    canvas.setActiveObject(changeitem);
    for (var i = 0; i < product.Design_List.length; i++) {
        if (product.Design_List[i].placementID == item.placementID) {

            for (var j = 0; j < product.Design_List[i].shapes.length; j++) {
                if (product.Design_List[i].shapes[j].id == changeitem.id) {
                    product.Design_List[i].shapes[j] = changeitem;
                }
            }
            break;
        }

    }
    var cid = changeitem.objType + '_' + changeitem.id;
    var mycanvas = document.getElementById(cid);
    var myctx = mycanvas.getContext('2d');
    myctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, 35, 35);
};
Product.prototype.drawCharacters = function(fontid, characters, x, y, fillcolorstr, strokecolorstr, placementID,pitem) {
    
    if (characters.length == 0)
        return;
    var id = product.getID();
    $('#clipart_layer').find('li.active').removeClass('active');
    $('#clipart_layer').prepend('<li class="active" data-id="text_' + id + '"><a data-href="#"><canvas width="35" height="35" style="border-color:1px solid gray" id="text_' + id + '"></canvas></a></li>');
    var mycanvas = document.getElementById("text_"+id);
    var myctx = mycanvas.getContext('2d');
    canvas_org_imgdata = myctx.getImageData(0, 0, 35, 35);
    var item = getCharacters(fontid, characters, fillcolorstr, strokecolorstr, $('#text_' + id), x, y);
    item.set('id', id);
    item.set('objType', 'text');
    item.set('fillColor', fillcolorstr);
    item.set('strokeColor', strokecolorstr);
    item.set('text', characters);
    item.set('placementID', placementID);
    item.set('width', item.getWidth());
    item.set('height', item.getHeight());
    item.scale(0.1);
    item.sizelock = false;
    _render(item);
    canvas.add(item);
    activeObj = item;
    if (product.Design_List.length > 0) {
        for (var i = 0; i < product.Design_List.length; i++) {

            if (product.Design_List[i].placementID == placementID) {
                product.Design_List[i].shapes.push(item);
            } else {
                product.Design_List.push(product.addDesign_Object("", "", placementID, item));
            }
        }
    } else {
        product.Design_List.push(product.addDesign_Object("", "", placementID, item));
    }
    canvas.setActiveObject(item);
    $('#clipart_stretch_text, #clipart_stretch_range').val(item.getWidth());
    $('#clipart_lnheight_text, #clipart_lnheight_range').val(item.getHeight());
    $('#clipart_rotate_text, #clipart_rotate_range').val(item.getAngle());
    // object layer

    //$('#clipart_layer').find('#text_' + item.id).attr('src', item.toDataURL('png'));
    //var imagecanvas_ = new fabric.Canvas('imageCanvas');
    // var cid = item.objType + '_' + item.id; 
    // var mycanvas = document.getElementById(cid);
    // var myctx    = mycanvas.getContext('2d');
    // myctx.drawImage(item, 0, 0, item.width, source.height, 0, 0, 35, 35);
    // product.setSelectObj(item);
};
Product.prototype.updateTextDesign = function(item, fontid, str, fillcolor, strokecolor) {
    if (item == null) {
        alert('Please select a Object.');
        return;
    }
    var that = $('#clipart_layer').find('#text_' + item.id);

    var changeitem = getCharacters(fontid, item.text, fillcolor, strokecolor, that, item.left, item.top);

    changeitem.set('id', item.id);
    changeitem.set('objType', 'text');
    changeitem.set('fillColor', fillcolor);
    changeitem.set('strokeColor', strokecolor);
    changeitem.set('text', str);
    changeitem.set('placementID', item.placementID);
    // changeitem.set('width',item.getWidth());
    // changeitem.set('height',item.getHeight());
    changeitem.scale(0.1);
    changeitem.sizelock = false;
    //_render(item);
    canvas.remove(item);
    canvas.add(changeitem);
    canvas.setActiveObject(changeitem);
    product.setSelectObj(changeitem);
    for (var i = 0; i < product.Design_List.length; i++) {
        if (product.Design_List[i].placementID == item.placementID) {
            //product.Design_List[i].shapes.push(item);
            for (var j = 0; j < product.Design_List[i].shapes.length; j++) {
                if (product.Design_List[i].shapes[j].id == changeitem.id) {
                    product.Design_List[i].shapes[j] = changeitem;
                }
            }
            break;
        }

    }
    // $('#clipart_layer').find('li.active').removeClass('active');
    // $('#clipart_layer').prepend('<li class="active" data-id="text_' + id + '"><a data-href="#"><img width="35" height="35" style="border-color:1px solid gray" id="text_' + id + '"></a></li>');
};
$(document).ajaxStart(function() {
    $('.container-fluid').css('cursor', 'wait');
}).ajaxComplete(function() {
    $('.container-fluid').css('cursor', 'initial');
});

function login() {
    var xml = '<request><clientname>Sparkly Tees</clientname><sitekey>C7488241-3948-4827-BF7C-86D8A63AC51F</sitekey></request>';

    $.ajax({
        type: "POST",
        url: url + "/Site.svc/SiteLogin",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.SiteLoginResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            } else {

                sessionid = r.SessionID;
                listFonts();
                listClipArt();
                getColorPalette();
                listPlacement();
                var mycanvas = document.getElementById('myCanvas');
                var myctx = mycanvas.getContext('2d');
                drawGrid();

            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}


function listPlacement() {
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/PlacementList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.PlacementListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {
                var data = eval(r.Data);
                placementList = data;
                for (var i = 0; i < data.length; i++) {
                    var p = data[i];
                    $(".placement-modal .modal-body").append("<div style='float:left;'><IMG src='http://api.thetshirtguylv.com/image/placement/" + p.PreviewImage + "' data-width='" + p.Width + "' data-height='" + p.Height + "' data-name='" + p.Name + "' data-overlap='" + p.Overlap + "' data-id='" + p.ID + "'/><br><p align='center'>" + p.Name + "</p></div>");
                }
            }
        }
    });
}


function listClipArt() {
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/ClipArtList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.ClipArtListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var c = data[i];
                    $('#listClipArt').append($('<li>', {
                        id: c.ID,
                        html: c.Name,
                        "data-type": "image",
                        "data-name": c.Name,
                        "data-locksize": c.LockSize,

                    }));

                }
            }
        }
    });
}


function listFonts() {
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";

    $.ajax({
        type: "POST",
        url: url + "/Site.svc/FontList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.FontListResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    $('#dlFonts_form').append($('<option>', {
                        value: f.ID,
                        text: f.Name
                    }));
                    getFont(f.ID);
                }
            }
        }
    });
}

function getFont(fontid) {
    var xml = "<request><sessionid>" + sessionid + "</sessionid><fontid>" + fontid + "</fontid></request>";
    $.ajax({
        type: "POST",
        url: url + "/Site.svc/FontGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.FontGetResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {
                fonts[fontid] = eval(r.Data)[0];
            }
        }
    });
}
// Convert from data array to canvas object.
function getCanvasObjects(data_array, objtype) {
    var log = false;
    var width = 0;
    var height = 0;
    var gap = 10;
    var x = 0;
    var y = 0;
    var baseline = 0;

    for (var i = 0; i < data_array.length; i++) {
        var c = data_array[i];
        if (x == 0) {
            x = c.Width / 2;
        }
        if (c.Height > height) {
            height = c.Height;
        }
        width += c.Width;
        width += gap;
    }
    width -= gap;
    if (objtype == "image") {
        height = c.Height;
        y = c.Height / 2;
    } else if (objtype == "text") {
        height = c.Height + 210;
        y = c.Height;
    }


    var cTemp = document.createElement('canvas');
    cTemp.width = width;
    cTemp.height = height;
    var ctx = cTemp.getContext('2d');
    for (var da = 0; da < data_array.length; da++) {
        var data = data_array[da];
        for (var i = 0; i < data.Groups.length; i++) {
            var g = data.Groups[i];
            for (var j = 0; j < g.Paths.length; j++) {
                var p = g.Paths[j];
                var a = eval(p.Command);
                if (log) console.log(p.Command);
                switch (a[0]) {
                    case 'BP':
                        ctx.beginPath();
                        if (log) console.log('ctx.beginPath();');
                        break;
                    case 'MT':
                        ctx.moveTo((x + a[1]), (y + a[2]));
                        if (log) console.log('ctx.moveTo(' + (x + a[1]) + ',' + (y + a[2]) + ');');
                        break;
                    case 'LT':
                        ctx.lineTo((x + a[1]), (y + a[2]));
                        if (log) console.log('ctx.lineTo(' + (x + a[1]) + ',' + (y + a[2]) + ');');
                        break;
                    case 'BCT':
                        ctx.bezierCurveTo((x + a[1]), (y + a[2]), (x + a[3]), (y + a[4]), (x + a[5]), (y + a[6]));
                        if (log) console.log('ctx.bezierCurveTo(' + (x + a[1]) + ',' + (y + a[2]) + ',' + (x + a[3]) + ',' + (y + a[4]) + ',' + (x + a[5]) + ',' + (y + a[6]) + ');');
                        break;
                    case 'CP':
                        ctx.closePath();
                        if (log) console.log('ctx.closePath();');
                        break;
                }
            }

            if (g.Fill !== undefined) {
                if (g.Fill.HtmlColor.indexOf('img_pattern') != -1) {

                    var image = document.getElementById(g.Fill.HtmlColor);
                    ctx.fillStyle = ctx.createPattern(image, "repeat");
                } else {
                    ctx.fillStyle = g.Fill.HtmlColor.replace(new RegExp("'", 'g'), "");
                }

                ctx.mozFillRule = 'evenodd';
                ctx.fill('evenodd');
                if (log) {
                    console.log('ctx.fillStyle = ' + g.Fill.HtmlColor + ';');
                    console.log('ctx.mozFillRule = \'evenodd\';');
                    console.log('ctx.fill(\'evenodd\');');
                }
            }

            if (g.Stroke != undefined) {
                if (g.Stroke.HtmlColor.indexOf('img_pattern') != -1) {

                    var image = document.getElementById(g.Stroke.HtmlColor);
                    ctx.strokeStyle = ctx.createPattern(image, "repeat");
                } else {
                    ctx.strokeStyle = g.Stroke.HtmlColor.replace(new RegExp("'", 'g'), "");
                }
                //ctx.strokeStyle = g.Stroke.HtmlColor;
                ctx.lineWidth = g.StrokeWidth;
                ctx.stroke();
                if (log) {
                    console.log('ctx.strokeStyle = ' + g.Stroke.HtmlColor + ';');
                    console.log('ctx.lineWidth = ' + g.StrokeWidth + ';');
                    console.log('ctx.stroke();');
                }
            }
        }
        x += ((data.Width / 2) + gap);
        if (da + 1 < data_array.length)
            x += (data_array[da + 1].Width / 2);
    }

    return (cTemp);
}

function getCharacters(fontid, characters, fillcolorstr, strokecolor, $that, l, t) {
    var cliparts = [];
    var left = canvas.width / 2;
    var height = 0;
    var mycanvas = document.getElementById($that.attr('id'));
    var myctx = mycanvas.getContext('2d');
    myctx.putImageData(canvas_org_imgdata, 0, 0);
    //myctx.drawImage(item, 0, 0, item.width, source.height, 0, 0, 35, 35);
    var sourcel = 35 / characters.length;
    for (var i = 0; i < characters.length; i++) {

        for (var j = 0; j < fonts[fontid].Characters.length; j++) {
            if (characters[i] != " ") {
                var c = fonts[fontid].Characters[j];
                c.CanvasObject.Groups[0].Stroke = {
                    HtmlColor: strokecolor,
                    Pattern: ""
                };
                var sc = c.CanvasObject.Width / c.CanvasObject.Height;
                c.CanvasObject.Groups[0].Fill.HtmlColor = fillcolorstr;
                if (c.Character == characters[i]) {

                    // if(h==0)
                    // {
                    //    h = c.CanvasObject.Height;
                    //    w = h*sc;
                    // }
                    // else{
                    //    w = h*sc;

                    // }
                    if (c.CanvasObject.Height > height) {
                        height = c.CanvasObject.Height;

                    }
                    c.CanvasObject.Groups[0].StrokeWidth = 20;
                    var source = getCanvasObjects([c.CanvasObject], "text");
                    myctx.drawImage(source, 0, 0, source.width, source.height, (35 / characters.length) * (i), 0, 35 / characters.length, 35);
                    cliparts.push(new fabric.Image(getCanvasObjects([c.CanvasObject], "text"), {
                        left: left,
                        top: canvas.height / 2,
                        originX: 'left',
                        originY: 'bottom',
                        width: c.CanvasObject.Width,
                        height: c.CanvasObject.Height,
                    }));
                    left += c.CanvasObject.Width + 2;
                    break;
                }
            } else {
                left += 200;
                break;
            }
        }
    }

    var grp = new fabric.Group(cliparts, {
        left: l,
        top: t,
    });
    return grp;
}

function _render(source) {
    var left = source.left;
    var top = source.top;
    var scaleX = source.getScaleX();
    var scaleY = source.getScaleY();

    // Make a arced text.
    var radius  = 4000;
    var arc     = 10;
    var reverse = false;
    var align   = 'center';
    var arclength = 0;

    if ( align === 'center' ) {
        align = ( arc / 2) * ( source.size() - 1) ;
    } else if ( align === 'right' ) {
        align = ( arc ) * ( source.size() - 1) ;
    }

    for ( var i = 0; i < source.size(); i ++) {
        // Find coords of each letters (radians : angle*(Math.PI / 180)
        if ( reverse ) {
            curAngle = (-i * parseInt( arc, 10 )) + align;
            angleRadians = curAngle * (Math.PI / 180);
            source.item(i).set( 'top', (Math.cos( angleRadians ) * radius));
            source.item(i).set( 'left', (-Math.sin( angleRadians ) * radius) );
        } else {
            curAngle = (i * parseInt( arc, 10)) - align;
            angleRadians = curAngle * (Math.PI / 180);
            source.item(i).set( 'top', (-Math.cos( angleRadians ) * radius) );
            source.item(i).set( 'left', (Math.sin( angleRadians ) * radius) );
        }

        source.item(i).setAngle( curAngle );
    }
    
    // Update group coords
    source._calcBounds();
    source._updateObjectsCoords();
    source.top = top;
    source.left = left;
    source.saveCoords();

    source.setScaleX(scaleX);
    source.setScaleY(scaleY);

    canvas.renderAll();
}

function drawGrid() {
    var gridWidth = canvas.width; // <= you must define this with final grid width
    var gridHeight = canvas.height; // <= you must define this with final grid height

    var groupArray = [];
    // to manipulate grid after creation

    var gridSize = 10; // define grid size

    // define presentation option of grid
    var lineOption = {
        stroke: '#eee',
        strokeWidth: 1,
        selectable: false,
        strokeDashArray: [0, 0]
    };

    // do in two steps to limit the calculations
    // first loop for vertical line
    for (var i = Math.ceil(gridWidth / gridSize); i--;) {
        groupArray.push(new fabric.Line([gridSize * i, 0, gridSize * i, gridHeight], lineOption));
    }
    // second loop for horizontal line
    for (var i = Math.ceil(gridHeight / gridSize); i--;) {
        groupArray.push(new fabric.Line([0, gridSize * i, gridWidth, gridSize * i], lineOption));
    }

    // Group add to canvas
    var oGridGroup = new fabric.Group(groupArray, {
        left: 0,
        top: 0,
        originX: 'left',
        originY: 'top',
        selectable: false,
        hoverCursor: 'pointer'
    });
    canvas.add(oGridGroup);
}

function getColorPalette() {

    $('.tab_custom').css("height", $('.colortab_custom'));
    var col_array = [];
    var col_name_array = [];
    var img_dir_array = [];
    var img_pat_array = [];
    var img_name_array = [];
    var col_group_name = "";
    var pattern_group_name = "";

    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";

    $.ajax({
        type: "POST",
        url: url + "/Site.svc/ColorPaletteGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.ColorPaletteGetResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {

                var data = eval(r.Data);
                var p = data[0];
                for (var x = 0; x < p.ColorPaletteGroups.length; x++) {

                    var g = p.ColorPaletteGroups[x];
                    // g.Name,g.PriceIncrease g.id
                    for (var y = 0; y < g.ColorPaletteItems.length; y++) {

                        var i = g.ColorPaletteItems[y];
                        // is color?
                        if (i.HtmlColor != "") {
                            col_group_name = g.Name;
                            col_array[y] = i.HtmlColor;
                            col_name_array[y] = i.MediaColorName;
                        }
                        // is pattern?
                        else if (i.HtmlColor == "" && i.PreviewImage != "") {
                            pattern_group_name = g.Name;
                            img_dir_array[y] = i.PreviewImage;
                            img_name_array[y] = i.MediaColorName;
                            img_pat_array[y] = i.PatternImage;
                            // console.log(y+img_dir_array[y]);
                        }
                        // console.log(i.PatternImage);
                        /* 
                        This is Object Item of ColorpaletteItems
                        i.ID,MediaColorID,MediaColorName,HtmlColor,PatternImage,PreviewImage,MediaColorTypeID,MediaColorTypeName 
                        */
                    }
                }
                var strx = "";
                var stry = "";
                for (var i = 0; i < col_array.length; i++) {
                    strx += "<a class='btn btn-default selectcolor' style='background:" + col_array[i] + ";' title='" + col_name_array[i] + "'></a>";
                }

                for (var i = 0; i < img_dir_array.length; i++) {
                    stry += "<a class='btn btn-default selectcolor' style='background-image:url(" + url + img_dir_array[i] + ");margin-top:3px; margin-left :3px' title='" + img_name_array[i] + "'></a>";
                    stry += "<img id='img_pattern_" + i + "' src='" + url + img_pat_array[i] + "' style='display:none'>";

                    // var img = new Image();
                    // img.crossOrigin="anonymous";
                }
                $('.cliparteditor #colorpad').html(strx);
                $('.cliparteditor #patternpad').html(stry);
                $('.cliparteditor #colorx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + col_group_name);
                $('.cliparteditor #patternx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + pattern_group_name);
                $('.texteditor #colorpad').html(strx);
                $('.texteditor #patternpad').html(stry);
                $('.texteditor #colorx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + col_group_name);
                $('.texteditor #patternx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + pattern_group_name);
            }
        }
    });
}

// Select a color layer.

$('body').on('click', '.cliparteditor .colorlayer a', function(event) {
    $('.cliparteditor .colorlayer').find('a.active').removeClass('active');
    $(this).addClass('active');
});
$('body').on('click', '.texteditor .colorlayer a', function(event) {
    $('.texteditor .colorlayer').find('a.active').removeClass('active');
    $(this).addClass('active');
});


// Select a text colorpad.
$('body').on('click', '.texteditor #colorpad a', function(event) {
    $('.texteditor .colorlayer').find('a.active').css('background-color', $(this).css('background-color'));
    $('.texteditor .colorlayer').find('a.active').css('background-image', '');
    isSelectedColor = true;
    activeObj = canvas.getActiveObject();
     if ($('#fillcolor').css('background-image') == "none") {
         if ($('#strokecolor').css('background-image') == "none") {
             product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').css('background-color'), $('#strokecolor').css('background-color'));
         } else {

             product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').css('background-color'), $(this).next().attr('id'));
         }

     }
     if ($('#fillcolor').css('background-image') != "none") {
         if ($('#strokecolor').css('background-image') == "none") {
             product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $(this).next().attr('id'), $('#strokecolor').css('background-color'));
         } else {

             product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $(this).next().attr('id'), $(this).next().attr('id'));
         }

     }

});
// Select text pattern pad.
$('body').on('click', '.texteditor #patternpad a', function(event) {
    $('.texteditor .colorlayer').find('a.active').css('background-color', '');
    $('.texteditor .colorlayer').find('a.active').css('background-image', $(this).css('background-image'));
    isSelectedColor = true;
    activeObj = canvas.getActiveObject();
     if ($('#fillcolor').css('background-image') == "none") {
         if ($('#strokecolor').css('background-image') == "none") {
             product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').css('background-color'), $('#strokecolor').css('background-color'));
         } else {

             product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').css('background-color'), $(this).next().attr('id'));
         }

     }
     if ($('#fillcolor').css('background-image') != "none") {
         if ($('#strokecolor').css('background-image') == "none") {
             product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $(this).next().attr('id'), $('#strokecolor').css('background-color'));
         } else {

             product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $(this).next().attr('id'), $(this).next().attr('id'));
         }

     }
});
// Select a clipart color pad.
$('body').on('click', '.cliparteditor #colorpad a', function(event) {
    $('.cliparteditor .colorlayer').find('a.active').css('background-color', $(this).css('background-color'));
    $('.cliparteditor .colorlayer').find('a.active').css('background-image', '');
    isSelectedColor = true;
    activeObj = canvas.getActiveObject();
    product.updateImageDesign(activeObj, $('.cliparteditor .colorlayer').find('a.active').attr('data-id'), $(this).css('background-color'));
    

});
// Select a clipart pattern pad.
$('body').on('click', '.cliparteditor #patternpad a', function(event) {
    $('.cliparteditor .colorlayer').find('a.active').css('background-color', '');
    $('.cliparteditor .colorlayer').find('a.active').css('background-image', $(this).css('background-image'));
    isSelectedColor = true;
    activeObj = canvas.getActiveObject();
    product.updateImageDesign(activeObj, $('.cliparteditor .colorlayer').find('a.active').attr('data-id'), $(this).next().attr('id'));
     
});

var ratio;

var isChagingAngle = false;
$('#clipart_angle_text, #clipart_angle_range').mousedown(function(event) {
    isChagingAngle = true;
}).mousemove(function() {
    if (!isChagingAngle) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;

    var val = parseInt($(this).val());
    selectedObj.setAngle(val);

    $('#clipart_angle_text, #clipart_angle_range').val(val);
    canvas.renderAll();
}).mouseup(function(event) {
    isChagingAngle = false;
});

// ---------------------------------------------------------------------------
// clipart width
var isChagingWidth = false;
$('#clipart_width_text, #clipart_width_range').mousedown(function(event) {
    isChagingWidth = true;
}).mousemove(function() {
    if (!isChagingWidth) return;


    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;

    var val = parseFloat($(this).val());
    if ($('.cliparteditor #lock').attr('data-lock') == 'true') {
        selectedObj.setHeight(val / ratio);
        $('#clipart_height_text, #clipart_height_range').val(val / ratio);
    }

    selectedObj.setWidth(val);
    $('#clipart_width_text, #clipart_width_range').val(val);
    canvas.renderAll();

}).mouseup(function(event) {
    isChagingWidth = false;
});

// ---------------------------------------------------------------------------
// clipart height
var isChagingHeight = false;
$('#clipart_height_text, #clipart_height_range').mousedown(function(event) {
    isChagingHeight = true;
}).mousemove(function(event) {
    if (!isChagingHeight) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;

    var val = parseFloat($(this).val());
    if ($('.cliparteditor #lock').attr('data-lock') == 'true') {
        selectedObj.setWidth(val * ratio);
        $('#clipart_width_text, #clipart_width_range').val(val * ratio);
    }
    selectedObj.setHeight(val);
    $('#clipart_height_text, #clipart_height_range').val(val);
    canvas.renderAll();

}).mouseup(function(event) {
    isChagingHeight = false;
});

// ---------------------------------------------------------------------------
// text rotate
$('#clipart_rotate_text, #clipart_rotate_range').mousedown(function(event) {
    isChagingAngle = true;
}).mousemove(function() {
    if (!isChagingAngle) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;
    var val = parseInt($(this).val());
    selectedObj.setAngle(val);
    $('#clipart_rotate_text, #clipart_rotate_range').val(val);

    canvas.renderAll();
}).mouseup(function(event) {
    isChagingAngle = false;
});

// ---------------------------------------------------------------------------
// Text arc
$('#clipart_arc_text, #clipart_arc_range').mousedown(function(event) {
    isChagingAngle = true;
}).mousemove(function() {
    if (!isChagingAngle) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;
    var val = parseInt($(this).val());
    selectedObj.set('radius', val);
    $('#clipart_arc_text, #clipart_arc_range').val(val);

    canvas.renderAll();
}).mouseup(function(event) {
    isChagingAngle = false;
    if ($('.texteditor .colorlayer').find('a.active').attr('id') == "fillcolor") {
        product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $(this).next().attr('id'), $('#strokecolor').css('background-color'));
    } else if ($('.texteditor .colorlayer').find('a.active').attr('id') == "strokecolor") {

        product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#strokecolor').css('background-color'), $(this).next().attr('id'));
    }
});

// ---------------------------------------------------------------------------
// Text spacing
$('#clipart_spacing_text, #clipart_spacing_range').mousedown(function(event) {
    isChagingAngle = true;
}).mousemove(function() {
    if (!isChagingAngle) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null || selectedObj.getBoundingRectWidth() > canvas.width)
        return;

    var val = parseInt($(this).val());
    // selectedObj.set('spacing', val);
    var left = selectedObj.item(0).left;
    for (var i = 0; i < selectedObj.size(); i++) {
        selectedObj.item(i).left = left;

        left += selectedObj.item(i).getWidth() + val * 1 / selectedObj.getScaleX();
    }
    _render(selectedObj);

    $('#clipart_spacing_text, #clipart_spacing_range').val(val);


}).mouseup(function(event) {
    isChagingAngle = false;
});

// ---------------------------------------------------------------------------
// Text stretch
var isChagingWidth = false;
$('#clipart_stretch_text, #clipart_stretch_range').mousedown(function(event) {
    isChagingWidth = true;
}).mousemove(function() {
    if (!isChagingWidth) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;

    var val = parseFloat($(this).val());
    if (val > canvas.width)
        val = canvas.width;
    selectedObj.scaleWidth(val);
    $('#clipart_stretch_text, #clipart_stretch_range').val(val);
    if ($('.texteditor #lock').attr('data-lock') == 'true') {
        $('#clipart_lnheight_text, #clipart_lnheight_range').val(val);
        selectedObj.scaleHeight(val);
    }
    _render(selectedObj);

}).mouseup(function(event) {
    isChagingWidth = false;
});

// ---------------------------------------------------------------------------
// Text lnheight
var isChagingHeight = false;
$('#clipart_lnheight_text, #clipart_lnheight_range').mousedown(function(event) {
    isChagingHeight = true;
}).mousemove(function(event) {
    if (!isChagingHeight) return;
    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;

    var val = parseFloat($(this).val());
    if (val > canvas.height)
        val = canvas.height;
    selectedObj.scaleHeight(val);
    $('#clipart_lnheight_text, #clipart_lnheight_range').val(val);
    if ($('.texteditor #lock').attr('data-lock') == 'true') {
        selectedObj.scaleWidth(val);
        $('#clipart_stretch_text, #clipart_stretch_range').val(val);
    }
    selectedObj.scaleHeight(val);
    _render(selectedObj);

}).mouseup(function(event) {
    isChagingHeight = false;
});

// ---------------------------------------------------------------------
// text size
$('#clipart_size_text, #clipart_size_range').mousedown(function(event) {
    isChagingAngle = true;
}).mousemove(function() {
    if (!isChagingAngle) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;

    var val = parseInt($(this).val());
    selectedObj.scale(val);
    $('#clipart_size_text, #clipart_size_range').val(val);

    canvas.renderAll();
}).mouseup(function(event) {
    isChagingAngle = false;
});


$('.layer_up').click(function(event) {
    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;
    if (selectedObj) {

        selectedObj.bringForward();
    }
    //selectedObj.bringToFront();

    // Update object tab
    var id = selectedObj.id;
    if (selectedObj.objType == "image") {
        var selLi = $('#clipart_layer').find("[data-id='image_" + selectedObj.id + "']");
    } else if (selectedObj.objType == "text") {
        var selLi = $('#clipart_layer').find("[data-id='text_" + selectedObj.id + "']");
    }
    var prev = selLi.prev();
    prev.before(selLi);
    canvas.renderAll();
});

$('.layer_down').click(function(event) {
    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;
    console.log($('#clipart_layer li:last-child').attr('data-id') + "_" + selectedObj.id);
    var as = $('#clipart_layer li:last-child').attr('data-id').split("_");
    if (as[1] == selectedObj.id) {
        alert(1);
        return;
    }
    if (selectedObj) {
        selectedObj.sendBackwards();
    }

    var id = selectedObj.id;
    if (selectedObj.objType == "image") {
        var selLi = $('#clipart_layer').find("[data-id='image_" + selectedObj.id + "']");
    } else if (selectedObj.objType == "text") {
        var selLi = $('#clipart_layer').find("[data-id='text_" + selectedObj.id + "']");
    }
    var next = selLi.next();
    next.after(selLi);
    canvas.renderAll();
});

$('.position_center').click(function(event) {
    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;

    selectedObj.left = parseInt(canvas.getWidth() / 2, 10);
    canvas.renderAll();
    canvas.setActiveObject(selectedObj);
});


$('.texteditor #lock').click(function(event) {
    if ($(this).attr('data-lock') == 'false') {
        $(this).attr('data-lock', 'true');
        $(this).css('background-position', '0 -3600px');
    } else {
        $(this).attr('data-lock', 'false');
        $(this).css('background-position', '0 -3650px');
    }
});
$('.cliparteditor #lock').click(function(event) {
    if ($(this).attr('data-lock') == 'false') {
        $(this).attr('data-lock', 'true');
        $(this).css('background-position', '0 -3600px');
    } else {
        $(this).attr('data-lock', 'false');
        $(this).css('background-position', '0 -3650px');
    }
});

$('body').on('click', '#clipart_layer li', function(e) {

    var data_id = $(this).attr('data-id');
    var res = data_id.split("_");
    var type = res[0];
    var id = res[1];
    $('#clipart_layer').find('li.active').removeClass('active');
    $('#clipart_layer').find("[data-id='" + data_id + "']").addClass('active');
    for (var i = 0; i < canvas.getObjects().length; i++) {
        if (canvas.item(i).id == id && canvas.item(i).objType == type) {
            canvas.setActiveObject(canvas.item(i));
            product.setSelectObj(canvas.item(i));
            return;
        }
    }

});
$('#placement').click(function(e) {
    if (product.Design_List.length > 0) {
        for (var i = 0; i < product.Design_List.length; i++) {

            var pobj = product.getPlacement(product.Design_List[i].placementID);
            if (pobj.Overlap != null) {
                var overlaps = pobj.Overlap.split(",");
                for (var j = 0; j < overlaps.length; j++) {
                    $('.placement-modal .modal-body').children('div').each(function() {
                        if ($(this).children('img').attr('data-id') == overlaps[j]) {
                            $(this).children('img').css('opacity', 0.3);
                        }
                    });

                }
            }
        }
    }
});
$('.placement-modal .modal-body').on('click', 'div', function() {
    $('.placement-modal .modal-body').find('.active').removeClass('active');
    $(this).addClass('active');
});

$('#select_placement').click(function(event) {
    var pobj = product.getPlacement($('.placement-modal .modal-body').find('.active').children('img').attr('data-id'));
    if (product.Design_List.length > 0) {

        if ($('.placement-modal .modal-body').find('.active').children('img').css('opacity') == 0.3) {
            alert("Please select other placement.");
            return;
        } else {
            if ($('.placement-modal .modal-body').find('.active').hasClass('selectdesign')) {
                activePlacement = product.getPlacement(pobj.ID);
            } else {
                product.addPlacement(pobj.Name, pobj.PreviewImage, pobj.ID);
                activePlacement = product.getPlacement(pobj.ID);
            }
        }

    } else {
        product.addPlacement(pobj.Name, pobj.PreviewImage, pobj.ID);
        activePlacement = product.getPlacement(pobj.ID);
    }

    $('#placement').attr('src', $('.placement-modal .modal-body').find('.active').children('img').attr('src'));
    $('.placement-modal .modal-body').find('.active').addClass('selectdesign');
    $('.placement-modal .close').click();
    product.removeGrayGrid(canvas.getObjects());
    var ratio = product.drawGrayGrid(activePlacement);
    activePlacement.ratio = ratio;
    product.refreshDesign(activePlacement);
});
$("#tbx").on('input', function(e) {
    activeObj = canvas.getActiveObject();
    isSelectedColor = true;
    if ($('#fillcolor').css('background-image') == "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), $("#tbx").val(), $('#fillcolor').css('background-color'), $('#strokecolor').css('background-color'));
        } else {

            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), $("#tbx").val(), $('#fillcolor').css('background-color'), $(this).next().attr('id'));
        }

    }
    if ($('#fillcolor').css('background-image') != "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), $("#tbx").val(), $(this).next().attr('id'), $('#strokecolor').css('background-color'));
        } else {

            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), $("#tbx").val(), $(this).next().attr('id'), $(this).next().attr('id'));
        }

    }

});
$('#dlFonts_form').change(function() {
    activeObj = canvas.getActiveObject();
    isSelectedColor = true;
    if ($('#fillcolor').css('background-image') == "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), $("#tbx").val(), $('#fillcolor').css('background-color'), $('#strokecolor').css('background-color'));
        } else {

            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), $("#tbx").val(), $('#fillcolor').css('background-color'), $(this).next().attr('id'));
        }

    }
    if ($('#fillcolor').css('background-image') != "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), $("#tbx").val(), $(this).next().attr('id'), $('#strokecolor').css('background-color'));
        } else {

            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), $("#tbx").val(), $(this).next().attr('id'), $(this).next().attr('id'));
        }

    }


});

function updateControls() {
    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;

    if (selectedObj.objType == "image") {
        $('#clipart_width_text, #clipart_width_range').val(selectedObj.getWidth());
        $('#clipart_height_text, #clipart_height_range').val(selectedObj.getHeight());
        $('#clipart_angle_text, #clipart_angle_range').val(selectedObj.getAngle());
    } else if (selectedObj.objType == "text") {
        $('#clipart_stretch_text, #clipart_stretch_range').val(selectedObj.getWidth());
        $('#clipart_lnheight_text, #clipart_lnheight_range').val(selectedObj.getHeight());
        $('#clipart_rotate_text, #clipart_rotate_range').val(selectedObj.getAngle());
    }
    // ratio = selectedObj.getWidth() / selectedObj.getHeight();
}

// Handle canvas event
canvas.on({
    'object:modified': checkText,
    'object:resizing': updateControls,
    'object:rotating': updateControls,
    'object:scaling': updateControls,
    'object:removed': updatelayersection,
    'selection:cleared': removeEditPanel,
    'object:moving': grayCanvasBound,
    "mouse:down": function(e) {
        var selectedObj = canvas.getActiveObject();
        if (selectedObj == null)
            return;
        activeObj = selectedObj;
        product.setSelectObj(selectedObj);
    },
    "mouse:move": function(e) {

    }
});

function grayCanvasBound() {
    // var selectedObj = canvas.getActiveObject();
    // lpos = selectedObj.getBoundingRect().left;
    // tpos = selectedObj.getBoundingRect().top;
    // gwidth = selectedObj.getBoundingRect().width;
    // gheight = selectedObj.getBoundingRect().height;
    // // graytlx = gridlp;
    // // graytly = gridtp;
    // // graywidth = w;
    // // grayheight = h;
    // // if((graytlx>lpos && graytly<tpos) || (graytlx+graywidth>lpos+gwidth && graytly+grayheight<tpos+gheight) || )
    // //if(selectedObj)
}


function checkText(e) {

    var b = e.target;
    var c = this;
    var selectedObj = canvas.getActiveObject();
    var ratio = selectedObj.getWidth() / selectedObj.getHeight();
    var selectedObjId = selectedObj.id;

    if (selectedObj.objType == "image") {
        var cid = 'image_' + selectedObjId;
    } else if (selectedObj.objType == "text") {
        var cid = 'text_' + selectedObjId;
    }
    var angle = selectedObj.getAngle();
    if (ratio > 1) {
        $('#' + cid).css('transform', 'rotate(' + angle + 'deg) scale(1,' + 1 / ratio + ')');
    } else {
        $('#' + cid).css('transform', 'rotate(' + angle + 'deg) scale(' + ratio + ',1)');
    }

}

function updatelayersection() {
    if (!isSelectedColor) {
        $('.colortab_custom').hide();
        if (activeObj.objType == 'image') {
            $('#clipart_layer').find("[data-id='image_" + activeObj.id + "']").remove();
        } else if (activeObj.objType == 'text') {
            $('#clipart_layer').find("[data-id='text_" + activeObj.id + "']").remove();
        }

        removeobj = 1;
    }

    isSelectedColor = false;
}

function removeEditPanel() {

    if (!isSelectedColor) {
        $(".colortab_custom").hide();
    }
}
$('#addText').click(function() {
    $('#tbxbefore').val('');
    $('.colortab_custom').show();
    $('.edittextbox').show();
    $('.cliparteditor').hide();
    $('.texteditor').hide();
});
$('#gotext').click(function() {
    $('.edittextbox').hide();
    $('#tbx').val($('#tbxbefore').val());
    $('.texteditor').show();
    product.drawCharacters($('#dlFonts_form').val(), $('#tbx').val(), $('#myCanvas').width() / 2, $('#myCanvas').height() / 2, $("#fillcolor").css("background-color"), $("#strokecolor").css("background-color"), activePlacement.ID,activePlacement);

    $('cliparteditor').hide();
});
jQuery(document).ready(function() {
    product = new Product();
    login();
    jQuery('#placement').click();
    jQuery('.secondp').hide();
    jQuery(".tabcontent").children().hide();
    jQuery(".tabcontent").children().first().show();
    jQuery('.colortab_custom').hide();
    jQuery('.tab_custom').height(jQuery('.colortab_custom').height());
    acc[0].classList.toggle("active");
    acc[0].nextElementSibling.classList.toggle("show");
    accc[0].classList.toggle("active");
    accc[0].nextElementSibling.classList.toggle("show");
});

$('body').on('click', '#listClipArt li', function(event) {
    $('.edittextbox').hide();
    product.drawClipArt($(this).attr('id'), $('#myCanvas').width() / 2, $('#myCanvas').height() / 2, activePlacement.ID,activePlacement);
});


$('body').on('click', '.cliparteditor .colorpicker', function(e) {
    if ($('.cliparteditor .firstp').css("display") == "none") {

        $('.cliparteditor .firstp').show();
        $('.cliparteditor .secondp').hide();
    } else if ($('.cliparteditor .firstp').css("display") == "block") {
        $('.cliparteditor .firstp').hide();
        $('.cliparteditor .secondp').show();
    }
    $('.tab_custom').css("height", $('.colortab_custom').css("height"));
});
$('body').on('click', '.texteditor .colorpicker', function(e) {
    if ($('.texteditor .firstp').css("display") == "none") {

        $('.texteditor .firstp').show();
        $('.texteditor .secondp').hide();
    } else if ($('.texteditor .firstp').css("display") == "block") {
        $('.texteditor .firstp').hide();
        $('.texteditor .secondp').show();
    }
    $('.tab_custom').css("height", $('.colortab_custom').css("height"));
});

$('body').on('click', '.closebtn', function(e) {
    $('.secondp').hide();
    $('.firstp').show();
});
var i;
var acc = document.getElementsByClassName("accordion");
var accc = document.getElementsByClassName("accordion1");
for (i = 0; i < acc.length; i++) {
    acc[i].onmousedown = function() {
        $('.tab_custom').height();
        $('.secondp').find('.accordion').removeClass('active');
        $('.secondp').find('.panel').removeClass('show');
        this.classList.toggle("active");

        this.nextElementSibling.classList.toggle("show");
    }
}
for (i = 0; i < accc.length; i++) {
    accc[i].onmousedown = function() {
        $('.tab_custom').height();
        $('.secondp').find('.accordion1').removeClass('active');
        $('.secondp').find('.panel1').removeClass('show');
        this.classList.toggle("active");

        this.nextElementSibling.classList.toggle("show");
    }
}