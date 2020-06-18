// Copyrights(c) 2020 Zhou Le, Tang Jingyao

// Course project of EE357 spring semester, 2020, Shanghai JiaoTong University

// The contract source file of game "Crypto Galaxy"

// ONLY used for research and study

// Version 1.0.0

pragma solidity >=0.4.22 <0.5.2;
pragma experimental ABIEncoderV2;



contract Random {
    uint saltForRandom;

    function _rand() internal returns (uint) {
        uint lastBlockNumber = block.number; // block.number - 1
        uint hashVal = uint(blockhash(lastBlockNumber));
        uint factor = 1157920892373161954235709850086879078532699846656405640394575840079131296399;
        saltForRandom += uint(msg.sender) % 100 + uint(uint(hashVal) / factor);
        return saltForRandom;
    }

    function _randRange(uint min, uint max) internal returns (uint) {
        return uint256(keccak256(abi.encode(_rand(), now))) % (max - min + 1) + min;
    }

    function _randChance(uint percent) internal returns (bool) {
        return _randRange(0, 100) < percent;
    }
}

contract GalaxyStorage is Random {
    
    struct Planet {
        string name;
        address owner;
        uint pid;
        // data
        // loc_y, loc_x, planet_type, last_update_time, res_type, res_gen_speed, current_res[3], max_res[3]
        uint[12] data;
    }
    
    struct ShipTemplate {
        string name;
        // data
        // attack, shield, hull, speed, cargo, build_time, build_res[3]
        uint[9] data;
    }
    
    struct Ship {
        string name;
        address owner;
        uint sid;
        // data
        // loc_y, loc_x, state, type_id, attack, shield, hull, speed, cargo, max_hull, rarity, num_of_treasure_install
        // state 0-null 1-destroyed 2-moving 3-normal 4-onsale
        uint[12] data;
    }
    
    struct Treasure {
        string name;
        address owner;
        uint tid;
        // data
        // old_effect_num(can check whether installed), on_sale, effect_type, effect_percent, rarity
        uint[5] data;
    }
    
    struct Sale {
        address seller;
        uint said;
        // data
        // sale_type, token_id, start_time, end_time, price
        // sale_type: 0-null 1-ship 2-treasure
        uint[5] data;
    }
    
    struct BattleLog {
        address attacker;
        address defencer;
        // data
        // loc_y, loc_x, result, stage_num, time
        uint[5] data;
        uint[3][2][5] detail; // store sum of attack, shield receive damage, hull receive damage
        uint[][2][6] stage_sids; // store remain ship id of each player, 1+5
    }
    
    struct Order {
        address player;
        uint oid;
        // data
        // loc_y, loc_x, order_type, object_id, start_time, end_time, res[3]
        uint[9] data;
    }
    
    uint MAX_X = 100;
    uint MAX_Y = 100;
    uint[10000] galaxyMap;
    
    uint planetNum = 0;
    uint salePt = 0;
    uint orderPt = 0;
    
    uint[] saleKeyList;
    uint[] orderKeyList;
    
    Planet[] planetList;
    ShipTemplate[] shipTemplateList;
    Ship[] shipList;
    Treasure[] treasureList;
    BattleLog[] battleLogList;
    
    mapping (address => uint) ppcount;
    mapping (address => uint) pscount;
    mapping (address => uint) ptcount;
    mapping (address => uint) pocount;
    mapping (address => uint) pblcount;
    mapping (uint => uint) tinstall;
    mapping (uint => uint) plid;
    
    
    // mapping (uint256 => uint256) orderIdToIndex;
    
    mapping (uint => Sale) saleList;
    mapping (uint => Order) orderList;
    mapping (address => uint) ownerApprovals;
    
}


