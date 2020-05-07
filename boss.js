// 语言(language): 默认(default) 简体中文(zh-CN)
module.exports = {
	// 进入副本提示文(Into Dungeon Tip-Msg)
	DungeonInfo : [
		{zone: 3026, string: 'Bienvenido <font color="#56B4E9">Corrupted Skynest</font> <font color="#E69F00">Normal</font>'},
		{zone: 3126, string: 'Bienvenido <font color="#56B4E9">Corrupted Skynest</font> <font color="#00FFFF">Dificil</font>'},
		{zone: 3027, string: 'Bienvenido <font color="#56B4E9">Forbidden Arena</font>'}
	],
	// 凯尔赛克隐藏地 (Corrupted Skynest)
	CK_BOSS : [
		// 120 猛烈的咆哮
		// 162 猛烈的咆哮
		// 106 前方-驴打滚
		// 156 前方-驴打滚
		// 205 前方跳跃(回避)
		// 206 后方跳跃(闪避)
		// 131 广域1实例
		{id: 103, msg: 'Coletazo (Esquiva o vuelas!!)'},
		{id: 153, msg: 'Coletazo (Esquiva o vuelas!!)'},
		{id: 108, msg: 'Giro a la derecha (Derribo!!)'},
		{id: 158, msg: 'Grio a la derecha (Derribo!!)'},
		{id: 109, msg: 'Giro a la izquierda (Derribo!!)'},
		{id: 159, msg: 'Giro a la izquierda (Derribo!!)'},
		{id: 118, msg: '~El Gato Volador~'},
		{id: 160, msg: '~El Gato Volador~'},
		{id: 137, msg: '[Rugido] Kelsaik se fortalece'},
		{id: 138, msg: 'Ataque amplio Alejarse 50m!!'},
		{id: 110, msg: 'Fuego en el piso (Alejate)'},
		{id: 112, msg: 'Hielo en el piso (Alejate)'},
		{id: 114, msg: 'Fuego Quemadura Adelante (Alejate)'},
		{id: 139, msg: '[Temperatura] 60% todos (Hielo)'},
		{id: 140, msg: '[Temperatura] 40% todos (Fuego)'},
		// 164 [温度] 100° 全灭
		// 165 [温度] 0° 全灭
	// 切换DeBuff:
		// 101 右脚(火_闪避)
		// 151 右脚(火_闪避)
		// 102 左脚(冰_格挡)
		// 152 左脚(冰_格挡)
		// 107 双脚_快
		// 157 双脚_快
		{id: 145, msg: 'Ataque Lento (Stun)'},
		{id: 104, msg: 'AOE-Magia de Hielo (Grande)'},
		{id: 154, msg: 'AOE-Magia de Hielo (Chico)'},
		{id: 105, msg: 'AOE-Magia de Fuego (Grande)'},
		{id: 155, msg: 'AOE-Magia de Fuego (Chico)'},
	// 内外鉴定:
		{id: 212, msg: 'Primero Fuego Despues Hielo'}, // 212 -> 141(火爪)
		{id: 213, msg: 'Primero Hielo Despues Fuego'}, // 213 -> 143(冰爪)
		{id: 214, msg: 'Primero Hielo Despues Fuego'}, // 214 -> 142(火爪)
		{id: 215, msg: 'Primero Fuego Despues Hielo'}, // 215 -> 144(冰爪)
	// 以下未知:
	/* 	{id: 119, msg: '微弱的咆哮'},
		{id: 161, msg: '微弱的咆哮'},
		{id: 124, msg: '弱高空落下'},
		{id: 163, msg: '弱高空落下'},
		
		{id: 116, msg: '（火焰布雷斯用）活力四射'},// "(화염브레스용)액티브무브_Run_노멀"
		{id: 117, msg: '火焰布鲁斯'},// "화염브레스_breath_노멀"
		
		{id: 121, msg: '复活诅咒'},// "부활저주_SpwanNpc_노멀"
		{id: 122, msg: '召唤部下'},// "부하소환_reactionAtk_노멀"
		{id: 123, msg: '等待-磁增益法术'},// "자기버프_Wait_노멀"
		
		{id: 125, msg: '近身禁止 发动'},// "근거리금지_발동_SpawnNpc_노멀"
		{id: 126, msg: '远程禁止 发动'},// "원거리금지_발동_SpawnNpc_노멀"
		{id: 127, msg: '禁止恢复 发动'},// "회복금지_발동_SpawnNpc_노멀"
		{id: 128, msg: '近身禁止 结束'},// "근거리금지_종료_SpawnNpc_노멀"
		{id: 129, msg: '远程禁止 结束'},// "원거리금지_종료_SpawnNpc_노멀"
		{id: 130, msg: '禁止恢复 结束'},// "회복금지_종료_SpawnNpc_노멀"
		
		{id: 132, msg: '目标召唤(475)'},// "오브젝트소환(475)_aggrochange_노말"
		{id: 133, msg: '目标召唤(3026)'},// "오브젝트소환(3026)_aggrochange_노말"
		{id: 134, msg: '广域一人奴隶'},// "광역1인노예_aggrochange_노말"
		
		{id: 135, msg: '[暴走]凯克·萨克 强悍的咆哮'},// "[폭주]켈사이크_강한포효_Roar_노멀"
		{id: 136, msg: '[暴走]凯克·赛克 环形动作'},// "[폭주]켈사이크_루프동작_노멀"
		
		{id: 150, msg: '移动-活跃的'},// "액티브무브_Run_노멀"
		{id: 201, msg: '呼哧呼哧动作'},// "헉헉동작_Groggy_노멀"
		{id: 204, msg: '换人'},// "어그로체인지_aggrochange_노멀"
		{id: 209, msg: '模式提醒'},// "모드알람_ModeAlarm_더미"
		{id: 210, msg: '赞助动作'},// "스폰동작_Spawn_노멀"
		{id: 211, msg: '旋转结束用'},// "회전종료용_ModeAlarm_노멀"
		{id: 302, msg: '随机Buff'}// "무적버프_wait_노멀" */
	],
	//            0     1     2      3
	CK_TipMsg : ["(Entrar)", "(Salir)", "Lado Izquierdo-Adentro (Seguro)", "Lado Derecho-Adentro (Seguro)"],
	// 狂气竞技场 (Forbidden Arena)
	FA_BOSS : [
		{id: 108, msg: 'Espadazo Frontal (Lento)'},    // 101 121 122 連續攻擊 -> 108 One size兩斷(坦)
		{id: 355, msg: 'Rompemandibulas (Golpe Frontal)'},    // 102 121 103 連續攻擊 -> 355 右手蓄力 -> 114 下巴粉碎
		{id: 135, msg: 'Espadazo Frontal (Lento)'},    //         104 連續攻擊 -> 135 左手蓄力 -> 130 One size兩斷
		{id: 111, msg: 'Stun - Espadazo Frontal'}, //         104 連續攻擊 -> 111 刀背打擊 -> 130 One size兩斷
		{id: 112, msg: 'Salto Detras - Espadazo'}, //     121 102 連續攻擊 -> 112 後退踢擊 -> 130 One size兩斷
		{id: 109, msg: 'Salto Adelante - Espadazo'},         // 109 向下劈擊 -> 402 等待     -> 130 One size兩斷
		
		{id: 116, msg: 'Bloqueo perfecto (Esquivar)'},    // 116 斬擊
		{id: 140, msg: 'Bloqueo perfecto (Esquivar)'},    // 140 斬擊
		
		{id: 145, msg: '3 Ataques Circulares de Corte'},  // 145 重擊斬 139 迴旋砍擊x2 -> 140 斬擊
		{id: 136, msg: '2 Ataques Circulares - Un Golpe Frontal'},  // 136 重擊斬 144 迴旋砍擊x1 -> 130 One size兩斷
		
		{id: 141, msg: 'Ataque Circular - Espadazo Frontal'}, // 141 破壞氣魄+迴旋砍擊x2 -> 146 114 130
		{id: 146, msg: 'Ataque Barbilla Adelante - Espadazo Frontal'}, // 146 One size兩斷       -> 114 下巴粉碎 -> 130 One size兩斷
		{id: 142, msg: 'Ataque con Giros - Ataque Barbilla Adelante'}, // 142 破壞氣魄+迴旋砍擊x2 -> 143 114 130
		{id: 143, msg: 'Un Espdazo Frontal'},        // 143 One size兩斷(取消) -> 114 下巴粉碎 -> 130 One size兩斷
		
		{id: 151, msg: '3 Cortes Flash - Un Ataque Frontal'}, // 151 149 148三斬 -> 130 One size兩斷
		{id: 117, msg: 'Flash (Esquivar)'},  //    117 瞬閃点名 -> 130 One size兩斷
		{id: 356, msg: 'Flash (Esquivar)'},  //    356 瞬閃点名 -> 147 One size兩斷
		{id: 134, msg: 'Cuidado (Ataque hacia atras)'},  //    134 要害攻擊 -> 147 One size兩斷
		
		{id: 357, msg: 'Morado-> Explosion (Salir!!)'}, // 357 吸收力量 -> 110 起身攻擊 -> 氣斬
		{id: 350, msg: 'Rojo-> Donas'},     // 350 吸收力量                 -> 302 甜甜圈
		
		{id: 351, msg: 'Romper Escudo !!'},       // 护盾开始 环形爆发
		{id: 401, msg: '30% (Esquivar)'}           // 开始
	],
	FA_TipMsg : ["Carga de Skill Completa (Cuidado) !!"]
}
