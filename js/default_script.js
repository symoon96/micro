/* 다중 파일 업로드(1) */
const FILE_UPLOAD_MAX = 5;   
const UPLOAD_EMPTY_TEXT = '파일선택'
const UPLOAD_CLASS_NAME = Object.freeze({
    TXT_FILE_NUM : 'txt-file-num',
    FILE_TAG : 'upload-hidden',
    FILE_LABEL : 'upload-name',
    BTN_DELETE : 'btn-del-file',
});
const uploadElements = {
    fileLabel : null,
    btnDel : null,
    txtNum : null,
    init : function () {
        this.fileLabel = $('.'+UPLOAD_CLASS_NAME.FILE_LABEL);
        this.btnDel = $('.'+UPLOAD_CLASS_NAME.BTN_DELETE);
        this.txtNum = $('.'+UPLOAD_CLASS_NAME.TXT_FILE_NUM);
    }
}
/* // 다중 파일 업로드(1) */

$(document).ready(function(){
    // 대상외 클릭시
    if( !headSearch.is(e.target) && headSearch.has(e.target).length === 0
        && !mobileGnb.is(e.target) && mobileGnb.has(e.target).length === 0
        && !popup.is(e.target) && popup.has(e.target).length === 0
        && $('.popup.on').length === 0 // PSJ 20210608 박세진 추가
        ){
        dimRemove();
    }

    // header 영역 스크롤시 스타일 제어
    var sTop = $(document).scrollTop();
    if(sTop >= 1){
        $(".header").addClass("on");
    }
    $(window).scroll(function(){
        var sTop = $(document).scrollTop();

        if(sTop >= 1){
            $(".header").addClass("on");
        } else{
            $(".header").removeClass("on");
        }
    });

    // 스크롤 이동별 컨트롤러 스타일 적용
    var scrollController = $('.scroll-top-controller ul');
    var scrollControllerPosition = scrollController.offset().top;
    var headerHeight = $('.header').outerHeight();

    $(window).scroll(function(){
        var documentSrlTop = $(document).scrollTop();

        if(documentSrlTop > scrollControllerPosition - $('.scroll-top-controller').height()){
            scrollController.css({
                'position' : 'fixed',
                'top' : headerHeight,
                'transform': 'translateY(0)',
                'z-index': '11',
                'width' : '100%',
                'left' : 0,
                'border-top-left-radius' : '0',
                'border-bottom-right-radius' : '0',
                'border-top' : '1px solid #dedede'
            })
        } else if(documentSrlTop < scrollControllerPosition - $('.scroll-top-controller').height()){
            scrollController.css({
                'position' : '',
                'top' : '',
                'transform': '',
                'z-index': '',
                'width' : '',
                'left' : 0,
                'border-top-left-radius' : '',
                'border-bottom-right-radius' : '',
                'border-top' : ''
            })
        }

        /* 2021.07.13 수정 */
        $.each(subContId, function(index, obj){
            var objPositionTop = $(obj).offset().top;
            var objHeight = $(obj).outerHeight();
            var objPositionBottom = objPositionTop + objHeight;

            if(documentSrlTop + (headerHeight + $('.scroll-top-controller').height() + 1) > objPositionTop && documentSrlTop <= objPositionBottom){
                var areaName = $(this).attr('id');
                saveAreaName = '#ctrl' + (areaName[0].toUpperCase()) + areaName.substring(1);
                $(saveAreaName).addClass('on');
                $(saveAreaName).siblings('li').removeClass('on')
            }
        });
        /* // 2021.07.13 수정 */
    });

    // 윈도우 높이값 체크
    if(isHeightChange() == true){
        return;
    }

    //preview image 
    var imgTarget = $('.preview-image .upload-hidden');

    imgTarget.on('change', function(){
        var parent = $(this).parent().children('.upload-display').children('.upload-thumb-wrap');

        if(window.FileReader){
            //image 파일만
            if (!$(this)[0].files[0].type.match(/image\//)) return;
            
            var reader = new FileReader();
            reader.onload = function(e){
                var src = e.target.result;
                parent.append('<img src="'+src+'" class="upload-thumb">');
                parent.css("background", "#ffffff");
            }
            reader.readAsDataURL($(this)[0].files[0]);
        }

        else {
            $(this)[0].select();
            $(this)[0].blur();
            var imgSrc = document.selection.createRange().text;
            parent.append('<img class="upload-thumb">');
            parent.css("background", "#ffffff");

            var img = $(this).siblings('.upload-display').find('img');
            img[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\""+imgSrc+"\")";        
        }
    });

    // 별점
    $("[class^='star-grade'] span").click(function () {
        $(this).parent().children('span').removeClass('on');
        $(this).addClass('on').prevAll('span').addClass('on');
        return false;
    });

    /* 페이징(1) */
    $('.references_list > ul > li').hide();

    const LOAD_PER_PAGE = 3;
    var currentShowCnt = LOAD_PER_PAGE;

    $('.references_list > ul > li').slice(0, currentShowCnt).show();

    $('.references_list .btn_more').click(function(){
        addShowLst();

        var el = $('.references_list > ul > li');
        var cate = getCategory();

        el = cate == "all" ? el : el.find('p.category.' + cate).closest('li');

        if(currentShowCnt - el.length >= 0){
            $('.references_list .btn_more').hide();
        } 
    });

    $('.carousel_sort').find('a').click(function(e){
        $(this).parents().find('a').removeClass('active');
        $(this).addClass('active');
        $('.references_list .btn_more').show();
        $('.references_list > ul > li').hide();

        currentShowCnt = 0;
        clickCnt = 0;

        addShowLst()
    });

    function addShowLst(){
        currentShowCnt += LOAD_PER_PAGE;
        var el = $('.references_list > ul > li');
        var cate = getCategory();

        el = cate == "all" ? el.slice(0, currentShowCnt) : el.find('p.category.' + cate).closest('li').slice(0, currentShowCnt);

        el.show();
    }

    $('.references_list > ul > li.has_mobile').on('mouseenter', function(){
        $(this).siblings('li').removeClass('on');
        $(this).addClass('on');
    });
    $('.references_list > ul > li.has_mobile').on('mouseleave', function(){
        $('.references_list > ul > li.has_mobile').removeClass('on');
    })
    if($(window).width() <= 1200)
		{
            $('.references_list > ul > li.has_mobile').on('click', function(){
                $(this).siblings('li').removeClass('on');
                $(this).toggleClass('on');
            });
        }
    /* // 페이징(1) */
})

// dim 생성
function dimMaker() {
    if($('body').find('.dim').length > 0){
        return;
    }
    $('body').append('<div class="dim"></div>');
    bodyHidden();
}

// dim 제거
function dimRemove() {
    $('.dim').remove();
    bodyAuto();
}

// body scroll hidden
function bodyHidden() {
    $('body').css('overflow', 'hidden');
}

// body scroll auto
function bodyAuto() {
    $('body').css('overflow', '')
}

// 팝업열기
function popOpen(id){
    $("#" + id).addClass('on');
}

// 팝업닫기
function popClose(id) {
    $("#" + id).removeClass('on');
    dimRemove();
}

// dim 옵션 팝업 열기
function popOpenAndDim(id, isDim){
    popOpen(id);
    
    if(isDim == true){
        dimMaker();
    }
}

// 변수에 객체 넣기
var selectedData1;
var selectedData2;

function selectMyNFT() {
    $('.nft-list .nft-item').each(function(){
        $(this).click(function(){
            var thisName = $(this).find('.name').html();
            var thisThumb = $(this).find('.thumbnail').html();
            var thisInfo = $(this).find('.info').html();
            
            if($(this).closest('.volume').hasClass('volume01')){
                selectedData1 = {
                    name: thisName,
                    thumbnail: thisThumb,
                    info: thisInfo
                }
            } else {
                selectedData2 = {
                    name: thisName,
                    thumbnail: thisThumb,
                    info: thisInfo
                }
            }

            var thisSlectSlot = $(this).closest('.volume').find('.select-slot');

            thisSlectSlot.find('.name').html(thisName);
            thisSlectSlot.find('.thumbnail').html(thisThumb).append('<button class="btn">EMPTY</button>');
            thisSlectSlot.addClass('has-empty');
        })
    })
}

// 토스트 팝업
function popTost(msg){
    $('body').append('<div class="tost">' + msg + '</div>');
    $('.tost').fadeIn(400).delay(4000).fadeOut(400,function(){
        $('.tost').remove();
    });
}

// 파일 드롭 다운
function fileDropDown() {
    var dropZone = $("#dropZone");
    //Drag기능 
    dropZone.on('dragenter', function(e) {
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color', '#E3F2FC');
    });
    dropZone.on('dragleave', function(e) {
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color', '#FFFFFF');
    });
    dropZone.on('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color', '#E3F2FC');
    });
    dropZone.on('drop', function(e) {
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color', '#FFFFFF');

        var files = e.originalEvent.dataTransfer.files;
        if (files != null) {
            if (files.length < 1) {
                return;
            } else {
                selectFile(files)
            }
        } else {
            alert("ERROR");
        }
    });
}

// 파일 선택시
function selectFile(fileObject) {
    var files = null;

    if (fileObject != null) {
        // 파일 Drag 이용하여 등록시
        files = fileObject;
    }

    // 다중파일 등록
    if (files != null) {        
        for (var i = 0; i < files.length; i++) {
            // 파일 이름
            var fileName = files[i].name;
            var fileNameArr = fileName.split("\.");
            // 확장자
            var ext = fileNameArr[fileNameArr.length - 1];

            if ($.inArray(ext, [ 'hwp', 'hwpx', 'doc', 'docx', 'pdf', 'odt', 'txt', 'html' ]) <= 0) {
                alert("등록이 불가능한 파일 입니다.");
            } else {
                // 업로드 파일 목록 생성
                addFileList(fileIndex, fileName);
            }
        }
    } else {
        alert("ERROR");
    }
}

// 업로드 파일 목록 생성
function addFileList(fIndex, fileName) {
    var html = "";
    var fileExt = fileType(fileName);

    html += "    <p class='file-name'><i class='ic-" + fileExt + "'></i>";
    html += fileName + "</p>"

    $('#dropZone').find('.txt-guide, .file-name').remove();
    $('#dropZone').append(html);
    
}

// 파일타입
function fileType(fileName){
    var fileLen = fileName.length;
    var lastDot = fileName.lastIndexOf('.');
    var fileExt = fileName.substring(lastDot + 1, fileLen).toLowerCase();

    return fileExt;
}

// 아코디언탭
function accList(){
    $('.acc-wrap [data-click]').click(function(){
        $(this).closest('.acc-list').toggleClass('on');
        $(this).closest('.acc-list').children('.acc-cont').slideToggle(300);
        $(this).closest('.acc-list').siblings().removeClass('on');
        $(this).closest('.acc-list').siblings().children('.acc-cont').slideUp(300);
    });
}

// 웹접근성시 페이지 첫번때 객체 포커스 이동
function focusFirst(){
    $('#container').find('input[type!=hidden],select,textarea,a,button,div[tabindex]').first().focus()
}

/* 제로필 */
function zeroFill(digit, value) {
    var length = String(value).length;
    var missing = digit - length;
    var zeroValue = "";

    for (var i = 0; i < missing; i++) {
        zeroValue = "0" + zeroValue;
    }

    return zeroValue + String(value);
}

/* 여러줄 말줄임 */
function multiRowHidden(parentsObj, showLine){
    $(parentsObj).find('.ellipsis-ext').each(function(){
        var fontSize = null;
        var pHeight = null;
        
        fontSize = parseInt($(this).find('p').css('font-size'));
        pHeight = parseInt($(this).find('p').css('height'));
        rowHeight = fontSize*1.6;

        if(pHeight > rowHeight*(showLine)) {
            $(this).find('p').after("<span class='ellipsis-tail'>...</span>");
            $(this).find('.ellipsis-tail').css("height", rowHeight+"px");
        }
    });
}

// 탭
function tab(){
    $('.tab-wrap').each(function(){
        let thisUse = $(this).data('use'),
            thisNo = $(this).find('.tab-btn.on').index();

        if(thisUse !== false) {
            $(this).children('.tab-cont-wrap').children('.tab-cont').hide()
            $(this).children('.tab-cont-wrap').children('.tab-cont').eq(thisNo).show();
            
            $(this).find('.tab-btn').click(function(){
                thisNo = $(this).index();

                $(this).siblings('.tab-btn').removeClass('on');
                $(this).addClass('on');

                $(this).closest('.tab-wrap').children('.tab-cont-wrap').children('.tab-cont').hide()
                $(this).closest('.tab-wrap').children('.tab-cont-wrap').children('.tab-cont').eq(thisNo).show();
            })

            if($('[data-tab]').length > 0){
                $('[data-tab]').each(function(){
    
                    $(this).click(function(){
                        thisTabNo = $(this).data('tab') - 1;

                        $(this).closest('.tab-wrap').find('.tab-cont').hide()
                        $(this).closest('.tab-wrap').find('.tab-cont').eq(thisTabNo).show();
        
                        $(this).closest('.tab-wrap').find('.tab-btn').removeClass('on');
                        $(this).closest('.tab-wrap').find('.tab-btn').eq(thisTabNo).addClass('on');
                    })
                })
            }
        }
    });
}

// 페이지 스크롤 이동
function scrollTopController(){
    var scrollControllerHeight = $('.scroll-top-controller').outerHeight();

    $('.scroll-top-controller a[href*="#"]').click(function(event) {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

            if (target.length) {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - ($('.scroll-top-controller').height() + $('.header').height())
                }, 1000);
            }
        }
    });
}