contract GalaxyGetter is GalaxyStorage {
    
    function getPlanetInfo(uint _loc_y, uint _loc_x) external view returns (string memory name, address owner, uint[12] memory data) {
        uint loc = _loc_y * MAX_X + _loc_x;
        require(loc < 10000);
        data[2] = galaxyMap[loc];
        if (data[2] > 1) {
            Planet storage p = planetList[plid[loc]];
            name = p.name;
            owner = p.owner;
            data = p.data;
        }
    }
    
    function getShipInfo(uint _sid) external view returns (string memory name, address owner, uint[12] memory data) {
        require(_sid < shipList.length);
        Ship storage s = shipList[_sid];
        name = s.name;
        owner = s.owner;
        data = s.data;
    }
    
    function getShipTemplateInfo(uint _stid) external view returns (string memory name, uint[9] memory data) {
        require(_stid < shipTemplateList.length);
        ShipTemplate storage st = shipTemplateList[_stid];
        name = st.name;
        data = st.data;
    }
    
    function getTreasureInfo(uint _tid) external view returns (string memory name, address owner, uint[5] memory data) {
        require(_tid < treasureList.length);
        Treasure storage t = treasureList[_tid];
        name = t.name;
        owner = t.owner;
        data = t.data;
    }
    
    function getSaleInfo(uint _said) external view returns (address seller, uint[5] memory data) {
        require(saleList[_said].data[0] > 0);
        Sale storage sa = saleList[_said];
        seller = sa.seller;
        data = sa.data;
    }
    
    function getBattleLogInfo(uint _blid) external view returns (
        address at,
        address de,
        uint[5] memory data,
        uint[3][2][5] memory detail,
        uint[][2][6] memory stage_sids
    ){
        require(_blid < battleLogList.length);
        BattleLog storage bl = battleLogList[_blid];
        at = bl.attacker;
        de = bl.defencer;
        data = bl.data;
        detail = bl.detail;
        stage_sids = bl.stage_sids;
    }
    
    function getOrderInfo(uint _oid) external view returns (address player, uint[9] memory data) {
        require(_oid < orderPt);
        Order storage od = orderList[_oid];
        player = od.player;
        data = od.data;
    }
    
    function getPlayerOrders() external view returns (
        uint[] memory os_id,
        uint[9][] memory os_data
    ) {
        os_id = new uint[] (pocount[msg.sender]);
        os_data = new uint[9][] (pocount[msg.sender]);
        uint count = 0;
        for (uint i = 0; i < orderKeyList.length; i++) {
            if (orderList[orderKeyList[i]].player == msg.sender) {
                os_id[count] = orderKeyList[i];
                os_data[count] = orderList[orderKeyList[i]].data;
                count++;
            }
        }
    }
    
    function getPlayerPlanets() external view returns (
        string[] memory ps_name,
        uint[] memory ps_id,
        uint[12][] memory ps_data
    ) {
        ps_name = new string[] (ppcount[msg.sender]);
        ps_id = new uint[] (ppcount[msg.sender]);
        ps_data = new uint[12][] (ppcount[msg.sender]);
        uint count = 0;
        for (uint i = 0; i < planetList.length; i++) {
            if (planetList[i].owner == msg.sender) {
                ps_name[count] = planetList[i].name;
                ps_id[count] = planetList[i].pid;
                ps_data[count] = planetList[i].data;
                count++;
            }
        }
    }
    
    function getPlayerShips() external view returns (
        string[] memory ss_name,
        uint[] memory ss_id,
        uint[12][] memory ss_data
    ) {
        ss_name = new string[] (pscount[msg.sender]);
        ss_id = new uint[] (pscount[msg.sender]);
        ss_data = new uint[12][] (pscount[msg.sender]);
        uint count = 0;
        for (uint i = 0; i < shipList.length; i++) {
            if (shipList[i].owner == msg.sender) {
                ss_name[count] = shipList[i].name;
                ss_id[count] = shipList[i].sid;
                ss_data[count] = shipList[i].data;
                count++;
            }
        }
    }
    
    function getPlayerTreasures() external view returns (
        string[] memory ts_name,
        uint[] memory ts_id,
        uint[5][] memory ts_data
    ) {
        ts_name = new string[] (ptcount[msg.sender]);
        ts_id = new uint[] (ptcount[msg.sender]);
        ts_data = new uint[5][] (ptcount[msg.sender]);
        uint count = 0;
        for (uint i = 0; i < treasureList.length; i++) {
            if (treasureList[i].owner == msg.sender) {
                ts_name[count] = treasureList[i].name;
                ts_id[count] = treasureList[i].tid;
                ts_data[count] = treasureList[i].data;
                count++;
            }
        }
    }
    
    function getSales() external view returns (address[] memory sas_seller, uint[] memory sas_id) {
        sas_id = saleKeyList;
        sas_seller = new address[] (saleKeyList.length);
        for (uint i = 0; i < saleKeyList.length; i++) {
            sas_seller[i] = saleList[saleKeyList[i]].seller;
        }
    }
    
    // function getShipTemplates() external view returns (string[] memory sts_name, uint[] memory sts_id) {
    //     sts_name = new string[] (shipTemplateList.length);
    //     sts_id = new uint[] (shipTemplateList.length);
    //     for (uint i = 0; i < shipTemplateList.length; i++) {
    //         sts_name[i] = shipTemplateList[i].name;
    //         sts_id[i] = i;
    //     }
    // }
    
    function getPlayerBattleLogs() external view returns (
        uint[] memory bls_id,
        uint[] memory bls_result,
        address[] memory bls_at,
        address[] memory bls_de
    ) {
        bls_id = new uint[] (pblcount[msg.sender]);
        bls_result = new uint[] (pblcount[msg.sender]);
        bls_at = new address[] (pblcount[msg.sender]);
        bls_de = new address[] (pblcount[msg.sender]);
        
        uint count = 0;
        for (uint i = 0; i < battleLogList.length; i++) {
            if (battleLogList[i].attacker == msg.sender || battleLogList[i].defencer == msg.sender) {
                bls_id[count] = i;
                bls_result[count] = battleLogList[i].data[2];
                bls_at[count] = battleLogList[i].attacker;
                bls_de[count] = battleLogList[i].defencer;
                count++;
            }
        }
    }
    
    function getMap(uint256 _sector) external view returns (uint[10][10] memory sector_map) {
        require(_sector < 100);
        uint x_bias = (_sector % 10) * 10;
        uint y_bias = (_sector / 10) * 1000;
        uint current_bias;
        for (uint i = 0; i < 10; i++) {
            for (uint j = 0; j < 10; j++) {
                current_bias = y_bias + x_bias + j + i * 100;
                sector_map[j][i] = galaxyMap[current_bias];
            }
        }
    }
    
}


