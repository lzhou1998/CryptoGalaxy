import Web3 from "web3";
import CryptoGalaxyArtifact from "../../build/contracts/CryptoGalaxy.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    const networkId = await web3.eth.net.getId();
    const CryptoGalaxyNetwork = CryptoGalaxyArtifact.networks[networkId];
    
    this.CryptoGalaxy = new web3.eth.Contract(
      CryptoGalaxyArtifact.abi,
      CryptoGalaxyNetwork.address,
    );

    const accounts = await web3.eth.getAccounts();
    this.account = accounts[0];
    web3.eth.defaultAccount= accounts[0];
    this.CheckPlExt();
    this.DrawOriginalMap();
  },

  GetMap: async function(){
    var td = event.srcElement; 
    var index=td.parentElement.rowIndex*10+td.cellIndex;
    this.sector=index;
    if(this.CryptoGalaxy)
    {
      var { getMap} = this.CryptoGalaxy.methods;
      var map = await getMap(index).call({from:this.account});
      this.DrawMap(map);
      $("#map").attr("onclick","");
    }
  },

  DrawMap: async function(map){
    var x=10;
    var y=10;
    var str = "";
    str += '<table class="table2" border="2">';
    for (var i=0;i<x;i++)
    {
        str += "<tr>";
        for (var j=0;j<y;j++)
        {
            switch(parseInt(map[i][j]))
            {
              case 0:str +="<td width='60' height='60' style='border:2px solid #E7EFE0;'><img src='assets/img/transparent.png' height='60' width='60'  onclick='App.PopUpPlanetInfoWindowInTable("+i+","+j+");'></td>";break;
              case 1:str +="<td width='60' height='60' style='border:2px solid #E7EFE0;'><img src='assets/img/1.png' height='60'  width='60' onclick='App.PopUpPlanetInfoWindowInTable("+i+","+j+");'></td>";break;
              case 2:str +="<td width='60' height='60' style='border:2px solid #E7EFE0;'><img src='assets/img/6.jpg' height='60'  width='60' onclick='App.PopUpPlanetInfoWindowInTable("+i+","+j+");'></td>";break;
              case 3:str +="<td width='60' height='60' style='border:2px solid #E7EFE0;'><img src='assets/img/3.png' height='60'  width='60' onclick='App.PopUpPlanetInfoWindowInTable("+i+","+j+");'></td>";break;
            }
            
            
        }
        str += "</tr>";
    }
    
    document.getElementById("map").innerHTML=str;
    document.getElementById("return").style.display="block";
  },

  DrawOriginalMap: function(){
    var x=10;
    var y=10;
    var str = "";
    str += '<table class="table1" style="background-image:url(assets/img/4.jpg);">';
    for (var i=0;i<x;i++)
    {
        str += "<tr>";
        for (var j=0;j<y;j++)
        {
            str += "<td  width='60' height='60'>" + (i*10+j) + "</td>";
        }
        str += "</tr>";
    }
    
    document.getElementById("map").innerHTML=str;
    document.getElementById("return").style.display="none";
    $("#map").attr("onclick","App.GetMap();");
  },

  PopUpInfoWindow: function(id){
    document.getElementById(id).style.display='block';
    document.getElementById('fade').style.display='block';
  },


  PopUpPlanetInfoWindowInTable: function(i,j){
    
    // var td = event.srcElement; 
    var y =parseInt(this.sector / 10) * 10 + j;
    var x =(this.sector%10)*10+i;
    this.GetPlanetInfo(x,y,0);
    this.PopUpInfoWindow("PlanetInfoWindowInTable");
  },

  PopUpFleetInfoWindow: function(){
    this.GetPlayerShips();
    document.getElementById('fleetId').style.display='block';
    this.PopUpInfoWindow("FleetInfoWindow");
  },

  PopUpTreasureInfoWindow: function(){
    this.GetPlayerTreasures();
    document.getElementById('treasureId').style.display='block';
    this.PopUpInfoWindow("TreasureInfoWindow");
  },

  PopUpSaleInfoWindow: function(){
    this.GetPlayerSales();
    document.getElementById('saleId').style.display='block';
    this.PopUpInfoWindow("SaleInfoWindow");
  },

  PopUpOrderInfoWindow: function(){
    this.GetPlayerOrders();
    document.getElementById('orderId').style.display='block';
    this.PopUpInfoWindow("OrderInfoWindow");
  },

  PopUpBattleLogInfoWindow: function(){
    this.GetPlayerBattleLogs();
    document.getElementById('battleLogId').style.display='block';
    this.PopUpInfoWindow("BattleLogInfoWindow");
  },

  PopUpPlanetInfoWindow: function(){
    this.GetPlayerPlanets();
    document.getElementById('planetId').style.display='block';
    this.PopUpInfoWindow("PlanetInfoWindow");
  },

  CloseInfoWindow: function(id){
    document.getElementById(id).style.display='none';
    document.getElementById('fade').style.display='none';
  },

  ClosePlanetInfoWindowInTable: function(){
    document.getElementById('orderFormInTable').style.display='none';
    document.getElementById('planetInfoInTable').style.display='none';
    document.getElementById('surveyInTable').style.display='none';
    document.getElementById('transportInTable').style.display='none';
    document.getElementById('buildInTable').style.display='none';
    document.getElementById('captureInTable').style.display='none';
    document.getElementById('refresh_resInTable').style.display='none';
    document.getElementById('changePNameInTable').style.display='none';
    document.getElementById('changePNameFormInTable').style.display='none';
    this.CloseInfoWindow("PlanetInfoWindowInTable");
  },

  CloseFleetInfoWindow: function(){
    document.getElementById('fleetId').style.display='none';  
    document.getElementById('fleetInfo').style.display='none';
    document.getElementById('return_fleet').style.display='none'; 
    document.getElementById('changeSName').style.display='none';
    this.CloseInfoWindow("FleetInfoWindow");
  },

  CloseTreasureInfoWindow: function(){
    document.getElementById('treasureId').style.display='none';  
    document.getElementById('treasureInfo').style.display='none';
    document.getElementById('return_treasure').style.display='none';
    document.getElementById('install').style.display='none';
    document.getElementById('uninstall').style.display='none'; 
    document.getElementById('installForm').style.display='none';
    this.CloseInfoWindow("TreasureInfoWindow");
  },

  CloseSaleInfoWindow: function(){
    document.getElementById('saleId').style.display='none';  
    document.getElementById('saleInfo').style.display='none';
    document.getElementById('return_sale').style.display='none'; 
    document.getElementById('saleForm').style.display='none';
    document.getElementById('buy_sale').style.display='none';
    document.getElementById('view_sale_item').style.display='none';
    this.CloseInfoWindow("SaleInfoWindow");
  },

  CloseBattleLogInfoWindow: function(){
    document.getElementById('battleLogId').style.display='none';  
    document.getElementById('battleLogInfo').style.display='none';
    document.getElementById('return_battleLog').style.display='none'; 
    this.CloseInfoWindow("BattleLogInfoWindow");
  },

  CloseOrderInfoWindow: function(){
    document.getElementById('orderId').style.display='none';  
    document.getElementById('orderInfo').style.display='none';
    document.getElementById('return_order').style.display='none'; 
    this.CloseInfoWindow("OrderInfoWindow");
  },

  ClosePlanetInfoWindow: function(){
    document.getElementById('planetId').style.display='none';  
    document.getElementById('planetInfo').style.display='none';
    document.getElementById('return_planet').style.display='none'; 
    document.getElementById('attack').style.display='none';
    document.getElementById('move').style.display='none';
    document.getElementById('build').style.display='none';
    document.getElementById('transport').style.display='none';
    document.getElementById('capture').style.display='none';
    document.getElementById('orderForm').style.display='none';
    document.getElementById('changePNameForm').style.display='none';
    document.getElementById('changePName').style.display='none';
    document.getElementById('refresh_res').style.display='none';
    this.CloseInfoWindow("PlanetInfoWindow");
  },

  ReturnFleetInfoWindow: function(){
    document.getElementById('return_fleet').style.display='none';  
    document.getElementById('changeSName').style.display='none';
    document.getElementById('fleetId').style.display='block';
    document.getElementById('fleetInfo').style.display='none';
  },

  ReturnTreasureInfoWindow: function(){
    document.getElementById('return_treasure').style.display='none';  
    document.getElementById('treasureId').style.display='block';
    document.getElementById('treasureInfo').style.display='none';
    document.getElementById('install').style.display='none';
    document.getElementById('installForm').style.display='none';
    document.getElementById('uninstall').style.display='none'; 
  },

  ReturnSaleInfoWindow: function(){
    document.getElementById('return_sale').style.display='none';  
    document.getElementById('saleId').style.display='block';
    document.getElementById('saleInfo').style.display='none';
    document.getElementById('saleForm').style.display='none';
    document.getElementById('buy_sale').style.display='none';
    document.getElementById('view_sale_item').style.display='none';
  },

  ReturnOrderInfoWindow: function(){
    document.getElementById('return_order').style.display='none';  
    document.getElementById('orderId').style.display='block';
    document.getElementById('orderInfo').style.display='none';
  },

  ReturnBattleLogInfoWindow: function(){
    document.getElementById('return_battleLog').style.display='none';  
    document.getElementById('battleLogId').style.display='block';
    document.getElementById('battleLogInfo').style.display='none';
  },

  ReturnPlanetInfoWindow: function(){
    document.getElementById('return_planet').style.display='none';  
    document.getElementById('planetId').style.display='block';
    document.getElementById('planetInfo').style.display='none';
    document.getElementById('move').style.display='none';
    document.getElementById('build').style.display='none';
    document.getElementById('attack').style.display='none';
    document.getElementById('transport').style.display='none';
    document.getElementById('capture').style.display='none';
    document.getElementById('orderForm').style.display='none';
    document.getElementById('changePNameForm').style.display='none';
    document.getElementById('changePName').style.display='none';
    document.getElementById('refresh_res').style.display='none';
  },

  GetPlayerShips: async function(){
    var{getPlayerShips} =this.CryptoGalaxy.methods;
    var IDdict= await getPlayerShips().call({from:this.account}); 
    var str="";
    str += '<div class="pricingTable" onclick=App.GetShipInfo() style="cursor:pointer;"><div class="pricingTable-header"><h3 class="heading">Your</h3><span class="price-value">Ships</span></div><div class="pricing-content"><ul>'
    var ship_typeid_dict = {"0": "Corvette", "1": "Destroyer", "2": "Cruiser ", "3": "Battleship", "4": "Small transporter", "5": "Large transporter"}
    // // loc_y, loc_x, state, type_id, attack, shield, hull, speed, cargo, max_hull, rarity, num_of_treasure_install
    var state_dict={0:"null",1:"destroyed",2:"moving",3:"normal",4:"on sale"}
    for (var j=0;j<IDdict["ss_id"].length;j++)
    {
        str += "<li>ID: " + IDdict["ss_id"][j] +
        " Name: "+ IDdict["ss_name"][j]+
        " Rarity: " +IDdict["ss_data"][j][10]+
        " State: "+ state_dict[IDdict["ss_data"][j][2]]+
        " Type:" +ship_typeid_dict[IDdict["ss_data"][j][3]]+
        "</li>";
    }
    str+='</ul></div></div>'
    document.getElementById("fleetId").innerHTML=str;
  },

  GetPlayerTreasures: async function(){
    var{getPlayerTreasures} =this.CryptoGalaxy.methods;
    var IDdict= await getPlayerTreasures().call({from:this.account}); 
    var str = "";
    // old_effect_num(can check whether installed), on_sale, effect_type, effect_percent, rarity
    str += '<div class="pricingTable" onclick=App.GetTreasureInfo() style="cursor:pointer;"><div class="pricingTable-header"><h3 class="heading">Your</h3><span class="price-value">Treasures</span></div><div class="pricing-content"><ul>'
    for (var j=0;j<IDdict["ts_id"].length;j++)
    {
      str += "<li>ID: " + IDdict["ts_id"][j]+
        " Name: "+ IDdict["ts_name"][j]+
        " Effect_type: " +IDdict["ts_data"][j][2]+
        "</li>";
    }
    str+='</ul></div></div>'
    document.getElementById("treasureId").innerHTML=str;
  },

  GetPlayerOrders: async function(){
    var{getPlayerOrders} =this.CryptoGalaxy.methods;
    var IDdict= await getPlayerOrders().call({from:this.account}); 
    var str = "";
     // loc_y, loc_x, order_type, object_id, start_time, end_time, res[3]
    str += '<div class="pricingTable" onclick=App.GetOrderInfo() style="cursor:pointer;"><div class="pricingTable-header"><h3 class="heading">Your</h3><span class="price-value">Orders</span></div><div class="pricing-content"><ul>'
    var myDate=new Date();
    var order_type_dict={"1":"Build","2":"Transport","3":"Dispatch"};
    for (var j=0;j<IDdict["os_id"].length;j++)
    {
      str += "<li>ID: " + IDdict["os_id"][j] +"</br>"+
        " Start time: "+ new Date(parseInt(IDdict["os_data"][j][4])*1000)+"</br>"+
        " End time: " +new Date(parseInt(IDdict["os_data"][j][5])*1000)+"</br>"+
        " Order type: " +order_type_dict[IDdict["os_data"][j][2]]+"</br>";
      if(parseInt(IDdict["os_data"][j][5])>myDate.getTime()/1000)
        str+=" seconds left to execute:"+(parseInt(IDdict["os_data"][j][5])-myDate.getTime()/1000);
      else
        str+=" seconds left to execute:"+ "Has finished";
      str+="</li>";
    }
    str+='</ul></div></div>'
    document.getElementById("orderId").innerHTML=str;
  },

  GetPlayerSales: async function(){
    var{getSales} =this.CryptoGalaxy.methods;
    var IDdict= await getSales().call({from:this.account}); 
    var str = "";
    // sale_type, token_id, start_time, end_time, price
    str += '<div class="pricingTable" onclick=App.GetSaleInfo() style="cursor:pointer;"><div class="pricingTable-header"><h3 class="heading">All</h3><span class="price-value">Sales</span></div><div class="pricing-content"><ul>'
    for (var j=0;j<IDdict["sas_id"].length;j++)
    {
      str += "<li>ID: " + IDdict["sas_id"][j] +
        " Seller: "+IDdict["sas_seller"][j]
        "</li>";
    }
    str+='</ul></div></div>'
    document.getElementById("saleId").innerHTML=str;
    document.getElementById("create_sale").style.display='block';
  },

  GetPlayerBattleLogs: async function(){
    var{getPlayerBattleLogs} =this.CryptoGalaxy.methods;
    var IDdict= await getPlayerBattleLogs().call({from:this.account}); 
    var str = "";
    str += '<div class="pricingTable" onclick=App.GetBattleLogInfo() style="cursor:pointer;"><div class="pricingTable-header"><h3 class="heading">Your</h3><span class="price-value">BattleLogs</span></div><div class="pricing-content"><ul>'
    var result_dict={'1':"Attacker wins.",'2':"Defenser wins.",'3':"Draw."}
    for (var j=0;j<IDdict["bls_id"].length;j++)
    {
      str += "<li>ID: " + IDdict["bls_id"][j] +
        "</br>Result: "+ result_dict[IDdict["bls_result"][j]]+
        "</br>Attacker: " +IDdict["bls_at"][j]+
        "</br>Defencer: " +IDdict["bls_de"][j]+
        "</li>";
    }
    str+='</ul></div></div>'
    document.getElementById("battleLogId").innerHTML=str;
  },

  GetPlayerPlanets: async function(){
    var{getPlayerPlanets} =this.CryptoGalaxy.methods;
    var IDdict= await getPlayerPlanets().call({from:this.account}); 
    var str = "";
    str += '<div class="pricingTable" onclick=App.FindPlanetLocation() style="cursor:pointer;"><div class="pricingTable-header"><h3 class="heading">Your</h3><span class="price-value">Planets</span></div><div class="pricing-content"><ul>'
    for (var j=0;j<IDdict["ps_id"].length;j++)
    {
        str += "<li>ID: " + IDdict["ps_id"][j] +
        " Name: "+ IDdict["ps_name"][j]+
        " Resource type: " +IDdict["ps_data"][j][4]+
        " Location: ("+IDdict["ps_data"][j][1]+", "+IDdict["ps_data"][j][0]+")"+
        "</li>";
    }
    str+='</ul></div></div>'
    document.getElementById("planetId").innerHTML=str;
  },

  FindPlanetLocation: function(){
    var td = event.srcElement.innerHTML; 
    var lbracket=td.indexOf('(');
    var comma=td.indexOf(',');
    var rbracket=td.indexOf(')');
    var x=parseInt(td.slice(lbracket+1,comma));
    var y=parseInt(td.slice(comma+1,rbracket));
    this.GetPlanetInfo(x,y,1);
  },

  GetPlanetInfo: async function(x,y,from){
    var { getPlanetInfo} = this.CryptoGalaxy.methods;
    var infoDict = await getPlanetInfo(y,x).call({from:this.account});
    var str="";
    console.log(infoDict['data'][2]);
    str += '<div class="pricingTable"><div class="pricingTable-header"><img style="height:100px" src="assets/img/'
    switch(parseInt(infoDict['data'][2]))
            {
              case 0:str += "transparent.png";break;
              case 1:str += "1.png" ;break;
              case 2:str += "6.jpg";break;
              case 3:str += "3.png" ;break;
            }
    str+='"></div><div class="pricing-content"><ul>';
// loc_y, loc_x, planet_type, last_update_time, Resource type, res_gen_speed, current_res[3], max_res[3]
    var planet_typeid_dict = {"0": "Deep space, with nothing interesting", "1": "Unexplored planet, explorable", "2": "Unhabitable planet, produce minerals", "3": "Habitable planet, produce minerals and ships."}
    if(infoDict['data'][3]!='0')
    {
      str +="<li>Name: "+infoDict['name']+"</li>"+
      "<li>Owner: "+infoDict['owner']+"</li>"+
      "<li>Resource type: "+infoDict['data'][4]+"</li>"+
      "<li>Resource generate speed: "+infoDict['data'][5]+"</li>"+
      "<li>Current resources: "+infoDict['data'][6]+","+infoDict['data'][7]+","+infoDict['data'][8]+"</li>"+
      "<li>Max resources: "+infoDict['data'][9]+","+infoDict['data'][10]+","+infoDict['data'][11]+"</li>"+
      "<li>Last update: "+new Date(parseInt(infoDict['data'][3]*1000))+"</li>";
    }
    str+="<li>Type: "+ planet_typeid_dict[infoDict['data'][2]]+"</li>"+
    "<li>Location: ("+x+", "+y+")</li>"+
          "<li>Sector: "+parseInt(parseInt(y/10)*10+parseInt(x/10))+"</li>";
    
    str+='</ul></div></div>'
    //星球类型（getmap的值）1的才会出survey，类型2和3才会出transport，capture，类型3才会出build，move和battle常驻
    if(from==1)
    {  
      document.getElementById('move').style.display='block';
      document.getElementById('build').style.display='block';
      document.getElementById('attack').style.display='block';
      document.getElementById('transport').style.display='block';
      document.getElementById('capture').style.display='block';
      // document.getElementById('changePName').style.display='block';
      document.getElementById('refresh_res').style.display='block';
      document.getElementById('planetInfo').innerHTML=str;
      document.getElementById('planetInfo').style="block";
      document.getElementById('return_planet').style.display='block';
      document.getElementById('planetId').style.display='none';
      if(this.account==infoDict['owner'])
      {
        document.getElementById('changePName').style.display='block';
        $("#changePName").attr("onclick","App.Create_ChangePName_Form("+x+","+y+");");

      }

      $("#attack").attr("onclick","App.Battle("+x+","+y+");");
      $("#move").attr("onclick","App.Create_Order_Form("+1+","+x+","+y+");");
      $("#transport").attr("onclick","App.Create_Order_Form("+3+","+x+","+y+");");
      $("#build").attr("onclick","App.Create_Order_Form("+5+","+x+","+y+");");
      $("#attack").attr("onclick","App.Create_Order("+2+","+x+","+y+");");
      $("#capture").attr("onclick","App.Create_Order("+4+","+x+","+y+");");
      // $("#changePName").attr("onclick","App.Create_ChangePName_Form("+x+","+y+");");
      $("#refresh_res").attr("onclick","App.RefreshRes("+x+","+y+");");
    }
    else
    { 
      
      if(infoDict['data'][2]=='1'){
        $("#surveyInTable").attr("onclick","App.Create_OrderInTable("+6+","+x+","+y+");");
        document.getElementById('surveyInTable').style.display='block';
      };
      if(infoDict['data'][2]=='2'||infoDict['data'][2]=='3'){
        document.getElementById('transportInTable').style.display='block';
        $("#transportInTable").attr("onclick","App.Create_Order_FormInTable("+3+","+x+","+y+");");
        $("#captureInTable").attr("onclick","App.Create_OrderInTable("+4+","+x+","+y+");");
        document.getElementById('captureInTable').style.display='block';
        document.getElementById('refresh_resInTable').style.display='block';
        $("#refresh_resInTable").attr("onclick","App.RefreshRes("+x+","+y+");");
      };
      if(infoDict['data'][2]=='3')
      {
        $("#buildInTable").attr("onclick","App.Create_Order_FormInTable("+5+","+x+","+y+");");
        document.getElementById('buildInTable').style.display='block';
      }
      document.getElementById('attackInTable').style.display='block';
      document.getElementById('moveInTable').style.display='block';
      if(this.account==infoDict['owner'])
      {
        document.getElementById('changePNameInTable').style.display='block';
        $("#changePNameInTable").attr("onclick","App.Create_ChangePName_FormInTable("+x+","+y+");");
      }      
      $("#attackInTable").attr("onclick","App.Create_OrderInTable("+2+","+x+","+y+");");
      $("#moveInTable").attr("onclick","App.Create_Order_FormInTable("+1+","+x+","+y+");");
      document.getElementById('planetInfoInTable').innerHTML=str;
      document.getElementById('planetInfoInTable').style="block";
    }

  },

  GetShipInfo: async function(){
    var id = (event.srcElement.innerHTML); 
    var index=id.indexOf("Name:");
    id= parseInt(id.slice(3,index-1));
    var{getShipInfo} =this.CryptoGalaxy.methods;
    var infoDict= await getShipInfo(id).call({from:this.account}); 
    var str="";
    str += '<div class="pricingTable"><div class="pricingTable-header"><img style="height:100px" src="assets/img/ship.jpg"></div><div class="pricing-content"><ul>'
    // loc_y, loc_x, state, type_id, attack, shield, hull, speed, cargo, max_hull, rarity, num_of_treasure_install
        // state 0-null 1-destroyed 2-moving 3-normal 4-onsale
    var state_dict={0:"null",1:"destroyed",2:"moving",3:"normal",4:"on sale"}
    var ship_typeid_dict = {"0": "Small ship with fastest speed.", "1": "Small ship with powerful weapon and better defence.", "2": "Middle size ship with widely usage.", "3": "Large ship, strong but slow", "4": "Small ship that use to transfer minerals", "5": "Large ship that can transfer much more minerals, but slow"}
    str +="<li>Name: "+infoDict['name']+"</li>"+
    "<li>Owner: "+infoDict['owner']+"</li>"+
    "<li>Type: "+ship_typeid_dict[infoDict['data'][3]]+"</li>"+
    "<li>State: "+state_dict[infoDict['data'][2]]+"</li>"+
    "<li>Rarity: "+infoDict['data'][10]+"</li>"+
    "<li>Location: ("+infoDict['data'][1]+","+infoDict['data'][0]+") </li>"+
    "<li>Speed: "+infoDict['data'][7]+"</li>"+
    "<li>Attack: "+infoDict['data'][4]+"</li>"+
    "<li>Shield: "+infoDict['data'][5]+"</li>"+
    "<li>Cargo: "+infoDict['data'][8]+"</li>"+
    "<li>Number of installed treasures: "+infoDict['data'][11]+"</li>"+
    "<li>Max hull: "+infoDict['data'][9]+"</li>";
    str+='</ul></div></div>'
    document.getElementById('fleetInfo').innerHTML=str;
    document.getElementById('fleetId').style.display='none';
    document.getElementById('fleetInfo').style.display='block';
    document.getElementById('return_fleet').style.display='block';
    document.getElementById('changeSName').style.display='block';
    $("#changeSName").attr("onclick","App.Create_ChangeSName_Form("+id+");");
  },

  GetTreasureInfo: async function(){
    var id = (event.srcElement.innerHTML); 
    var index=id.indexOf("Name:");
    id= parseInt(id.slice(3,index-1));
    var{getTreasureInfo} =this.CryptoGalaxy.methods;
    var infoDict= await getTreasureInfo(id).call({from:this.account}); 
    var str="";
     // old_effect_num(can check whether installed), on_sale, effect_type, effect_percent, rarity
    str += '<div class="pricingTable"><div class="pricingTable-header"><img style="height:100px" src="assets/img/treasure.jpg"></div><div class="pricing-content"><ul>'
    str +=  "<li>ID: "+id+"</li>";
    str +="<li>Name: "+infoDict['name']+"</li>"+
    "<li>Owner: "+infoDict['owner']+"</li>";
    if(infoDict['data'][0]!=0)
    {
      str+="<li>Installed: "+'Yes'+"</li>";
      document.getElementById('uninstall').style.display='block';
      $("#uninstall").attr("onclick","App.UninstallTreasure("+id+");");
    }
    else{
      str+="<li>Installed: "+'No'+"</li>";
      $("#install").attr("onclick","App.Create_InstallTreasure_Form();");
      document.getElementById('install').style.display='block';
      $("#install_form_submit").attr("onclick","App.InstallTreasure("+id+");");
      
    }
    str +="<li>On sale: "+infoDict['data'][1]+"</li>"+
    "<li>Effect type: "+infoDict['data'][2]+"</li>"+
    "<li>Effect_percent: "+infoDict['data'][3]+"</li>"+
    "<li>Rarity: "+infoDict['data'][4]+"</li>";
    str+='</ul></div></div>'
    document.getElementById('treasureInfo').innerHTML=str;
    document.getElementById('treasureId').style.display='none';
    document.getElementById('treasureInfo').style.display='block';
    document.getElementById('return_treasure').style.display='block';
  },

  GetSaleInfo: async function(){
    var id = (event.srcElement.innerHTML); 
    var index=id.indexOf("Seller:");
    
    id= parseInt(id.slice(3,index-1));
    var{getSaleInfo} =this.CryptoGalaxy.methods;
    
    var infoDict= await getSaleInfo(id).call({from:this.account}); 
    var str="";
    // sale_type, token_id, start_time, end_time, price
    // sale_type: 0-null 1-ship 2-treasure
    var sale_type_dict={'0':"Null",'1':"Ship",'2':"Treasure"};
    str += '<div class="pricingTable"><div class="pricingTable-header"><img style="height:100px" src="assets/img/sale.jpg"></div><div class="pricing-content"><ul>'
    str +=
    "<li>Token id: "+infoDict['data'][1]+"</li>"+
    "<li>Sale id: "+id+"</li>"+
    "<li>Seller: "+infoDict['seller']+"</li>"+
    "<li>Sale type: "+sale_type_dict[infoDict['data'][0]]+"</li>"+
    "<li>Price: "+parseFloat(infoDict['data'][4])/(1000000000000000000.0)+" ether</li>"+
    "<li>End time: "+new Date(parseInt(infoDict['data'][3])*1000)+"</li>"+
    "<li>Start time: "+new Date(parseInt(infoDict['data'][2])*1000)+"</li>";
    str+='</ul></div></div>'
    $("#buy_sale").attr("onclick","App.Accept_Sale("+id+","+infoDict['data'][4]+");");
    document.getElementById('saleInfo').innerHTML=str;
    document.getElementById('saleId').style.display='none';
    document.getElementById('saleInfo').style.display='block';
    document.getElementById('return_sale').style.display='block';
    document.getElementById('create_sale').style.display='none';
    document.getElementById('view_sale_item').style.display='block';
    if(this.account!=infoDict['seller'])
    {
      document.getElementById('buy_sale').style.display='block';
    }
    $("#view_sale_item").attr("onclick","App.ViewSaleItem("+infoDict['data'][0]+','+infoDict['data'][1]+','+id+");");
    
  },

  GetSaleInfoByID: async function(id){
    var{getSaleInfo} =this.CryptoGalaxy.methods;
    var infoDict= await getSaleInfo(id).call({from:this.account}); 
    var str="";
    // sale_type, token_id, start_time, end_time, price
    // sale_type: 0-null 1-ship 2-treasure
    var sale_type_dict={'0':"Null",'1':"Ship",'2':"Treasure"};
    str += '<div class="pricingTable"><div class="pricingTable-header"><img style="height:100px" src="assets/img/sale.jpg"></div><div class="pricing-content"><ul>'
    str +=
    "<li>Token id: "+infoDict['data'][1]+"</li>"+
    "<li>Sale id: "+id+"</li>"+
    "<li>Seller: "+infoDict['seller']+"</li>"+
    "<li>Sale type: "+sale_type_dict[infoDict['data'][0]]+"</li>"+
    "<li>Price: "+parseFloat(infoDict['data'][4])/(1000000000000000000.0)+" ether</li>"+
    "<li>End time: "+new Date(parseInt(infoDict['data'][3])*1000)+"</li>"+
    "<li>Start time: "+new Date(parseInt(infoDict['data'][2])*1000)+"</li>";
    str+='</ul></div></div>'
    $("#buy_sale").attr("onclick","App.Accept_Sale("+id+","+infoDict['data'][4]+");");
    document.getElementById('saleInfo').innerHTML=str;
    document.getElementById('saleId').style.display='none';
    document.getElementById('saleInfo').style.display='block';
    document.getElementById('return_sale').style.display='block';
    document.getElementById('create_sale').style.display='none';
    document.getElementById('view_sale_item').style.display='block';
    if(this.account!=infoDict['seller'])
    {
      document.getElementById('buy_sale').style.display='block';
    }
    $("#view_sale_item").attr("onclick","App.ViewSaleItem("+infoDict['data'][0]+','+infoDict['data'][1]+','+id+");");
    $("#return_sale").attr("onclick","App.ReturnSaleInfoWindow();");
  },

  ViewSaleItem: async function(type,id,sale_id){
    document.getElementById('view_sale_item').style.display='none';
    if(type=='1')
    {
      var{getShipInfo} =this.CryptoGalaxy.methods;
      var infoDict= await getShipInfo(id).call({from:this.account}); 
      var str="";
      str += '<div class="pricingTable"><div class="pricingTable-header"><img style="height:100px" src="assets/img/ship.jpg"></div><div class="pricing-content"><ul>'
      // loc_y, loc_x, state, type_id, attack, shield, hull, speed, cargo, max_hull, rarity, num_of_treasure_install
          // state 0-null 1-destroyed 2-moving 3-normal 4-onsale
      var state_dict={0:"null",1:"destroyed",2:"moving",3:"normal",4:"on sale"}
      var ship_typeid_dict = {"0": "Small ship with fastest speed.", "1": "Small ship with powerful weapon and better defence.", "2": "Middle size ship with widely usage.", "3": "Large ship, strong but slow", "4": "Small ship that use to transfer minerals", "5": "Large ship that can transfer much more minerals, but slow"}
      str +="<li>Name: "+infoDict['name']+"</li>"+
      "<li>Owner: "+infoDict['owner']+"</li>"+
      "<li>Type: "+ship_typeid_dict[infoDict['data'][3]]+"</li>"+
      "<li>State: "+state_dict[infoDict['data'][2]]+"</li>"+
      "<li>Rarity: "+infoDict['data'][10]+"</li>"+
      "<li>Location: ("+infoDict['data'][1]+","+infoDict['data'][0]+") </li>"+
      "<li>Speed: "+infoDict['data'][7]+"</li>"+
      "<li>Attack: "+infoDict['data'][4]+"</li>"+
      "<li>Shield: "+infoDict['data'][5]+"</li>"+
      "<li>Cargo: "+infoDict['data'][8]+"</li>"+
      "<li>Number of installed treasures: "+infoDict['data'][11]+"</li>"+
      "<li>Max hull: "+infoDict['data'][9]+"</li>";
      str+='</ul></div></div>'
    }
    else
    {
        var{getTreasureInfo} =this.CryptoGalaxy.methods;
        var infoDict= await getTreasureInfo(id).call({from:this.account}); 
        var str="";
          // old_effect_num(can check whether installed), on_sale, effect_type, effect_percent, rarity
        str += '<div class="pricingTable"><div class="pricingTable-header"><img style="height:100px" src="assets/img/treasure.jpg"></div><div class="pricing-content"><ul>'
        str +=  "<li>ID: "+id+"</li>";
        str +="<li>Name: "+infoDict['name']+"</li>"+
        "<li>Owner: "+infoDict['owner']+"</li>";
        if(infoDict['data'][0]!=0)
        {
          str+="<li>Installed: "+'Yes'+"</li>";
          document.getElementById('uninstall').style.display='block';
          $("#uninstall").attr("onclick","App.UninstallTreasure("+id+");");
        }
        else{
          str+="<li>Installed: "+'No'+"</li>";
          $("#install").attr("onclick","App.Create_InstallTreasure_Form();");
          document.getElementById('install').style.display='block';
          $("#install_form_submit").attr("onclick","App.InstallTreasure("+id+");");
          
        }
        str +="<li>On sale: "+infoDict['data'][1]+"</li>"+
        "<li>Effect type: "+infoDict['data'][2]+"</li>"+
        "<li>Effect_percent: "+infoDict['data'][3]+"</li>"+
        "<li>Rarity: "+infoDict['data'][4]+"</li>";
        str+='</ul></div></div>'
    }
    document.getElementById('saleInfo').innerHTML=str;
    $("#return_sale").attr("onclick","App.GetSaleInfoByID("+sale_id+");");
  },

  GetBattleLogInfo: async function(){
    var id = (event.srcElement.innerHTML); 
    var index=id.indexOf("Result:");
    id= parseInt(id.slice(3,index-1));
    var{getBattleLogInfo} =this.CryptoGalaxy.methods;
    var infoDict= await getBattleLogInfo(id).call({from:this.account}); 
    var str="";
    str += '<div class="pricingTable"><div class="pricingTable-header">';
    var winner="";
    switch(infoDict['data'][2])
    {
      case '1':winner="Attacker wins!";break;
      case '2':winner="Defenser wins!";break;
      case '3':winner="Draw";break;
    }
    str+='<h3 class="heading">'+winner+'</h3>';
    str+='<span class="price-new-value"><span class="tag">Attacker:&emsp;&emsp;&emsp;</span><span class="content">'+infoDict['at']+'</span></br>'
        +'<span class="tag">Defencer:&emsp;&emsp;&emsp;</span><span class="content">'+infoDict['de']+'</span></br>'
        +'<span class="tag">Number of rounds:&emsp;&emsp;&emsp;</span><span class="content">'+infoDict['data'][3]+'</span></br>'
        +'<span class="tag">Location:&emsp;&emsp;&emsp;</span><span class="content">('+infoDict['data'][1] +","+infoDict['data'][0]+')</span></br>'
        +'<span class="tag">Time:&emsp;&emsp;&emsp;</span><span class="content">'+new Date(parseInt(infoDict['data'][4])*1000)+'</span></br>'
        +'<span class="tag">Attacker\'s init ships:&emsp;&emsp;&emsp;</span><span class="content">'+infoDict['stage_sids'][0][0].length+'</span></br>'
        +'<span class="tag">Defencer\'s init ships:&emsp;&emsp;&emsp;</span><span class="content">'+infoDict['stage_sids'][0][1].length+'</span>';
    str+='</div><div class="pricing-content"><ul>';
    for (var j=1;j<=parseInt(infoDict["data"][3]);j++)
    {
      str+='Round '+j
         +'<li>Attacker</br> Remaining ships:'+infoDict['stage_sids'][j][0].length
         +'</br>Total attack/total absorption/total endurance: ' +infoDict['detail'][j][0][0]+'/'+infoDict['detail'][j][0][1]+'/'+infoDict['detail'][j][0][2]+'</br>'
         +'Defenser</br> Remaining ships:'+infoDict['stage_sids'][j][1].length
         +'</br>Total attack/total absorption/total endurance: ' +infoDict['detail'][j][1][0]+'/'+infoDict['detail'][j][1][1]+'/'+infoDict['detail'][j][1][2]+'</br></li>'
    }
    str+='</ul></div></div>'
    document.getElementById('battleLogInfo').innerHTML=str;
    document.getElementById('battleLogId').style.display='none';
    document.getElementById('battleLogInfo').style.display='block';
    document.getElementById('return_battleLog').style.display='block';
  },

  GetOrderInfo: async function(){
    var id = (event.srcElement.innerHTML); 
    var index=id.indexOf("Start time:");
    id= parseInt(id.slice(3,index-1));
    var{getOrderInfo} =this.CryptoGalaxy.methods;
    var infoDict= await getOrderInfo(id).call({from:this.account}); 
    var str="";
    var order_type_dict={"1":"Build","2":"Transport","3":"Dispatch"};
    // loc_y, loc_x, order_type, object_id, start_time, end_time, res[3]
    str += '<div class="pricingTable"><div class="pricingTable-header"><img style="height:100px" src="assets/img/order.jpg"></div><div class="pricing-content"><ul>'
    str +="<li>Player: "+infoDict['player']+"</li>"+
    "<li>Order type: "+order_type_dict[infoDict['data'][2]]+"</li>"+
    "<li>Location: ("+infoDict['data'][1]+","+infoDict['data'][0]+") </li>"+
    "<li>Order id: "+id+"</li>"+
    "<li>Object id: "+infoDict['data'][3]+"</li>"+
    "<li>Start time: "+new Date(parseInt(infoDict['data'][4])*1000)+"</li>"+
    "<li>End time: "+new Date(parseInt(infoDict['data'][5])*1000)+"</li>";
    str+="<li>resource: ";
    for(var i=0;i<2;i++)
    {
      str+=infoDict['data'][6+i]+",";
    }
    str+=infoDict['data'][8]+"</li>";
    str+='</ul></div></div>'
    document.getElementById('orderInfo').innerHTML=str;
    document.getElementById('orderId').style.display='none';
    document.getElementById('orderInfo').style.display='block';
    document.getElementById('return_order').style.display='block';
    var myDate=new Date();
    if(infoDict['player']==this.account && (parseInt(infoDict['data'][5])>myDate.getTime()/1000))
    {
      document.getElementById('withdrawOrder').style.display='block';
      $("#withdrawOrder").attr("onclick","App.WithdrawOrder("+id+");");
    }

  },


  Create_Sale_Form: async function(){
    document.getElementById('saleForm').style.display='block';
    document.getElementById('saleId').style.display='none';
    document.getElementById('create_sale').style.display='none';
  },

  Create_ChangePName_Form: async function(x,y){
    document.getElementById('changePNameForm').style.display='block';
    document.getElementById('planetInfo').style.display='none';
    document.getElementById('move').style.display='none';
    document.getElementById('build').style.display='none';
    document.getElementById('attack').style.display='none';
    document.getElementById('transport').style.display='none';
    document.getElementById('capture').style.display='none';
    document.getElementById('changePName').style.display='none';
    document.getElementById('refresh_res').style.display='none';
    $("#changePName_form_submit").attr("onclick","App.ChangePName("+x+","+y+");");
  },

  Create_ChangePName_FormInTable: async function(x,y){
    document.getElementById('changePNameFormInTable').style.display='block';
    document.getElementById('planetInfoInTable').style.display='none';
    document.getElementById('moveInTable').style.display='none';
    document.getElementById('buildInTable').style.display='none';
    document.getElementById('attackInTable').style.display='none';
    document.getElementById('transportInTable').style.display='none';
    document.getElementById('captureInTable').style.display='none';
    document.getElementById('changePNameInTable').style.display='none';
    document.getElementById('refresh_resInTable').style.display='none';
    $("#changePName_form_submitInTable").attr("onclick","App.ChangePNameInTable("+x+","+y+");");
  },

  Create_ChangeSName_Form: async function(id){
    document.getElementById('changeSNameForm').style.display='block';
    document.getElementById('changeSName').style.display='none';
    document.getElementById('fleetInfo').style.display='none';
    $("#changeSName_form_submit").attr("onclick","App.ChangeSName("+id+");");
  },

  Create_InstallTreasure_Form:async function(){
    document.getElementById('installForm').style.display='block';
    document.getElementById('treasureInfo').style.display='none';
    document.getElementById('install').style.display='none';
  },

  Create_Order_Form: async function(type,x,y){
    
    var str="";
    switch(type){
      case 1:
        {
            str+="<label>Ship ID</label>";
            str+='<input type="text"  name="ship_id" placeholder="Fill out which ship you want to move">';
            document.getElementById('order_form_content').innerHTML=str;
            break;
        }
      case 3:
        {
          str+="<label>Ship ID</label>";
          str+='<input type="text"  name="ship_id" placeholder="Fill out which ship you want to move">';
          str+="<label>Resource</label>";
          str+='<input type="text"  name="res" placeholder="Fill out how many resources you want to bring(e.g. 0,0,0)">';
          document.getElementById('order_form_content').innerHTML=str;
          break;
        }
      case 5:
        {
          var Info_list=await this.GetShipTemplateInfo();
          str+="<label>Ship Template ID</label>";
          str+='<select id="stid" name="stid" onchange="App.ChangeTemplateInfo()">';
          for( var i=0;i<=5;i++)
          {
            str+='<option value='+i+'>'+Info_list[i]["name"]+'</option>';
          }
          str+='</select>';
          str+='<p id="ShipTplInfo"></p>'
          var InfoDict=Info_list[0];
          var str2="";
          str2 += '<div><ul>'
          str2 += "<li>attack: " + InfoDict["data"][0] +
          "<li>shield: " + InfoDict["data"][1] +
          "<li>hull: " + InfoDict["data"][2] +
          "<li>speed: " + InfoDict["data"][3] +
          "<li>cargo: " + InfoDict["data"][4] +
          "<li>build time: " + InfoDict["data"][5] +
          "<li>build resources: " + InfoDict["data"][6] +","+InfoDict["data"][7] +","+InfoDict["data"][8]+
          "</li>";
          str2+='</ul></div>';
          document.getElementById('order_form_content').innerHTML=str;
          document.getElementById('ShipTplInfo').innerHTML=str2;
          break;
        }
    }
    $("#order_form_submit").attr("onclick","App.Create_Order("+type+","+x+","+y+");");
    {
      document.getElementById('orderForm').style.display='block';
      document.getElementById('planetId').style.display='none';
      document.getElementById('planetInfo').style.display='none';
      document.getElementById('move').style.display='none';
      document.getElementById('build').style.display='none';
      document.getElementById('attack').style.display='none';
      document.getElementById('transport').style.display='none';
      document.getElementById('capture').style.display='none';
      document.getElementById('changePName').style.display='none';
      document.getElementById('refresh_res').style.display='none';
    }
  },

  Create_Order_FormInTable: async function(type,x,y){
    var str="";
    switch(type){
      case 1:
        {
            str+="<label>Ship ID</label>";
            str+='<input type="text"  name="ship_id" placeholder="Fill out which ship you want to move">';
            document.getElementById('order_form_contentInTable').innerHTML=str;
            break;
        }
      case 3:
        {
          str+="<label>Ship ID</label>";
          str+='<input type="text"  name="ship_id" placeholder="Fill out which ship you want to move">';
          str+="<label>Resource</label>";
          str+='<input type="text"  name="res" placeholder="Fill out how many resources you want to bring(e.g. 0,0,0)">';
          document.getElementById('order_form_contentInTable').innerHTML=str;
          break;
        }
      case 5:
        {
          var Info_list=await this.GetShipTemplateInfo();
          str+="<label>Ship Template ID</label>";
          str+='<select id="stid" name="stid" onchange="App.ChangeTemplateInfo()">';
          for( var i=0;i<=5;i++)
          {
            str+='<option value='+i+'>'+Info_list[i]["name"]+'</option>';
          }
          str+='</select>';
          str+='<p id="ShipTplInfoInTable"></p>'
          var InfoDict=Info_list[0];
          var str2="";
          str2 += '<div><ul>'
          str2 += "<li>attack: " + InfoDict["data"][0] +
          "<li>shield: " + InfoDict["data"][1] +
          "<li>hull: " + InfoDict["data"][2] +
          "<li>speed: " + InfoDict["data"][3] +
          "<li>cargo: " + InfoDict["data"][4] +
          "<li>build time: " + InfoDict["data"][5] +
          "<li>build resources: " + InfoDict["data"][6] +
          "</li>";
          str2+='</ul></div>';
          document.getElementById('order_form_contentInTable').innerHTML=str;
          document.getElementById('ShipTplInfoInTable').innerHTML=str2;
          break;
        }
    }
    $("#order_form_submitInTable").attr("onclick","App.Create_OrderInTable("+type+","+x+","+y+");");
    document.getElementById('orderFormInTable').style.display='block';
    document.getElementById('planetInfoInTable').style.display='none';
    document.getElementById('moveInTable').style.display='none';
    document.getElementById('buildInTable').style.display='none';
    document.getElementById('attackInTable').style.display='none';
    document.getElementById('transportInTable').style.display='none';
    document.getElementById('captureInTable').style.display='none';
    document.getElementById('surveyInTable').style.display='none';
    document.getElementById('changePNameFormInTable').style.display='none';
    document.getElementById('changePNameInTable').style.display='none';
    document.getElementById('refresh_resInTable').style.display='none';
  },

  Create_Order:async function(type,x,y){
    this.GetPlanetInfo(x,y,1);
    switch(type)
    {
      case 1:
        {
          var object_id=orderform.ship_id.value;
          var{createMoveOrder}=this.CryptoGalaxy.methods;
          document.getElementById('orderForm').style.display='none';
          await createMoveOrder(y,x,object_id).send({from:this.account});
          alert("Move order created!");
          break;
        }
      case 2:
        {
          var{battle}=this.CryptoGalaxy.methods;
          await battle(y,x,this.account).send({from:this.account});
          alert("Battle finished!");
          break;
        }
      case 3:
        {
          var object_id=orderform.ship_id.value;
          var res=orderform.res.value.split(',');
          var{createTransOrder}=this.CryptoGalaxy.methods;
          document.getElementById('orderForm').style.display='none';
          await createTransOrder(y,x,object_id,res).send({from:this.account});
          alert("Transport order created!");
          break;
        }
      case 4:
        {
          var{capture}=this.CryptoGalaxy.methods;
          await capture(y,x).send({from:this.account});
          alert("Capture finished!");
          break;
        }
      case 5:
        {
          var object_id=orderform.stid.value;
          var{createBuildOrder}=this.CryptoGalaxy.methods;
          document.getElementById('orderForm').style.display='none';
          await createBuildOrder(y,x,object_id).send({from:this.account});
          alert("Build order created!");
        }              
    }
  },

  Create_OrderInTable:async function(type,x,y){
    this.GetPlanetInfo(x,y,2);
    switch(type)
    {
      case 1:
        {
          var object_id=orderformInTable.ship_id.value;
          var{createMoveOrder}=this.CryptoGalaxy.methods;
          document.getElementById('orderFormInTable').style.display='none';
          await createMoveOrder(y,x,object_id).send({from:this.account});
          alert("Move order created!");
          break;
        }
      case 2:
        {
          var{battle}=this.CryptoGalaxy.methods;
          await battle(y,x,this.account).send({from:this.account});
          alert("Battle finished!");
          break;
        }
      case 3:
        {
          var object_id=orderformInTable.ship_id.value;
          var res=orderformInTable.res.value.split(',');
          var{createTransOrder}=this.CryptoGalaxy.methods;
          document.getElementById('orderFormInTable').style.display='none';
          await createTransOrder(y,x,object_id,res).send({from:this.account});
          alert("Transport order created!");
          break;
        }
      case 4:
        {
          var{capture}=this.CryptoGalaxy.methods;
          await capture(y,x).send({from:this.account});
          alert("Capture finished!");
          break;
        }
      case 5:
        {
          var object_id=orderformInTable.stid.value;
          var{createBuildOrder}=this.CryptoGalaxy.methods;
          document.getElementById('orderFormInTable').style.display='none';
          await createBuildOrder(y,x,object_id).send({from:this.account});
          alert("Build order created!");
          break;
        }
      case 6:
        {
          var{survey}=this.CryptoGalaxy.methods;
          await survey(y,x).send({from:this.account});
          alert("Survey finished!");
          break;
       }          
          
    }
      

  },


  Create_Sale: async function(){
    var sale_type=saleform.sale_type.value;
    var id= saleform.sale_id.value;
    var price=parseInt(parseFloat(saleform.sale_price.value) * 1000000000000000000.0);
    var{createSale} =this.CryptoGalaxy.methods;
    document.getElementById('saleForm').style.display='none';
    document.getElementById('saleId').style.display='block';
    document.getElementById('create_sale').style.display='block';
    await createSale(sale_type,id,price).send({from:this.account});
  },

  Accept_Sale: async function(id,price){
    var {acceptSale}=this.CryptoGalaxy.methods;
    await acceptSale(id).send({from:this.account,value:price});
    alert("Buy successfully!");
  },


  Battle: async function(x,y){
    var{battle} =this.CryptoGalaxy.methods;
    await battle(y,x,this.account).send({from:this.account});
  },

  CheckPlExt: async function(){
    var{checkPlExt} = this.CryptoGalaxy.methods;
    var flag=await checkPlExt().call({from:this.account}); 
    if(flag==false)
    {
      $("#joingame").attr("onclick","App.JoinGame();");
    }
  },

  JoinGame: async function(){
    var{joinGame} =this.CryptoGalaxy.methods;
    await joinGame().send({from:this.account});
    alert("Join game successfully!");
  },

  CreateMoveOrder: async function(x,y){
    var{createMoveOrder} =this.CryptoGalaxy.methods;
    await createMoveOrder(y,x,s_id).send({from:this.account});
    alert("Create move order successfully!");
  },

  GetShipTemplateInfo:async function(){
    var{getShipTemplateInfo}=this.CryptoGalaxy.methods;
    var res_list=new Array();
    for(var stid=0;stid<=5;stid++)
    {
      var InfoDict=await getShipTemplateInfo(stid).call({from:this.account});
      res_list.push(InfoDict);
    }
    return res_list;
  },

  ChangeTemplateInfo: async function(){
    var{getShipTemplateInfo}=this.CryptoGalaxy.methods;
    var InfoDict=await getShipTemplateInfo(orderform.stid.value).call({from:this.account});
    var str="";
    str += '<div><ul>'
    // attack, shield, hull, speed, cargo, build_time, build_res[3]
    str += "<li>attack: " + InfoDict["data"][0] +
    "<li>shield: " + InfoDict["data"][1] +
    "<li>hull: " + InfoDict["data"][2] +
    "<li>speed: " + InfoDict["data"][3] +
    "<li>cargo: " + InfoDict["data"][4] +
    "<li>build time: " + InfoDict["data"][5] +" s" +
    "<li>build resources: " + InfoDict["data"][6] +','+InfoDict["data"][7]+','+InfoDict["data"][8]+
    "</li>";
    str+='</ul></div>'
    document.getElementById('ShipTplInfo').innerHTML=str;
  },

  ChangeTemplateInfoInTable: async function(){
    var{getShipTemplateInfo}=this.CryptoGalaxy.methods;
    var InfoDict=await getShipTemplateInfo(orderformInTable.stid.value).call({from:this.account});
    var str="";
    str += '<div><ul>'
    // attack, shield, hull, speed, cargo, build_time, build_res[3]
    str += "<li>attack: " + InfoDict["data"][0] +
    "<li>shield: " + InfoDict["data"][1] +
    "<li>hull: " + InfoDict["data"][2] +
    "<li>speed: " + InfoDict["data"][3] +
    "<li>cargo: " + InfoDict["data"][4] +
    "<li>build time: " + InfoDict["data"][5] + " s"+
    "<li>build resources: " + + InfoDict["data"][6] +','+InfoDict["data"][7]+','+InfoDict["data"][8]+
    "</li>";
    str+='</ul></div>'
    document.getElementById('ShipTplInfoInTable').innerHTML=str;
  },

  RefreshOrder:async function(){
    var{refreshOrder}=this.CryptoGalaxy.methods;
    await refreshOrder().send({from:this.account});
    alert("Refresh successfully!");
  },

  RefreshRes:async function(x,y){
    var{refreshRes}=this.CryptoGalaxy.methods;
    await refreshRes(y,x).send({from:this.account});
    alert("Refresh successfully!");
  },


  InstallTreasure: async function(tid){
    var sid=installform.ship_id.value;
    var{installTreasure}=this.CryptoGalaxy.methods;
    document.getElementById('installForm').style.display='none';
    document.getElementById('treasureInfo').style.display='block';
    await installTreasure(sid,tid).send({from:this.account});

    alert("Install successfully!");
  },

  UninstallTreasure: async function(tid){

    var{uninstallTreasure}=this.CryptoGalaxy.methods;
    await uninstallTreasure(tid).send({from:this.account});
    alert("Uninstall successfully!");
  },

  ChangePName:async function(x,y){
    var name=changePNameform.planet_name.value;
    var {setPName}=this.CryptoGalaxy.methods;
    document.getElementById('changePNameForm').style.display='none';
    document.getElementById('planetInfo').style.display='block';
    document.getElementById('move').style.display='block';
    document.getElementById('build').style.display='block';
    document.getElementById('attack').style.display='block';
    document.getElementById('transport').style.display='block';
    document.getElementById('capture').style.display='block';
    document.getElementById('changePName').style.display='block';
    await setPName(y,x,name).send({from:this.account});
    alert("Set Name successfully!");
  },

  ChangePNameInTable:async function(x,y){
    var name=changePNameformInTable.planet_name.value;
    var {setPName}=this.CryptoGalaxy.methods;
    document.getElementById('changePNameFormInTable').style.display='none';
    document.getElementById('planetInfoInTable').style.display='block';
    document.getElementById('moveInTable').style.display='block';
    document.getElementById('buildInTable').style.display='block';
    document.getElementById('attackInTable').style.display='block';
    document.getElementById('transportInTable').style.display='block';
    document.getElementById('captureInTable').style.display='block';
    document.getElementById('changePNameInTable').style.display='block';
    await setPName(y,x,name).send({from:this.account});
    alert("Set Name successfully!");
  },

  ChangeSName:async function(id){
    var name=changeSNameform.ship_name.value;
    var {setSName}=this.CryptoGalaxy.methods;
    document.getElementById('changeSNameForm').style.display='none';
    document.getElementById('fleetInfo').style.display='block';
    document.getElementById('changeSName').style.display='block';
    await setSName(id,name).send({from:this.account});
    alert("Set Name successfully!");
  },

  WithdrawOrder:async function(id){
    var { withdrawOrder}=this.CryptoGalaxy.methods;
    document.getElementById('withdrawOrder').style.display='none';
    await withdrawOrder(id).send({from:this.account});
    alert("Withdraw Order successfully!");
  },

  GetFreeShip:async function(){
    var {checkFT}=this.CryptoGalaxy.methods;
    var last_time=await checkFT().call({from:this.account});
    var myDate=new Date();
    var next_time=new Date((parseInt(last_time)+86400)*1000);
    if(parseInt(last_time)+86400>myDate.getTime()/1000)
    {
      alert("It's not time yet! Next time should be:\n"+next_time);
    }
    else
    {
      var {getFreeShip}=this.CryptoGalaxy.methods;
      await getFreeShip().send({from:this.account});
      alert("You've got a new ship!")
    }
  },

  CheckApproval:async function(){
    var {checkApproval}=this.CryptoGalaxy.methods;
    await checkApproval().send({from:this.account});
    alert("The balance has been deposited in your wallet.");
  },

};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