/* 이미지 자동변환 */
function imgChange(object) {
    $(object).each(function () {
        var srcName = $(this).attr('data-pc');
        var newSrc = $(this).attr('data-mobile');
        if ($(window).width() < 960) {
            $(this).attr('src', newSrc);
        } else {
            $(this).attr('src', srcName);
        }

    });
}

// 윈도우 높이값 체크
function isHeightChange(){
    var windowCurHeight = $(window).height();
    var isHeight = windowPrevHeght != windowCurHeight;

    windowPrevHeght = windowCurHeight;

    return isHeight;
}

/* 다중파일 업로드(2) */
// 라벨, 삭제 버튼 요소 추가
function addTag(obj, count){
    var clsNameObj = UPLOAD_CLASS_NAME;
    for(var i=1; i<=count; i++){
        var tag = '';
        tag += '<div class="file-item"><span class="txt-file-num">파일' + i + '</span><button id="btn-del' + i + '" class="btn ' + clsNameObj.BTN_DELETE + '" value="' + i + '">X</button>';
        tag += '<input class="' + clsNameObj.FILE_LABEL + '" id="inputFileName' + i +'" value="' + UPLOAD_EMPTY_TEXT + '" disabled="disabled" type="text"></div>';
        $(obj).append(tag);                      
    }
}