contract GalaxyPlanet is GalaxyGetter {
    
    function createPlanets() public {
        for (uint i = 0; i < 50; i++) {
            createOnePlanet(false);
        }
    }
    
    function setPName(uint _loc_y, uint _loc_x, string calldata _name) external {
        uint loc = _loc_y * MAX_X + _loc_x;
        require(loc < 10000 && galaxyMap[loc] > 1 && planetList[plid[loc]].owner == msg.sender);
        planetList[plid[loc]].name = _name;
    }
    
    function refreshRes(uint _loc_y, uint _loc_x) public {
        uint loc = _loc_y * MAX_X + _loc_x;
        require (loc < 10000 && galaxyMap[loc] > 1);
        
        uint[12] storage data = planetList[plid[loc]].data;
        uint gain = (now - data[3]) * data[5] / 1 seconds; // 3600 seconds
        data[6 + data[4]] = data[6 + data[4]] + gain < data[9 + data[4]]? data[6 + data[4]] + gain: data[9 + data[4]];
        data[3] = now;
    }
    
    function createHomePlanet(address _player) internal returns (uint, uint) {
        require (ppcount[_player] == 0);
        
        uint loc_y;
        uint loc_x;
        (loc_y, loc_x) = createOnePlanet(true);
        surveyPlanet(loc_y, loc_x, true);
        transferPlanet(address(0), _player, planetList.length - 1);
        return (loc_y, loc_x);
    }
    
    function surveyPlanet(uint _loc_y, uint _loc_x, bool _must_habitable) internal returns (bool) {
        uint loc = _loc_y * MAX_X + _loc_x;
        uint[3] memory data;
        
        require(loc < 10000 && galaxyMap[loc] == 1);
        data[0] = (_randChance(50) || _must_habitable)? 3: 2;
        data[1] = _randRange(0, 2);
        data[2] = _randRange(80, 120);
        planetList.push(Planet("New Planet", address(0), planetList.length, 
            [_loc_y, _loc_x, data[0], now, data[1], data[2], 0, 0, 0, 1000000, 1000000, 1000000]));
        plid[loc] = planetList.length - 1;
        galaxyMap[loc] = data[0];
        transferPlanet(address(0), address(0), planetList.length - 1);
        return (data[0] == 3) ? true: false;
    }
    
    function transferRes(uint _loc, uint[3] memory _res, bool _reverse) internal {
        uint[12] storage data = planetList[plid[_loc]].data;
        if (!_reverse) {
            data[6] -= _res[0];
            data[7] -= _res[1];
            data[8] -= _res[2];
        } else {
            data[6] = data[6] + _res[0] < data[9]? (data[6] + _res[0]): data[9];
            data[7] = data[7] + _res[1] < data[10]? (data[7] + _res[1]): data[10];
            data[8] = data[8] + _res[2] < data[11]? (data[8] + _res[2]): data[11];
        }
    }
    
    function createOnePlanet(bool _must) internal returns (uint, uint) {
        if (planetNum >= 800 && !_must) {
            return (MAX_Y, MAX_X);
        }
        uint256 random = _randRange(0, 9999);
        while (galaxyMap[random] != 0) {
            random = (random + 1) % 9999;
        }
        galaxyMap[random] = 1;
        planetNum++;
        return (random / MAX_X, random % MAX_X);
    }
    
    function transferPlanet(address _from, address _to, uint256 _pid) internal {
        ppcount[_to]++;
        ppcount[_from]--;
        planetList[_pid].owner = _to;
    }
    
    function checkEnoughRes(uint _loc, uint[3] memory _res) internal view returns (bool) {
        uint[12] storage data = planetList[plid[_loc]].data;
        if (data[6] < _res[0] || data[7] < _res[1] || data[8] < _res[2]) {
            return false;
        }
        return true;
    }
    


}


