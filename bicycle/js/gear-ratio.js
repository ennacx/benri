$(() => {
	// スプロケットプリセット
	const SPROCKET_PRESET = window.SPROCKET_PRESET;
	// タイヤサイズプリセット
	const TIRE_PRESET = window.TIRE_PRESET;

	// スプロケット 最小歯数構成数 / 最大歯数構成数
	const SPROCKET_S_MIN = Math.min(...Object.keys(SPROCKET_PRESET).map((v) => parseInt(v)));
	const SPROCKET_S_MAX = Math.max(...Object.keys(SPROCKET_PRESET).map((v) => parseInt(v)));
	// スプロケット 最小歯数 / 最大歯数
	const SPROCKET_T_MIN = Math.min(...Object.values(SPROCKET_PRESET).map((v) => Math.min(...v.map((vv) => Math.min(...vv)))));
	const SPROCKET_T_MAX = Math.max(...Object.values(SPROCKET_PRESET).map((v) => Math.max(...v.map((vv) => Math.max(...vv)))));

	// 各設定セレクター
	const $mode_field = $('#mode-field');
	const $cadence_field = $('#cadence-field');
	const $chainwheel_field = $('#chainwheel-field');
	const $sprocket_field = $('#sprocket-field');

	// 表計算で使用する変数群
	let selected_tire_size = 0;
	let selected_cadence = 0;
	const selected_chainwheel_gears = [];
	const selected_sprocket_gears = [];
	let selected_mode = 'ratio';

	// 表反映可能フラグ
	let applyable = false;

	// HTMLタグ生成用バッファー(的なやつ)
	let html;

	// タイヤサイズのセレクトボックス生成
	{
		html = '';
		for(const grp_no in TIRE_PRESET){
			html += `<optgroup label="${grp_no}">`;
			for(const name in TIRE_PRESET[grp_no]){
				const tire_size = TIRE_PRESET[grp_no][name];
				html += `<option value="${tire_size}" data-group="${grp_no}" data-width="${name}">${name}</option>`
			}
			html += '</optgroup>';
		}

		$cadence_field.find('select[name="tire_variation"]').prepend(html);
	}

	// チェーンリングのチェックボックス生成
	{
		html = '';
		for(let i = 11, c = 0; i <= 60; i++, c++){
			if((c === 0 && i % 10 !== 1) || i % 10 === 1){
				html += '<div>';
			}

			html += '<div class="form-check form-check-inline">';
			html += `  <input type="checkbox" name="chainwheel_${i}" value="${i}" id="chainwheel-${i}" class="form-check-input chainwheel-gear-check">`;
			html += `  <label for="chainwheel-${i}" class="form-check-label">${i.toString().padStart(2, '_')}T</label>\n`;
			html += '</div>';

			if(i % 10 === 0){
				html += '</div>';
			}
		}

		$chainwheel_field.find('#chainwheel-ids').append(html);
	}

	// スプロケットの歯数構成セレクトボックスの生成
	{
		html = '';
		for(const grp_no in SPROCKET_PRESET){
			html += `<optgroup label="${grp_no}S">`;
			for(const idx in SPROCKET_PRESET[grp_no]){
				const gears = SPROCKET_PRESET[grp_no][idx];
				const min_gear = Math.min(...gears);
				const max_gear = Math.max(...gears);
				html += `<option value="${gears.join(',')}" data-group="${grp_no}" data-gear_count="${gears.length}" data-index="${idx}">${min_gear}-${max_gear}T (${gears.join('-')}T)</option>`
			}
			html += '</optgroup>';
		}

		$sprocket_field.find('select[name="sprocket_variation"]').prepend(html);
	}

	// スプロケットの歯チェックボックスの生成
	{
		html = '';
		for(let i = SPROCKET_T_MIN, c = 0; i <= SPROCKET_T_MAX; i++, c++){
			if((c === 0 && SPROCKET_T_MIN % 10 !== 1) || i % 10 === 1){
				html += '<div>';
			}

			html += '<div class="form-check form-check-inline">';
			html += `  <input type="checkbox" name="sprocket_${i}" value="${i}" id="sprocket-${i}" class="form-check-input sprocket-gear-check">`;
			html += `  <label for="sprocket-${i}" class="form-check-label">${i.toString().padStart(2, '_')}T</label>`;
			html += '</div>';

			if(i % 10 === 0){
				html += '</div>';
			}
		}

		$sprocket_field.find('#sprocket-ids').append(html);
	}

	/**
	 * 設定値から計算、表に反映するサブファンクション
	 */
	const apply_func = () => {
		if(applyable){
			// ログ
			console.log(
				selected_mode, selected_tire_size, selected_cadence,
				selected_chainwheel_gears, selected_sprocket_gears
			);

			$('input.input-result').val('');

			let unit = '';
			switch(selected_mode){
				case 'ratio':
					unit = 'Rtt.';
					break;
				case 'kph':
					unit = 'Km/h';
					break;
			}
			$('span.result-unit').text(unit);

			if(selected_chainwheel_gears.length > 0 && selected_sprocket_gears.length > 0){
				for(const idx in selected_chainwheel_gears){
					const row = parseInt(idx) + 1;
					$(`input#cw-tooth-${row}`).val(selected_chainwheel_gears[idx]);
					$(`tr.result-row-${row}`).show();
				}
				for(let i = selected_chainwheel_gears.length; i < 3; i++){
					const row = i + 1;
					$(`tr.result-row-${row}`).hide();
				}

				for(const idx in selected_sprocket_gears){
					const col = parseInt(idx) + 1;
					$(`input#sp-tooth-${col}`).val(selected_sprocket_gears[idx]);
					$(`.result-col-${col}`).show();
				}
				for(let i = selected_sprocket_gears.length; i < SPROCKET_S_MAX; i++){
					const col = i + 1;
					$(`.result-col-${col}`).hide();
				}

				for(const r_idx in selected_chainwheel_gears){
					const row = parseInt(r_idx) + 1;
					const cw_gear = selected_chainwheel_gears[r_idx];
					for(const c_idx in selected_sprocket_gears){
						const col = parseInt(c_idx) + 1;
						const sp_gear = selected_sprocket_gears[c_idx];

						const ratio = cw_gear / sp_gear;

						let kmh = 0;
						if(selected_tire_size > 0 && selected_cadence > 0){
							kmh = (selected_tire_size / 1000000) * (selected_cadence * 60 * ratio);
						}

						let result = 0;
						switch(selected_mode){
							case 'ratio':
								result = ratio;
								break;
							case 'kph':
								result = kmh;
								break;
						}

						$(`input#result-${row}-${col}`).val(Math.round(result * 100) / 100);
					}
				}
			}
		}
	};

	/**
	 * タイヤサイズ・ケイデンスの設定値変更時の共通サブファンクション
	 */
	const cadence_common = () => {
		selected_tire_size = parseInt($('select[name="tire_variation"] option:selected').val());
		selected_cadence = parseInt($('input[name="cadence"]').val());

		// 表に適用
		apply_func();
	};

	// 表示モードラジオボタン操作のトリガー
	$('input[name="mode"]').change(() => {
		selected_mode = $('input[name="mode"]:checked').val();

		if(selected_mode === 'kph')
			$('#cadence-field').show(100);
		else
			$('#cadence-field').hide(100);

		// 表に適用
		apply_func();
	});

	// タイヤサイズ設定変更のトリガー
	$('select[name="tire_variation"]').on('change', cadence_common);

	// ケイデンス設定変更のトリガー
	$('input[name="cadence"]').on('change', cadence_common);

	// チェーンリングの歯数チェックボックス操作のトリガー
	$('input.chainwheel-gear-check').on('change', function(){
		const check_count = $('input.chainwheel-gear-check:checked').length;
		if(check_count < 1 || check_count > 3){
			$(this).prop('checked', (check_count < 1));

			window.alert("選択数が不正");
		}

		// 表計算に必要な配列の初期化
		selected_chainwheel_gears.splice(0);

		const gears = [];
		$('input.chainwheel-gear-check:checked').each((idx, elem) => {
			const int_val = parseInt($(elem).val());
			if(!isNaN(int_val))
				gears.push(int_val);
		});
		gears.sort((x, y) => x - y);

		for(const gear of gears){
			selected_chainwheel_gears.push(gear);
		}
		selected_chainwheel_gears.sort((x, y) => x - y);

		// 表に適用
		apply_func();
	});

	// スプロケットの歯数構成セレクトボックス操作のトリガー
	$('select[name="sprocket_variation"]').change(function(){
		// スプロケットの歯数チェックボックスを一括操作するので一旦禁止に
		applyable = false;

		const $sprocket_gear_checkbox = $('input.sprocket-gear-check');
		const val = $(this).find('option:selected').val();

		// 表計算に必要な配列の初期化
		selected_sprocket_gears.splice(0);

		if(val !== undefined && val !== ''){
			// 構成分解
			const selected_gears = val.split(',');
			// 定義されている構成数
			const org_len = selected_gears.length;

			// スプロケットの歯数チェックボックスを初期化
			$sprocket_gear_checkbox.prop('checked', false);

			// 構成されている歯のチェックボックスをONにする
			let c = 0;
			for(const gear of selected_gears.map((v) => parseInt(v))){
				if(!isNaN(gear)){
					// チェックON
					$(`input.sprocket-gear-check[value="${gear}"]`).prop('checked', true);

					// 表計算に必要な配列に追加
					selected_sprocket_gears.push(gear);

					// 追加分だけインクリメント
					c++;
				}
			}
			// 表計算に必要な配列をソート
			selected_sprocket_gears.sort((x, y) => x - y);

			// (念のため) 構成要素数と配列追加数が合わない場合
			if(org_len !== c){
				// スプロケットの歯数チェックボックスを初期化
				$sprocket_gear_checkbox.prop('checked', false);
				// 表計算に必要な配列の初期化
				selected_sprocket_gears.splice(0);
			}

			// スプロケットの歯数チェックボックスの一括変更を終えたので再度許可
			applyable = true;

			// 表に適用
			apply_func();
		}
	});

	// スプロケットの歯数チェックボックス操作のトリガー
	$('input.sprocket-gear-check').on('change', function(){
		// チェック数をカウント
		const check_count = $('input.sprocket-gear-check:checked').length;
		// チェック数のバリデーション
		if(check_count < 1 || check_count > SPROCKET_S_MAX){
			$(this).prop('checked', (check_count < 1));

			window.alert("選択数が不正");
		}

		// 表計算に必要な配列の初期化
		selected_sprocket_gears.splice(0);

		// 連動するスプロケットの歯数構成セレクトボックスの選択状態を解除
		$('select[name="sprocket_variation"] option').prop('selected', false);

		// チェックされているギヤ構成を配列化
		const gears = [];
		$('input.sprocket-gear-check:checked').each((idx, elem) => {
			const int_val = parseInt($(elem).val());
			if(!isNaN(int_val))
				gears.push(int_val);
		});
		// ソート
		gears.sort((x, y) => x - y);

		// セレクトボックスのギヤ構成にチェックされているギヤ構成が存在するかチェック
		let sel_val = '';
		if(SPROCKET_PRESET[gears.length]){
			const gears_str = gears.join(',');
			for(const preset_gears of SPROCKET_PRESET[gears.length]){
				if(preset_gears.join(',') === gears_str){
					sel_val = gears_str;
					break;
				}
			}
		}

		// 選択ギヤ構成がなければ選択肢が「その他」になる
		$(`select[name="sprocket_variation"] option[value="${sel_val}"]`).prop('selected', true);

		// 表計算に必要な配列に追加してソート
		for(const gear of gears)
			selected_sprocket_gears.push(gear);
		selected_sprocket_gears.sort((x, y) => x - y);

		// 表に適用
		apply_func();
	});

	// 結果表のベース生成
	{
		html = '';

		html += '<table class="table">';
		html += '  <thead>';
		html += '    <tr>';
		html += '      <th style="width: 100px;"></th>';
		for(let i = 1; i <= SPROCKET_S_MAX; i++){
			html += `<th class="result-col-${i}">${i}速</th>`;
		}
		html += '    </tr>';

		html += '    <tr>';
		html += '      <th></th>';
		for(let i = 1; i <= SPROCKET_S_MAX; i++){
			html += `<th class="result-col-${i}">`;
			html += '  <div class="input-group">';
			html +=	`    <input type="text" name="sp_tooth_${i}" id="sp-tooth-${i}" class="form-control small text-right input-sp-tooth" readonly />`;
			html += '    <span class="input-group-text s-unit">T</span>';
			html += '  </div>'
			html += '</th>';
		}
		html += '    </tr>';
		html += '  </thead>';

		html += '  <tbody>';
		for(let i = 1; i <= 3; i++){
			html += `<tr class="result-row-${i}">`;
			html += `  <th class="cw-${i}">`;
			html += '    <div class="input-group">';
			html +=	`      <input type="text" name="cw_tooth_${i}" id="cw-tooth-${i}" class="form-control small text-right input-cw-tooth" readonly />`;
			html += '      <span class="input-group-text s-unit">T</span>';
			html += '    </div>'
			html += '  </th>';

			for(let j = 1; j <= SPROCKET_S_MAX; j++){
				html += `<td class="result-col-${j}">`;
				html += '  <div class="input-group">';
				html +=	`    <input type="text" name="result_${i}_${j}" id="result-${i}-${j}" class="form-control small text-right input-result" readonly />`;
				html += '    <span class="input-group-text result-unit"></span>';
				html += '  </div>'
				html += '</td>';
			}

			html += '</tr>';
		}
		html += '  </tbody>';
		html += '</table>';

		$('div#result-table-field').append(html);
	}

	// デフォルト値の設定
	$('select[name="tire_variation"]').find('option[data-group="700"][data-width="28c"]').prop('selected', true).change();
	$('input.chainwheel-gear-check[value="34"]').prop('checked', true);
	$('input.chainwheel-gear-check[value="50"]').prop('checked', true);
	$('input.chainwheel-gear-check').change();
	$('select[name="sprocket_variation"]').find('option[data-group="11"][data-index="2"]').prop('selected', true).change();

	// 計算許可
	applyable = true;

	// 表に適用
	apply_func();
})