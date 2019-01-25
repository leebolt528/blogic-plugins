var menuLeftData=[
    {"id":"1","name":"时间选择","fa":"fa-home","href":"selectTime.html","children":[]},
    {"id":"5","name":"自动提示","fa":"fa-home","href":"promptExpre.html","children":[]},
    {"id":"6","name":"仪表板","fa":"fa-home","href":"dashBoard.html","children":[]},
    {"id":"7","name":"百度地图","fa":"fa-home","href":"#","children":[]},
    {"id":"8","name":"关系依赖图","fa":"fa-home","href":"#","children":[]},
    {"id":"9","name":"zTree表格","fa":"fa-home","href":"ztreeTable.html","children":[]},
    {"id":"10","name":"TreeTable异步","fa":"fa-home","href":"treeTable.html","children":[]},
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
var ztreeData={
    columns:[
        {
            field: 'name',
            title: '方法说明',
            align:'left',
            width:"27%"
        },
        {
            field: 'funPara',
            title: '方法参数',
            align:'center',
            width:"20%"
        },
        
        {
            field: 'gap',
            title: 'Gap(ms)',
            align:'center',
            width:"5%"
        },
        {
            field: 'eTime',
            title: '执行时间(ms)',
            align:'center',
            width:"10%"
        },
        {
            field: 'className',
            title: '方法类名',
            align:'center',
            width:"12%"
        },
        {
            field: 'apiType',
            title: 'API类型',
            align:'center',
            width:"12%"
        },
        {
            field: 'appNode',
            title: '应用节点',
            align:'center',
            width:"7%"
        },
        {
            field: 'appName',
            title: '应用名称',
            align:'center',
            width:"7%"
        }
    ],
    data:[
        {
            open:true,id:"0",pId:"1","selected":true,
            parameter:{
                name:"Tomcat Servlet Process",
                funPara:"/paas/operator/redis/service/2c90839e683590eb01684a784cce006f/node",
                startTime:"17:33:18 469",                                                       
                gap:"0",                                                                      
                eTime:"696",                                                                       
                className:"",                                                                     
                apiType:"TOMCAT",                                                               
                appNode:"dev_bcm",                                                             
                appName:"dev_bcm",
                icon:"fa-warning"                                                
            }
        },
        {
            open:true,id:"2",pId:"1",
            parameter:{
                name:"http.status.code",
                funPara:"200",
                startTime:"",
                gap:"",
                eTime:"",
                className:"",
                apiType:"",
                appNode:"",
                appName:"",
                icon:"fa-warning"
            }
        },
        {
            open:true,id:"3",pId:"1",
            parameter:{
                name:"REMOTE_ADDRESS",
                funPara:"172.16.73.63",
                startTime:"",                                                       
                gap:"",                                                                      
                eTime:"",                                                                       
                className:"",                                                                     
                apiType:"",                                                               
                appNode:"",                                                             
                appName:"",
                icon:"fa-warning"                                                            
            }
        },
        {
            open:true,id:"4",pId:"1",
            parameter:{
                name:"invoke(Request request, Response response)",
                funPara:"",  
                startTime:"17:33:18 469",                                                       
                gap:"0",                                                                      
                eTime:"696",                                                                       
                className:"StandardHostValve",                                                                     
                apiType:"TOMCAT_METHOD",                                                               
                appNode:"dev_bcm",                                                             
                appName:"dev_bcm",
                icon:""                                                                
            }
        },
        {
            open:true,id:"5",pId:"4",
            parameter:{
                name:"doGet(HttpServletRequest request, HttpServletResponse response)",
                funPara:"",  
                startTime:"17:33:18 470",                                                       
                gap:"1",                                                                      
                eTime:"695",                                                                       
                className:"FrameworkServlet",                                                                     
                apiType:"SPRING",                                                               
                appNode:"dev_bcm",                                                             
                appName:"dev_bcm",
                icon:""                                                              
            }
        },
        {
            open:true,id:"6",pId:"5",
            parameter:{
                name:"listNodes(String serviceId)",
                funPara:"", 
                startTime:"17:33:18 477",                                                       
                gap:"7",                                                                      
                eTime:"685",                                                                       
                className:"RedisOperatorController",                                                                     
                apiType:"TOMCAT_METHOD",                                                               
                appNode:"SPRING_BEAN",                                                             
                appName:"dev_bcm",
                icon:""                                                             
            }
        },
        {
            open:false,id:"7",pId:"6",
            parameter:{
                name:"prepareStatement(String sql)",
                funPara:"",  
                startTime:"17:33:18 478",                                                       
                gap:"1",                                                                      
                eTime:"1",                                                                       
                className:"ConnectionImpl",                                                                     
                apiType:"MYSQL(epm_paas)",                                                               
                appNode:"dev_bcm",                                                             
                appName:"dev_bcm",
                icon:""                                                             
            }
        },
        {
            open:true,id:"8",pId:"7",
            parameter:{
                name:"SQL",
                funPara:"select statefulse0_.id as id1_9_, statefulse0_.`access_url` as access_u2_9_, statefulse0_.`app_type` as app_type3_9_, statefulse0_.`bconsole_referenced` as bconsole4_9_, statefulse0_.`created_by` as created_5_9_, statefulse0_.`created_time` as created_6_9_, statefulse0_.`lastopt_time` as lastopt_7_9_, statefulse0_.`namespace` as namespac8_9_, statefulse0_.`nodenum` as nodenum9_9_, statefulse0_.`referenced_hbase` as referen10_9_, statefulse0_.`referenced_hive` as referen11_9_, statefulse0_.`referenced_mysql` as referen12_9_, statefulse0_.`referenced_spark` as referen13_9_, statefulse0_.`referenced_yarn` as referen14_9_, statefulse0_.`referenced_zk` as referen15_9_, statefulse0_.`service_name` as service16_9_, statefulse0_.`service_state` as service17_9_, statefulse0_.`storage` as storage18_9_, statefulse0_.`type` as type19_9_, statefulse0_.`version` as version20_9_ from `stateful_service` statefulse0_ where statefulse0_.id=? and statefulse0_.`service_state`<>?",
                startTime:"",                                                       
                gap:"",                                                                      
                eTime:"",                                                                       
                className:"",                                                                     
                apiType:"",                                                               
                appNode:"",                                                             
                appName:"",
                icon:"fa-info-circle"                                                            
            }
        },
        {
            open:true,id:"9",pId:"6",
            parameter:{
                name:"executeQuery()",
                funPara:"",  
                startTime:"17:33:18 481",                                                       
                gap:"2",                                                                      
                eTime:"1",                                                                       
                className:"PreparedStatement",                                                                    
                apiType:"MYSQL(epm_paas)",                                                              
                appNode:"dev_bcm",                                                             
                appName:"dev_bcm",
                icon:""                                                               
            }
        },
        {
            open:true,id:"10",pId:"9",
            parameter:{
                name:"SQL",
                funPara:"select statefulse0_.id as id1_9_, statefulse0_.`access_url` as access_u2_9_, statefulse0_.`app_type` as app_type3_9_, statefulse0_.`bconsole_referenced` as bconsole4_9_, statefulse0_.`created_by` as created_5_9_, statefulse0_.`created_time` as created_6_9_, statefulse0_.`lastopt_time` as lastopt_7_9_, statefulse0_.`namespace` as namespac8_9_, statefulse0_.`nodenum` as nodenum9_9_, statefulse0_.`referenced_hbase` as referen10_9_, statefulse0_.`referenced_hive` as referen11_9_, statefulse0_.`referenced_mysql` as referen12_9_, statefulse0_.`referenced_spark` as referen13_9_, statefulse0_.`referenced_yarn` as referen14_9_, statefulse0_.`referenced_zk` as referen15_9_, statefulse0_.`service_name` as service16_9_, statefulse0_.`service_state` as service17_9_, statefulse0_.`storage` as storage18_9_, statefulse0_.`type` as type19_9_, statefulse0_.`version` as version20_9_ from `stateful_service` statefulse0_ where statefulse0_.id=? and statefulse0_.`service_state`<>?",
                startTime:"",                                                       
                gap:"",                                                                      
                eTime:"",                                                                       
                className:"",                                                                     
                apiType:"",                                                               
                appNode:"",                                                             
                appName:"",
                icon:"fa-file-text-o"                                                         
            }
        }
    ]
}




var oneData=[
    {
      "id": "bconsoletest-dcos",
      "idP": "",
      "img": "",
      "last": false,
      "synChild": false,
      "ajax": "/app/monitor/orchestration/ajax/deployments?jumpsource=deployment&isIndicator=true",
      "parameterName": "namespace",
      "subResourceCount": "0",
      "data": {
        "name": "bconsoletest-dcos",
        "cpu": "0.2670101275765281",
        "memory": "3081396224",
        "diskReadRate": "4074575.8128073183",
        "diskWriteRate": "15371330.152342033",
        "networkReceive": "10775.390992786719",
        "networkTransmit": "15413.10717712519"
      }
    },
    {
      "id": "bonc-dcos",
      "idP": "",
      "img": "",
      "last": false,
      "synChild": false,
      "ajax": "/app/monitor/orchestration/ajax/deployments?jumpsource=deployment&isIndicator=true",
      "parameterName": "namespace",
      "subResourceCount": "0",
      "data": {
        "name": "bonc-dcos",
        "cpu": "0.11869720586390657",
        "memory": "6422401024",
        "diskReadRate": "3970074.280266197",
        "diskWriteRate": "14752037.58477244",
        "networkReceive": "51033.350549726165",
        "networkTransmit": "61384.98707763915"
      }
    },
    {
      "id": "default",
      "idP": "",
      "img": "",
      "last": false,
      "synChild": false,
      "ajax": "/app/monitor/orchestration/ajax/deployments?jumpsource=deployment&isIndicator=true",
      "parameterName": "namespace",
      "subResourceCount": "2",
      "data": {
        "name": "default",
        "cpu": "0.04794766247077155",
        "memory": "818184192",
        "diskReadRate": "0",
        "diskWriteRate": "0",
        "networkReceive": "146453.4122814712",
        "networkTransmit": "19421.67010546355"
      }
    },
    {
      "id": "istio-system",
      "idP": "",
      "img": "",
      "last": false,
      "synChild": false,
      "ajax": "/app/monitor/orchestration/ajax/deployments?jumpsource=deployment&isIndicator=true",
      "parameterName": "namespace",
      "subResourceCount": "0",
      "data": {
        "name": "istio-system",
        "cpu": "1.5351954437182396",
        "memory": "7864274944",
        "diskReadRate": "0",
        "diskWriteRate": "1049374.147854815",
        "networkReceive": "1333586.0212521434",
      }
    },
    {
      "id": "kube-system",
      "idP": "",
      "img": "",
      "last": true,
      "synChild": false,
      "ajax": "/app/monitor/orchestration/ajax/deployments?jumpsource=deployment&isIndicator=true",
      "parameterName": "namespace",
      "subResourceCount": "12",
      "data": {
        "name": "kube-system",
        "cpu": "7.778891712072217",
        "memory": "20110315520",
        "diskReadRate": "42962.48888888888",
        "diskWriteRate": "2484333.3061354994",
        "networkReceive": "113996080.78273587",
        "networkTransmit": "118128887.99307595"
      }
    }
  ]

  var twoData=[
    {
      "id": "redis-operator~_default",
      "idP": "default",
      "img": "",
      "last": false,
      "synChild": false,
      "ajax": "/app/monitor/orchestration/ajax/pods?isIndicator=true&type=deployment",
      "parameterName": "byname",
      "subResourceCount": "1",
      "data": {
        "name": "redis-operator",
        "cpu": "0.009505038197147635",
        "memory": "50987008",
        "diskReadRate": "0",
        "diskWriteRate": "0",
        "networkReceive": "23394.918911703855",
        "networkTransmit": "504.9275878178461"
      }
    },
    {
      "id": "zk-operator~_default",
      "idP": "default",
      "img": "",
      "last": true,
      "synChild": false,
      "ajax": "/app/monitor/orchestration/ajax/pods?isIndicator=true&type=deployment",
      "parameterName": "byname",
      "subResourceCount": "1",
      "data": {
        "name": "zk-operator",
        "cpu": "0.0026503065111113874",
        "memory": "25878528",
        "diskReadRate": "0",
        "diskWriteRate": "0",
        "networkReceive": "3322",
        "networkTransmit": "104.4"
      }
    }
  ]

  var threeData=[ {
    "id" : "redis-operator-5bbb7f78bf-48j9f~_redis-operator~_default",
    "idP" : "redis-operator~_default",
    "img" : "",
    "last" : false,
    "synChild" : false,
    "ajax" : "/app/monitor/orchestration/ajax/containers?isIndicator=true&type=deployment",
    "parameterName" : "pod",
    "subResourceCount" : "1",
    "data" : {
      "name" : "redis-operator-5bbb7f78bf-48j9f",
      "cpu" : "0.0026199834486441143",
      "memory" : "48439296",
      "diskReadRate" : "0",
      "diskWriteRate" : "0",
      "networkReceive" : "7514.604791884496",
      "networkTransmit" : "187.4930479855843"
    }
  }]
  var lastData=[ {
    "id" : "redis-controller~_redis-operator-5bbb7f78bf-48j9f~_redis-operator~_default",
    "idP" : "redis-operator-5bbb7f78bf-48j9f~_redis-operator~_default",
    "img" : "../img/plugins/treeTable/docker.png",
    "last" : true,
    "synChild" : false,
    "ajax" : "",
    "parameterName" : "container",
    "subResourceCount" : null,
    "data" : {
      "name" : "redis-controller",
      "cpu" : "0.0026199834486441143",
      "memory" : "48308224",
      "diskReadRate" : "0",
      "diskWriteRate" : "0",
      "networkReceive" : null,
      "networkTransmit" : null
    }
  } ]

  var syncData=[ {
    "id" : "default",
    "idP" : "",
    "img" : "",
    "last" : false,
    "synChild" : true,
    "ajax" : "/app/monitor/orchestration/ajax/deployments?jumpsource=deployment&isIndicator=true",
    "parameterName" : "namespace",
    "subResourceCount" : "2",
    "data" : {
      "name" : "default",
      "cpu" : "0.04794590946692686",
      "memory" : "463245312",
      "diskReadRate" : "0",
      "diskWriteRate" : "0",
      "networkReceive" : "142576.61410056025",
      "networkTransmit" : "24045.73368741528"
    }
  }, {
    "id" : "redis-operator~_default",
    "idP" : "default",
    "img" : "",
    "last" : false,
    "synChild" : false,
    "ajax" : "/app/monitor/orchestration/ajax/pods?isIndicator=true&type=deployment",
    "parameterName" : "byname",
    "subResourceCount" : "1",
    "data" : {
      "name" : "redis-operator",
      "cpu" : "0.006945529545102065",
      "memory" : "50065408",
      "diskReadRate" : "0",
      "diskWriteRate" : "0",
      "networkReceive" : "18642.080935131893",
      "networkTransmit" : "558.2790728682861"
    }
  } ]

  var treeTData={
    columns:[
        {
            field: 'name',
            title: '名称',
            align:'left',
            width:"30%"
        },
        {
            field: 'memory',
            title: '内存使用量（GiB）',
            align:'center',
            width:"20%"
        },
        
        {
            field: 'cpu',
            title: 'cpu使用核数',
            align:'center',
            width:"10%"
        },
        {
            field: 'diskReadRate',
            title: '磁盘读速率（KiB/s）',
            align:'center',
            width:"10%"
        },
        {
            field: 'diskWriteRate',
            title: '磁盘写速率（KiB/s）',
            align:'center',
            width:"10%"
        },
        {
            field: 'networkReceive',
            title: 'IO指标（流入MiB/s）',
            align:'center',
            width:"10%"
        },
        {
            field: 'networkTransmit',
            title: 'IO指标（流出MiB/s）',
            align:'center',
            width:"10%"
        }
    ],
    data:[{
        "id" : "default",
        "idP" : "",
        "img" : "",
        "last" : false,
        "synChild" : true,
        "ajax" : "/app/monitor/orchestration/ajax/deployments?jumpsource=deployment&isIndicator=true",
        "parameterName" : "namespace",
        "subResourceCount" : "2",
        "data" : {
          "name" : "default",
          "cpu" : "0.04794590946692686",
          "memory" : "463245312",
          "diskReadRate" : "0",
          "diskWriteRate" : "0",
          "networkReceive" : "142576.61410056025",
          "networkTransmit" : "24045.73368741528"
        }
      }, {
        "id" : "redis-operator~_default",
        "idP" : "default",
        "img" : "",
        "last" : false,
        "synChild" : false,
        "ajax" : "/app/monitor/orchestration/ajax/pods?isIndicator=true&type=deployment",
        "parameterName" : "byname",
        "subResourceCount" : "1",
        "selected":true,
        "data" : {
          "name" : "redis-operator",
          "cpu" : "0.006945529545102065",
          "memory" : "50065408",
          "diskReadRate" : "0",
          "diskWriteRate" : "0",
          "networkReceive" : "18642.080935131893",
          "networkTransmit" : "558.2790728682861"
        }
      }]
  }