contract GalaxyShip is GalaxyPlanet {
    
    function setSName(uint _sid, string calldata _name) external {
        require(_sid < shipList.length && shipList[_sid].owner == msg.sender);
        shipList[_sid].name = _name;
    }
    
    function buildShip(address _player, uint _loc_y, uint _loc_x, uint _type) internal {
        require (_type < shipTemplateList.length);
        uint[6] memory sdata;
        uint[9] storage stdata = shipTemplateList[_type].data;
        sdata[5] = _randRange(0, 4);
        for (uint i = 0; i < 5; i++) {
            sdata[i] = stdata[i] * (100 + 20 * sdata[5] * _randRange(0, 999) / 1000) / 100;
        }
        shipList.push(Ship("New ship", _player, shipList.length, 
            [_loc_y, _loc_x, 3, _type, sdata[0], sdata[1], sdata[2], sdata[3], sdata[4], sdata[2], sdata[5], 0]));
        pscount[_player]++;
    }
    
    function endMoveShip(uint _sid, uint _loc_y, uint _loc_x) internal {
        uint[12] storage data = shipList[_sid].data;
        data[0] = _loc_y;
        data[1] = _loc_x;
        data[2] = 3;
    }
    
    function startMoveShip(uint _sid, uint _loc_y, uint _loc_x) internal returns (uint) {
        uint[12] storage data = shipList[_sid].data;
        require(data[2] == 3);
        data[2] = 2;
        uint dy = _loc_y > data[0]? _loc_y - data[0]: data[0] - _loc_y;
        uint dx = _loc_x > data[1]? _loc_x - data[1]: data[1] - _loc_x;
        return (dy + dx) * 1000 / data[7];
    }
    
    function checkEnoughResAndCargo(uint _loc, uint _sid, uint[3] memory _res) internal view returns (bool) {
        if (!checkEnoughRes(_loc, _res) || shipList[_sid].data[8] < _res[0] + _res[1] + _res[2]) {
            return false;
        }
        return true;
    }
    
    function transferShip(address _from, address _to, uint256 _id) internal {
        pscount[_to]++;
        pscount[_from]--;
        shipList[_id].owner = _to;
    }
    
    function getShipAttackSum(uint[] memory _sids) internal view returns (uint) {
        uint sum = 0;
        for (uint i = 0; i < _sids.length; i++) {
            if(shipList[_sids[i]].data[2] == 3) {
                sum += shipList[_sids[i]].data[4];
            }
        }
        return sum;
    }
    
    function damageShip(uint _sid, uint _damage) internal returns (bool, uint, uint) {
        uint[12] storage data = shipList[_sid].data;
        if (data[5] < _damage) {
            _damage -= data[5];
            if (data[6] < _damage) {
                data[6] = 0;
                data[2] = 1;
                return (true, data[5], _damage);
            } else {
                data[6] -= _damage;
                return (false, data[5], _damage);
            }
        }
        return (false, _damage, 0);
    }
    
    function getValidSids(uint _loc_y, uint _loc_x, address _player, bool _is_player) internal view returns (uint[] memory) {
        uint count = 0;
        uint[] memory sids = new uint[] (shipList.length);
        for (uint i = 0; i < shipList.length; i++) {
            uint[12] storage data = shipList[i].data;
            if (data[0] == _loc_y && data[1] == _loc_x && data[2] == 3 && (_player == shipList[i].owner) == _is_player) {
                sids[count] = i;
                count++;
            }
        }
        uint[] memory sids2 = new uint[] (count);
        for (uint i = 0; i < sids2.length; i++)
            sids2[i] = sids[i];
        return sids2;
    }

}