// 파일 태크 요소 추가
function addFileTag(obj){
    $(obj).append('<input type="file" id="ex_filename" class="' + UPLOAD_CLASS_NAME.FILE_TAG + '">');
}

// 파일 등록 이벤트 추가
function addFileEvent(){
    $('.btn-file-select').on('click', function(){
        var clsObjName = UPLOAD_CLASS_NAME;
        var fileTagEls = $('.' + clsObjName.FILE_TAG);

        if(fileTagEls.length > FILE_UPLOAD_MAX-1){
            return alert('파일 개수 초과');
        }

        if(isFileTagAddCheck(fileTagEls) == true){
            addFileTag('.file-wrap');
            fileTagEls = $('.' + clsObjName.FILE_TAG);
        }

        var index = fileTagEls.length - 1;
        var targetObj= $(fileTagEls)[index];

        $(targetObj).on('change', function(){
            $($('.' + clsObjName.FILE_LABEL)[index]).val(getFileName(this));
            $($('.' + clsObjName.BTN_DELETE)[index]).show();
            $($('.' + clsObjName.TXT_FILE_NUM)[index]).hide();
        });

        $(targetObj).click();
    });
}

// 파일 태그 추가 전 체크
// 추가 해야하면 true
function isFileTagAddCheck(objEls) {
    var index = $(objEls).length - 1;
    if(index < 0){
        return true;
    }
    var lastFileTag = $(objEls)[index];
    if(lastFileTag.files.length == 0){
        return false;
    }
    return true; 
}

