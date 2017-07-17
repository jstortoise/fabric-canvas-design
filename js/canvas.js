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
var isNewPlacement = true;
var zoom_ratio = 1;

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
    var ID = this.Design_List.length;
    this.ID = 0;
    this.Name = ""; // In the future, What,   I have to in here?
    this.Design_List.push({
        ID: ID,
        Name: Name,
        previewImage: PreviewImage,
        placementID: PlacementID,
        shapes: []
    });
};

Product.prototype.updatePlacement = function(id, newPlacementID, Name, PreviewImage) {
    for (i in this.Design_List) {
        if (id == this.Design_List[i].placementID) {
            this.Design_List[i].Name = Name;
            this.Design_List[i].previewImage = PreviewImage;
            this.Design_List[i].placementID = newPlacementID;
            return;
        }
    }
};

Product.prototype.removePlacement = function(PlacementID) {
    for (i in this.Design_List) {
        if (PlacementID == this.Design_List[i].placementID) {
            this.Design_List.splice(i);
            return;
        }
    }
}

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
            if ((colstr.includes) && (!colstr.includes("img"))) {

                html += '<li><a data-toggle="tab" href="#home" class="btn btn-default colorpicker selectcolor" data-id="' + i +
                    '" style="background-color: ' +
                    ca.CanvasObject.Colors[i].HtmlColor +
                    '"></a></li>';
            } else {
                var imgstr = $('.cliparteditor .colorlayer').children().eq(i).css('background-image');
                html += "<li role='presentation'><a data-toggle='tab' href='#home' class='btn btn-default colorpicker selectcolor' data-id='" + i +
                    "' style='background-image : " + imgstr + ";background-color:" + ca.CanvasObject.Colors[i].HtmlColor + "'></a></li>";
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
            $('#clipart_width_range, #clipart_height_range').css('cursor', 'not-allowed');

        } else {
            item.setControlsVisibility({
                'bl': true,
                'br': true,
                'mb': true,
                'ml': true,
                'mr': true,
                'mt': true
            });
            $('#clipart_width_text, #clipart_width_range').prop('disabled', false);
            $('#clipart_height_text, #clipart_height_range').prop('disabled', false);
            $('#clipart_width_range, #clipart_height_range').css('cursor', 'default');
        }
        var i = $('.cliparteditor .colorlayer').find('a.active').attr('data-id');
        $('.cliparteditor .colorlayer').html(html);
        $('.cliparteditor .colorlayer').find('a.active').removeClass('active');
        $('.cliparteditor .colorlayer').find("[data-id='" + i + "']").addClass('active');
        $('.cliparteditor .colorlayer').find('li').first().children().addClass('active');
        $('.cliparteditor .firstp').show();
        //$('.cliparteditor .secondp').hide();
        $('.edittextbox').hide();
        $('#clipart_width_range').val(parseFloat(item.getWidth()));
        $('#clipart_height_range').val(parseFloat(item.getHeight()));
        $('#clipart_width_text').val(toInch(parseFloat(item.getWidth()) / 100));
        $('#clipart_height_text').val(toInch(parseFloat(item.getHeight()) / 100));
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
        $('#clipart_spacing_text, #clipart_spacing_range').val(parseFloat(item.spacing));
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
        // check item stroke color if no stroke.
        var strokeColor = "";
        strokeColor = (typeof item.strokeColor == 'undefined') ? "none" : item.strokeColor;
        if (strokeColor == "none")
            setDefaultStroke();
        else if (item.strokeColor.indexOf("img_pattern") != -1 || item.strokeColor.indexOf("img_glitter_pattern") != -1) {
            $('#strokecolor').css('background-color', "none");
            $('#strokecolor').css('background-image', $("#" + item.strokeColor).prev().css('background-image'));
        } else {
            $('#strokecolor').css('background-color', item.strokeColor);
            $('#strokecolor').css('background-image', "none");
        }
        $('.texteditor .firstp').show();
        //$('.texteditor .secondp').hide();
        $('.edittextbox').hide();

        ratio = item.getWidth() / item.getHeight();
    }
};

Product.prototype.refreshDesign = function(item) {
    var items = item;
    var designs = [];
    for (var i = 0; i < product.Design_List.length; i++) {
        if (product.Design_List[i].placementID == items.ID) {
            designs = product.Design_List[i].shapes;
            break;
        }
    }

    var k = designs.length;
    for (var j = 0; j < k; j++) {
        if (designs[j].objType == "image") {
            product.updateImageDesign(designs[j], -1, "");
        } else if (designs[j].objType == "text") {
            product.updateTextDesign(designs[j], $('#dlFonts_form').val(), designs[j].text, designs[j].fillColor, designs[j].strokeColor);
        }
    }
    $('.texteditor').hide();
    $('.cliparteditor').hide();
    $('.edittextbox').hide();
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
        ratios = obj.Height / obj.Width;
        zoom_ratio = obj.Width / 12;
    } else if (obj.Height > 8) {
        h = 800;
        w = 8 / obj.Height * obj.Width * 100;
        ratios = obj.Width / obj.Height;
        zoom_ratio = obj.Height / 8;
    }
    var gridlp = canvas.width / 2 - w / 2; // <= you must define this with final grid width
    var gridtp = canvas.height / 2 - h / 2; // <= you must define this with final grid height
    graywidth = w;
    grayheight = h;
    var groupArray = [];
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
        fill: '#3d85e6', //#eee',
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

    // set width and height of option box.
    $("#clipart_stretch_range, #clipart_stretch_text").attr("min", "0");
    $("#clipart_stretch_range").attr("max", w);
    $("#clipart_stretch_text").attr("max", obj.Width);
    $("#clipart_stretch_range").attr("step", "1");
    $("#clipart_stretch_text").attr("step", "0.1");

    $("#clipart_lnheight_range, #clipart_lnheight_text").attr("min", "0");
    $("#clipart_lnheight_range").attr("max", h);
    $("#clipart_lnheight_text").attr("max", obj.Height);
    $("#clipart_lnheight_range").attr("step", "1");
    $("#clipart_lnheight_text").attr("step", "0.1");

    $("#clipart_width_range, #clipart_width_text").attr("min", "0");
    $("#clipart_width_range").attr("max", w);
    $("#clipart_width_text").attr("max", obj.Width);
    $("#clipart_width_range").attr("step", "1");
    $("#clipart_width_text").attr("step", "0.1");

    $("#clipart_height_range, #clipart_height_text").attr("min", "0");
    $("#clipart_height_range").attr("max", h);
    $("#clipart_height_text").attr("max", obj.Height);
    $("#clipart_height_range").attr("step", "1");
    $("#clipart_height_text").attr("step", "0.1");


    return ratios;
};