contract GalaxyTreasure is GalaxyShip {
    
    function createTreasure(address _player) internal {
        uint[3] memory data;

        data[0] = _randRange(0, 3);
        data[2] = _randRange(0, 5);
        data[1] = _randRange(5 + 20 * data[2], 20 + 20 * data[2]);
        string memory name = data[0] == 0? "Weapon Charger":
            (data[0] == 1? "Shield Charger": (data[0] == 2? "Structure stengthener": "Booster"));
        treasureList.push(Treasure(name, _player, treasureList.length, [0, 0, data[0], data[1], data[2]]));
        ptcount[_player]++;
    }
    
    function transferTreasure(address _from, address _to, uint _id) internal {
        ptcount[_to]++;
        ptcount[_from]--;
        treasureList[_id].owner = _to;
    }
    
    function installTreasure(uint _sid, uint _tid) external {
        require(_sid < shipList.length && _tid < treasureList.length);
        uint[12] storage sdata = shipList[_sid].data;
        uint[5] storage tdata = treasureList[_tid].data;
        require(tdata[0] == 0 && tdata[1] == 0 && sdata[11] < 3);
        
        if (tdata[2] == 2) {
            tdata[0] = sdata[9];
            sdata[9] = sdata[9] * tdata[3] / 100;
            sdata[6] = sdata[6] * tdata[3] / 100;
        } else {
            tdata[0] = sdata[4 + tdata[2]] / 100;
            sdata[4 + tdata[2]] = sdata[4 + tdata[2]] * tdata[3] / 100;
        }
        
        sdata[11] ++;
        tinstall[_tid] = _sid;
    }
    
    function uninstallTreasure(uint _tid) external {
        require(_tid < treasureList.length);
        uint[5] storage tdata = treasureList[_tid].data;
        require(tdata[0] > 0);
        uint[12] storage sdata = shipList[tinstall[_tid]].data;
        
        if (tdata[2] == 2) {
            sdata[6] = sdata[6] * tdata[0] / sdata[9];
            sdata[9] = tdata[0];
        } else {
            sdata[4 + tdata[2]] = tdata[0];
        }
        sdata[11]--;
        tdata[0] = 0;
    }
    
    function survey(uint _loc_y, uint _loc_x) external {
        uint256[] memory player_ships_id;
        player_ships_id = getValidSids(_loc_y, _loc_x, msg.sender, true);
        require(player_ships_id.length > 0);
        createTreasure(msg.sender);
        surveyPlanet(_loc_y, _loc_x, false);
    }

}