// 파일이름 가져오기
function getFileName(obj){
    return (window.FileReader ? $(obj)[0].files[0].name : $(obj).val().split('/').pop().split('\\').pop());
}

// 파일 삭제 이벤트
function deleteFileEvent() {
    var clsNameObj = UPLOAD_CLASS_NAME;
    $('.' + clsNameObj.BTN_DELETE).on('click', function () {
        var fileTagEls = $('.' + clsNameObj.FILE_TAG);
        var index = this.value - 1;

        fileTagEls[index].remove();
        fileTagEls = $('.' + clsNameObj.FILE_TAG);

        setViewByTag( uploadElements.fileLabel, uploadElements.btnDel, fileTagEls, uploadElements.txtNum );
    });
}

// 파일 태그와 라벨 뷰 매핑
function setViewByTag (labelEls, btnDelEls, tagEls, txtNUM) {
var tagCount = $(tagEls).length;
    for(var i=0; i<tagCount; i++){
        var tagTargetEl = $(tagEls[i]);
        var filaName = getFileName(tagTargetEl);
        $(labelEls[i]).val( filaName );
    }
    $(labelEls[tagEls.length]).val(UPLOAD_EMPTY_TEXT);
    $(btnDelEls[tagEls.length]).hide();
    $(txtNUM[tagEls.length]).show();
}
/* // 다중파일 업로드(2) */

/* 페이징(2) */
function getClickedCategoryClass(){
    var _class = $('.carousel_sort a.active').parents().attr('class');
    return _class
}

function getCategory(){

    var _text = getClickedCategoryClass().split(' ');

    return _text[0]
}
/* // 페이징(2) */