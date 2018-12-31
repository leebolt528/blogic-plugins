var menuLeftData=[
    {"id":"1","name":"时间选择","fa":"fa-home","href":"selectTime.html","children":[]},
    {"id":"5","name":"自动提示","fa":"fa-home","href":"promptExpre.html","children":[]},
    {"id":"2","name":"规则链库","fa":"fa-link","href":"#","children":[
        {"id":"2-1","name":"规则链库1","fa":"fa-home","href":"#","children":[]},
        {"id":"2-2","name":"规则链库2","fa":"fa-home","href":"#","children":[]},
        {"id":"2-3","name":"规则链库3","fa":"fa-home","href":"#","children":[]},
        {"id":"2-4","name":"规则链库4","fa":"fa-home","href":"#","children":[]}
    ]},
    {"id":"4","name":"设备管理","fa":"fa-link","href":"#","children":[
        {"id":"4-1","name":"设备管理1","fa":"fa-home","href":"#","children":[]},
        {"id":"4-2","name":"设备管理2","fa":"fa-home","href":"#","children":[]},
        {"id":"4-3","name":"设备管理3","fa":"fa-home","href":"#","children":[]},
        {"id":"4-4","name":"设备管理4","fa":"fa-home","href":"#","children":[]},
        {"id":"4-5","name":"设备管理5","fa":"fa-home","href":"#","children":[]},
        {"id":"4-6","name":"设备管理6","fa":"fa-home","href":"#","children":[]},
        {"id":"4-7","name":"设备管理7","fa":"fa-home","href":"#","children":[]},
        {"id":"4-8","name":"设备管理8","fa":"fa-home","href":"#","children":[]},
        {"id":"4-9","name":"设备管理9","fa":"fa-home","href":"#","children":[]},
        {"id":"4-10","name":"设备管理10","fa":"fa-home","href":"#","children":[]},
        {"id":"4-11","name":"设备管理11","fa":"fa-home","href":"#","children":[]},
        {"id":"4-12","name":"设备管理12","fa":"fa-home","href":"#","children":[]},
        {"id":"4-13","name":"设备管理13","fa":"fa-home","href":"#","children":[]},
        {"id":"4-14","name":"设备管理14","fa":"fa-home","href":"#","children":[]},
        {"id":"4-15","name":"设备管理15","fa":"fa-home","href":"#","children":[]},
        {"id":"4-16","name":"设备管理16","fa":"fa-home","href":"#","children":[]}
    ]},
     {"id":"3","name":"设备管理","fa":"fa-link","href":"#","children":[
        {"id":"3-1","name":"设备管理1","fa":"fa-home","href":"#","children":[
            {"id":"3-1-1","name":"设备管理1-1","fa":"fa-home","href":"#","children":[]},
            {"id":"3-1-2","name":"设备管理1-2","fa":"fa-home","href":"#","children":[]},
            {"id":"3-1-3","name":"设备管理1-3","fa":"fa-home","href":"#","children":[]}
        ]},
        {"id":"3-2","name":"设备管理2","fa":"fa-home","href":"#","children":[]},
        {"id":"3-3","name":"设备管理3","fa":"fa-home","href":"#","children":[]},
        {"id":"3-4","name":"设备管理4","fa":"fa-home","href":"#","children":[]}
    ]},
]

var promptExpreData = {
    "field": [
        "fl_article_from",
        "fl_board_name",
        "fl_content",
        "fl_fetch_time",
        "当前选中"
    ],
    "fieldop": {
        "fl_article_from": [
            "=",
            "!=",
            "is"
        ],
        "fl_board_name": [
            "=",
            "!=",
            "is"
        ],
        "fl_content": [
            "=",
            "!=",
            ">",
            ">=",
            "<",
            "<=",
            "is"
        ]
    },
    "valuemap": {
        "fl_article_from#=": "contentop1",
        "fl_article_from#!=": "contentop1",
        "fl_article_from#is": "contentop2",
        "fl_board_name#=": "contentop3",
        "fl_board_name#!=": "contentop3",
        "fl_board_name#is": "contentop2",
        "fl_content#~": "contentop4",
        "fl_content#!~": "contentop4",
        "fl_content#is": "contentop2",
        "fl_fetch_time#=": "contentop4",
        "fl_fetch_time#!=": "contentop4",
        "fl_fetch_time#>": "contentop4",
        "fl_fetch_time#>=": "contentop4",
        "fl_fetch_time#<": "contentop4",
        "fl_fetch_time#<=": "contentop4",
        "fl_fetch_time#is": "contentop2"
    },
    "values": {
        "contentop1": {
            "type": "value",
            "data": [
                "新华网"
            ]
        },
        "contentop2": {
            "type": "value",
            "data": [
                "Empty"
            ]
        },
        "contentop3": {
            "type": "value",
            "data": [
                "新华地方"
            ]
        },
        "contentop4": {
            "type": "http"
        }
    }
}