contract GalaxySale is GalaxyTreasure {
    
    function createSale(uint _sale_type, uint _id, uint _price) external {
        require(0 < _sale_type && _sale_type < 3);
        if (_sale_type == 1) {
            setShipSale(msg.sender, _id);
        } else if (_sale_type == 2) {
            setTreasureSale(msg.sender, _id);
        }
        saleList[salePt] = Sale(msg.sender, salePt, [_sale_type, _id, now, now + 24 hours, _price]);
        saleKeyList.push(salePt);
        salePt++;
        // emit saleCreated(_sale_type, _id, _price, now + 24 hours);
    }
    
    function acceptSale(uint _said) external payable {
        refreshSales();
        require(saleList[_said].data[0] > 0);
        Sale storage sa = saleList[_said];
        require(msg.value >= sa.data[4] && msg.sender != sa.seller);
        // emit saleSuccessful(_sale_type, current_sale.token_id, current_sale.price, msg.sender);
        executeSale(msg.sender, sa.data[0], _said);
        if (!msg.sender.send(msg.value - sa.data[4]))
            ownerApprovals[msg.sender] = msg.value - sa.data[4];
    }
    
    function checkApproval() external {
        refreshSales();
        if (ownerApprovals[msg.sender] > 0 && msg.sender.send(ownerApprovals[msg.sender])) {
            ownerApprovals[msg.sender] = 0;
        }
    }
    
    function refreshSales() public {
        for(uint256 i = 0; i < saleKeyList.length; i++) {
            uint[5] storage data = saleList[saleKeyList[i]].data;
            if (now > data[3]) {
                if (data[0] == 1) {
                    shipList[data[1]].data[2] = 3;
                } else if (data[0] == 2) {
                    treasureList[data[1]].data[1] = 0;
                }
                // delete saleList[saleKeylist[i]];
                saleKeyList[i] = saleKeyList[saleKeyList.length - 1];
                saleKeyList.length--;
                i--;
            }
        }
    }
    
    function setTreasureSale(address _player, uint _tid) internal {
        require(_tid < treasureList.length && treasureList[_tid].owner == _player);
        uint[5] storage data = treasureList[_tid].data;
        require(data[0] == 0 && data[1] == 0);
        data[1] = 1;
    }
    
    function setShipSale(address _player, uint _sid) internal {
        require(_sid < shipList.length && shipList[_sid].owner == _player);
        uint[12] storage data = shipList[_sid].data;
        require(data[2] == 3);
        data[2] = 4;
    }
    
    function executeSale(address _to, uint _sale_type, uint _said) internal {
        if (_sale_type == 1) {
            transferShip(saleList[_said].seller, _to, saleList[_said].data[1]);
            shipList[saleList[_said].data[1]].data[2] = 3;
        } else if (_sale_type == 2) {
            transferTreasure(saleList[_said].seller, _to, saleList[_said].data[1]);
            treasureList[saleList[_said].data[1]].data[1] = 0;
        }
        ownerApprovals[saleList[_said].seller] = saleList[_said].data[4];
        // delete saleList[_id];
        for (uint i = 0; i < saleKeyList.length; i++) {
            if (saleKeyList[i] == _said) {
                saleKeyList[i] = saleKeyList[saleKeyList.length - 1];
                saleKeyList.length--;
                break;
            }
        }
    }
}


contract GalaxyBattle is GalaxySale {
    
    function capture(uint _loc_y, uint _loc_x) external {
        uint loc = _loc_y * MAX_X + _loc_x;
        require (loc < 10000 && galaxyMap[loc] > 1 && planetList[plid[loc]].owner != msg.sender);
        uint[] memory sids;
        uint[] memory desids;
        sids = getValidSids(_loc_y, _loc_x, msg.sender, true);
        desids = getValidSids(_loc_y, _loc_x, msg.sender, false);
        require(sids.length > 0 && desids.length == 0);
        transferPlanet(planetList[plid[loc]].owner, msg.sender, plid[loc]);
    }
    
    
    function battle(uint _loc_y, uint _loc_x, address _attacker) external {
        require (_loc_y * MAX_X + _loc_x < 10000);
        //get ships of attacker's and defencer's ships first
        //if can not find such defencer, return false
        //in each stage, calculate the sum of damage of each side, divide them into equl part and resort in enemy's ship
        //ship whose hull is equl to 0 will be ignored in next stage of battle and marked as destroyed
        
        address defencer;
        uint[] memory atsids = getValidSids(_loc_y, _loc_x, _attacker, true);
        uint[] memory desids = getValidSids(_loc_y, _loc_x, _attacker, false);
        
        require(atsids.length != 0);
        
        if (desids.length == 0) {
            return;
        } else {
            defencer = shipList[desids[0]].owner;
        }
        
        // uint attacker_attack_sum;
        // uint attacker_attack_each;
        // uint defencer_attack_sum;
        // uint defencer_attack_each;
        // uint attacker_shield_recieve;
        // uint attacker_hull_recieve;
        // uint defencer_shield_recieve;
        // uint defencer_hull_recieve;
        // uint shield_recieve;
        // uint hull_recieve;
        uint[10] memory detail;
        uint stage;
        uint result;
        uint atcount = atsids.length;
        uint decount = desids.length;
        bool destroyed;
        
        BattleLog memory blank;
        battleLogList.push(blank);
        BattleLog storage bl = battleLogList[battleLogList.length - 1];
        
        bl.attacker = _attacker;
        bl.defencer = defencer;
        bl.stage_sids[0][0] = atsids;
        bl.stage_sids[0][1] = desids;
        
        for (stage = 1; stage < 6; stage++) {
            (detail[4], detail[5], detail[6], detail[7]) = (0, 0, 0, 0);
            
            detail[0] = getShipAttackSum(atsids);
            detail[1] = detail[0] / decount;
            for (uint i = 0; i < desids.length; ++i) {
                if (shipList[desids[i]].data[2] == 3) {
                    (destroyed, detail[8], detail[9]) = damageShip(desids[i], detail[1]);
                    if (destroyed) {
                        decount--;
                    } else {
                        bl.stage_sids[stage][1].push(desids[i]);
                    }
                    detail[6] += detail[8];
                    detail[7] += detail[9];
                }
            }
            
            detail[2] = getShipAttackSum(desids);
            detail[3] = detail[2] / atcount;
            for (uint i = 0; i < atsids.length; ++i) {
                if (shipList[atsids[i]].data[2] == 3) {
                    (destroyed, detail[8], detail[9]) = damageShip(atsids[i], detail[3]);
                    if (destroyed) {
                        atcount--;
                    } else {
                        bl.stage_sids[stage][0].push(atsids[i]);
                    }
                    detail[4] += detail[8];
                    detail[5] += detail[9];
                }
            }
            
            bl.detail[stage][0] = [detail[0], detail[4], detail[5]];
            bl.detail[stage][1] = [detail[2], detail[6], detail[7]];
            
            if (atcount == 0) {
                result = 2;
                break;
            }
            if (decount == 0) {
                result = 1;
                break;
            }
        }
        
        if (atcount != 0 && decount != 0) {
            result = 3;
        }
        
        bl.data = [_loc_y, _loc_x, result, stage, now];
        pblcount[_attacker]++;
        pblcount[defencer]++;
    }
    
}