Product.prototype.drawClipArt = function(clipartid, x, y, placementID, pitem) {
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
                    width: source.width * pitem.ratio,
                    height: source.height * pitem.ratio,
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
                item.scale(0.5);
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
                        ca.CanvasObject.Colors[i].HtmlColor + '"></a>';
                }
                $('.cliparteditor .colorlayer').html(html);
                $('#clipart_width_range').val(parseFloat(item.getWidth()));
                $('#clipart_height_range').val(parseFloat(item.getHeight()));
                $('#clipart_width_text').val(toInch(parseFloat(item.getWidth()) / 100));
                $('#clipart_height_text').val(toInch(parseFloat(item.getHeight()) / 100));
                $('#clipart_angle_text,  #clipart_angle_range').val(item.getAngle());
                product.setSelectObj(item);
            }
        }
    });
}

Product.prototype.updateImageDesign = function(item, is, colorstr) {
    if (item == null) {
        alert('Please select a Object.');
        return;
    }

    var ca = item.sevData;
    if (is != -1) {
        ca.CanvasObject.Colors[is].HtmlColor = colorstr;
    }
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
        objId: ca.ID,
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
    activeObj = changeitem;
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
    if (is == -1) {
        var html = '';
        // Set values in html elements.
        for (var i = 0; i < ca.CanvasObject.Colors.length; i++) {
            html += '<a class="btn btn-default colorpicker selectcolor" data-id="' + i +
                '" style="background-color: ' +
                ca.CanvasObject.Colors[i].HtmlColor +
                '"></a>';
        }
        $('.cliparteditor .colorlayer').html(html);
        $('#clipart_width_range').val(parseFloat(item.getWidth()));
        $('#clipart_height_range').val(parseFloat(item.getHeight()));
        $('#clipart_width_text').val(toInch(parseFloat(item.getWidth()) / 100));
        $('#clipart_height_text').val(toInch(parseFloat(item.getHeight()) / 100));
        $('#clipart_angle_text,  #clipart_angle_range').val(item.getAngle());
        $('#clipart_layer').find('li.active').removeClass('active');
        $('#clipart_layer').prepend('<li class="active" data-id="' + cid + '"><a data-href="#home"><canvas width="35" height="35" style="border-color:1px solid gray" id="' + cid + '"></canvas></a></li>');

        var source = getCanvasObjects([ca.CanvasObject], "image");
        var mycanvas = document.getElementById(cid);
        var myctx = mycanvas.getContext('2d');
        myctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, 35, 35);
    } else {
        var mycanvas = document.getElementById(cid);
        var myctx = mycanvas.getContext('2d');
        myctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, 35, 35);
    }
    product.setSelectObj(changeitem);
};

Product.prototype.drawCharacters = function(fontid, characters, x, y, fillcolorstr, strokecolorstr, placementID, pitem) {

    if (characters.length == 0)
        return;
    var id = product.getID();
    $('#clipart_layer').find('li.active').removeClass('active');
    $('#clipart_layer').prepend('<li class="active" data-id="text_' + id + '"><a data-href="#"><canvas width="35" height="35" style="border-color:1px solid gray" id="text_' + id + '"></canvas><button class="glyphicon glyphicon-remove del_layer"></button></a></li>');
    var mycanvas = document.getElementById("text_" + id);
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
    item.set('spacing', 0);
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

    $('#clipart_stretch_text').val(Math.floor(parseFloat(item.getWidth()) / 100 * 10) / 10);
    $('#clipart_lnheight_text').val(Math.floor(parseFloat(item.getHeight()) / 100 * 10) / 10);
    $('#clipart_stretch_range').val(parseFloat(item.getWidth()));
    $('#clipart_lnheight_range').val(parseFloat(item.getHeight()));

    $('#clipart_rotate_text, #clipart_rotate_range').val(item.getAngle());
    // object layer

    //$('#clipart_layer').find('#text_' + item.id).attr('src', item.toDataURL('png'));
    //var imagecanvas_ = new fabric.Canvas('imageCanvas');
    // var cid = item.objType + '_' + item.id; 
    // var mycanvas = document.getElementById(cid);
    // var myctx    = mycanvas.getContext('2d');
    // myctx.drawImage(item, 0, 0, item.width, source.height, 0, 0, 35, 35);

    product.setSelectObj(item);
};

