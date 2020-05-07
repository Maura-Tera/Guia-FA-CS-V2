module.exports = function Tera_Guide(mod) {
	let {
		DungeonInfo,
		CK_BOSS,    CK_TipMsg,
		FA_BOSS,    FA_TipMsg
	} = require((mod.region.toUpperCase()=='NA')?'./boss':'./boss-Custom');
	
	let Enabled            = true,  // 总开关
		SendToStream       = false; // true 关闭队长通知, 并将消息发送到聊天[代理]频道
	// 定义变量
	let hooks              = [],
		myDeBuff           = null,  // AQ_红/蓝诅咒, CK_业火/寒气
		
		partyMakers        = [],    // 队员标记
		
		whichmode          = null,  // 副本地图(huntingZoneId)
		
		whichboss          = null,  // 区域位置(templateId)
		boss_ID            = null,  // BOSS gameId
		boss_HP            = 0,     // BOSS 血量%
		skillid            = 0,     // BOSS 攻击技能编号
		// DW
		circleCount        = 0,     // 累计点名圆圈数
		ballColor          = 0,     // 打投掷颜色
		// VS
		checked            = false, // 鉴定
		inverted           = false, // 恢复正常 / 进入灵魂
		nextMsg            = 0,     // 预告下一次[鉴定消息数组]角标
		// RK
		FirstMsg           = "X",   // 第一技能
		SecondMsg          = "X",   // 第二技能
		switchMsg          = false, // 正常顺序 / 反向顺序
		// AA
		lastTwoUpDate      = 0,
		lastRotationDate   = 0,
		rotationDelay      = 0,
		// GLS
		power              = false, // 充能计数
		level              = 0,     // 充能层数
		levelMsg           = [],    // 充能文字 数组
		// SI
		bossBuff           = 0,     // 紫/绿武器
		// CK
		bossWord           = null;  // 愤怒/恐惧
	// 控制命令
	mod.command.add(["Gatos Magicos", "guide"], (arg) => {
		if (!arg) {
			Enabled = !Enabled;
			mod.command.message("Gatos Magicos(Guide) " + (Enabled ? "(ON)" : "(OFF)"));
		} else {
			switch (arg) {
				case "st":
				case "stream":
				case "Fijo":
					SendToStream = !SendToStream;
					mod.command.message("(Stream) " + (SendToStream ? "(ON)" : "(OFF)"));
					break;
				case "info":
				case "status":
					mod.command.message("Module Switch: " + Enabled);
					mod.command.message("Modo Fijo: " + SendToStream);
					mod.command.message("Copiar mapa: " + whichmode);
					mod.command.message("Localizacion: " + whichboss);
					mod.command.message("bossID: "   + boss_ID);
					break;
				default :
					mod.command.message("Parametro Invalido");
					break;
			}
		}
	});
	// 切换场景
	mod.game.me.on('change_zone', (zone, quick) => {
		whichmode = zone % 9000;
		
		if (mod.game.me.inDungeon && DungeonInfo.find(obj => obj.zone == zone)) {
			mod.command.message(DungeonInfo.find(obj => obj.zone == zone).string);
			if (whichmode < 100) whichmode = whichmode + 400;
			load();
		} else {
			whichmode = null;
			unload();
		}
	});
	
	function load() {
		if (!hooks.length) {
			hook('S_BOSS_GAGE_INFO',        3, sBossGageInfo);
			hook('S_CREATURE_ROTATE',       2, sCreatureRotate);
			hook('S_DUNGEON_EVENT_MESSAGE', 2, sDungeonEventMessage);
			hook('S_QUEST_BALLOON',         1, sQuestBalloon);
			hook('S_ABNORMALITY_BEGIN',     4, sAbnormalityBegin);
			// hook('S_ABNORMALITY_REFRESH',   2, UpdateAbnormality);
			hook('S_ABNORMALITY_END',       1, sAbnormalityEnd);
			hook('S_ACTION_STAGE',          9, sActionStage);
		}
	}
	
	function hook() {
		hooks.push(mod.hook(...arguments));
	}
	
	function unload() {
		if (hooks.length) {
			for (let h of hooks) {
				mod.unhook(h);
			}
			hooks = [];
		}
		reset();
	}
	
	function reset() {
		// 清除所有定时器
		mod.clearAllTimeouts();
		// 清除自身debuff记录
		myDeBuff           = null;
		// 清除队员标记
		partyMakers        = [];
		UpdateMarkers();
		// 清除BOSS信息
		whichboss          = null;
		boss_ID            = null;
		boss_HP            = 0;
		skillid            = 0;
		// DW
		circleCount        = 0;
		ballColor          = 0;
		// VS_3王
		checked            = false;
		inverted           = false;
		nextMsg            = 0;
		// RK_3王
		FirstMsg           = "X";
		SecondMsg          = "X";
		switchMsg          = false;
		// AA
		lastTwoUpDate      = 0;
		lastRotationDate   = 0;
		rotationDelay      = 0;
		// GLS_3王
		power              = false;
		level              = 0;
		levelMsg           = [];
		// SI_3王
		bossBuff           = 0;
		// CK
		bossWord           = null;
	}
	
	function sBossGageInfo(event) {
		if (!whichboss || (whichboss!=event.templateId)) whichboss = event.templateId;
		if (!boss_ID || (boss_ID!=event.id)) boss_ID = event.id;
		
		boss_HP = Number(event.curHp) / Number(event.maxHp);
		if ((boss_HP<=0) || (boss_HP==1)) reset();
	}
	
	function sCreatureRotate(event) {
		if (!Enabled || !whichmode) return;
		// AA_3王 后砸
		if (lastTwoUpDate && boss_ID==event.gameId) {
			lastRotationDate = Date.now();
			rotationDelay = event.time;
		}
	}
	
	function sDungeonEventMessage(event) {
		if (!Enabled || !whichmode) return;
		var msg_Id = parseInt(event.message.match(/\d+/ig)) % 1000;
		// DRC_1王 能量满100提醒 下级-9783103 上级-9983103
		if ([783, 983, 3018].includes(whichmode) && whichboss==1000 && msg_Id==103) {
			SendMessage(DRC_TipMsg[0]);
		}
		// VS_3王 下一次鉴定提示(翻译王说话)
		if ([781, 981].includes(whichmode) && whichboss==3000) {
			// 1 注 - 9781043 9981043  2 闪 - 9781044 9981044  3 炸 - 9781045 9981045
			if ([43, 44, 45].includes(msg_Id)) {
				nextMsg = msg_Id % 42;
				if (inverted) nextMsg = nextMsg+3;
				SendMessage((VS_TipMsg[0] + VS_TipMsg[nextMsg]), 25);
			}
		}
		// RK_3王 上级鉴定
		if (whichmode==935 && whichboss==3000) {
			// 传送协议  近- 9935302 远- 9935303 全- 9935304
			if ([302, 303, 304].includes(msg_Id)) {
				FirstMsg = RK_TipMsg[msg_Id % 301];
				SecondMsg = "X";
				SendMessage((RK_TipMsg[0] + FirstMsg + " + " + SecondMsg), 25);
			}
			if (msg_Id==311) { // 变更协议-绿  9935311
				switchMsg = false;
				SendMessage((RK_TipMsg[0] + FirstMsg + " + " + SecondMsg), 25);
			}
			if (msg_Id==312) { // 变更协议-红  9935312
				switchMsg = true;
				SendMessage((RK_TipMsg[0] + SecondMsg + " + " + FirstMsg), 25);
			}
		}
	}
	
	function sQuestBalloon(event) {
		if (!Enabled || !whichmode) return;
		var msg_Id = parseInt(event.message.match(/\d+/ig)) % 1000;
		// DW_2王 轮盘选中球的颜色(王的说话)
		if (whichmode==466 && whichboss==46602) {
			// 逆-466054 [红色] 顺-466050 | 逆-466055 [白色] 顺-466051 | 逆-466056 [蓝色] 顺-466052
			if ([50, 51, 52, 54, 55, 56].includes(msg_Id)) {
			//    1   2   3   5   6   7
				ballColor = msg_Id % 49;
				SendMessage((DW_TipMsg2[0] + DW_TipMsg2[ballColor]), 25);
			}
		}
		// FI_1王 
		if ([459, 759].includes(whichmode) && [1001, 1004].includes(whichboss)) {
			// 459015 谁要被我诅咒看看吗(伯恩斯坦的诅咒)
			if (msg_Id==15) SendMessage(FI_TipMsg[0], 25);
			// 459021 有人撑不住我的诅咒(拉道斯的诅咒)
			if (msg_Id==21) SendMessage(FI_TipMsg[1], 25);
		}
		// FI_2王 
		if ([459, 759].includes(whichmode) && [1002, 1005].includes(whichboss)) {
			// 459022 亡灵会暂时醒来
			if (msg_Id==22) SendMessage(FI_TipMsg[2], 25);
		}
		// VS_3王 鉴定
		if ([781, 981].includes(whichmode) && whichboss==3000) {
			if (msg_Id==142) { // 死于混乱之中吧(开始鉴定) - 78142
				checked = true;
				mod.setTimeout(() => { checked = false; }, 1000);
				if (boss_HP > 0.5) {
					nextMsg = nextMsg+1;
					if (!inverted && nextMsg>3) nextMsg = 1; // VS_TipMsg[1] - VS_TipMsg[2] - VS_TipMsg[3]
					if ( inverted && nextMsg>6) nextMsg = 4; // VS_TipMsg[4] - VS_TipMsg[5] - VS_TipMsg[6]
				} else {
					nextMsg = nextMsg-1;
					if (!inverted && nextMsg<1) nextMsg = 3; // 1注(近)-2闪(分)-3炸(解)
					if ( inverted && nextMsg<4) nextMsg = 6; // 4注(远)-5闪(集)-6炸(不)
				}
				mod.setTimeout(() => { SendMessage((VS_TipMsg[0] + VS_TipMsg[nextMsg]), 25); }, 5000);
			}
			if (msg_Id==151) { // 进入灵魂 - 78151
				inverted = true;
				nextMsg = nextMsg+3;
				SendMessage(("Into -> " + VS_TipMsg[nextMsg]), 25);
			}
			if (msg_Id==152) { // 挺能撑的 - 78152
				inverted = false;
				nextMsg = nextMsg-3;
				SendMessage(("Out  -> " + VS_TipMsg[nextMsg]), 25);
			}
			// 在神的面前不要掉以轻心 - 78155
		}
		// RK_3王 上级鉴定
		if (whichmode==935 && whichboss==3000) {
			// 执行协议-935300  近-935301 远-935302 全-935303
			if ([301, 302, 303].includes(msg_Id)) {
				SecondMsg = RK_TipMsg[msg_Id % 300];
				if (!switchMsg) { // switchMsg - false(绿) / true(红)
					SendMessage(FirstMsg + " -> " + SecondMsg);
					// 下一次鉴定提示
					FirstMsg = SecondMsg;
					SecondMsg = "X";
					mod.setTimeout(() => {
						SendMessage((RK_TipMsg[0] + FirstMsg + " -> " + SecondMsg), 25);
					}, 6500);
				} else {
					SendMessage(SecondMsg + " -> " + FirstMsg);
					// 下一次鉴定提示
					FirstMsg = SecondMsg;
					SecondMsg = "X";
					mod.setTimeout(() => {
						SendMessage((RK_TipMsg[0] + SecondMsg + " -> " + FirstMsg), 25);
					}, 6500);
				}
			}
		}
		// CK_凯尔 鉴定
		if ([3026, 3126].includes(whichmode) && whichboss==1000) {
			// 感受毁灭的恐惧吧-3026005-3126005 感受毁灭的愤怒吧-3026004-3126004
			bossWord = parseInt(event.message.match(/\d+/ig));
		}
	}
	
	function sAbnormalityBegin(event) {
		if (!Enabled || !whichmode) return;
		// BS_火神
		if (event.id==90442304 && boss_ID==event.target) {
			SendMessage(BS_TipMsg[1], 25);
		}
		// SI_金鳞船 亡靈閃電的襲擊 / 海洋魔女的氣息
		if ([30209101, 30209102].includes(event.id)) {
			partyMakers.push({
				color: 0, // 0.红色箭头 1.黄色箭头 2.蓝色箭头
				target: event.target
			});
			UpdateMarkers();
			
			mod.setTimeout(() => {
				partyMakers = [];
				UpdateMarkers();
			}, 3500);
			
			if (mod.game.me.is(event.target)) {
				mod.setTimeout(() => { SendMessage(SI_TipMsg[2], 25); }, 2000);
			}
		}
		
		if (!mod.game.me.is(event.target)) return;
		// AQ_1王 内外圈-鉴定 紅色詛咒氣息 藍色詛咒氣息
		if ([30231000, 30231001].includes(event.id)) {
			myDeBuff = event.id;
		}
		// CK_凯尔    破灭业火 / 破灭寒气
		if ([30260001, 31260001, 30260002, 31260002].includes(event.id)) {
			myDeBuff = event.id;
		}
	}
	
	function sAbnormalityEnd(event) {
		if (!Enabled || !whichmode) return;
		
		if (!mod.game.me.is(event.target)) return;
		// AQ_1王 内外圈-鉴定 紅色詛咒氣息 藍色詛咒氣息
		if ([30231000, 30231001].includes(event.id)) {
			myDeBuff = null;
		}
		// CK_凯尔    破灭业火 / 破灭寒气
		if ([30260001, 31260001, 30260002, 31260002].includes(event.id)) {
			myDeBuff = null;
		}
	}
	
	function sActionStage(event) {
		// 模块关闭 或 不在副本中
		if (!Enabled || !whichmode) return;
		
		// BS_火神_王座
		if (whichmode== 444 && event.templateId==2500 && event.stage==0 && event.skill.id==1305) {
			SendMessage(BS_TipMsg[2], 25);
		}
		
		if (boss_ID != event.gameId) return;
		skillid = event.skill.id % 1000; // 愤怒简化 取1000余数运算
		var bossSkillID = null;
		// CK_凯尔
		if ([3026, 3126].includes(whichmode) && [1000, 1001, 1002].includes(event.templateId) && event.stage==0) {
			if (!(bossSkillID = CK_BOSS.find(obj => obj.id==skillid))) return;
			if ([212, 215].includes(skillid)) { // 内火(火爪)
				mod.command.message("Fuego Adentro /" + ((bossWord%2)?"Miedo(Mismo)":"Furia(Diferente)") + "/ Hielo Adentro");
				SendMessage((myDeBuff?CK_TipMsg[(0+bossWord+myDeBuff)%2]:"X") + "->" + CK_TipMsg[(0+bossWord)%2+2]);
				return;
			}
			if ([213, 214].includes(skillid)) { // 内冰(冰爪)
				mod.command.message("Hielo Adentro l" + ((bossWord%2)?"Miedo(Mismo)":"Furia(Diferente)") + "l Fuego Adentro");
				SendMessage((myDeBuff?CK_TipMsg[(1+bossWord+myDeBuff)%2]:"X") + "->" + CK_TipMsg[(1+bossWord)%2+2]);
				return;
			}
			SendMessage(bossSkillID.msg);
		}
		// FA_狂气
		if (whichmode==3027 && event.templateId==1000 && event.stage==0) {
			if (!(bossSkillID = FA_BOSS.find(obj => obj.id==skillid))) return;
			if ([350, 357].includes(skillid)) { // 紫/红 鉴定预测
				mod.setTimeout(() => { SendMessage(FA_TipMsg[0], 25); }, 58000);
			}
			if (skillid==401) { // 30% 全屏爆炸
				mod.setTimeout(() => { SendMessage(bossSkillID.msg); }, 1200);
				return;
			}
			SendMessage(bossSkillID.msg);
		}
	}
	// 发送提示文字
	function SendMessage(msg, chl) {
		if (SendToStream) {
			mod.command.message(msg);
		} else {
			mod.send('S_CHAT', 3 , {
				channel: chl ? chl : 21, // 21 = 队长通知, 1 = 组队, 2 = 公会, 25 = 团长通知
				name: 'Gatos-Guide',
				message: msg
			});
		}
	}
	// 更新 队内玩家 标记
	function UpdateMarkers() {
		mod.send('S_PARTY_MARKER', 1, {
			markers: partyMakers
		});
	}
	
}