contract GalaxyOrder is GalaxyBattle {
    
    function createBuildOrder(uint _loc_y, uint _loc_x, uint _stid) external {
        refreshOrder();
        uint loc = _loc_y * MAX_Y + _loc_x;
        require(_stid < shipTemplateList.length && loc < 10000 && galaxyMap[loc] == 3 && planetList[plid[loc]].owner == msg.sender);
        ShipTemplate storage st = shipTemplateList[_stid];
        uint[3] memory res = [st.data[6], st.data[7], st.data[8]];
        refreshRes(_loc_y, _loc_x);
        require(checkEnoughRes(loc, res));
        transferRes(loc, res, false);
        uint[9] memory data = [_loc_y, _loc_x, 1, _stid, now, now + st.data[5], res[0], res[1], res[2]];
        createOrder(msg.sender, data);
    }
    
    function createTransOrder(uint _loc_y, uint _loc_x, uint _sid, uint[3] calldata _res) external {
        refreshOrder();
        uint loc = _loc_y * MAX_Y + _loc_x;
        require(_sid < shipList.length && loc < 10000 && galaxyMap[loc] > 1 && shipList[_sid].owner == msg.sender);
        refreshRes(_loc_y, _loc_x);
        require(checkEnoughResAndCargo(loc, _sid, _res));
        transferRes(loc, _res, false);
        uint[9] memory data = [_loc_y, _loc_x, 2, _sid, now, now + startMoveShip(_sid, _loc_y, _loc_x), _res[0], _res[1], _res[2]];
        createOrder(msg.sender, data);
    }
    
    function createMoveOrder(uint _loc_y, uint _loc_x, uint _sid) external {
        refreshOrder();
        uint loc = _loc_y * MAX_Y + _loc_x;
        require(_sid < shipList.length && loc < 10000 && shipList[_sid].owner == msg.sender);
        uint[9] memory data = [_loc_y, _loc_x, 3, _sid, now, now + startMoveShip(_sid, _loc_y, _loc_x), 0, 0, 0];
        createOrder(msg.sender, data);
    }
    
    function createOrder(address _player, uint[9] memory data) internal {
        orderList[orderPt] = Order(_player, orderPt, data);
        orderKeyList.push(orderPt);
        orderPt++;
        pocount[_player]++;
    }
    
    function deleteOrder(uint _oid) internal {
        orderList[_oid].data[2] = 0;
        pocount[orderList[_oid].player]--;
        for (uint i = 0; i < orderKeyList.length; i++) {
            if (orderKeyList[i] == _oid) {
                orderKeyList[i] = orderKeyList[orderKeyList.length - 1];
                orderKeyList.length--;
                break;
            }
        }
    }
    
    function withdrawOrder(uint _oid) external {
        refreshOrder();
        require(orderList[_oid].data[2] > 0 && orderList[_oid].player == msg.sender && orderList[_oid].data[5] < now);
        Order storage od = orderList[_oid];
        if (od.data[2] == 1) {
            transferRes(od.data[0] * MAX_Y + od.data[1], [od.data[6], od.data[7], od.data[8]], true);
        } else if (od.data[2] == 2 || od.data[2] == 3) {
            uint[12] memory sdata = shipList[od.data[3]].data;
            require(!(od.data[0] == sdata[0] && od.data[1] == sdata[1]));
            od.data[0] = sdata[0];
            od.data[1] = sdata[1];
            od.data[5] = now + od.data[5] - od.data[4];
            od.data[4] = now;
            return;
        }
        deleteOrder(_oid);
    }
    
    function executeOrder(uint _oid) internal {
        Order storage od = orderList[_oid];
        if (od.data[2] == 1) {
            buildShip(od.player, od.data[0], od.data[1], od.data[3]);
        } else if (od.data[2] == 2) {
            transferRes(od.data[0] * MAX_X + od.data[1], [od.data[6], od.data[7], od.data[8]], true);
            endMoveShip(od.data[3], od.data[0], od.data[1]);
        } else if (od.data[2] == 3) {
            endMoveShip(od.data[3], od.data[0], od.data[1]);
        }
        deleteOrder(_oid);
    }
    
    function refreshOrder() public {
        for (uint i = 0; i < orderKeyList.length; i++) {
            if (orderList[orderKeyList[i]].data[5] < now) {
                executeOrder(orderKeyList[i]);
                i--;
            }
        }
    }
    
}