Product.prototype.updateTextDesign = function(item, fontid, str, fillcolor, strokecolor) {
    if (item == null) {
        alert('Please select a Object.');
        return;
    }
    var that = $('#clipart_layer').find('#text_' + item.id);
    if ($('#clipart_layer').find('#text_' + item.id).attr('id') == undefined) {
        var id = item.id;
        $('#clipart_layer').find('li.active').removeClass('active');
        $('#clipart_layer').prepend('<li class="active" data-id="text_' + id + '"><a data-href="#"><canvas width="35" height="35" style="border-color:1px solid gray" id="text_' + id + '"></canvas></a></li>');
        that = $('#clipart_layer').find('#text_' + id);
    }
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
    changeitem.set('spacing', item.spacing);
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
    canvas.renderAll();
    // $('#clipart_layer').find('li.active').removeClass('active');
    // $('#clipart_layer').prepend('<li class="active" data-id="text_' + id + '"><a data-href="#"><img width="35" height="35" style="border-color:1px solid gray" id="text_' + id + '"></a></li>');
};

Product.prototype.removeObject = function(id, objtype, PlacementId) {
    var f_item = null;
    var design = [];
    var i;

    /*    
        for (i = 0; i < this.Design_List.length; i++) {
            if (this.Design_List[i].placementID = PlacementId) {
                break;
            }
        }

        for (j in this.Design_List[i].shapes) {
            if (this.Design_List[i].shapes[j].id == id) {
                f_item = this.Design_List[i].shapes[j];
                this.Design_List[i].shapes.splice(j, 1);
            }
        }

        if (f_item != null)
            canvas.remove(f_item);
    */
    canvas.remove(activeObj);
    return f_item;
};

$(document).ajaxStart(function() {
    $('body').css('cursor', 'wait');
}).ajaxComplete(function() {
    $('body').css('cursor', 'initial');
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

                // console.log(placementList);
                product.addPlacement("Full Front", "full_front.png", 1);
                activePlacement = product.getPlacement(1);
                var ratio = product.drawGrayGrid(activePlacement);
                activePlacement.ratio = ratio;

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
        async: false,
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
                $(".placement-modal .modal-body div").first().addClass('selectdesign');
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

function getGlitterThumbnail(mediacolorid, img_id) {
    var xml = "<request><sessionid>" + sessionid + "</sessionid><mediacolorid>" + mediacolorid + "</mediacolorid></request>";

    $.ajax({
        type: "POST",
        url: url + "/Site.svc/MediaColorPatternThumbnailGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.MediaColorPatternThumbnailGetResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {
                //console.log("MediaColorPatternThumbnailGet")
                //console.log(response);
                $(".texteditor #" + img_id).css("background-image", "url(data:image/png;base64," + r.Data + ")");
                $(".cliparteditor #" + img_id).css("background-image", "url(data:image/png;base64," + r.Data + ")");
            }
        }
    });
}

