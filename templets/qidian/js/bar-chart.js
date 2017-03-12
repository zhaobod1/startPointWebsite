!function($) {
	var tmpl = 
		[
			'<div class="price-bar-chart">',
				'<div class="price-bar-chart-inner">',
					'<div class="divide-rule"><span class="value">99</span></div>',
					'<div class="divide-rule"><span class="value">89</span></div>',
					'<div class="divide-rule"><span class="value">79</span></div>',
					'<div class="divide-rule"><span class="value">69</span></div>',
					'<div class="divide-rule"><span class="value">59</span></div>',
					'<div class="divide-rule"><span class="value">49</span></div>',
					'<div class="divide-rule"><span class="value">39</span></div>',
					'<div class="divide-rule"><span class="value">0</span></div>',
					'<div class="colums">{{colums}}</div>',
				'</div>',
			'</div>'
		].join("");

	var EdjPriceBarChart = function(element, price) {
		this.$element = $(element);
		this.render(price);
	}

	EdjPriceBarChart.prototype.render = function(list) {
		var colums = [];
		var oneSplitBlockHeight = 100 / 7;
		for(var i = 0, len = list.length; i < len; i++) {
			var item = list[i];
			var barHeight = item.price > 39 ? (item.price - 39) / 10 * 100 / 7 + (100 / 7) : item.price / 39 * 100 / 7;
			colums.push([
				'<div class="colum">',
					'<div class="colum-bar" style="height:' + barHeight + '%;"><span class="value-tip">' + item.price + '元</span></div>',
					'<div class="colum-range">' + item.start_time + '-' + item.end_time + '</div>',
				'</div>'
			].join(''));
		}
		this.$element.html(tmpl.replace('{{colums}}', colums.join('')));
	}
	
	$.fn.edjPriceBarChart = function(priceList) {
		new EdjPriceBarChart(this, priceList);
	}
}(jQuery);