contract CryptoGalaxy is GalaxyOrder {
    
    address[] playerList;
    address host;
    mapping (address => uint) freetime;
    
    constructor() public {
        host = msg.sender;
    }
    
    function checkPlExt() public view returns (bool) {
        for (uint i = 0; i < playerList.length; i++) {
            if (playerList[i] == msg.sender)
                return true;
        }
        return false;
    }
    
    function joinGame() external {
        require(!checkPlExt());
        playerList.push(msg.sender);
        uint loc_y;
        uint loc_x;
        (loc_y, loc_x) = createHomePlanet(msg.sender);
        buildShip(msg.sender, loc_y, loc_x, 2);
        freetime[msg.sender] = now;
    }
    
    function getFreeShip() external {
        require(checkPlExt());
        require(freetime[msg.sender] + 12 hours < now);
        freetime[msg.sender] = now;
        uint loc = _randRange(0, 9999);
        buildShip(msg.sender, loc / MAX_X, loc % MAX_X, 2);
    }
    
    function checkFT() external view returns (uint) {
        require(checkPlExt());
        return freetime[msg.sender];
    }
    
    function donate() external payable {
        return;
    }
    
    function gameOver() external {
        require(msg.sender == host);
        selfdestruct(address(uint160(host)));
    }
    
    function init() external {
        shipTemplateList.push(ShipTemplate("corvette", [uint256(100), 50, 400, 800, 500, 30 seconds, 0, 0, 0]));
        shipTemplateList.push(ShipTemplate("destroyer", [uint256(200), 100, 800, 600, 800, 60 seconds, 12000, 4000, 2000]));
        shipTemplateList.push(ShipTemplate("cruiser", [uint256(600), 300, 1500, 400, 1000, 60 seconds, 5000, 10000, 20000]));
        shipTemplateList.push(ShipTemplate("battleship", [uint256(1600), 800, 6000, 200, 2000, 60 seconds, 100000, 80000, 60000]));
        shipTemplateList.push(ShipTemplate("small transporter", [uint256(0), 50, 800, 600, 3000, 60 seconds, 10000, 20000, 10000]));
        shipTemplateList.push(ShipTemplate("large transporter", [uint256(0), 100, 1500, 400, 8000, 60 seconds, 40000, 40000, 40000]));
    }
    
}