function getGlitterPattern(mediacolorid, img_id) {
    mediacolor_id = 3415;
    var xml = "<request><sessionid>" + sessionid + "</sessionid><mediacolorid>" + mediacolorid + "</mediacolorid></request>";

    $.ajax({
        type: "POST",
        url: url + "/Site.svc/MediaColorPatternFileGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            //console.log("MediaColorPatternFileGet" + img_id);
            //console.log(response);
            var r = response.MediaColorPatternFileGetResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            } else if (r.isSuccessful == true) {
                $(".texteditor #" + img_id).attr("src", "data:image/png;base64," + r.Data);
                $(".cliparteditor #" + img_id).attr("src", "data:image/png;base64," + r.Data);
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
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
                if (g.Fill.HtmlColor.indexOf('img_pattern') != -1 || g.Fill.HtmlColor.indexOf('img_glitter_pattern') != -1) {

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
                if ((g.Stroke.HtmlColor != undefined) && (g.Stroke.HtmlColor.indexOf('img_pattern') != -1 || g.Stroke.HtmlColor.indexOf('img_glitter_pattern') != -1)) {

                    var image = document.getElementById(g.Stroke.HtmlColor);
                    ctx.strokeStyle = ctx.createPattern(image, "repeat");
                } else if (g.Stroke.HtmlColor != undefined) {
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
    //var sourcel = 35 / characters.length;
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
    /*
    var radius = 4000;
    var arc = 10;
    var reverse = false;
    var align = 'center';
    var arclength = 0;

    if (align === 'center') {
        align = (arc / 2) * (source.size() - 1);
    } else if (align === 'right') {
        align = (arc) * (source.size() - 1);
    }

    for (var i = 0; i < source.size(); i++) {
        // Find coords of each letters (radians : angle*(Math.PI / 180)
        if (reverse) {
            curAngle = (-i * parseInt(arc, 10)) + align;
            angleRadians = curAngle * (Math.PI / 180);
            source.item(i).set('top', (Math.cos(angleRadians) * radius));
            source.item(i).set('left', (-Math.sin(angleRadians) * radius));
        } else {
            curAngle = (i * parseInt(arc, 10)) - align;
            angleRadians = curAngle * (Math.PI / 180);
            source.item(i).set('top', (-Math.cos(angleRadians) * radius));
            source.item(i).set('left', (Math.sin(angleRadians) * radius));
        }

        source.item(i).setAngle(curAngle);
    }
    */

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

    // $('.tab_custom').css("height", $('.colortab_custom'));
    var col_array = [];
    var col_name_array = [];
    var img_dir_array = [];
    var img_pat_array = [];
    var img_name_array = [];
    var glitter_mediacolorid_array = [];
    var glitter_name_array = [];
    var col_group_name = "";
    var pattern_group_name = "";
    var glitter_group_name = "";

    var color_palette = null;

    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";

    $.ajax({
        type: "POST",
        url: url + "/Site.svc/ColorPaletteGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify($.xml2json(xml)),
        dataType: "json",
        success: function(response) {
            var r = response.ColorPaletteGetResult;
            console.log(response);
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
                return;
            } else {

                var data = eval(r.Data);
                var p = data[0];
                color_palette = p;
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
                        // is glitter?
                        else if (i.HasThumbnail && i.HasPattern) {
                            glitter_group_name = g.Name;
                            glitter_mediacolorid_array[y] = i.MediaColorID;
                            glitter_name_array[y] = i.MediaColorName;
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
                var strz = "";
                for (var i = 0; i < col_array.length; i++) {
                    strx += "<a class='btn btn-default selectcolor' style='background:" + col_array[i] + ";' title='" + col_name_array[i] + "'></a>";
                }

                for (var i = 0; i < img_dir_array.length; i++) {
                    stry += "<a class='btn btn-default selectcolor' style='background-image:url(" + url + img_dir_array[i] + ");margin-top:3px; margin-left :3px' title='" + img_name_array[i] + "'></a>";
                    stry += "<img id='img_pattern_" + i + "' src='" + url + img_pat_array[i] + "' style='display:none'>";

                    // var img = new Image();
                    // img.crossOrigin="anonymous";
                }
                for (var i = 0; i < glitter_mediacolorid_array.length; i++) {
                    strz += "<a id='glitter_thumbnail_" + i + "' class='btn btn-default selectcolor' style='margin-top:3px; margin-left :3px' title='" + glitter_name_array[i] + "'></a>";
                    strz += "<img id='img_glitter_pattern_" + i + "' style='display:none'>";
                }

                // Follow this code block isn't necessary.
                // The color swatches are supposed to be dynamically drawn. It should come off of these loops //
                for (var x = 0; x < color_palette.ColorPaletteGroups.length; x++) {
                    var g = color_palette.ColorPaletteGroups[x];
                    // ID,Name,PriceIncrease
                    for (var y = 0; y < g.ColorPaletteItems.length; y++) {
                        var i = g.ColorPaletteItems[y];
                        //ID,MediaColorID,MediaColorName,HtmlColor,PatternImage,PreviewImage,MediaColorTypeID,MediaColorTypeName 
                    }
                }

                $('.cliparteditor #colorpad').html(strx);
                $('.cliparteditor #patternpad').html(stry);
                $('.cliparteditor #glitterpad').html(strz);
                $('.cliparteditor #colorx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + col_group_name);
                $('.cliparteditor #patternx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + pattern_group_name);
                $('.cliparteditor #glitterx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + glitter_group_name);

                $('.texteditor #colorpad').html(strx);
                $('.texteditor #patternpad').html(stry);
                $('.texteditor #glitterpad').html(strz);
                $('.texteditor #colorx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + col_group_name);
                $('.texteditor #patternx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + pattern_group_name);
                $('.texteditor #glitterx').html("<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>  " + glitter_group_name);

                //get thumbnails and pattern of Glitter.
                for (var i = 0; i < glitter_mediacolorid_array.length; i++) {
                    getGlitterThumbnail(glitter_mediacolorid_array[i], "glitter_thumbnail_" + i);
                    if (i == 2) continue; // Glitter : RED, skipped because of JSON deserialize error occur in server.
                    getGlitterPattern(glitter_mediacolorid_array[i], "img_glitter_pattern_" + i);
                }
            }
        }
    });
}

// Make to active state that selected placement.
function activeSelectedPlacement(placementID) {
    var pobj = product.getPlacement(placementID);
    activePlacement = pobj;

    product.removeGrayGrid(canvas.getObjects());
    var ratio = product.drawGrayGrid(activePlacement);
    activePlacement.ratio = ratio;
    console.log(activePlacement)
    product.refreshDesign(activePlacement);
}
// Select a color layer.

$('body').on('click', '.cliparteditor .colorlayer li', function(event) {
    $('.cliparteditor .colorlayer').find('a.active').removeClass('active');
    $(this).children('a').addClass('active');
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
    if (typeof activeObj.text == undefined) {
        console.log(activeobj);
        return;
    }
    if ($('#fillcolor').css('background-image') == "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').css('background-color'), $('#strokecolor').css('background-color'));
        } else {

            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').css('background-color'), $(this).next().attr('id'));
        }

    } else if ($('#fillcolor').css('background-image') != "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $(this).next().attr('id'), $('#strokecolor').css('background-color'));
        }

    }

});
// Select text pattern pad.
$('body').on('click', '.texteditor #patternpad a', function(event) {
    $('.texteditor .colorlayer').find('a.active').css('background-color', '');
    $('.texteditor .colorlayer').find('a.active').css('background-image', $(this).css('background-image'));
    $('.texteditor .colorlayer').find('a.active').attr('data-id', $(this).next().attr('id'));
    isSelectedColor = true;
    activeObj = canvas.getActiveObject();
    if ($('#fillcolor').css('background-image') == "none") {
        if ($('#strokecolor').css('background-image') != "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').css('background-color'), $('#strokecolor').attr('data-id'));
        }

    } else if ($('#fillcolor').css('background-image') != "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $(this).next().attr('id'), $('#strokecolor').css('background-color'));
        } else {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').attr('data-id'), $('#strokecolor').attr('data-id'));

        }

    }
});

// Select text glitter pad.
$('body').on('click', '.texteditor #glitterpad a', function(event) {
    $('.texteditor .colorlayer').find('a.active').css('background-color', '');
    $('.texteditor .colorlayer').find('a.active').css('background-image', $(this).css('background-image'));
    $('.texteditor .colorlayer').find('a.active').attr('data-id', $(this).next().attr('id'));
    isSelectedColor = true;
    activeObj = canvas.getActiveObject();
    if ($('#fillcolor').css('background-image') == "none") {
        if ($('#strokecolor').css('background-image') != "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').css('background-color'), $('#strokecolor').attr('data-id'));
        }

    } else if ($('#fillcolor').css('background-image') != "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $(this).next().attr('id'), $('#strokecolor').css('background-color'));
        } else {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').attr('data-id'), $('#strokecolor').attr('data-id'));
        }
    }
});

// -------------------------------------------------------------------------------------------------
// Select a clipart color pad.
// -------------------------------------------------------------------------------------------------
$('body').on('click', '.cliparteditor #colorpad a', function(event) {
    $('.cliparteditor .colorlayer').find('a.active').css('background-color', $(this).css('background-color'));
    $('.cliparteditor .colorlayer').find('a.active').css('background-image', '');
    isSelectedColor = true;
    activeObj = canvas.getActiveObject();
    // alert($('.cliparteditor .colorlayer').find('a.active').attr('data-id'))
    product.updateImageDesign(activeObj, $('.cliparteditor .colorlayer').find('a.active').attr('data-id'), $(this).css('background-color'));

});

// -------------------------------------------------------------------------------------------------
// Select a clipart pattern pad.
// -------------------------------------------------------------------------------------------------
$('body').on('click', '.cliparteditor #patternpad a', function(event) {
    $('.cliparteditor .colorlayer').find('a.active').css('background-color', '');
    $('.cliparteditor .colorlayer').find('a.active').css('background-image', $(this).css('background-image'));
    isSelectedColor = true;
    activeObj = canvas.getActiveObject();
    product.updateImageDesign(activeObj, $('.cliparteditor .colorlayer').find('a.active').attr('data-id'), $(this).next().attr('id'));

});

// -------------------------------------------------------------------------------------------------
// Select a clipart glitter pad.
// -------------------------------------------------------------------------------------------------
$('body').on('click', '.cliparteditor #glitterpad a', function(event) {
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
    checkText();
});

// ---------------------------------------------------------------------------
// clipart width
var isChagingWidth = false;
$('#clipart_width_range').mousedown(function(event) {
    isChagingWidth = true;
}).mousemove(function() {
    if (!isChagingWidth) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;

    var val = parseFloat($(this).val());
    if ($('.cliparteditor #lock').attr('data-lock') == 'true') {
        selectedObj.scaleHeight(val / ratio);
        $('#clipart_height_range').val(val / ratio);
        $('#clipart_height_text').val(toInch(val / ratio / 100));
    }

    selectedObj.scaleWidth(val);
    $('#clipart_width_range').val(val);
    $('#clipart_width_text').val(toInch(val / 100));
    canvas.renderAll();

}).mouseup(function(event) {
    isChagingWidth = false;
    checkText();
});

// ---------------------------------------------------------------------------
// clipart height
var isChagingHeight = false;
$('#clipart_height_range').mousedown(function(event) {
    isChagingHeight = true;
}).mousemove(function(event) {
    if (!isChagingHeight) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;

    var val = parseFloat($(this).val());
    if ($('.cliparteditor #lock').attr('data-lock') == 'true') {
        selectedObj.scaleWidth(val * ratio);
        $('#clipart_width_range').val(val * ratio);
        $('#clipart_width_text').val(toInch(val * ratio / 100));
    }
    selectedObj.scaleHeight(val);
    $('#clipart_height_range').val(val);
    $('#clipart_height_text').val(toInch(val / 100));
    canvas.renderAll();

}).mouseup(function(event) {
    isChagingHeight = false;
    checkText();
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
    checkText();
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
    checkText();
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
    selectedObj.set('spacing', val);
    var left = selectedObj.item(0).left;
    for (var i = 0; i < selectedObj.size(); i++) {
        selectedObj.item(i).left = left;

        left += selectedObj.item(i).getWidth() + val * 1 / selectedObj.getScaleX();
    }
    _render(selectedObj);

    $('#clipart_spacing_text, #clipart_spacing_range').val(val);


}).mouseup(function(event) {
    isChagingAngle = false;
    checkText();
});

// ---------------------------------------------------------------------------
// Text stretch
$('#clipart_stretch_range').mousedown(function(event) {
    isChagingWidth = true;
}).mousemove(function() {
    if (!isChagingWidth) return;

    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;

    var val = parseFloat($(this).val());
    if (val > canvas.width) {
        val = canvas.width;
    }

    selectedObj.scaleWidth(val);
    $('#clipart_stretch_range').val(val);
    $('#clipart_stretch_text').val(toInch(val / 100));
    if ($('.texteditor #lock').attr('data-lock') == 'true') {
        $('#clipart_lnheight_range').val(val / ratio);
        $('#clipart_lnheight_text').val(toInch(val / ratio / 100));
        selectedObj.scaleHeight(val / ratio);
    }
    _render(selectedObj);

}).mouseup(function(event) {
    isChagingWidth = false;
    checkText();
});

// ---------------------------------------------------------------------------
// Text lnheight
$('#clipart_lnheight_range').mousedown(function(event) {
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
    $('#clipart_lnheight_range').val(val);
    $('#clipart_lnheight_text').val(toInch(val / 100));
    if ($('.texteditor #lock').attr('data-lock') == 'true') {
        selectedObj.scaleWidth(val * ratio);
        $('#clipart_stretch_range').val(val * ratio);
        $('#clipart_lnheight_text').val(toInch(val * ratio / 100));
    }
    selectedObj.scaleHeight(val);
    _render(selectedObj);

}).mouseup(function(event) {
    isChagingHeight = false;
    checkText();
});
$('.layer_up').click(function(event) {
    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;
    if (selectedObj) {

        canvas.bringForward(selectedObj);

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
        return;
    }
    if (selectedObj) {
        canvas.sendBackwards(selectedObj);
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
    //canvas.renderAll();
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

$('#addplacementbtn').click(function() {
    if (isNewPlacement) {
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
    }
});

$('.placement-modal .modal-body').on('click', 'div', function() {
    $('.placement-modal .modal-body').find('.active').removeClass('active');
    $(this).addClass('active');
});

$('#select_placement').click(function() {

    var prevobj = activePlacement;
    var pobj = product.getPlacement($('.placement-modal .modal-body').find('.active').children('img').attr('data-id'));
    $('.placement-panel').find('.active').removeClass('active');
    var previewImage = $('.placement-modal .modal-body').find('.active').children('img').attr('src');
    var dataName = $('.placement-modal .modal-body').find('.active').children('img').attr('data-name');

    var placementHtml = '<div class="col-md-2 active">' +
        '<img class="img-responsive shirtimg" id="placement_' + pobj.ID + '" src="' + previewImage + '" >' +
        '<h5 id="placement_name_' + pobj.ID + '">' + dataName + '</h5>' +
        '<span class="placement-close"></span>' +
        '<span class="placement-update"></span>' +
        '</div>';

    if (product.Design_List.length > 0) {
        if ($('.placement-modal .modal-body').find('.active').children('img').css('opacity') == 0.3) {
            alert("Please select other placement.");
            return;
        } else {
            if ($('.placement-modal .modal-body').find('.active').hasClass('selectdesign')) {
                // activePlacement = pobj;
                // $('[id="placement_' + pobj.ID + '"]').parent().addClass('active');
                alert("Please select other placement.");
                return;
            } else {
                if (!isNewPlacement) {
                    product.updatePlacement(prevobj.ID, pobj.ID, dataName, previewImage);
                    $('.placement-modal .modal-body').find('[data-id="' + prevobj.ID + '"]').parent('div').removeClass('selectdesign');
                    // alert($('.placement-modal .modal-body').find('[data-id="' + prevobj.placementID + '"]').html())
                    $('[id="placement_' + prevobj.ID + '"]').attr({ 'src': previewImage, 'id': 'placement_' + pobj.ID });
                    $('[id="placement_name_' + prevobj.ID + '"]').html(dataName);
                    activePlacement = pobj;
                    isNewPlacement = true;
                } else {
                    product.addPlacement(pobj.Name, pobj.PreviewImage, pobj.ID);
                    activePlacement = pobj;

                    $('.placement-panel').append(placementHtml);
                }
            }
        }
    } else {
        product.addPlacement(pobj.Name, pobj.PreviewImage, pobj.ID);
        activePlacement = pobj;

        $('.placement-panel').append(placementHtml);
    }

    // $('#placement').attr('src', $('.placement-modal .modal-body').find('.active').children('img').attr('src'));
    // $('#placement_name').html($('.placement-modal .modal-body').find('.active').children('img').attr('data-name'));

    if (prevobj == null) {
        product.removeGrayGrid(canvas.getObjects());
        var ratio = product.drawGrayGrid(activePlacement);
        activePlacement.ratio = ratio;
        product.refreshDesign(activePlacement);
    } else if (prevobj.ID != activePlacement.ID) {
        product.removeGrayGrid(canvas.getObjects());
        var ratio = product.drawGrayGrid(activePlacement);
        activePlacement.ratio = ratio;
        product.refreshDesign(activePlacement);
    }

    $('.placement-modal .modal-body').find('.active').addClass('selectdesign');
    $('.placement-modal .close').click();
});

// -------------------------------------------------------------------------------------------------
// When click a placement, it make to active state.
// -------------------------------------------------------------------------------------------------
$('.placement-panel').on('click', 'img', function(event) {
    $('.placement-panel').find('div.active').removeClass('active');
    $(this).parent('div').addClass('active');

    activeSelectedPlacement($(this).attr('id').split('_')[1]);
});

// -------------------------------------------------------------------------------------------------
// Show/hide a placement-close button.
// -------------------------------------------------------------------------------------------------
$('.placement-panel').on('mouseover', 'div.active', function(event) {
    $(this).children('span.placement-close, span.placement-update').show();
}).on('mouseleave', 'div', function(event) {
    $(this).children('span.placement-close, span.placement-update').hide();
});

// -------------------------------------------------------------------------------------------------
// When click a placement-close button, selected placement will be remove.
// -------------------------------------------------------------------------------------------------
$('.placement-panel').on('click', 'span.placement-close', function() {

    $(this).parent('.col-md-2').remove();
    var placementID = $(this).parent('div').find('img').attr('id').split('_')[1];
    product.removePlacement(placementID);
    $('.placement-panel div').first().addClass('active');
    $(".placement-modal .modal-body").find('img[data-id="' + placementID + '"]').parent('div').removeClass('selectdesign');

    activeSelectedPlacement($('.placement-panel div').first().find('img').attr('id').split('_')[1]);
});

// -------------------------------------------------------------------------------------------------
// When click a 'placement-update' button, placement selection modal will be show.
// Here you should select other placement.  
// -------------------------------------------------------------------------------------------------
$('.placement-panel').on('click', 'span.placement-update', function() {
    isNewPlacement = false;
    $('#addplacementbtn').click();
});

$("#tbx").on('input', function(e) {
    activeObj = canvas.getActiveObject();
    isSelectedColor = true;
    if ($('#fillcolor').css('background-image') == "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').css('background-color'), $('#strokecolor').css('background-color'));
        } else {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').css('background-color'), $(this).next().attr('id'));
        }
    } else if ($('#fillcolor').css('background-image') != "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $(this).next().attr('id'), $('#strokecolor').css('background-color'));
        } else {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').attr('data-id'), $('#strokecolor').attr('data-id'));
        }
    }
});

$('#dlFonts_form').change(function() {
    activeObj = canvas.getActiveObject();
    isSelectedColor = true;
    if ($('#fillcolor').css('background-image') == "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').css('background-color'), $('#strokecolor').css('background-color'));
        } else {

            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').css('background-color'), $(this).next().attr('id'));
        }
    } else if ($('#fillcolor').css('background-image') != "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $(this).next().attr('id'), $('#strokecolor').css('background-color'));
        } else {
            product.updateTextDesign(activeObj, $('#dlFonts_form').val(), activeObj.text, $('#fillcolor').attr('data-id'), $('#strokecolor').attr('data-id'));
        }
    }
});

function updateControls() {
    var selectedObj = canvas.getActiveObject();
    if (selectedObj == null)
        return;

    if (selectedObj.objType == "image") {
        $('#clipart_width_range').val(selectedObj.getWidth());
        $('#clipart_width_text').val(toInch(selectedObj.getWidth() / 100));
        $('#clipart_height_range').val(selectedObj.getHeight());
        $('#clipart_height_text').val(toInch(selectedObj.getHeight() / 100));

        $('#clipart_angle_text, #clipart_angle_range').val(selectedObj.getAngle());
    } else if (selectedObj.objType == "text") {
        $('#clipart_stretch_range').val(selectedObj.getWidth());
        $('#clipart_stretch_text').val(toInch(selectedObj.getWidth() / 100));
        $('#clipart_lnheight_range').val(selectedObj.getHeight());
        $('#clipart_lnheight_text').val(toInch(selectedObj.getHeight() / 100));
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
    var originleft = 0;
    var origintop = 0;
    var originwidth = 0;
    var originheight = 0;
    var getobj = canvas.getObjects();
    for (var i = 0; i < getobj.length; i++) {
        if (getobj[i].objType != undefined) {
            if (getobj[i].objType == "backplacementID") {
                originleft = getobj.left;
                origintop = getobj.top;
                originwidth = getobj.width;
                originheight = getobj.height;
                break;

            }
        }

    }
    var selectedObj = canvas.getActiveObject();
    lpos = selectedObj.getBoundingRect().left;
    tpos = selectedObj.getBoundingRect().top;
    gwidth = selectedObj.getBoundingRect().width;
    gheight = selectedObj.getBoundingRect().height;
    if ((originleft > lpos && origintop > tpos)) {
        console.log(selectedObj);
    }
    // if((graytlx>lpos && graytly<tpos) || (graytlx+graywidth>lpos+gwidth && graytly+grayheight<tpos+gheight) || )
    //if(selectedObj)
}


function checkText() {
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

function setDefaultStroke() {
    //console.log($('#strokecolor').css('background-image'));
    $('#strokecolor').attr("style", "background-image : url(image/trans-color.png)");
    $('#strokecolor').attr("data-id", "none");
}

function setDefaultSpacing() {
    $('#clipart_spacing_text, #clipart_spacing_range').val(0);

}

/* truncate decimal part of d until e position */
function fix(d, e = 1) {
    var r;
    r = Math.round(d * Math.pow(10, e)) / Math.pow(10, e);
    return r;
}

function toInch(d) {
    return fix(d * zoom_ratio);
}
// alert(fix(3.141592, 2));
// alert(fix(3.141592));

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

    // set storke to no stroke
    setDefaultStroke();
    setDefaultSpacing();

    $('.texteditor').show();
    if ($('#fillcolor').css('background-image') == "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.drawCharacters($('#dlFonts_form').val(), $('#tbx').val(), $('#myCanvas').width() / 2, $('#myCanvas').height() / 2, $("#fillcolor").css("background-color"), $("#strokecolor").css("background-color"), activePlacement.ID, activePlacement);

        } else {
            product.drawCharacters($('#dlFonts_form').val(), $('#tbx').val(), $('#myCanvas').width() / 2, $('#myCanvas').height() / 2, $("#fillcolor").css("background-color"), $("#strokecolor").attr("data-id"), activePlacement.ID, activePlacement);
        }

    } else if ($('#fillcolor').css('background-image') != "none") {
        if ($('#strokecolor').css('background-image') == "none") {
            product.drawCharacters($('#dlFonts_form').val(), $('#tbx').val(), $('#myCanvas').width() / 2, $('#myCanvas').height() / 2, $("#fillcolor").attr("data-id"), $("#strokecolor").css("background-color"), activePlacement.ID, activePlacement);

        } else {
            product.drawCharacters($('#dlFonts_form').val(), $('#tbx').val(), $('#myCanvas').width() / 2, $('#myCanvas').height() / 2, $("#fillcolor").attr('data-id'), $("#strokecolor").attr('data-id'), activePlacement.ID, activePlacement);

        }

    }

    $('cliparteditor').hide();
});
jQuery(document).ready(function() {
    product = new Product();
    login();
    //jQuery('.secondp').hide();
    jQuery(".tabcontent").children().hide();
    jQuery(".tabcontent").children().first().show();
    jQuery('.colortab_custom').hide();
    acc[0].classList.toggle("active");
    acc[0].nextElementSibling.classList.toggle("show");
    accc[0].classList.toggle("active");
    accc[0].nextElementSibling.classList.toggle("show");

    $(".secondp").hide();
});

$('body').on('click', '#listClipArt li', function(event) {
    $('.edittextbox').hide();
    product.drawClipArt($(this).attr('id'), $('#myCanvas').width() / 2, $('#myCanvas').height() / 2, activePlacement.ID, activePlacement);
});
$('body').on('click', '.cliparteditor .colorpicker', function(e) {
    // if ($('.cliparteditor .firstp').css("display") == "none") {

    //     $('.cliparteditor .firstp').show();
    //     $('.cliparteditor .secondp').hide();
    // } else if ($('.cliparteditor .firstp').css("display") == "block") {
    //     $('.cliparteditor .firstp').hide();
    //     $('.cliparteditor .secondp').show();
    // }
    // $('.tab_custom').css("height", $('.colortab_custom').css("height"));
});
$('body').on('click', '.texteditor .colorpicker', function(e) {
    // if ($('.texteditor .firstp').css("display") == "none") {

    //     $('.texteditor .firstp').show();
    //     $('.texteditor .secondp').hide();
    // } else if ($('.texteditor .firstp').css("display") == "block") {
    //     $('.texteditor .firstp').hide();
    //     $('.texteditor .secondp').show();
    // }
    // $('.tab_custom').css("height", $('.colortab_custom').css("height"));
});

//added 2017.1.24
/* Popup Menu of Color Palette, Begin */
// show popup 
//var old_colorpicker = null;
$('body').on('click', '.texteditor .colorpicker', function(e) {
    var $this = $(e.target);
    var offset = $this.offset();
    var width = $this.outerWidth();
    var height = $this.outerHeight();
    var posX = offset.left;
    var posY = offset.top;

    var $parent = $(".colortab_custom");
    var posX1 = $parent.offset().left;
    var posY1 = $parent.offset().top;

    console.log("width : " + width + " height : " + height);
    console.log("POS XY : " + posX + ' ' + posY);
    $('.texteditor .secondp').css({ left: (posX - posX1) + 'px', top: (posY - posY1 + height) + 'px' });
    //if ($this.id != old_colorpicker.id)
    //$('.texteditor .secondp').hide();
    $('.texteditor .secondp').slideToggle();
    //old_colorpicker = $this;
});

$('body').on('click', '.cliparteditor .colorpicker', function(e) {
    var $this = $(e.target);
    var offset = $this.offset();
    var width = $this.outerWidth();
    var height = $this.outerHeight();
    var posX = offset.left;
    var posY = offset.top;

    var $parent = $(".colortab_custom");
    var posX1 = $parent.offset().left;
    var posY1 = $parent.offset().top;

    console.log("width : " + width + " height : " + height);
    console.log("POS XY : " + posX + ' ' + posY);
    $('.cliparteditor .secondp').css({ left: (posX - posX1) + 'px', top: (posY - posY1 + height) + 'px' });
    $('.cliparteditor .secondp').hide();
    $('.cliparteditor .secondp').slideToggle();
});


// hide popup
$(document).on("click", function(event) {
    if (!$(event.target).is($('.colorpicker'))) {
        clickedtarget = $(event.target).closest('.secondp');
        $('.secondp').not(clickedtarget).hide();
    }
});
/* Popup Menu of Color Palette, End */

$('body').on('click', '#clipart_layer .del_layer', function(e) {
    console.log("del clicked!");

    if (!isSelectedColor) {
        //$('.colortab_custom').hide();
        var $this = $(e.target);
        var parent = $this.parent().parent();
        var idstr = parent.attr("data-id");
        var id = idstr.match(/\d+/)[0];
        var objType = "";
        if (idstr.indexOf("image") != -1) {
            objType = "image";
        } else if (idstr.indexOf("text") != -1) {
            objType = "text";
        }

        $('#clipart_layer').find('li.active').removeClass('active');
        $('#clipart_layer').find("[data-id='" + idstr + "']").addClass('active');
        for (var i = 0; i < canvas.getObjects().length; i++) {
            if (canvas.item(i).id == id && canvas.item(i).objType == objType) {
                canvas.setActiveObject(canvas.item(i));
                product.setSelectObj(canvas.item(i));
                break;
            }
        }

        var item;
        //var prevLayer = (parent.prev() != null) ? parent.prev() : parent.nextElementSibling();
        item = product.removeObject(id, objType, activePlacement.ID);
        /*
                        if (prevLayer != null) {
                            idstr = prevLayer.attr("data-id");
                            id = idstr.split('_')[1];
                            objType = idstr.split('_')[0];
                            $('#clipart_layer').find('li.active').removeClass('active');
                            $('#clipart_layer').find("[data-id='" + idstr + "']").addClass('active');
                            for (var i = 0; i < canvas.getObjects().length; i++) {
                                if (canvas.item(i).id == id && canvas.item(i).objType == objType) {
                                    canvas.setActiveObject(canvas.item(i));
                                    product.setSelectObj(canvas.item(i));
                                    break;
                                }
                            }
                        }
                */
        removeobj = 1;
    }

    isSelectedColor = false;

});

var i;
var acc = document.getElementsByClassName("accordion");
var accc = document.getElementsByClassName("accordion1");
for (i = 0; i < acc.length; i++) {
    acc[i].onmousedown = function() {

        $('.secondp').find('.accordion').removeClass('active');
        $('.secondp').find('.panel').removeClass('show');
        this.classList.toggle("active");

        this.nextElementSibling.classList.toggle("show");
    }
}
for (i = 0; i < accc.length; i++) {
    accc[i].onmousedown = function() {
        $('.secondp').find('.accordion1').removeClass('active');
        $('.secondp').find('.panel1').removeClass('show');
        this.classList.toggle("active");

        this.nextElementSibling.classList.toggle("show");
    }
}