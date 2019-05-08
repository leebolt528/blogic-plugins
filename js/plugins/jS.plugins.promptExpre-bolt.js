(function($){
    $.fn.promptExpre=function(options1,getData){
        if (arguments.length === 1) {
            getData=options1;
            options1={};
        }
        var options0={
            callback:{}
        }
        var options=$.extend(true,{},options0,options1);
        var dataSource=$.isFunction(getData) ? getData() : getData;
        $(this).addClass("autoInput-bolt");
        var inputNode = document.getElementsByClassName('autoInput-bolt')[0]; //输入框
        var indexSelect = -1; //当前选中的DIV的索引 
        var search_value = ""; //保存当前搜索的字符
        var valueArr = []; //当前需要匹配对应的搜索字段
        var oneSplit = []; //当前输入框内的值按空格截开
        var linkMark = ['AND', 'OR', 'NOT'];
        inputNode.setAttribute("placeholder","请输入..");
        inputNode.setAttribute("autoComplete","off");
        function start(event) {
            return function(event){
                if (event.which != 13 && event.which != 38 & event.which != 40) {
                    init();
                    deleteDIV();
                    inputNode.value = inputNode.value.replace(/^\s+|\s+$/g, ' ');
                    search_value = inputNode.value;
                    oneSplit = inputNode.value.replace(/^\s*\(*\s*|\s*\(*\s*$/g, '').split(/[\s\(\)]+/);
                    //初始化按空格展示所有字段
                    if (/^\s*\(*\s+$/.test(inputNode.value) || /(AND|OR|NOT)\s*\(*\s+$/.test(inputNode.value)) {
                        valueArr = dataSource.field;
                        valueArr.sort();
                        createSelect(/[.]*/, false);
                    }
                    //首次匹配字段
                    if (/^\s*\(*\s*[0-9a-zA-Z\_\$\u4e00-\u9fa5]+$/.test(inputNode.value) || /(AND|OR|NOT)[\(\s]+[0-9a-zA-Z\_\$\u4e00-\u9fa5]+$/.test(inputNode.value)) {
                        let reg = new RegExp("(" + '^' + `${oneSplit[oneSplit.length-1]}` + ")", "i");
                        valueArr = dataSource.field;
                        valueArr.sort();
                        createSelect(reg, true);
                    }
                    //显示运算符
                    if (/^\s*\(*\s*[0-9a-zA-Z\_\$\u4e00-\u9fa5]+\s+$/.test(inputNode.value) || /(AND|OR|NOT)[\(\s]+[0-9a-zA-Z\_\$\u4e00-\u9fa5]+\s+$/.test(inputNode.value)) {
                        let qw = oneSplit[oneSplit.length - 1].replace(/^\(*/g, '');
                        valueArr = dataSource.fieldop[`${qw}`];
                        !(valueArr == undefined) ? createSelect(/[.]*/, false): '';
                    }
                    //显示值
                    if (/((=|!=|>|>=|<|<=|is|~|!~)\s+)$/.test(inputNode.value)) {
                        let qw = (oneSplit[oneSplit.length - 2] + "#" + oneSplit[oneSplit.length - 1]);
                        if(dataSource.values[dataSource.valuemap[`${qw}`]]!= undefined){
                            valueArr = dataSource.values[dataSource.valuemap[`${qw}`]].data;
                            if (dataSource.values[dataSource.valuemap[`${qw}`]].type == "value") {
                                valueArr.sort();
                                createSelect(/[.]*/, false);
                            }
                        }
                    }
                    //匹配显示值
                    if (/((=|!=|>|>=|<|<=|is|~|!~)\s+[0-9a-zA-Z\_\$\u4e00-\u9fa5]+)$/.test(inputNode.value)) {
                        let qw = (oneSplit[oneSplit.length - 3] + "#" + oneSplit[oneSplit.length - 2]);
                        valueArr = [];
                        if (dataSource.values[dataSource.valuemap[`${qw}`]].type == "value") {
                            valueArr = dataSource.values[dataSource.valuemap[`${qw}`]].data;
                            valueArr.sort();
                            let reg = new RegExp("(" + '^' + `${oneSplit[oneSplit.length-1]}` + ")", "i");
                            createSelect(reg, true);
                        } 
                        //dataSource.values[dataSource.valuemap[`${qw}`]].type == "http"的情况
                        else {
                            fetch(dataSource.values[this.state.dataSource.valuemap[`${qw}`]].data + oneSplit[oneSplit.length - 1], {
                                    credentials: 'same-origin',
                                    method: 'GET'
                                })
                                .then((res) => res.json())
                                .then((data) => {
                                    let reg = new RegExp("(" + '^' + `${oneSplit[oneSplit.length-1]}` + ")", "i");
                                    createSelectHttp(reg, data.data);
                                }).catch((err) => {
                                    console.log(err.toString());
                                });
                        }
                    }
                    //显示连接符
                    if (/(=|!=|>|>=|<|<=|is|~|!~)\s+[0-9a-zA-Z\_\$\u4e00-\u9fa5]+\s*\)*\s+$/.test(inputNode.value) || /(=|!=|>|>=|<|<=|is|~|!~)\s+\"[\s\d\-\:]+\"\s*\)*\s+$/.test(inputNode.value)) {
                        valueArr = linkMark;
                        valueArr.sort();
                        createSelect(/[.]*/, false);
                    }
                }
                pressKey(event);
                changeClear(event);
            }
        }
        function changeClear(event) {
            if (event.target.value != '') {
                document.getElementById('clear').classList.add("clear");
            } else {
                document.getElementById('clear').classList.remove("clear");
            }
        }
        inputNode.onkeyup=start(event);
        //插入节点方法
        function insertAfter(newElement, targetElement){  
            let parent = targetElement.parentNode;  
            if (parent.lastChild == targetElement) {  
                // 如果最后的节点是目标元素，则直接添加。因为默认是最后  
                parent.appendChild(newElement);  
            } else {  
                parent.insertBefore(newElement, targetElement.nextSibling);  
                //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面  
            }  
        }  
        var newIncludeElement=document.createElement("div");
        newIncludeElement.className = "promptExpreBolt";
        insertAfter(newIncludeElement,inputNode);
        newIncludeElement.appendChild(inputNode);
        function clertInput() {
            return function(){
                inputNode.value = '';
                document.getElementById('clear').classList.remove("clear");
                if(options.callback.hasOwnProperty("onClickClear")){
                    options.callback.onClickClear();
                }
            }
        }
        //创建清空按钮
        var newClearElement = document.createElement("li");
        newClearElement.className = "fa fa-times-circle";
        newClearElement.id = "clear";
        newClearElement.onclick = clertInput();
        //创建下拉框
        var newAutoElement = document.createElement("div");
        newAutoElement.className = "auto_hidden";
        newAutoElement.id = "auto";
        insertAfter(newClearElement,inputNode);
        insertAfter(newAutoElement,newClearElement);
        var autoNode = document.getElementById('auto'); //DIV的根节点
        //初始化DIV的位置
        function init() {
                autoNode.style.left = inputNode.offsetLeft + "px";
                autoNode.style.top = inputNode.offsetTop + inputNode.offsetHeight + "px";
                autoNode.style.width = inputNode.offsetWidth - 2 + "px"; //减去边框的长度2px
            }
        //删除自动完成需要的所有DIV
        function deleteDIV() {
                while (autoNode.hasChildNodes()) {
                    autoNode.removeChild(autoNode.firstChild);
                }
                autoNode.className = "auto_hidden";
            }
        //创建下拉列表
        function createSelect(reg, bool) {
                let div_index = 0; //记录创建的DIV的索引
                for (let i = 0; i < valueArr.length; i++) {
                    if (reg.test(valueArr[i])) {    
                        let div = document.createElement("div");
                        div.className = "auto_onmouseout";
                        div.seq = valueArr[i];
                        div.onclick = setValue(valueArr[i]);
                        div.onmouseover = autoOnmouseover(div_index);
                        if (bool) {
                            div.innerHTML = valueArr[i].replace(reg, "<strong>$1</strong>");
                        } else {
                            div.innerHTML = valueArr[i];
                        }
                        autoNode.appendChild(div);
                        autoNode.className = "auto_show";
                        div_index++;
                    }
                }
            }
        //设置值
        function setValue(seq) {
                return function(event) {
                    autoNode.className = "auto_hidden";
                    if (/\s+$/.test(inputNode.value)) {
                        inputNode.value = inputNode.value + seq;
                    } else {
                        let reg = new RegExp("(" + '^' + `${oneSplit[oneSplit.length-1]}` + ")", "i");
                        inputNode.value = inputNode.value + seq.replace(reg, '');
                    }
                }
            }
        //模拟鼠标移动到DIV时,DIV高亮
        function autoOnmouseover(div_index) {
            return function() {
                indexSelect = div_index;
                let length = autoNode.children.length;
                for (let j = 0; j < length; j++) {
                    if (j != indexSelect) {
                        autoNode.childNodes[j].className = 'auto_onmouseout';
                    } else {
                        autoNode.childNodes[j].className = 'auto_onmouseover';
                    }
                }
            }
        }
            //响应键盘
        function pressKey(event) {
                let length = autoNode.children.length;
                //光标键"↓"
                if (event.keyCode == 40) {
                    ++indexSelect;
                    if (indexSelect == length) {
                        inputNode.value = search_value;
                    } else if (indexSelect > length) {
                        indexSelect = 0;
                    }
                    changeClassname(length);
                }
                //光标键"↑"
                else if (event.keyCode == 38) {
                    indexSelect--;
                    if (indexSelect == -1) {
                        inputNode.value = search_value;
                    } else if (indexSelect < -1) {
                        indexSelect = length - 1;
                    }
                    changeClassname(length);
                }
                //回车
                else if (event.keyCode == 13 && (indexSelect=='-1'||$("#auto").hasClass("auto_hidden"))) {
                    if(options.callback.hasOwnProperty("onClickSearch")){
                        options.callback.onClickSearch($(".autoInput-bolt").val());
                    }
                } else if (event.keyCode == 13) {
                    autoNode.className = "auto_hidden";
                    indexSelect = -1;
                }else {
                    indexSelect = -1;
                }
            }
        //更改classname
        function changeClassname(length) {
            for (let i = 0; i < length; i++) {
                if (i != indexSelect) {
                    autoNode.childNodes[i].className = 'auto_onmouseout';
                } else {
                    autoNode.childNodes[i].className = 'auto_onmouseover';
                    if (/\s+$/.test(search_value)) {
                        inputNode.value = search_value + autoNode.childNodes[i].seq;
                    } else {
                        let reg = new RegExp("(" + '^' + `${oneSplit[oneSplit.length-1]}` + ")", "i");
                        inputNode.value = search_value + autoNode.childNodes[i].seq.replace(reg, '');
                    }
                }
            }
        }
        document.onclick = function(event) {
            autoNode.className = "auto_hidden";
        };
        var promptExpreTools={
            getInputValue:function(){
                return $(".autoInput-bolt").val();
            }
        }
        return promptExpreTools;
    }
})(jQuery)